"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { Loader2, Plus, Edit2, Trash2, X, Save, Image as ImageIcon, FileText, Settings, Minus } from "lucide-react";
import Image from "next/image";
import { ImageUpload } from "~/components/admin/ImageUpload";
import { MultiImageUpload } from "~/components/admin/MultiImageUpload";

interface ModelItem {
  id?: string;
  slug?: string;
  name: string;
  area: string;
  builtArea?: string;
  floors: string;
  bedrooms: number;
  price: string;
  kitPrice: string;
  description: string;
  fullDescription: string;
  concept: string;
  ideal: string;
  composition: string[];
  features: string[];
  image: string;
  gallery: string[];
  floorPlanImage?: string;
  floorPlanLabel?: string;
  floorPlanSuperiorImage?: string;
  floorPlanSuperiorLabel?: string;
  rooms?: { name: string; size: string }[];
  promoPrice?: string;
  promoBadge?: string;
}

const initialFormState: ModelItem = {
  slug: "",
  name: "",
  area: "",
  builtArea: "",
  floors: "1",
  bedrooms: 1,
  price: "",
  kitPrice: "",
  description: "",
  fullDescription: "",
  concept: "",
  ideal: "",
  composition: [],
  features: [],
  image: "",
  gallery: [],
  floorPlanImage: "",
  floorPlanLabel: "Planta Térrea",
  floorPlanSuperiorImage: "",
  floorPlanSuperiorLabel: "Planta Superior",
  rooms: [],
  promoPrice: "",
  promoBadge: "",
};

