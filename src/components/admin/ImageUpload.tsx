"use client";

import { useState } from "react";
import { supabase } from "~/lib/supabase";
import { UploadCloud, X, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  folder?: string;
  defaultImage?: string;
}

export function ImageUpload({ onUploadComplete, folder = "uploads", defaultImage }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const executeUpload = async (uploadFile: File) => {
    if (supabase) {
      setUploading(true);
      setError("");
      setProgress(10);

      try {
        const fileExtension = uploadFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;
        const filePath = `${folder}/${fileName}`;

        setProgress(30);

        const { data, error: uploadError } = await supabase.storage
          .from('woodbahia') // Usando bucket central 'woodbahia'
          .upload(filePath, uploadFile, {
             cacheControl: '3600',
             upsert: false
          });

        if (uploadError) throw uploadError;

        setProgress(80);

        const { data: { publicUrl } } = supabase.storage
          .from('woodbahia')
          .getPublicUrl(filePath);

        onUploadComplete(publicUrl);
        setProgress(100);
        setUploading(false);
      } catch (err: any) {
        console.error("Erro no upload Supabase:", err);
        setError(`Falha no Supabase: ${err.message || 'Erro desconhecido'}`);
        setUploading(false);
        setFile(null);
      }
    } else {
      setError("Supabase não configurado. Por favor, pare o terminal (Ctrl+C) e inicie o npm run dev novamente.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.type.startsWith("image/")) {
        setError("Por favor, selecione apenas imagens.");
        return;
      }
      if (selected.size > 5 * 1024 * 1024) {
        setError("A imagem deve ter no máximo 5MB.");
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError("");
      
      // Auto upload!
      executeUpload(selected);
    }
  };

  const clearImage = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
    setError("");
    onUploadComplete(""); // Clear URL
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border-2 border-slate-200">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
          {uploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white backdrop-blur-sm">
              <Loader2 className="mb-2 h-8 w-8 animate-spin" />
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
          )}
          {!uploading && file && (
            <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700 shadow-sm border border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              Upload Concluído
            </div>
          )}
          {!uploading && (
             <button
                type="button"
                onClick={clearImage}
                className="absolute right-4 bottom-4 flex items-center justify-center rounded-lg bg-red-500 p-2 text-white shadow-lg hover:bg-red-600"
                title="Remover imagem"
             >
               <X className="h-5 w-5" />
             </button>
          )}
        </div>
      ) : (
        <label className="group flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:border-primary hover:bg-primary/5">
          <div className="flex flex-col items-center justify-center pb-6 pt-5 text-slate-500 transition-colors group-hover:text-primary">
            <UploadCloud className="mb-4 h-10 w-10 text-slate-400 group-hover:text-primary" />
            <p className="mb-2 text-sm font-semibold">
              <span className="text-primary underline">Clique para selecionar</span> ou arraste
            </p>
            <p className="text-xs text-slate-400">Upload Automático (Max. 5MB)</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      )}

      {error && <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
}
