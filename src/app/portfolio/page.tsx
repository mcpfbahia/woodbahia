"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
  Instagram,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { initialPortfolio } from "~/lib/data";
import { StaggerContainer, StaggerItem } from "~/components/common/ScrollReveal";
import Image from "next/image";
import { Header } from "~/components/layout/Header";
import { FooterWoodBahia } from "~/components/layout/FooterWoodBahia";
import { WhatsAppButton } from "~/components/common/WhatsAppButton";

function PortfolioCard({ item, onOpenLightbox }: { item: any; onOpenLightbox: (gallery: string[], index: number, title: string) => void }) {
  const [activeImage, setActiveImage] = useState(item.image);
  const gallery = [item.image, ...(item.gallery || [])].filter(Boolean);

  return (
    <StaggerItem key={item.id}>
      <div 
        className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl bg-muted shadow-lg transition-all duration-300 hover:shadow-xl"
        onClick={() => {
          const currentIndex = gallery.indexOf(activeImage);
          onOpenLightbox(gallery, currentIndex > -1 ? currentIndex : 0, item.title);
        }}
      >
        {item.image ? (
          <Image
            src={activeImage}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImageIcon className="h-12 w-12 opacity-50" />
          </div>
        )}

        {/* Overlay com detalhes */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <div className="translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
            <h3 className="font-serif text-xl font-bold text-white mb-1">
              {item.title}
            </h3>
            <p className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              {item.location}
            </p>

            {item.description && (
              <p className="border-t border-white/20 pt-3 text-sm leading-relaxed text-white/80">
                {item.description}
              </p>
            )}

            {/* Gallery Thumbnails */}
            {gallery.length > 1 && (
              <div
                className="mt-4 flex gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImage(img);
                    }}
                    className={`relative h-12 w-16 overflow-hidden rounded-md border-2 transition-all ${
                      activeImage === img ? 'border-primary scale-110 opacity-100 z-10 shadow-md' : 'border-transparent opacity-60 hover:opacity-100 hover:border-white/50'
                    }`}
                  >
                    <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Instagram Link */}
        {item.instagramUrl && (
          <a
            href={item.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#f09433]/90 via-[#e6683c]/90 to-[#bc1888]/90 opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
            title="Ver no Instagram"
          >
            <Instagram className="h-5 w-5 text-white" />
          </a>
        )}
      </div>
    </StaggerItem>
  );
}

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [lightboxData, setLightboxData] = useState<{
    isOpen: boolean;
    gallery: string[];
    index: number;
    title: string;
  }>({
    isOpen: false,
    gallery: [],
    index: 0,
    title: "",
  });

  const openLightbox = (gallery: string[], index: number, title: string) => {
    setLightboxData({ isOpen: true, gallery, index, title });
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxData((prev) => ({ ...prev, isOpen: false }));
    document.body.style.overflow = "auto";
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxData((prev) => ({ ...prev, index: (prev.index + 1) % prev.gallery.length }));
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxData((prev) => ({ ...prev, index: (prev.index - 1 + prev.gallery.length) % prev.gallery.length }));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxData.isOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") {
        setLightboxData((prev) => ({ ...prev, index: (prev.index + 1) % prev.gallery.length }));
      }
      if (e.key === "ArrowLeft") {
        setLightboxData((prev) => ({ ...prev, index: (prev.index - 1 + prev.gallery.length) % prev.gallery.length }));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxData.isOpen]);

  useEffect(() => {
    setMounted(true);
    const fetchPortfolio = async () => {
      if (!db) {
        setPortfolioItems(initialPortfolio);
        setLoading(false);
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
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}

      {/* Background sutil */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary/5 to-transparent" />

      <main className="relative z-10 pb-24 pt-32">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="font-serif mb-6 text-4xl font-bold leading-tight tracking-tight text-primary md:text-5xl lg:text-6xl">
              Galeria de Projetos
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Explore nossa coleção completa de chalés e casas entregues. Cada
              projeto conta uma história de realização.
            </p>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {portfolioItems.map((item) => (
                <PortfolioCard key={item.id} item={item} onOpenLightbox={openLightbox} />
              ))}
            </StaggerContainer>
          )}

          {!loading && portfolioItems.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              <p>Nenhum projeto encontrado no momento.</p>
              <Link href="/" className="mt-2 inline-block text-primary hover:underline">
                Voltar para a página inicial
              </Link>
            </div>
          )}
        </div>
      </main>

      <FooterWoodBahia />
      <WhatsAppButton />

      {/* Lightbox Modal */}
      {lightboxData.isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md" 
          onClick={closeLightbox}
        >
          <button 
            type="button"
            onClick={closeLightbox} 
            className="absolute right-4 top-4 z-[110] p-2 text-white/70 transition-colors hover:text-white"
          >
            <X className="h-8 w-8" />
          </button>

          {lightboxData.gallery.length > 1 && (
            <>
              <button 
                type="button"
                onClick={prevImage} 
                className="absolute left-4 top-1/2 z-[110] -translate-y-1/2 p-2 text-white/70 transition-all hover:scale-110 hover:text-white md:left-8"
              >
                <ChevronLeft className="h-10 w-10 md:h-14 md:w-14" />
              </button>
              <button 
                type="button"
                onClick={nextImage} 
                className="absolute right-4 top-1/2 z-[110] -translate-y-1/2 p-2 text-white/70 transition-all hover:scale-110 hover:text-white md:right-8"
              >
                <ChevronRight className="h-10 w-10 md:h-14 md:w-14" />
              </button>
            </>
          )}

          <div 
            className="relative flex h-full w-full max-w-6xl flex-col items-center justify-center p-4 md:p-8" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[80vh] w-full">
              <Image
                src={lightboxData.gallery[lightboxData.index] || ""}
                alt={`${lightboxData.title} - Imagem ${lightboxData.index + 1}`}
                fill
                className="object-contain"
                quality={100}
                priority
              />
            </div>
            
            <div className="mt-4 text-center text-white/90">
              <h3 className="text-lg font-medium">{lightboxData.title}</h3>
              {lightboxData.gallery.length > 1 && (
                <p className="text-sm opacity-70">
                  {lightboxData.index + 1} / {lightboxData.gallery.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
