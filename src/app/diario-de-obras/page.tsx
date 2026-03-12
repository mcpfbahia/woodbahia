"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, MessageCircle, Loader2 } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { Header } from "~/components/layout/Header";
import { FooterWoodBahia } from "~/components/layout/FooterWoodBahia";
import { WhatsAppButton } from "~/components/common/WhatsAppButton";
import Image from "next/image";

interface Obra {
  id: string;
  status: string;
  titulo: string;
  fase: string;
  imagem_principal: string;
  galeria: string[];
  depoimento?: {
    texto: string;
    autor: string;
  };
}

const ObraCard = ({ obra }: { obra: Obra }) => {
  const [mainImage, setMainImage] = useState(obra.imagem_principal);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="bg-card group flex flex-col overflow-hidden rounded-3xl border border-border shadow-md transition-shadow hover:shadow-lg"
    >
      {/* Imagem Principal */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={mainImage}
          alt={obra.titulo}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Badge */}
        <div className="absolute left-4 top-4">
          {obra.status === "Andamento" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-md">
              🚧 Em Andamento
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-md">
              ✅ Entregue
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif mb-2 line-clamp-2 text-xl font-bold text-foreground">
          {obra.titulo}
        </h3>
        <p className="mb-6 flex-1 text-sm text-muted-foreground">{obra.fase}</p>

        {/* Mini-galeria */}
        <div className="mb-6 grid grid-cols-4 gap-2">
          {obra.galeria?.map((img, i) => (
            <div
              key={i}
              onClick={() => setMainImage(img)}
              className="ring-primary ring-offset-background aspect-square cursor-pointer overflow-hidden rounded-lg transition-all ring-offset-2 hover:ring-2"
            >
              <Image
                src={img}
                alt={`Galeria ${i + 1}`}
                width={80}
                height={80}
                className="h-full w-full object-cover transition-opacity hover:opacity-80"
              />
            </div>
          ))}
        </div>

        {/* Depoimento (apenas entregues) */}
        {obra.status === "Entregue" && obra.depoimento && (
          <div className="mt-auto border-t border-border pt-4">
            <div className="flex items-start gap-3">
              <Quote className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div>
                <p className="mb-2 text-sm italic leading-relaxed text-foreground/90">
                  "{obra.depoimento.texto}"
                </p>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  — {obra.depoimento.autor}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function DiarioObrasPage() {
  const [activeTab, setActiveTab] = useState("Todos");
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchObras = async () => {
      if (!db) {
        setObras([]);
        setLoading(false);
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(db, "diario_obras"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Obra[];
        setObras(data);
      } catch (error) {
        console.error("Erro ao buscar Diário de Obras:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchObras();
  }, []);

  const filteredObras = obras.filter((obra) => {
    if (activeTab === "Todos") return true;
    if (activeTab === "Em Andamento") return obra.status === "Andamento";
    if (activeTab === "Obras Entregues") return obra.status === "Entregue";
    return true;
  });

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <Header />

      {/* Background sutil */}
      <div className="from-primary/5 pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b to-transparent" />

      <main className="relative z-10 pb-24 pt-32">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="font-serif mb-6 text-4xl font-bold leading-tight tracking-tight text-primary md:text-5xl lg:text-6xl">
              Diário de Obras
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Transparência e qualidade em cada detalhe. Acompanhe a evolução da
              montagem das nossas casas e chalés de madeira.
            </p>
          </div>

          {/* Filtros */}
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            {["Todos", "Em Andamento", "Obras Entregues"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full border px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-primary border-primary text-white shadow-md"
                    : "bg-card border-border text-foreground hover:bg-primary/5 hover:border-primary/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Grid de Obras */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredObras.length > 0 ? (
                  filteredObras.map((obra) => (
                    <ObraCard key={obra.id} obra={obra} />
                  ))
                ) : (
                  <div className="col-span-full rounded-3xl border border-border bg-card py-20 text-center">
                    <p className="text-lg text-muted-foreground">
                      Nenhuma obra encontrada para esta categoria ainda.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-20 lg:mt-32">
            <div className="bg-card shadow-primary/20 relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-primary/10 p-8 shadow-lg md:p-12 text-center">
              <div className="relative z-10 mx-auto max-w-3xl">
                <h2 className="mb-6 text-3xl font-bold text-primary md:text-4xl">
                  Viu como nosso processo é seguro e organizado?
                </h2>
                <p className="mb-8 text-lg text-muted-foreground">
                  O próximo projeto a sair do papel pode ser o seu. Fale com
                  nossa equipe e tire suas dúvidas.
                </p>
                <a
                  href="https://wa.me/5571992936290"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shadow-primary/20 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground transition-all shadow-xl hover:scale-[1.02] hover:bg-primary/90"
                >
                  <MessageCircle className="h-5 w-5" />
                  Falar com um Especialista Agora
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterWoodBahia />
      <WhatsAppButton />
    </div>
  );
}
