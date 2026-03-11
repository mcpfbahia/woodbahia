"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { Loader2, Plus, Edit2, Trash2, X, Save } from "lucide-react";
import Image from "next/image";
import { ImageUpload } from "~/components/admin/ImageUpload";

interface PortfolioItem {
  id?: string;
  title: string;
  location: string;
  description: string;
  image: string;
  instagramUrl: string;
}

const initialFormState: PortfolioItem = {
  title: "",
  location: "",
  description: "",
  image: "",
  instagramUrl: "",
};

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PortfolioItem>(initialFormState);
  const [saving, setSaving] = useState(false);

  // Fetch items
  const fetchItems = async () => {
    setLoading(true);
    try {
      if (!db) throw new Error("Firebase DB not initialized");
      const querySnapshot = await getDocs(collection(db, "portfolio"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem));
      setItems(data);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handlers
  const handleOpenModal = (item?: PortfolioItem) => {
    if (item) {
      setFormData(item);
      setIsEditing(true);
    } else {
      setFormData(initialFormState);
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormState);
    setIsEditing(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;
    try {
      if (!db) return;
      await deleteDoc(doc(db, "portfolio", id));
      await fetchItems();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir. Tente novamente.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      alert("Título e Imagem são obrigatórios. (Lembre-se de clicar em FAZER UPLOAD após escolher a imagem)");
      return;
    }

    setSaving(true);
    try {
      if (!db) throw new Error("No DB");
      
      const dataToSave = { ...formData };
      delete dataToSave.id; // Remove id from data

      if (isEditing && formData.id) {
        await updateDoc(doc(db, "portfolio", formData.id), dataToSave);
      } else {
        await addDoc(collection(db, "portfolio"), dataToSave);
      }
      
      handleCloseModal();
      await fetchItems();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar. Verifique o console.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-slate-800">Projetos Entregues</h2>
          <p className="text-sm text-slate-500">Gerencie a galeria de portfólio exibida no site.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary/90"
        >
          <Plus className="h-5 w-5" />
          Adicionar Projeto
        </button>
      </div>

      {loading ? (
        <div className="flex py-20 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map(item => (
            <div key={item.id} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
              <div className="relative aspect-video w-full bg-slate-100">
                {item.image && (
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-4">
                  <button onClick={() => handleOpenModal(item)} className="p-2 rounded-full bg-white text-slate-800 hover:text-primary transition-colors">
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button onClick={() => item.id && handleDelete(item.id)} className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-800 truncate">{item.title}</h3>
                <p className="text-sm text-slate-500 truncate">{item.location}</p>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
              Nenhum projeto cadastrado no portfólio.
            </div>
          )}
        </div>
      )}

      {/* Modal / Formulário */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-xl font-bold text-slate-800">
                {isEditing ? "Editar Projeto" : "Novo Projeto"}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="max-h-[80vh] overflow-y-auto p-6">
              <form onSubmit={handleSave} className="space-y-6">
                
                {/* Upload Section */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Foto Principal *</label>
                  <ImageUpload 
                    folder="portfolio" 
                    defaultImage={formData.image} 
                    onUploadComplete={(url) => setFormData(prev => ({ ...prev, image: url }))} 
                  />
                  {!formData.image && <p className="mt-1 text-xs text-amber-600">Lembre-se de clicar em "Fazer Upload" após selecionar a imagem.</p>}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">Título do Projeto *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 p-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Ex: Chalé Itacimirim"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">Localização</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 p-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Ex: Camaçari - BA"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Link do Instagram</label>
                  <input
                    type="url"
                    value={formData.instagramUrl}
                    onChange={e => setFormData(prev => ({ ...prev, instagramUrl: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 p-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="https://instagram.com/p/..."
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Descrição Opcional</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 p-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    placeholder="Breve descrição dos detalhes da obra..."
                  />
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="rounded-lg px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 disabled:opacity-70"
                  >
                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    {saving ? "Salvando..." : "Salvar Projeto"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
