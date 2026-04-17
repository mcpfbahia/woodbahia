"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { db, createSecondaryAuth } from "~/lib/firebase";
import { Loader2, Plus, Trash2, ShieldCheck, Mail, Key, Eye, EyeOff } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

interface Operador {
  id: string; // The doc ID (also the user UID usually)
  name: string;
  email: string;
  role: "admin" | "vendedor";
  createdAt: any;
}

export default function OperadoresPage() {
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "vendedor" as "admin" | "vendedor",
  });

  const fetchOperadores = async () => {
    setLoading(true);
    try {
      if (!db) return;
      const querySnapshot = await getDocs(collection(db, "operadores"));
      const ops: Operador[] = [];
      querySnapshot.forEach((doc) => {
        ops.push({ id: doc.id, ...doc.data() } as Operador);
      });
      setOperadores(ops);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar a lista de operadores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperadores();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const secondaryAuth = createSecondaryAuth();
      if (!secondaryAuth || !db) {
        throw new Error("Erro de configuração. Não foi possível conectar à instância secundária.");
      }

      // Create user
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Desloga o secondaryAuth pra não manter sessão
      await signOut(secondaryAuth);

      // Save Operator metadata in Firestore
      await setDoc(doc(db, "operadores", user.uid), {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });

      toast.success("Operador criado com sucesso!");
      setIsDialogOpen(false);
      setFormData({ name: "", email: "", password: "", role: "vendedor" });
      fetchOperadores();
    } catch (error: any) {
      console.error("Erro ao criar operador no handleCreate:", error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error("Este e-mail já está em uso por outro usuário.");
      } else if (error.code === 'auth/weak-password') {
        toast.error("A senha deve ter pelo menos 6 caracteres.");
      } else {
        toast.error(`Acesso negado ou erro desconhecido: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (operadorId: string) => {
    if (!confirm("Tem certeza que deseja remover este acesso do painel?\\n(Por segurança total, você deve excluí-lo no Console do Firebase).")) {
      return;
    }
    
    try {
      if (!db) return;
      await deleteDoc(doc(db, "operadores", operadorId));
      toast.success("Operador removido do banco de dados das listagens.");
      setOperadores(prev => prev.filter(o => o.id !== operadorId));
    } catch (e) {
      console.error(e);
      toast.error("Erro ao remover o operador.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Operadores e Acessos</h2>
          <p className="text-slate-500 text-sm mt-1">Gerencie quem tem acesso ao painel de administração e sistema de propostas.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Novo Operador
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
            <p>Carregando registros...</p>
          </div>
        ) : operadores.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <ShieldCheck className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">Nenhum operador listado</h3>
            <p className="text-slate-500 mt-1 max-w-sm">Adicione seu time de vendas e gerentes para que eles possam acessar o sistema gerador.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Nome e Acesso</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Cargo</th>
                  <th className="px-6 py-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {operadores.map((op) => (
                  <tr key={op.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {op.name.charAt(0).toUpperCase()}
                        </div>
                        {op.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{op.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        op.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {op.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(op.id)}
                        className="text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg h-8 w-8"
                        title="Remover Acesso"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Operador</DialogTitle>
            <DialogDescription>
              Crie credenciais para um novo membro da equipe acessar o painel.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                placeholder="Ex: João Silva"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  className="pl-9"
                  placeholder="acesso@woodbahia.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Nível de Acesso</Label>
                <Select
                  value={formData.role}
                  onValueChange={(val) => setFormData({ ...formData, role: (val || "vendedor") as "admin" | "vendedor" })}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendedor">Vendedor</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha Inicial</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-9 pr-10"
                    placeholder="Mín. 6 caracteres"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-32 bg-primary text-primary-foreground hover:bg-primary/90">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar Acesso"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