export default function AdminModelosPage() {
  const [models, setModels] = useState<ModelItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ModelItem>(initialFormState);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"basico" | "detalhes" | "midia" | "planta">("basico");

  // Arrays temporários no estado do input para adicionar composition/features/rooms
  const [newComp, setNewComp] = useState("");
  const [newFeat, setNewFeat] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomSize, setNewRoomSize] = useState("");

  const fetchModels = async () => {
    setLoading(true);
    try {
      if (!db) throw new Error("Firebase DB not initialized");
      const querySnapshot = await getDocs(collection(db, "models"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ModelItem));
      setModels(data);
    } catch (error) {
      console.error("Error fetching models:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleOpenModal = (item?: ModelItem) => {
    if (item) {
      setFormData({ ...item, slug: item.id });
      setIsEditing(true);
    } else {
      setFormData(initialFormState);
      setIsEditing(false);
    }
    setActiveTab("basico");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormState);
    setIsEditing(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este modelo? Essa ação é IRREVERSÍVEL.")) return;
    try {
      if (!db) return;
      await deleteDoc(doc(db, "models", id));
      await fetchModels();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir. Tente novamente.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Gerar slug se estiver vazio
    let finalSlug = formData.slug?.trim() || 
                    formData.name.toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .replace(/[^a-z0-z0-9]/g, "-")
                      .replace(/-+/g, "-")
                      .replace(/^-|-$/g, "");

    if (!formData.name || !formData.price || !formData.image) {
      alert("Nome, Preço e Imagem Principal são obrigatórios.");
      return;
    }

    setSaving(true);
    try {
      if (!db) throw new Error("No DB");
      
      const dataToSave = { ...formData };
      delete dataToSave.id;
      delete dataToSave.slug;

      if (isEditing && formData.id) {
        // Se o slug mudou, precisamos mover o documento
        if (formData.id !== finalSlug) {
          const oldDocRef = doc(db, "models", formData.id);
          const newDocRef = doc(db, "models", finalSlug);
          
          // Verificar se o novo slug já existe
          const checkNew = await getDoc(newDocRef);
          if (checkNew.exists()) {
            if (!confirm("Já existe um modelo com este link (slug). Deseja SOBRESCREVER?")) {
               setSaving(false);
               return;
            }
          }

          await setDoc(newDocRef, dataToSave);
          await deleteDoc(oldDocRef);
        } else {
          await updateDoc(doc(db, "models", formData.id), dataToSave);
        }
      } else {
        // Novo Modelo com ID (slug) customizado
        const newDocRef = doc(db, "models", finalSlug);
        const checkNew = await getDoc(newDocRef);
        if (checkNew.exists()) {
          alert("Erro: Já existe um modelo com este link (slug). Escolha outro.");
          setSaving(false);
          return;
        }
        await setDoc(newDocRef, dataToSave);
      }
      
      handleCloseModal();
      await fetchModels();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar. Verifique o console.");
    } finally {
      setSaving(false);
    }
  };

  // Funções Arrays
  const handleAddString = (field: "composition" | "features", val: string, setVal: (v:string)=>void) => {
    if (!val.trim()) return;
    setFormData(prev => ({ ...prev, [field]: [...prev[field], val] }));
    setVal("");
  };

  const handleRemoveString = (field: "composition" | "features", idx: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== idx)
    }));
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const handleAddRoom = () => {
    if (!newRoomName.trim() || !newRoomSize.trim()) return;
    setFormData(prev => ({
      ...prev,
      rooms: [...(prev.rooms || []), { name: newRoomName, size: newRoomSize }]
    }));
    setNewRoomName("");
    setNewRoomSize("");
  };

  const handleRemoveRoom = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      rooms: (prev.rooms || []).filter((_, i) => i !== idx)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-slate-800">Catálogo de Modelos</h2>
          <p className="text-sm text-slate-500">Gerência de chalés, casas pré-fabricadas e plantas.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary/90"
        >
          <Plus className="h-5 w-5" />
          Adicionar Modelo
        </button>
      </div>

      {loading ? (
        <div className="flex py-20 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {models.map(model => (
            <div key={model.id} className="group overflow-hidden flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
              <div className="relative aspect-video w-full bg-slate-100">
                {model.image ? (
                  <Image src={model.image} alt={model.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400"><ImageIcon className="h-8 w-8" /></div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-4">
                  <button onClick={() => handleOpenModal(model)} className="p-2 rounded-full bg-white text-slate-800 hover:text-primary transition-colors">
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button onClick={() => model.id && handleDelete(model.id)} className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-slate-800 mb-2 truncate">{model.name}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  <span>{model.area}</span>
                  <span>•</span>
                  <span>{model.bedrooms} Quartos</span>
                </div>
                <div className="mt-auto border-t border-slate-100 pt-3 flex justify-between items-center text-sm">
                  <span className="font-semibold text-primary">{model.price}</span>
                </div>
              </div>
            </div>
          ))}
          {models.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
              Nenhum modelo cadastrado.
            </div>
          )}
        </div>
      )}

      {/* Modal / Formulário */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 flex-shrink-0">
              <h3 className="text-xl font-bold text-slate-800">
                {isEditing ? `Editar Modelo: ${formData.name}` : "Novo Modelo"}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 px-6 flex-shrink-0 overflow-x-auto hide-scrollbar">
              <button
                onClick={() => setActiveTab("basico")}
                className={`py-3 px-4 font-semibold text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'basico' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                 <span className="flex items-center gap-2"><FileText className="h-4 w-4"/> Inf. Básicas</span>
              </button>
              <button
                onClick={() => setActiveTab("detalhes")}
                className={`py-3 px-4 font-semibold text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'detalhes' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                 <span className="flex items-center gap-2"><Settings className="h-4 w-4"/> Detalhes</span>
              </button>
              <button
                onClick={() => setActiveTab("midia")}
                className={`py-3 px-4 font-semibold text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'midia' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                 <span className="flex items-center gap-2"><ImageIcon className="h-4 w-4"/> Fotos</span>
              </button>
              <button
                onClick={() => setActiveTab("planta")}
                className={`py-3 px-4 font-semibold text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'planta' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                 <span className="flex items-center gap-2"><FileText className="h-4 w-4"/> Planta Baixa</span>
              </button>
            </div>

            <div className="overflow-y-auto p-6 flex-1 bg-slate-50/50">
              <form id="model-form" onSubmit={handleSave} className="space-y-6">
                
                {/* ABA 1: BÁSICO */}
                {activeTab === "basico" && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="col-span-full grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Nome do Modelo *</label>
                        <input type="text" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full rounded-lg border border-slate-200 p-3" placeholder="Ex: Chalé Suíço" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Link do Modelo (Slug SEO)</label>
                        <input type="text" value={formData.slug} onChange={e => setFormData(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} className="w-full rounded-lg border border-slate-200 p-3 font-mono text-sm" placeholder="Ex: chale-itacimirim" />
                        <p className="text-[10px] text-slate-500 mt-1">Gera a URL: woodbahia.site/modelo/<strong>{formData.slug || "id-automatico"}</strong></p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">Preço Principal (Montado) *</label>
                      <input type="text" required value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} className="w-full rounded-lg border border-slate-200 p-3" placeholder="Ex: R$ 85.000" />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">Preço do Kit (Montagem própria)</label>
                      <input type="text" value={formData.kitPrice || ""} onChange={e => setFormData(p => ({ ...p, kitPrice: e.target.value }))} className="w-full rounded-lg border border-slate-200 p-3" placeholder="Ex: R$ 45.000" />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">Preço Promocional (Opcional)</label>
                      <input type="text" value={formData.promoPrice || ""} onChange={e => setFormData(p => ({ ...p, promoPrice: e.target.value }))} className="w-full rounded-lg border-red-200 bg-red-50 p-3 focus:border-red-500 focus:ring-1 focus:ring-red-500" placeholder="Ex: R$ 75.000 (Substitui Preço)" />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">Etiqueta/Badge (Opcional)</label>
                      <input type="text" value={formData.promoBadge || ""} onChange={e => setFormData(p => ({ ...p, promoBadge: e.target.value }))} className="w-full rounded-lg border-red-200 bg-red-50 p-3 focus:border-red-500 focus:ring-1 focus:ring-red-500" placeholder="Ex: 15% OFF | CHALÉ PRONTO" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Área (m²) *</label>
                        <input type="text" value={formData.area} onChange={e => setFormData(p => ({ ...p, area: e.target.value }))} className="w-full rounded-lg border border-slate-200 p-3" placeholder="Ex: 45m²" />
                      </div>
                      <div>
                         <label className="mb-1 block text-sm font-semibold text-slate-700">Área Construída</label>
                         <input type="text" value={formData.builtArea || ""} onChange={e => setFormData(p => ({ ...p, builtArea: e.target.value }))} className="w-full rounded-lg border border-slate-200 p-3" placeholder="Ex: 42m²" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Andares</label>
                        <input type="text" value={formData.floors} onChange={e => setFormData(p => ({ ...p, floors: e.target.value }))} className="w-full rounded-lg border border-slate-200 p-3" placeholder="Ex: 1 ou Mezanino" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Quartos</label>
                        <input type="number" min="0" value={formData.bedrooms} onChange={e => setFormData(p => ({ ...p, bedrooms: parseInt(e.target.value)||0 }))} className="w-full rounded-lg border border-slate-200 p-3" />
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label className="mb-1 block text-sm font-semibold text-slate-700">Descrição Curta</label>
                      <textarea rows={2} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className="w-full rounded-lg border border-slate-200 p-3 resize-none" placeholder="Aparece no card pequeno na galeria..." />
                    </div>
                  </div>
                )}

                {/* ABA 2: DETALHES */}
                {activeTab === "detalhes" && (
                  <div className="space-y-6">
                     <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">Descrição Completa</label>
                      <textarea rows={3} value={formData.fullDescription} onChange={e => setFormData(p => ({ ...p, fullDescription: e.target.value }))} className="w-full rounded-lg border border-slate-200 p-3 resize-none" placeholder="Aparece na página de detalhes do modelo..." />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Conceito</label>
                        <input type="text" value={formData.concept} onChange={e => setFormData(p => ({ ...p, concept: e.target.value }))} className="w-full rounded-lg border border-slate-200 p-3" placeholder="Ex: Moderno e integrado à natureza" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Ideal para</label>
                        <input type="text" value={formData.ideal} onChange={e => setFormData(p => ({ ...p, ideal: e.target.value }))} className="w-full rounded-lg border border-slate-200 p-3" placeholder="Ex: Famílias médias e locação" />
                      </div>
                    </div>

                    {/* Arrays */}
                    <div className="grid md:grid-cols-2 gap-8 border-t border-slate-200 pt-6">
                      {/* Composition */}
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Cômodos / Composição</label>
                        <div className="flex gap-2 mb-3">
                          <input type="text" value={newComp} onChange={e => setNewComp(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddString('composition', newComp, setNewComp)}}} className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Ex: 1 Suíte master" />
                          <button type="button" onClick={() => handleAddString('composition', newComp, setNewComp)} className="bg-slate-200 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-300">
                             <Plus className="h-5 w-5" />
                          </button>
                        </div>
                        <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                          {formData.composition.map((item, idx) => (
                            <li key={idx} className="flex justify-between items-center bg-white border border-slate-100 p-2 rounded-md text-sm">
                              <span>{item}</span>
                              <button type="button" onClick={() => handleRemoveString('composition', idx)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Minus className="h-3 w-3"/></button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Features */}
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Diferenciais</label>
                        <div className="flex gap-2 mb-3">
                          <input type="text" value={newFeat} onChange={e => setNewFeat(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddString('features', newFeat, setNewFeat)}}} className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Ex: Fechadura eletrônica" />
                          <button type="button" onClick={() => handleAddString('features', newFeat, setNewFeat)} className="bg-slate-200 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-300">
                             <Plus className="h-5 w-5" />
                          </button>
                        </div>
                        <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                          {formData.features.map((item, idx) => (
                            <li key={idx} className="flex justify-between items-center bg-white border border-slate-100 p-2 rounded-md text-sm">
                              <span>{item}</span>
                              <button type="button" onClick={() => handleRemoveString('features', idx)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Minus className="h-3 w-3"/></button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* ABA 3: FOTOS DA GALERIA */}
                {activeTab === "midia" && (
                  <div className="space-y-8">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">Foto Principal (Capa) *</label>
                      <ImageUpload folder="models/covers" defaultImage={formData.image} onUploadComplete={url => setFormData(p => ({ ...p, image: url }))} />
                    </div>

                    <div className="border-t border-slate-200 pt-6">
                       <label className="mb-4 block text-sm font-semibold text-slate-700">Galeria de Fotos do Projeto</label>
                       
                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                        {formData.gallery.map((img, index) => (
                          <div key={index} className="relative aspect-video overflow-hidden rounded-xl border border-slate-200 group">
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

                       <div>
                          <MultiImageUpload folder="models/gallery" onUploadComplete={urls => { if(urls && urls.length > 0) setFormData(p => ({ ...p, gallery: [...p.gallery, ...urls] }))}} />
                       </div>
                    </div>
                  </div>
                )}

                {/* ABA 4: PLANTA BAIXA */}
                {activeTab === "planta" && (
                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                       <div>
                         <label className="mb-2 block text-sm font-semibold text-slate-700">Imagem da Planta Térrea</label>
                         <input type="text" value={formData.floorPlanLabel || "Planta Térrea"} onChange={e => setFormData(p => ({ ...p, floorPlanLabel: e.target.value }))} className="w-full rounded-lg border border-slate-200 p-2 mb-2 text-sm" placeholder="Rótulo. Ex: Planta Térrea" />
                         <ImageUpload folder="models/floorplans" defaultImage={formData.floorPlanImage} onUploadComplete={url => setFormData(p => ({ ...p, floorPlanImage: url }))} />
                         {/* Fallback support for legacy field */}
                         {!formData.floorPlanImage && (formData as any).floorPlan && (
                            <p className="text-xs text-orange-500 mt-1">Este modelo possui planta em formato legado. Ao alterar, ela será salva no novo formato.</p>
                         )}
                       </div>
                       <div>
                         <label className="mb-2 block text-sm font-semibold text-slate-700">Planta Superior (Opcional)</label>
                         <input type="text" value={formData.floorPlanSuperiorLabel || "Planta Superior"} onChange={e => setFormData(p => ({ ...p, floorPlanSuperiorLabel: e.target.value }))} className="w-full rounded-lg border border-slate-200 p-2 mb-2 text-sm" placeholder="Rótulo. Ex: Mezanino" />
                         <ImageUpload folder="models/floorplans_superior" defaultImage={formData.floorPlanSuperiorImage} onUploadComplete={url => setFormData(p => ({ ...p, floorPlanSuperiorImage: url }))} />
                       </div>
                    </div>
                    
                    <div className="border-t border-slate-200 pt-6">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">Distribuição de Ambientes (Tabela da Planta)</label>
                      <div className="flex gap-2 mb-3">
                        <input type="text" value={newRoomName} onChange={e => setNewRoomName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddRoom()}}} className="flex-2 rounded-lg border border-slate-200 px-3 py-2 text-sm w-full" placeholder="Nome. Ex: Suíte Master" />
                        <input type="text" value={newRoomSize} onChange={e => setNewRoomSize(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddRoom()}}} className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm w-full" placeholder="Área. Ex: 12m²" />
                        <button type="button" onClick={() => handleAddRoom()} className="bg-slate-200 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-300">
                           <Plus className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <ul className="space-y-2 max-h-48 overflow-y-auto pr-2 mt-4 border border-slate-100 rounded-lg p-2 bg-slate-50">
                        {(!formData.rooms || formData.rooms.length === 0) && (
                          <li className="text-sm text-slate-400 p-2 text-center">Nenhum cômodo cadastrado.</li>
                        )}
                        {(formData.rooms || []).map((room, idx) => (
                          <li key={idx} className="flex justify-between items-center bg-white border border-slate-200 p-2 rounded-md text-sm shadow-sm">
                            <span className="font-medium text-slate-700">{room.name}</span>
                            <div className="flex items-center gap-3">
                               <span className="text-primary font-bold">{room.size}</span>
                               <button type="button" onClick={() => handleRemoveRoom(idx)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Minus className="h-4 w-4"/></button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

              </form>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-6 py-4 flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="rounded-lg px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    form="model-form"
                    disabled={saving}
                    className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 disabled:opacity-70"
                  >
                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    {saving ? "Salvando..." : "Salvar Modelo"}
                  </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
