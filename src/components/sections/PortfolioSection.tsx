"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Loader2, Image as ImageIcon } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { initialPortfolio } from "~/lib/data";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "../common/ScrollReveal";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "~/lib/utils";


export const PortfolioSection = () => {
  const [mounted, setMounted] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const fetchPortfolio = async () => {
      if (!db) {
        setPortfolioItems(initialPortfolio);
        setIsLoading(false);
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(db, "portfolio"));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (items.length > 0) {
          setPortfolioItems(items);
        } else {
          setPortfolioItems(initialPortfolio);
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        setPortfolioItems(initialPortfolio);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, []);


  if (!mounted) {
    return (
      <section id="portfolio" className="bg-background py-16 md:py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl h-96 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="bg-background py-16 md:py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="mb-12 text-center md:mb-16">
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary md:text-sm">
              Nossos Projetos
            </span>
            <h2 className="section-title text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">
              Portfólio
            </h2>
            <p className="mx-auto mt-4 max-w-2xl px-2 text-sm text-muted-foreground md:text-lg">
              Conheça alguns dos nossos projetos realizados. Acompanhe nosso
              Instagram para ver mais obras e novidades.
            </p>
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <StaggerContainer className="mx-auto mb-12 grid max-w-5xl grid-cols-2 gap-3 sm:gap-4 md:mb-16 md:grid-cols-3 md:gap-6">
            {portfolioItems?.slice(0, 6).map((item: any, idx: number) => (
              <StaggerItem 
                key={item.id} 
                index={idx}
                className={idx >= 4 ? "hidden md:block" : ""}
              >
                <div className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-muted md:rounded-2xl">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title || "Projeto Wood Bahia"}
                       fill
                       sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                       className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-8 w-8 opacity-50" />
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/50 to-black/20 p-4 opacity-0 transition-all duration-300 group-hover:opacity-100 md:p-6">
                    <div className="translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                      <h4 className="font-serif text-lg font-bold text-white md:text-xl">
                        {item.title}
                      </h4>
                      <p className="mb-2 flex items-center gap-1 text-xs font-medium text-primary md:text-sm">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                        {item.location}
                      </p>
                      {item.description && (
                        <p className="line-clamp-2 border-t border-white/20 pt-2 text-[10px] leading-relaxed text-white/80 md:line-clamp-3 md:text-xs">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {item.instagramUrl && (
                    <a
                      href={item.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#f09433]/90 via-[#e6683c]/90 to-[#bc1888]/90 opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 group-hover:opacity-100 md:right-3 md:top-3 md:h-10 md:w-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Instagram className="h-4 w-4 text-white md:h-5 md:w-5" />
                    </a>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        <ScrollReveal delay={0.3}>
          <div className="flex flex-col items-center gap-6">
            <Link
              href="/portfolio"
              className={cn(
                buttonVariants({ variant: "default" }),
                "btn-cta h-auto gap-2 rounded-xl px-8 py-4 text-sm font-semibold shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl md:gap-3 md:py-6 md:text-base"
              )}
            >
              <ImageIcon className="h-5 w-5" />
              Ver Galeria Completa
            </Link>




            <a
              href="https://www.instagram.com/woodbahiacasasprefabricadas/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <Instagram className="h-4 w-4" />
              <span>Ou siga no Instagram @woodbahiacasasprefabricadas</span>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
