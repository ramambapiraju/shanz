import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

export const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-secondary/90" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8 animate-fade-in border border-secondary/30">
            <Sparkles className="h-4 w-4 text-secondary-foreground" />
            <span className="text-sm font-medium text-secondary-foreground">
              3rd Prize Winner - ASME IMECE 2025 Pitchathon
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in leading-tight">
            Inspiring Gen Z from{" "}
            <span className="text-secondary">Scrolling</span> to{" "}
            <span className="text-secondary">Building</span>
          </h1>

          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-12 animate-fade-in max-w-3xl mx-auto">
            A next-gen STEM and innovation platform merging learning with creation through DIY electronics, 
            mechatronics projects, and AI-integrated simulations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6 font-semibold shadow-lg hover:shadow-xl transition-all"
              onClick={() => scrollToSection("simulator")}
            >
              Try Simulator Beta
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 font-semibold bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => scrollToSection("about")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};
