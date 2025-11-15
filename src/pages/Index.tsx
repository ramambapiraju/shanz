import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { SimulatorSection } from "@/components/SimulatorSection";
import { QuantumSection } from "@/components/QuantumSection";
import { DIYHubSection } from "@/components/DIYHubSection";
import { SubscriptionSection } from "@/components/SubscriptionSection";
import { CommunitySection } from "@/components/CommunitySection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <SimulatorSection />
      <QuantumSection />
      <DIYHubSection />
      <SubscriptionSection />
      <CommunitySection />
      <Footer />
    </div>
  );
};

export default Index;
