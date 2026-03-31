"use client";

import Image from "next/image";
import { Phone, Instagram, MapPin, Clock, CreditCard, ExternalLink } from "lucide-react";
import { ScrollReveal } from "../common/ScrollReveal";

const footerLinks = [
  { name: "Simular Investimento", href: "/simulador" },
  { name: "Simulador de Cartão", href: "/simulador/parcelamento" },
  { name: "Modelos", href: "/modelos" },
  { name: "Portfólio", href: "/portfolio" },
  { name: "Diário de Obras", href: "/diario-de-obras" },
  { name: "Como Funciona", href: "/#como-funciona" },
  { name: "Contato", href: "/#contato" },
];

export const FooterWoodBahia = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Wood Bahia Casas Pré-Fabricadas",
    "image": "https://www.woodbahia.com/logo-rodape.svg",
    "@id": "https://www.woodbahia.com",
    "url": "https://www.woodbahia.com",
    "telephone": "+5571992936290",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Showroom Lauro de Freitas",
      "addressLocality": "Lauro de Freitas",
      "addressRegion": "BA",
      "postalCode": "42700-000",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -12.8997267,
      "longitude": -38.383889
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "08:00",
        "closes": "12:00"
      }
    ],
    "sameAs": [
      "https://www.instagram.com/woodbahiacasasprefabricadas/"
    ]
  };

  return (
    <footer className="border-t border-primary-foreground/10 bg-primary text-primary-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* SECTION 2 — Social Proof (Top) */}
      <div className="border-b border-primary-foreground/10 bg-gradient-to-br from-primary via-primary/95 to-secondary">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] shadow-lg">
                <Instagram className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="mb-3 font-serif text-xl font-bold md:text-2xl lg:text-3xl">
              Mais de <span className="font-extrabold text-white">45 mil pessoas</span> acompanham <br className="hidden lg:block" />
              a Wood Bahia no Instagram.
            </h3>
            <a
              href="https://www.instagram.com/woodbahiacasasprefabricadas/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta"
            >
              <Instagram className="h-6 w-6" />
              Seguir @woodbahia
            </a>
          </ScrollReveal>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* SECTION 1 — Company Description */}
          <div className="lg:col-span-4">
            <div className="mb-6 flex items-center gap-4">
              <Image
                src="/logo-rodape.svg"
                alt="Wood Bahia Logo"
                width={56}
                height={56}
                className="h-14 w-auto drop-shadow-lg"
              />
              <div>
                <h2 className="font-serif text-2xl font-bold leading-tight text-white">
                  Wood Bahia
                </h2>
                <span className="text-xs font-semibold uppercase tracking-widest text-white/60">
                  Casas Pré-Fabricadas
                </span>
              </div>
            </div>
            <p className="mb-6 text-lg leading-relaxed text-primary-foreground/80">
              Especialistas em <strong className="text-white">chalés de madeira</strong> e <strong className="text-white">casas pré-fabricadas</strong> para investimento, campo e praia. Nossos projetos utilizam <strong className="text-white">madeira Pinus tratada em autoclave</strong> para garantir durabilidade e máxima resistência.
            </p>
            <div className="rounded-2xl bg-white/5 p-5 border border-white/10">
              <span className="block text-xs font-bold uppercase tracking-widest text-primary-foreground/40 mb-2">Área de Atuação</span>
              <p className="text-sm font-medium leading-relaxed">Atendimento para construção de casas e chalés pré-fabricados na Bahia e Sergipe.</p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {/* SECTION 5 — Navigation */}
              <nav aria-label="Navegação do rodapé">
                <h4 className="mb-6 text-sm font-black uppercase tracking-widest text-white">Links Rápidos</h4>
                <ul className="space-y-4">
                  {footerLinks.map((link) => (
                    <li key={link.name}>
                      <a href={link.href} className="group flex items-center text-primary-foreground/70 transition-colors hover:text-white">
                        <span className="mr-2 h-1 w-0 bg-primary-foreground transition-all group-hover:w-3"></span>
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* SECTION 3 — Showroom */}
              <address className="not-italic">
                <h4 className="mb-6 text-sm font-black uppercase tracking-widest text-white">Nosso Showroom</h4>
                <div className="space-y-4">
                  <div className="flex gap-3 text-primary-foreground/70 transition-colors hover:text-white">
                    <MapPin className="h-5 w-5 shrink-0 text-primary-foreground/40" />
                    <p className="text-sm">Showroom em Lauro de Freitas – BA</p>
                  </div>
                  <div className="flex gap-3 text-primary-foreground/70 transition-colors hover:text-white">
                    <Clock className="h-5 w-5 shrink-0 text-primary-foreground/40" />
                    <div className="text-sm">
                      <p>Segunda a sexta das 8h às 18h</p>
                      <p>Sábado das 8h às 12h</p>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/5571992936290?text=Olá! Gostaria de agendar uma visita ao showroom."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold transition-all hover:bg-white hover:text-primary"
                  >
                    Agendar visita ao showroom
                  </a>
                </div>
              </address>

              {/* SECTION 4 & 6 — Contact & Payments */}
              <div className="space-y-10">
                <div>
                  <h4 className="mb-6 text-sm font-black uppercase tracking-widest text-white">Contato Direto</h4>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                        <Phone className="h-5 w-5 text-primary-foreground/60" />
                      </div>
                      <a href="https://wa.me/5571992936290" className="text-lg font-bold hover:text-white transition-colors tracking-tight">(71) 99293-6290</a>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                        <Instagram className="h-5 w-5 text-primary-foreground/60" />
                      </div>
                      <a href="https://www.instagram.com/woodbahiacasasprefabricadas/" className="text-lg font-bold hover:text-white transition-colors tracking-tight">@woodbahia</a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-4 text-sm font-black uppercase tracking-widest text-white">Facilidade de Pagamento</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-4">
                      <CreditCard className="h-6 w-6 text-primary-foreground/60" />
                      <div className="leading-tight">
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Parcelamento</span>
                      <p className="font-black text-white text-sm">
                        Até 3x sem juros <br/>
                        ou 18x com juros
                      </p>
                    </div>
                    </div>
                    <a 
                      href="/simulador/parcelamento"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-xs font-bold transition-all hover:bg-white hover:text-primary group"
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      Simular parcelas no cartão
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 7 — Reviews */}
            <div className="mt-12 flex flex-wrap items-center gap-6 rounded-3xl bg-secondary/20 p-6 md:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xl">
                 <Image src="https://www.google.com/favicon.ico" alt="Google" width={24} height={24} />
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-white mb-1">Confira nossas avaliações</p>
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <a href="https://www.google.com/search?q=Wood+Bahia+Casas+Pr%C3%A9+Fabricadas" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-white underline-offset-4 hover:underline">
                  Google Reviews <ExternalLink className="h-4 w-4" />
                </a>
                <a href="https://www.google.com/maps?q=Wood+Bahia+Lauro+de+Freitas" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-white underline-offset-4 hover:underline">
                  Google Maps <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-10 md:flex-row">
          <p className="text-center text-sm text-primary-foreground/40 md:text-left">
            © 2026 Wood Bahia Casas Pré-Fabricadas. Todos os direitos reservados.
          </p>
          
          <div className="flex gap-8 text-sm font-bold">
            <a href="/politica-de-privacidade" className="text-primary-foreground/50 transition-colors hover:text-white">Política de Privacidade</a>
            <a href="/termos-de-uso" className="text-primary-foreground/50 transition-colors hover:text-white">Termos de Uso</a>
          </div>

          <p className="flex items-center gap-2 text-sm text-primary-foreground/30">
            Desenvolvido por 
            <a href="https://www.agilizedev.site/" target="_blank" rel="noopener noreferrer" className="font-black tracking-tighter text-primary-foreground/50 transition-colors hover:text-white">
              AGILIZEDEV
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
