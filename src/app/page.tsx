import { Header } from "~/components/layout/Header";
import { HeroSection } from "~/components/sections/HeroSection";
import { ModalitiesHomeSection } from "~/components/sections/ModalitiesHomeSection";
import { AboutSection } from "~/components/sections/AboutSection";
import { UseCasesSection } from "~/components/sections/UseCasesSection";
import { TechnicalAdvantagesSection } from "~/components/sections/TechnicalAdvantagesSection";
import { ModelsSection } from "~/components/sections/ModelsSection";
import { RegionalCoverageSection } from "~/components/sections/RegionalCoverageSection";
import dynamic from "next/dynamic";
import { type Metadata } from "next";

const SimulatorSection = dynamic(() => import("../components/sections/SimulatorSection").then(mod => mod.SimulatorSection));
const PortfolioSection = dynamic(() => import("../components/sections/PortfolioSection").then(mod => mod.PortfolioSection));
const TestimonialsSection = dynamic(() => import("../components/sections/TestimonialsSection").then(mod => mod.TestimonialsSection));
const TimelineSection = dynamic(() => import("../components/sections/TimelineSection").then(mod => mod.TimelineSection));
const PaymentSection = dynamic(() => import("../components/sections/PaymentSection").then(mod => mod.PaymentSection));
const FAQSection = dynamic(() => import("../components/sections/FAQSection").then(mod => mod.FAQSection));
const ContactSection = dynamic(() => import("../components/sections/ContactSection").then(mod => mod.ContactSection));
import { FooterWoodBahia } from "~/components/layout/FooterWoodBahia";
import { WhatsAppButton } from "~/components/common/WhatsAppButton";
import { initialModels } from "~/lib/data";

export const metadata: Metadata = {
  title: "Wood Bahia | Chalés de Madeira e Casas Pré-Fabricadas na Bahia",
  description: "Construa seu chalé de madeira ou chalé A-frame para Airbnb, moradia, lazer no campo ou praia. Kits estruturais e modalidade Chave na Mão com total previsibilidade.",
  keywords: [
    "chalé de madeira",
    "chalé a-frame",
    "casa pré-fabricada",
    "casa de madeira",
    "chalé para airbnb",
    "chalé para aluguel por temporada",
    "casa de campo de madeira",
    "chalé de madeira bahia",
    "casa pré-fabricada bahia",
    "wood bahia"
  ].join(", "),
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ModalitiesHomeSection />
        <AboutSection />
        <ModelsSection initialModelsData={initialModels} />
        <RegionalCoverageSection />
        <UseCasesSection />
        <TechnicalAdvantagesSection />
        <SimulatorSection />
        <PortfolioSection />
        <TestimonialsSection />
        <TimelineSection />
        <PaymentSection />
        <FAQSection />
        <ContactSection />
      </main>
      <FooterWoodBahia />
      <WhatsAppButton />
    </div>
  );
}
