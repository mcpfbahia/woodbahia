"use client";

import { useState, useEffect } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save, Key, UserCog, Mail } from "lucide-react";

export default function PerfilPage() {
  const { user, operador } = useAuth();
  
  // States para os dados pessoais
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSavingData, setIsSavingData] = useState(false);

  // States para a senha
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    if (operador) {
      setName(operador.name || "");
      setPhone(operador.phone || "");
      setAddress(operador.address || "");
    }
  }, [operador]);

  const handleSaveData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;
    
    setIsSavingData(true);
    try {
      const docRef = doc(db, "operadores", user.uid);
      await setDoc(docRef, {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim()
      }, { merge: true });
      toast.success("Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      toast.error("Erro ao salvar os dados.");
    } finally {
      setIsSavingData(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;

    if (newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setIsSavingPassword(true);
    try {
      // O Firebase exige que o usuário tenha logado recentemente para trocar a senha.
      // Vamos tentar reautenticar o usuário primeiro usando a senha atual.
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Se a reautenticação passar, trocamos a senha
      await updatePassword(user, newPassword);
      
      toast.success("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Erro ao alterar senha:", error);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        toast.error("A senha atual informada está incorreta.");
      } else if (error.code === 'auth/requires-recent-login') {
        toast.error("Por segurança, saia do sistema e faça login novamente antes de alterar a senha.");
      } else {
        toast.error("Erro ao alterar a senha.");
      }
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/50 p-4 md:p-6 rounded-2xl border border-border/40 backdrop-blur-sm gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-bold engraved-text">Meu Perfil</h1>
          <p className="text-muted-foreground text-[10px] md:text-sm uppercase tracking-widest font-bold mt-1">Gerencie seus dados e acessos</p>
        </div>
      </div>

      <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Coluna 1: Dados Pessoais */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-border/40 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <UserCog className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Dados Pessoais</h2>
              <p className="text-xs text-slate-500">Atualize suas informações de contato</p>
            </div>
          </div>

          <form onSubmit={handleSaveData} className="space-y-4">
            <div className="space-y-2">
              <Label>E-mail de Acesso (Não alterável)</Label>
              <div className="relative">
                <Input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="pl-9 bg-slate-50 text-slate-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone / WhatsApp</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(71) 90000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço Completo</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rua, Número, Bairro, Cidade"
              />
            </div>

            <Button type="submit" disabled={isSavingData} className="w-full mt-2">
              {isSavingData ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" /> Salvar Dados</>
              )}
            </Button>
          </form>
        </div>

        {/* Coluna 2: Alteração de Senha */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-border/40 shadow-sm space-y-6 self-start">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Segurança</h2>
              <p className="text-xs text-slate-500">Altere sua senha de acesso</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite a senha atual"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirme a Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                required
                minLength={6}
              />
            </div>

            <Button type="submit" variant="secondary" disabled={isSavingPassword} className="w-full mt-2">
              {isSavingPassword ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Atualizando...</>
              ) : (
                <><Key className="mr-2 h-4 w-4" /> Alterar Senha</>
              )}
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}
