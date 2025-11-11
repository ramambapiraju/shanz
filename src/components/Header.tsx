import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/shan-z-logo.png";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: "Home", id: "home" },
    { label: "About Us", id: "about" },
    { label: "Simulator", id: "simulator" },
    { label: "DIY Hub", id: "diy-hub" },
    { label: "Kits", id: "kits" },
    { label: "Join Us", id: "join" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center animate-fade-in">
            <img src={logo} alt="Shan Z Logo" className="h-16 md:h-20 w-auto" />
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
            <Button variant="default" size="lg" onClick={() => scrollToSection("join")}>
              Get Started
            </Button>
          </div>

          <button
            className="md:hidden p-3 hover:bg-muted/50 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-6 animate-fade-in bg-background/95 backdrop-blur-md">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-foreground hover:text-primary hover:bg-muted/50 transition-colors font-medium text-left py-4 px-4 rounded-lg"
                >
                  {item.label}
                </button>
              ))}
              <Button variant="default" size="lg" className="mt-2" onClick={() => scrollToSection("join")}>
                Get Started
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
