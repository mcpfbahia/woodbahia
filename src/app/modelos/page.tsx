"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Maximize2, Layers, Loader2 } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { initialModels } from "~/lib/data";
import { StaggerContainer, StaggerItem } from "~/components/common/ScrollReveal";
import Image from "next/image";
import { Header } from "~/components/layout/Header";
import { WhatsAppButton } from "~/components/common/WhatsAppButton";
import { FooterWoodBahia } from "~/components/layout/FooterWoodBahia";

export default function ModelsGalleryPage() {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchModels = async () => {
      if (!db) {
        setModels(initialModels);
        setLoading(false);
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(db, "models"));
        const modelsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (modelsData.length > 0) {
          setModels(modelsData);
        } else {
          setModels(initialModels);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
        setModels(initialModels);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Background sutil */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary/5 to-transparent" />

      <main className="relative z-10 pb-24 pt-32">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="font-serif mb-6 text-4xl font-bold leading-tight tracking-tight text-primary md:text-5xl lg:text-6xl">
              Nossos Modelos
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Descubra a variedade de chalés e casas pré-fabricadas. Encontre o
              projeto perfeito para o seu estilo de vida.
            </p>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {models.map((model) => (
                <StaggerItem key={model.id}>
                  <div className="card-wood group flex h-full flex-col overflow-hidden border border-border bg-background shadow-sm transition-all hover:shadow-md">
                    {/* Image Container */}
                    <Link
                      href={`/modelo/${model.id}`}
                      className="relative block h-56 overflow-hidden"
                    >
                      <Image
                        src={model.image || "/placeholder.svg"}
                        alt={model.title || model.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
                      {model.promoBadge && (
                        <div className="absolute top-4 right-4 z-10 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                          {model.promoBadge}
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="font-serif text-xl font-bold text-white drop-shadow-md">
                          {model.title || model.name}
                        </p>
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex flex-grow flex-col space-y-4 p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Maximize2 className="h-4 w-4 text-primary" />
                          {model.area}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Layers className="h-4 w-4 text-primary" />
                          {model.floors || "1 Andar"}
                        </span>
                      </div>

                      {model.description && (
                        <p className="line-clamp-3 mb-4 text-sm leading-relaxed text-muted-foreground">
                          {model.description}
                        </p>
                      )}

                      <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            Kit Montado
                          </p>
                          {model.promoPrice ? (
                            <div className="flex flex-col">
                              <span className="text-sm text-muted-foreground line-through decoration-red-500/50">{model.price}</span>
                              <span className="font-serif text-xl font-bold text-red-600">{model.promoPrice}</span>
                            </div>
                          ) : (
                            <p className="font-serif text-lg font-bold text-primary">
                              {model.price}
                            </p>
                          )}
                        </div>
                        <Link
                          href={`/modelo/${model.id}`}
                          className="group/btn hover:bg-secondary inline-flex items-center gap-2 rounded-xl bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary transition-all hover:text-white"
                        >
                          Detalhes
                          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </main>

      <FooterWoodBahia />
      <WhatsAppButton />
    </div>
  );
}
