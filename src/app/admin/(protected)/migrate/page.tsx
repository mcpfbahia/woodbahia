"use client";

import { useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { supabase } from "~/lib/supabase";
import { Loader2, Database, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import Image from "next/image";

interface LogEntry {
  type: "info" | "success" | "error";
  message: string;
}

export default function MigrateImagesPage() {
  const [isMigrating, setIsMigrating] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const addLog = (type: "info" | "success" | "error", message: string) => {
    setLogs((prev) => [...prev, { type, message }]);
  };

  const downloadImageAsFile = async (url: string, filename: string): Promise<File | null> => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    } catch (e: any) {
      console.error("Erro ao baixar imagem:", e);
      return null;
    }
  };

  const uploadToSupabase = async (file: File, folder: string): Promise<string | null> => {
    if (!supabase) return null;
    try {
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('woodbahia')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('woodbahia')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (e) {
      console.error("Erro ao subir no Supabase:", e);
      return null;
    }
  };

  const processUrl = async (url: string, folder: string): Promise<string> => {
    // Se não for do Firebase, não faz nada
    if (!url.includes("firebasestorage")) return url;

    const file = await downloadImageAsFile(url, "migrated_image.jpg");
    if (!file) throw new Error("Falha no download");

    const newUrl = await uploadToSupabase(file, folder);
    if (!newUrl) throw new Error("Falha no upload");

    return newUrl;
  };

  const handleMigration = async () => {
    if (!confirm("Tem certeza que deseja iniciar a migração? As imagens do Firebase precisam estar acessíveis para isso funcionar.")) return;
    if (!supabase || !db) {
      addLog("error", "Supabase ou Firebase não inicializados.");
      return;
    }

    setIsMigrating(true);
    setLogs([]);
    
    try {
      addLog("info", "Iniciando busca de modelos...");
      const modelsSnapshot = await getDocs(collection(db, "models"));
      const models = modelsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }) as any);
      
      addLog("info", "Iniciando busca de portfólio...");
      const portfolioSnapshot = await getDocs(collection(db, "portfolio"));
      const portfolios = portfolioSnapshot.docs.map(d => ({ id: d.id, ...d.data() }) as any);

      const totalItems = models.length + portfolios.length;
      setProgress({ current: 0, total: totalItems });
      
      let currentIdx = 0;

      // MIGRAR MODELOS
      for (const model of models) {
        addLog("info", `Processando modelo: ${model.name || model.id}`);
        let updated = false;
        const updates: any = {};

        try {
          if (model.image && model.image.includes("firebasestorage")) {
            addLog("info", `Baixando imagem principal do modelo...`);
            updates.image = await processUrl(model.image, "models/covers");
            updated = true;
          }

          if (model.floorPlanImage && model.floorPlanImage.includes("firebasestorage")) {
             addLog("info", `Baixando planta térrea...`);
             updates.floorPlanImage = await processUrl(model.floorPlanImage, "models/floorplans");
             updated = true;
          }

          if (model.floorPlanSuperiorImage && model.floorPlanSuperiorImage.includes("firebasestorage")) {
             addLog("info", `Baixando planta superior...`);
             updates.floorPlanSuperiorImage = await processUrl(model.floorPlanSuperiorImage, "models/floorplans_superior");
             updated = true;
          }

          if (model.gallery && Array.isArray(model.gallery)) {
            const newGallery = [];
            for (let i = 0; i < model.gallery.length; i++) {
              if (model.gallery[i].includes("firebasestorage")) {
                 addLog("info", `Baixando imagem ${i+1} da galeria...`);
                 const newUrl = await processUrl(model.gallery[i], "models/gallery");
                 newGallery.push(newUrl);
                 updated = true;
              } else {
                 newGallery.push(model.gallery[i]);
              }
            }
            if (updated) updates.gallery = newGallery;
          }

          if (updated) {
            await updateDoc(doc(db, "models", model.id), updates);
            addLog("success", `✅ Modelo '${model.name}' atualizado no banco.`);
          } else {
            addLog("info", `Modelo '${model.name}' pulado (sem imagens do Firebase).`);
          }
        } catch (e: any) {
           addLog("error", `❌ Erro no modelo '${model.name}': ${e.message}`);
        }
        
        currentIdx++;
        setProgress({ current: currentIdx, total: totalItems });
      }

      // MIGRAR PORTFOLIO
      for (const port of portfolios) {
        addLog("info", `Processando portfólio: ${port.title || port.id}`);
        let updated = false;
        const updates: any = {};

        try {
          if (port.image && port.image.includes("firebasestorage")) {
            addLog("info", `Baixando imagem principal do portfólio...`);
            updates.image = await processUrl(port.image, "portfolio");
            updated = true;
          }

          if (port.gallery && Array.isArray(port.gallery)) {
            const newGallery = [];
            for (let i = 0; i < port.gallery.length; i++) {
              if (port.gallery[i].includes("firebasestorage")) {
                 addLog("info", `Baixando imagem ${i+1} da galeria do portfólio...`);
                 const newUrl = await processUrl(port.gallery[i], "portfolio/galeria");
                 newGallery.push(newUrl);
                 updated = true;
              } else {
                 newGallery.push(port.gallery[i]);
              }
            }
            if (updated) updates.gallery = newGallery;
          }

          if (updated) {
            await updateDoc(doc(db, "portfolio", port.id), updates);
            addLog("success", `✅ Portfólio '${port.title}' atualizado no banco.`);
          } else {
            addLog("info", `Portfólio '${port.title}' pulado (sem imagens do Firebase).`);
          }
        } catch (e: any) {
           addLog("error", `❌ Erro no portfólio '${port.title}': ${e.message}`);
        }
        
        currentIdx++;
        setProgress({ current: currentIdx, total: totalItems });
      }

      addLog("success", "🎉 Migração concluída!");
    } catch (error: any) {
      addLog("error", `Erro crítico: ${error.message}`);
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-2">
          <Database className="h-6 w-6 text-primary" />
          Ferramenta de Migração de Imagens
        </h2>
        <p className="text-slate-600 mb-6">
          Esta ferramenta faz o download de todas as imagens salvas no Firebase (modelos e portfólio),
          faz o upload para o seu novo bucket no Supabase, e atualiza os links no banco de dados.
        </p>

        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mb-6">
          <h3 className="font-bold text-amber-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Atenção
          </h3>
          <ul className="list-disc ml-5 mt-2 text-sm text-amber-700 space-y-1">
            <li>Só execute esta ferramenta <strong>quando as imagens estiverem aparecendo no site</strong> (cota do Firebase restabelecida).</li>
            <li>O processo pode demorar alguns minutos dependendo da quantidade de imagens.</li>
            <li>Não feche esta aba durante o processo.</li>
          </ul>
        </div>

        <button
          onClick={handleMigration}
          disabled={isMigrating}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30"
        >
          {isMigrating ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              Migrando... ({progress.current}/{progress.total})
            </>
          ) : (
            <>
              Iniciar Migração para Supabase
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>

      {/* Terminal de Logs */}
      {logs.length > 0 && (
        <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-xl">
          <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-slate-400 text-xs font-mono ml-2">Console de Migração</span>
          </div>
          <div className="p-4 h-96 overflow-y-auto font-mono text-sm space-y-2">
            {logs.map((log, i) => (
              <div key={i} className={`
                ${log.type === 'error' ? 'text-red-400' : ''}
                ${log.type === 'success' ? 'text-green-400 font-bold' : ''}
                ${log.type === 'info' ? 'text-slate-300' : ''}
              `}>
                <span className="text-slate-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                {log.message}
              </div>
            ))}
            {isMigrating && (
              <div className="text-primary animate-pulse">
                Processando... <Loader2 className="inline h-3 w-3 animate-spin" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
