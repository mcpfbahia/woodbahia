import { Header } from "~/components/layout/Header";
import { HeroSection } from "~/components/sections/HeroSection";
import { AboutSection } from "~/components/sections/AboutSection";
import { UseCasesSection } from "~/components/sections/UseCasesSection";
import { TechnicalAdvantagesSection } from "~/components/sections/TechnicalAdvantagesSection";
import { ModelsSection } from "~/components/sections/ModelsSection";
import { RegionalCoverageSection } from "~/components/sections/RegionalCoverageSection";
import { TimelineSection } from "~/components/sections/TimelineSection";
import { TestimonialsSection } from "~/components/sections/TestimonialsSection";
import { PortfolioSection } from "~/components/sections/PortfolioSection";
import { FAQSection } from "~/components/sections/FAQSection";
import { ContactSection } from "~/components/sections/ContactSection";
import { FooterWoodBahia } from "~/components/layout/FooterWoodBahia";
import { WhatsAppButton } from "~/components/common/WhatsAppButton";
import { PaymentSection } from "~/components/sections/PaymentSection";
import { SimulatorSection } from "~/components/sections/SimulatorSection";
import { AnnouncementModal } from "~/components/common/AnnouncementModal";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ModelsSection />
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
      <AnnouncementModal />
    </div>
  );
}
