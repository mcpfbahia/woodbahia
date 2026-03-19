"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Maximize2, Layers, Pencil, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { initialModels } from "~/lib/data";
import { Button } from "../ui/button";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "../common/ScrollReveal";
import { cn } from "~/lib/utils";
import { buttonVariants } from "../ui/button";


export const ModelsSection = () => {
  const [models, setModels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      if (!db) {
        setModels(initialModels);
        setIsLoading(false);
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
        setIsLoading(false);
      }
    };

    fetchModels();
  }, []);


  return (
    <section
      id="modelos"
      className="relative overflow-hidden bg-card py-20 md:py-32"
    >
      <div className="absolute inset-0 bg-pattern opacity-30" />

      <div className="container relative z-10 mx-auto px-4">
        <ScrollReveal className="mb-16 text-center">
          <span className="mb-6 inline-block rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">
            Nossos Modelos
          </span>
          <h2 className="section-title text-3xl font-bold md:text-5xl">
            Escolha o chalé
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {" "}
              dos seus sonhos
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg lg:text-xl mt-4">
            Conheça nossos modelos exclusivos pensados para morar, investir ou
            relaxar. Cada projeto é a combinação perfeita de design rústico e
            conforto moderno.
          </p>
        </ScrollReveal>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {models?.slice(0, 5).map((model, idx) => (
              <StaggerItem
                key={model.id}
                index={idx}
                className={idx >= 3 ? "hidden md:block" : ""}
              >
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg">
                  {/* Image Container */}
                  <Link
                    href={`/modelo/${model.id}`}
                    className="relative -mx-6 -mt-6 mb-6 block h-48 overflow-hidden sm:h-52"
                  >
                    <Image
                      src={model.image || "/placeholder.svg"}
                      alt={`${model.name} - chalé de madeira ideal para investimento em Airbnb na Bahia`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4">
                      <p className="font-serif text-lg font-bold text-white md:text-xl">
                        {model.name}
                      </p>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex flex-grow flex-col space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Maximize2 className="h-4 w-4" />
                        {model.area}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Layers className="h-4 w-4" />
                        {model.floors}
                      </span>
                    </div>

                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {model.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                      <div className="flex flex-col gap-1">
                        <div>
                          <p className="text-[10px] uppercase text-muted-foreground">
                            Kit Montado
                          </p>
                          <p className="font-serif text-xl font-bold text-primary">
                            {model.price}
                          </p>
                        </div>
                        <p className="mt-1 text-[10px] font-medium leading-tight text-secondary">
                          * Frete grátis (consulte condições)
                        </p>
                      </div>
                      <Link
                        href={`/modelo/${model.id}`}
                        className="group/btn inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-secondary/10 px-4 py-2.5 text-sm font-bold text-secondary transition-all hover:bg-secondary hover:text-white"
                      >
                        Conhecer Modelo
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}

            {/* Card Projeto Personalizado */}
            <StaggerItem index={5} className="hidden md:block">
              <div className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 transition-all duration-300 hover:border-primary/50">
                <div className="flex flex-grow flex-col items-center justify-center py-8 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:scale-110">
                    <Pencil className="h-8 w-8 text-primary" />
                  </div>

                  <h3 className="mb-4 font-serif text-2xl font-bold text-primary">
                    Projeto Personalizado
                  </h3>

                  <p className="mb-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    Envie sua ideia e nossos arquitetos desenvolvem o modelo
                    ideal para você
                  </p>

                  <a
                    href="https://wa.me/5571992936290?text=Olá! Gostaria de mais informações sobre projetos personalizados."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cta w-full"
                  >
                    Solicitar Orçamento
                  </a>
                </div>

                <p className="border-t border-border pt-2 pb-4 text-center text-[10px] text-muted-foreground mt-4">
                  * Custo adicional para projetos personalizados
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        )}

        {/* View All Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/modelos"
            className={cn(
              "btn-cta w-full sm:w-auto"
            )}
          >
            Ver Todos os Modelos
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>



      </div>
    </section>
  );
};
