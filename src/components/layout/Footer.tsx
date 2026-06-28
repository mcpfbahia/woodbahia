"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, Instagram, Navigation, CreditCard, Home, Clock } from "lucide-react";
import { toast } from "sonner";

const footerLinks = [
  { name: "Simulador de Compra Cartão Crédito", href: "/simulador/parcelamento" },
  { name: "Modelos", href: "/modelos" },
  { name: "Portfólio", href: "/portfolio" },
  { name: "Diário de Obras", href: "/diario-de-obras" },
  { name: "Como Funciona", href: "/#como-funciona" },
  { name: "Showroom", href: "#showroom" },
  { name: "Contato", href: "/#contato" },
];

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Por favor, insira um e-mail válido.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Inscrição realizada! 🎉");
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <footer className="border-t border-primary-foreground/10 bg-primary text-primary-foreground">
      {/* Prova Social Instagram */}
      <div className="border-b border-primary-foreground/10 bg-gradient-to-br from-primary via-primary/95 to-secondary">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] shadow-lg">
                <Instagram className="h-6 w-6 text-white" />
              </div>
            </div>

            <h3 className="mb-3 font-serif text-xl font-bold text-primary-foreground md:text-2xl lg:text-3xl">
              Mais de <span className="font-extrabold text-white">47 mil pessoas</span> acompanham a Wood Bahia no Instagram.
            </h3>

            <p className="mx-auto mb-6 max-w-lg text-sm text-primary-foreground/60 md:text-base">
              Isso não é sobre seguidores — é sobre confiança construída todos os dias.
            </p>

            <a
              href="https://www.instagram.com/woodbahiacasasprefabricadas/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary-foreground/90"
            >
              <Instagram className="h-5 w-5" />
              Seguir @woodbahia
            </a>
          </div>
        </div>
      </div>

      {/* Showroom & Map Section */}
      <div id="showroom" className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1.5 text-sm text-primary-foreground/80">
                <Navigation className="h-4 w-4" />
                Atendimento na Bahia e no interior de Sergipe
              </span>
              <h3 className="mb-4 font-serif text-2xl font-bold md:text-3xl">
                Visite nosso Showroom
              </h3>
              <p className="mb-6 max-w-md text-lg text-primary-foreground/70">
                Conheça de perto os modelos e soluções em madeira.
                <br />
                <br />
                <a
                  href="https://www.google.com/search?q=Wood+Bahia+Casas+Pr%C3%A9+Fabricadas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white hover:underline"
                >
                  <strong className="text-white">Showroom em Lauro de Freitas – BA</strong>
                </a>
              </p>

              <div className="mb-8 rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-6">
                <div className="mb-4 flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 text-primary-foreground/60" />
                  <div>
                    <h4 className="mb-1 font-semibold">Horário de atendimento:</h4>
                    <p className="text-sm text-primary-foreground/70">Segunda a sexta, das 8h às 18h</p>
                    <p className="text-sm text-primary-foreground/70">Sábados, das 8h às 12h</p>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/5571992936290?text=Olá! Gostaria de agendar uma visita ao showroom."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-foreground px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary-foreground/90 md:w-auto"
              >
                Agendar visita ao showroom
              </a>
            </div>

            <div className="h-64 overflow-hidden rounded-2xl border border-primary-foreground/10 shadow-lg md:h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124587.47878158877!2d-38.383889!3d-12.8997267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7161bdc3a6f4f1f%3A0x6f1c8e3c5c5c5c5c!2sLauro%20de%20Freitas%2C%20BA!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Wood Bahia - Lauro de Freitas, BA"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          {/* Col 1: Brand */}
          <div className="lg:col-span-1">
            <div className="mb-6 flex items-center gap-3">
              <Image
                src="/logo-rodape.svg"
                alt="Wood Bahia Logo"
                width={48}
                height={48}
                className="h-12 w-auto"
              />

              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold leading-tight text-white">
                  Wood Bahia
                </span>
                <span className="font-serif text-xs font-medium tracking-wide text-white/80">
                  Casas Pré Fabricadas
                </span>
              </div>
            </div>
            <p className="mb-6 leading-relaxed text-primary-foreground/70">
              Especialistas em chalés e casas de madeira para investimento, campo e praia.
              <br /><br />
              📍 Atendimento na Bahia e no interior de Sergipe
            </p>
          </div>

          {/* Col 2: Contact */}
          <div className="lg:col-span-1">
            <h4 className="mb-6 font-serif text-lg font-bold">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-primary-foreground/60" />
                <div>
                  <span className="mb-1 block text-xs text-primary-foreground/60">WhatsApp</span>
                  <a href="https://wa.me/5571992936290" target="_blank" rel="noopener noreferrer" className="text-lg font-medium transition-colors hover:text-white">
                    (71) 99293-6290
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Instagram className="mt-0.5 h-5 w-5 text-primary-foreground/60" />
                <div>
                  <span className="mb-1 block text-xs text-primary-foreground/60">Instagram</span>
                  <a href="https://www.instagram.com/woodbahiacasasprefabricadas/" target="_blank" rel="noopener noreferrer" className="font-medium transition-colors hover:text-white">
                    @woodbahia
                  </a>
                  <span className="mt-1 block text-sm text-primary-foreground/50">+47 mil seguidores</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 3: Payment */}
          <div className="lg:col-span-1">
            <h4 className="mb-6 font-serif text-lg font-bold">Pagamento</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 rounded-lg border border-primary-foreground/10 bg-primary-foreground/5 p-3">
                <CreditCard className="h-5 w-5 text-primary-foreground/60" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-primary-foreground/40">Cartão de Crédito</span>
                  <span className="font-bold text-white text-sm">Até 3x sem juros ou 18x com juros</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 rounded-lg border border-primary-foreground/10 bg-primary-foreground/5 p-3">
                <Home className="h-5 w-5 text-primary-foreground/60" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-primary-foreground/40">Construção</span>
                  <span className="font-bold text-white text-sm">Parcelamento Direto</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Local Presence */}
          <div className="lg:col-span-1">
            <h4 className="mb-6 font-serif text-lg font-bold">Presença Local</h4>
            <a
              href="https://www.google.com/search?q=Wood+Bahia+Casas+Pr%C3%A9+Fabricadas&stick=H4sIAAAAAAAA_-NgU1IxqDA3NDNOM0g1MTc0TzSyMLcyqLBINEtJSjYxTzNLMjMxSDRZxKoQnp-fouCUmJGZqOCcWJxYrBBQdHilgltiUlFmcmJKYjEAXfO5vksAAAA&hl=pt-BR&mat=CWaJdqa7r9VyElcBTVDHniOgyz1aGOdWS4jxmlDccvQU7pV3XEqVI34dZ98LF5MTXRnBz1FA-3k-r6znnUlC-qbN4b9aSgPOSCKP3x-aXyFDvBNRqRY3Ex0t8SXaQ2HZd0A&authuser=0&ved=2ahUKEwiIgPzBjcaSAxVylJUCHSLdNBAQ-MgIegQIFxAj"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-3"
            >
              <p className="text-sm text-primary-foreground/70 group-hover:text-white transition-colors">
                Veja nossas avaliações no Google Meu Negócio
              </p>
              <div className="flex items-center gap-2 font-medium text-white hover:underline transition-all">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                  <Image 
                    src="https://www.google.com/favicon.ico" 
                    alt="Google" 
                    width={16} 
                    height={16} 
                    className="h-4 w-4" 
                  />
                </div>
                <span>Google Maps</span>
              </div>
            </a>
          </div>

          {/* Col 5: Navigation */}
          <div className="lg:col-span-1">
            <h4 className="mb-6 font-serif text-lg font-bold">Navegação</h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-white"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-8 text-sm text-primary-foreground/50 md:flex-row">
          <p className="order-2 text-center md:order-1 md:text-left">
            © {new Date().getFullYear()} Wood Bahia Casas Pré Fabricadas. Todos os direitos reservados.
          </p>
          <div className="relative z-10 order-1 flex gap-6 md:order-2">
            <a href="/politica-de-privacidade" className="cursor-pointer transition-colors hover:text-primary-foreground">Política de Privacidade</a>
            <a href="/termos-de-uso" className="cursor-pointer transition-colors hover:text-primary-foreground">Termos de Uso</a>
          </div>
        </div>

        {/* Developer Credit */}
        <div className="mt-8 border-t border-primary-foreground/5 pt-4 text-center">
          <p className="flex items-center justify-center gap-1 text-xs text-primary-foreground/30">
            Desenvolvido por
            <a
              href="https://www.agilizedev.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 font-medium transition-colors hover:text-primary-foreground/50"
            >
              AgilizeDev
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
