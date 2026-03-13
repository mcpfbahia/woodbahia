"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { Loader2, Trash2, Mail, Phone, Calendar, Search } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  message?: string;
  status: "Novo" | "Em Atendimento" | "Finalizado";
  createdAt: any;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLeads = async () => {
    setLoading(true);
    try {
      if (!db) throw new Error("Firebase DB not initialized");
      const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => {
        const d = doc.data();
        return { 
          id: doc.id, 
          ...d,
          name: d.name || d.nome,
          phone: d.phone || d.whatsapp,
          source: d.source || d.origem
        } as Lead;
      });
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
      // Se a coleção não existir ou faltar index, mostre um mock local temporário ou erro
      console.log("Nota: Se houver erro de Index (indexes do firestore), certifique-se de criá-lo no link fornecido no console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja apagar este contato permanentemente?")) return;
    try {
      if (!db) return;
      await deleteDoc(doc(db, "leads", id));
      setLeads(prev => prev.filter(l => l.id !== id));
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir contato.");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      if (!db) return;
      await updateDoc(doc(db, "leads", id), { status: newStatus });
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus as any } : l));
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status do lead.");
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "-";
    // Trata timestamp do firestore ou string ISO date
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
    return new Date(timestamp).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium text-slate-800">Leads e Contatos</h2>
          <p className="text-sm text-slate-500">Acompanhe as pessoas que entraram em contato com o site.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar lead..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">Contato</th>
                <th className="px-6 py-4 font-semibold">Origem/Mensagem</th>
                <th className="px-6 py-4 font-semibold">Data</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  </td>
                </tr>
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{lead.name || "Sem Nome"}</div>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        <a href={`https://wa.me/55${lead.phone?.replace(/\D/g,'')}`} target="_blank" className="hover:text-primary hover:underline">{lead.phone || "-"}</a>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <a href={`mailto:${lead.email}`} className="hover:text-primary hover:underline">{lead.email || "-"}</a>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                       <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-md mb-1">{lead.source || "Site Genérico"}</span>
                       {lead.message && (
                         <p className="text-xs text-slate-500 line-clamp-2" title={lead.message}>{lead.message}</p>
                       )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(lead.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={lead.status || "Novo"} 
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-3 py-1 border outline-none cursor-pointer
                          ${lead.status === 'Finalizado' ? 'bg-green-50 text-green-700 border-green-200' : 
                            lead.status === 'Em Atendimento' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                            'bg-blue-50 text-blue-700 border-blue-200'}
                        `}
                      >
                        <option value="Novo">Novo</option>
                        <option value="Em Atendimento">Em Atendimento</option>
                        <option value="Finalizado">Finalizado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(lead.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-slate-100"
                        title="Excluir Lead"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                     Nenhum contato encontrado.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
