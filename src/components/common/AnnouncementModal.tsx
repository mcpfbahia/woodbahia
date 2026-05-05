"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle2, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const AnnouncementModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já viu o aviso nesta sessão
    const seen = sessionStorage.getItem("wb-announcement-seen");
    if (!seen) {
      const timer = setTimeout(() => setIsOpen(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => {
    sessionStorage.setItem("wb-announcement-seen", "1");
    setIsOpen(false);
  };

  const handleCTA = () => {
    close();
    // Espera o modal fechar antes de fazer scroll
    setTimeout(() => {
      const section = document.getElementById("modelos");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        // Backdrop
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
          style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
          onClick={close}
        >
          {/* Modal box — stopPropagation para não fechar ao clicar dentro */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FDFAF7] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Borda superior decorativa */}
            <div className="h-1.5 w-full rounded-t-3xl bg-gradient-to-r from-[#B06D46] to-[#8A3A1B]" />

            {/* Botão fechar */}
            <button
              onClick={close}
              aria-label="Fechar aviso"
              className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-400 transition-colors hover:bg-stone-200 hover:text-stone-700"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Conteúdo */}
            <div className="px-6 py-7 sm:px-8 sm:py-8">

              {/* Eyebrow */}
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-700">
                📢 Aviso Importante — a partir de 11 de maio
              </span>

              {/* Título */}
              <h2 className="mb-4 font-serif text-xl font-bold leading-snug text-[#2C1A10] sm:text-2xl">
                Construção Inteligente: Mais Economia e Liberdade para o Seu Projeto
              </h2>

              {/* Intro */}
              <p className="mb-5 text-sm leading-relaxed text-[#57463A] sm:text-base">
                A partir do dia{" "}
                <strong className="text-[#2C1A10]">11 de maio</strong>, adotaremos um formato de vendas inovador, desenhado exclusivamente para{" "}
                <strong className="text-[#2C1A10]">reduzir drasticamente os custos finais da sua obra</strong>.
              </p>
              <p className="mb-5 text-sm leading-relaxed text-[#57463A] sm:text-base">
                Para entregar o melhor valor de mercado e proteger o seu investimento contra impostos e taxas embutidas da construção civil, deixaremos de atuar com o modelo <em>&ldquo;chave na mão&rdquo;</em>. Nossa operação agora será{" "}
                <strong className="text-[#2C1A10]">100% focada na excelência industrial</strong>: fabricamos e entregamos o seu kit de madeiramento premium direto no seu terreno.
              </p>

              {/* Subtítulo 1 */}
              <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-[#B06D46]">
                Como funciona a montagem?
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-[#57463A] sm:text-base">
                Nós conectamos você à nossa rede de carpinteiros e montadores credenciados — os melhores e mais experientes profissionais, localizados o mais perto possível da sua região. Você adquire o kit e os opcionais com preço de fábrica e negocia a montagem diretamente com a equipe técnica.
              </p>

              {/* Subtítulo 2 */}
              <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-[#B06D46]">
                Por que esse modelo é a melhor escolha para você?
              </h3>
              <ul className="mb-5 space-y-2.5">
                {[
                  {
                    title: "Economia Real",
                    text: "Sem taxas de intermediação. O valor do kit cai, e o custo da mão de obra também, pois você contrata o serviço direto com o prestador.",
                  },
                  {
                    title: "Transparência Total",
                    text: "Contratos separados. Você sabe exatamente para onde vai cada centavo: o custo do material e o custo do serviço.",
                  },
                  {
                    title: "Especialização",
                    text: "Profissionais locais que já conhecem nossos projetos garantem o ajuste perfeito das peças e uma montagem ágil e limpa.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <p className="text-sm leading-relaxed text-[#57463A]">
                      <strong className="text-[#2C1A10]">{item.title}:</strong>{" "}
                      {item.text}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Parágrafo final */}
              <p className="mb-6 rounded-2xl bg-stone-100/80 p-4 text-sm leading-relaxed text-[#57463A] sm:text-base">
                Essa mudança é a união perfeita entre a{" "}
                <strong className="text-[#2C1A10]">precisão da nossa fábrica</strong> e a{" "}
                <strong className="text-[#2C1A10]">eficiência da mão de obra especializada</strong>, garantindo um chalé de alto padrão com um custo-benefício imbatível.
              </p>

              {/* CTA */}
              <button
                onClick={handleCTA}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#B06D46] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#8A3A1B] hover:shadow-lg active:scale-[0.98] sm:text-base"
              >
                Entendi e Quero Ver os Novos Valores
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
