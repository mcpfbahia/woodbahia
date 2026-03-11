"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { Loader2, Plus, Edit2, Trash2, X, Save } from "lucide-react";
import Image from "next/image";
import { ImageUpload } from "~/components/admin/ImageUpload";

interface Obra {
  id?: string;
  titulo: string;
  status: "Andamento" | "Entregue";
  fase: string;
  imagem_principal: string;
  galeria: string[];
  depoimento: {
    texto: string;
    autor: string;
  } | null;
}

const initialFormState: Obra = {
  titulo: "",
  status: "Andamento",
  fase: "",
  imagem_principal: "",
  galeria: [],
  depoimento: null,
};

export default function AdminDiarioObrasPage() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Obra>(initialFormState);
  const [saving, setSaving] = useState(false);

  const fetchObras = async () => {
    setLoading(true);
    try {
      if (!db) throw new Error("Firebase DB not initialized");
      const querySnapshot = await getDocs(collection(db, "diario_obras"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Obra));
      setObras(data);
    } catch (error) {
      console.error("Error fetching diario_obras:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObras();
  }, []);

  const handleOpenModal = (item?: Obra) => {
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
    if (!confirm("Tem certeza que deseja excluir esta obra?")) return;
    try {
      if (!db) return;
      await deleteDoc(doc(db, "diario_obras", id));
      await fetchObras();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir. Tente novamente.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo || !formData.imagem_principal || !formData.fase) {
      alert("Título, Fase e Imagem Principal são obrigatórios.");
      return;
    }

    setSaving(true);
    try {
      if (!db) throw new Error("No DB");
      
      const dataToSave = { ...formData };
      delete dataToSave.id;

      if (isEditing && formData.id) {
        await updateDoc(doc(db, "diario_obras", formData.id), dataToSave);
      } else {
        await addDoc(collection(db, "diario_obras"), dataToSave);
      }
      
      handleCloseModal();
      await fetchObras();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar. Verifique o console.");
    } finally {
      setSaving(false);
    }
  };

  // Funções de manipulação do array de galeria
  const handleAddGalleryImage = (url: string) => {
    if (url) {
      setFormData(prev => ({ ...prev, galeria: [...prev.galeria, url] }));
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      galeria: prev.galeria.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-slate-800">Diário de Obras</h2>
          <p className="text-sm text-slate-500">Acompanhamento das montagens e obras.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary/90"
        >
          <Plus className="h-5 w-5" />
          Adicionar Obra
        </button>
      </div>

      {loading ? (
        <div className="flex py-20 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {obras.map(obra => (
            <div key={obra.id} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md flex flex-col">
              <div className="relative aspect-[4/3] w-full bg-slate-100">
                {obra.imagem_principal && (
                  <Image src={obra.imagem_principal} alt={obra.titulo} fill className="object-cover" />
                )}
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-bold text-white rounded-full ${obra.status === 'Andamento' ? 'bg-amber-500' : 'bg-green-500'}`}>
                    {obra.status}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-4">
                  <button onClick={() => handleOpenModal(obra)} className="p-2 rounded-full bg-white text-slate-800 hover:text-primary transition-colors">
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button onClick={() => obra.id && handleDelete(obra.id)} className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col flex-1 p-4">
                <h3 className="font-bold text-slate-800 line-clamp-1 mb-1">{obra.titulo}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">{obra.fase}</p>
                <div className="mt-auto pt-4 text-xs font-medium text-slate-400">
                  {obra.galeria?.length || 0} fotos na galeria
                </div>
              </div>
            </div>
          ))}
          {obras.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
              Nenhuma obra cadastrada.
            </div>
          )}
        </div>
      )}

      {/* Modal / Formulário */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-xl font-bold text-slate-800">
                {isEditing ? "Editar Obra" : "Nova Obra"}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="max-h-[80vh] overflow-y-auto p-6">
              <form onSubmit={handleSave} className="space-y-8">
                
                {/* Imagem Principal */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Foto Principal (Capa) *</label>
                  <div className="max-w-md">
                    <ImageUpload 
                      folder="diario_obras" 
                      defaultImage={formData.imagem_principal} 
                      onUploadComplete={(url) => setFormData(prev => ({ ...prev, imagem_principal: url }))} 
                    />
                  </div>
                </div>

                {/* Informações Básicas */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">Título da Obra *</label>
                    <input
                      type="text"
                      required
                      value={formData.titulo}
                      onChange={e => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 p-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Ex: Montagem do Chalé Suíço"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">Status</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as "Andamento" | "Entregue" }))}
                      className="w-full rounded-lg border border-slate-200 p-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                    >
                      <option value="Andamento">🚧 Em Andamento</option>
                      <option value="Entregue">✅ Entregue</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Fase Atual / Descrição *</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.fase}
                    onChange={e => setFormData(prev => ({ ...prev, fase: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 p-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    placeholder="Ex: Finalizando a cobertura de telhas ecológicas..."
                  />
                </div>

                {/* Galeria */}
                <div className="border-t border-slate-100 pt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Galeria de Imagens Adicionais</label>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 mb-4">
                    {formData.galeria.map((img, index) => (
                      <div key={index} className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 group">
                        <Image src={img} alt={`Galeria ${index}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="max-w-sm">
                    <p className="text-xs text-slate-500 mb-2">Envie uma foto por vez para adicionar à galeria.</p>
                    <ImageUpload 
                      folder="diario_obras/galeria" 
                      onUploadComplete={(url) => {
                        handleAddGalleryImage(url);
                      }} 
                    />
                  </div>
                </div>

                {/* Depoimento - Apenas se Entregue */}
                {formData.status === "Entregue" && (
                  <div className="border-t border-slate-100 pt-6">
                    <h4 className="font-semibold text-slate-700 mb-4">Depoimento do Cliente (Opcional)</h4>
                    <div className="grid gap-6">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-500 uppercase">Nome do Cliente</label>
                        <input
                          type="text"
                          value={formData.depoimento?.autor || ""}
                          onChange={e => setFormData(prev => ({ 
                            ...prev, 
                            depoimento: { autor: e.target.value, texto: prev.depoimento?.texto || "" } 
                          }))}
                          className="w-full rounded-lg border border-slate-200 p-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          placeholder="Ex: João e Maria"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-500 uppercase">Texto do Depoimento</label>
                        <textarea
                          rows={3}
                          value={formData.depoimento?.texto || ""}
                          onChange={e => setFormData(prev => ({ 
                            ...prev, 
                            depoimento: { texto: e.target.value, autor: prev.depoimento?.autor || "" } 
                          }))}
                          className="w-full rounded-lg border border-slate-200 p-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                          placeholder="Ex: Muito felizes com nosso chalé novo!"
                        />
                      </div>
                    </div>
                  </div>
                )}

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
                    {saving ? "Salvando..." : "Salvar Obra"}
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
