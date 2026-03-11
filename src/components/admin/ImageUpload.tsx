"use client";

import { useState, useCallback } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "~/lib/firebase";
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
    }
  };

  const clearImage = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
    setError("");
    onUploadComplete(""); // Clear URL
  };

  const handleUpload = async () => {
    if (!file || !storage) return;

    setUploading(true);
    setError("");

    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(prog);
      },
      (err) => {
        console.error("Erro no upload:", err);
        setError("Falha ao enviar a imagem.");
        setUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onUploadComplete(downloadURL);
          setUploading(false);
          setFile(null); // Upload succeeded, clear the local file object 
          // We keep the preview URL pointing to the local blob for immediate feedback, 
          // but arguably we could set it to the downloadURL
        } catch (err) {
          setError("Erro ao obter o link da imagem.");
          setUploading(false);
        }
      }
    );
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
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                type="button"
                onClick={clearImage}
                className="flex items-center justify-center rounded-lg bg-red-500 p-2 text-white shadow-lg hover:bg-red-600"
              >
                <X className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleUpload}
                className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 font-semibold text-white shadow-lg hover:bg-green-600"
              >
                <UploadCloud className="h-5 w-5" />
                Fazer Upload
              </button>
            </div>
          )}
          {!uploading && !file && (
            <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700 shadow-sm border border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              Upload Concluído
            </div>
          )}
          {!uploading && !file && preview === defaultImage && (
             <button
                type="button"
                onClick={clearImage}
                className="absolute top-4 right-4 flex items-center justify-center rounded-lg bg-red-500 p-2 text-white shadow-lg hover:bg-red-600"
                title="Remover imagem atual"
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
            <p className="text-xs text-slate-400">SVG, PNG, JPG ou WEBP (Max. 5MB)</p>
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
