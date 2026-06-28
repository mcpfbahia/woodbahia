"use client";

import { useState } from "react";
import { supabase } from "~/lib/supabase";
import { UploadCloud, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface MultiImageUploadProps {
  onUploadComplete: (urls: string[]) => void;
  folder?: string;
}

export function MultiImageUpload({ onUploadComplete, folder = "uploads" }: MultiImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const executeUpload = async (uploadFiles: File[]) => {
    if (uploadFiles.length === 0) return;

    setUploading(true);
    setError("");
    setProgress(0);

    const fileProgresses = new Array(uploadFiles.length).fill(0);

    const uploadPromises = uploadFiles.map((file, index) => {
      return new Promise<string>(async (resolve, reject) => {
        const fileExtension = file.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;
        const filePath = `${folder}/${fileName}`;

        // Se Supabase estiver disponível, usa ele
        if (supabase) {
          try {
            const { data, error: uploadError } = await supabase.storage
              .from('woodbahia')
              .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
              .from('woodbahia')
              .getPublicUrl(filePath);

            fileProgresses[index] = 100;
            setProgress(fileProgresses.reduce((a, b) => a + b, 0) / uploadFiles.length);
            resolve(publicUrl);
          } catch (err: any) {
            console.error("Erro no upload múltiplo Supabase:", err);
            reject(err);
          }
        } else {
          reject(new Error("Supabase não configurado. Por favor, pare o terminal (Ctrl+C) e inicie o npm run dev novamente."));
        }
      });
    });

    try {
      const urls = await Promise.all(uploadPromises);
      onUploadComplete(urls);
      setUploading(false);
      // Remove previews after upload so the user can select new ones.
      // The parent component should be responsible for showing the finalized images in its own gallery.
      setPreviews([]);
    } catch (err) {
      setError("Falha ao enviar uma ou mais imagens.");
      setUploading(false);
      setPreviews([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      const validFiles: File[] = [];
      const validPreviews: string[] = [];
      let hasError = false;

      for (const file of selectedFiles) {
        if (!file.type.startsWith("image/")) {
          setError("Por favor, selecione apenas imagens.");
          hasError = true;
          break;
        }
        if (file.size > 5 * 1024 * 1024) {
          setError("Algumas imagens têm mais de 5MB. O limite é 5MB por arquivo.");
          hasError = true;
          break;
        }
        validFiles.push(file);
        validPreviews.push(URL.createObjectURL(file));
      }

      if (!hasError) {
        setPreviews(validPreviews);
        setError("");
        
        // Auto upload!
        executeUpload(validFiles);
      }
    }
  };

  return (
    <div className="w-full">
      {previews.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {previews.map((preview, index) => (
            <div key={index} className="relative aspect-video overflow-hidden rounded-xl border border-slate-200">
              <Image src={preview} alt={`Preview ${index}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {uploading ? (
        <div className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-slate-200 bg-slate-50 py-8 text-slate-800">
          <Loader2 className="mb-2 h-8 w-8 animate-spin text-primary" />
          <span className="font-semibold">Fazendo Upload: {Math.round(progress)}%</span>
        </div>
      ) : (
        <label className="group flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:border-primary hover:bg-primary/5 py-8">
          <div className="flex flex-col items-center justify-center text-slate-500 transition-colors group-hover:text-primary">
            <UploadCloud className="mb-4 h-10 w-10 text-slate-400 group-hover:text-primary" />
            <p className="mb-2 text-sm font-semibold text-center">
              <span className="text-primary underline">Selecione Múltiplas Fotos</span> ou arraste
            </p>
            <p className="text-xs text-slate-400">Upload Automático (Max. 5MB cada)</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </label>
      )}

      {error && <p className="mt-2 text-sm font-medium text-red-500">{error}</p>}
    </div>
  );
}
