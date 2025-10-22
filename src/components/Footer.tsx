import { Mail, Phone, Linkedin, Twitter, Instagram, Youtube } from "lucide-react";
import logo from "@/assets/shan-z-logo.png";

export const Footer = () => {
  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" }
  ];

  const quickLinks = [
    { label: "About Us", href: "#about" },
    { label: "Simulator", href: "#simulator" },
    { label: "DIY Hub", href: "#diy-hub" },
    { label: "Subscription Kits", href: "#kits" },
    { label: "Community", href: "#join" }
  ];

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <img src={logo} alt="Shan Z Logo" className="h-16 w-auto mb-4 brightness-0 invert" />
            <p className="text-primary-foreground/80 leading-relaxed mb-4">
              Inspiring Gen Z from Scrolling to Building
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg p-2 transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <a 
                href="mailto:ramambapiraju@gmail.com" 
                className="flex items-center gap-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span>ramambapiraju@gmail.com</span>
              </a>
              <a 
                href="tel:+919945539649" 
                className="flex items-center gap-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span>+91 9945539649</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Recognition</h3>
            <div className="bg-secondary/20 backdrop-blur-sm rounded-lg p-4 border border-secondary/30">
              <p className="text-sm text-primary-foreground/90 leading-relaxed">
                <strong>3rd Prize Winner</strong><br />
                ASME IMECE 2025<br />
                International Pitchathon
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8">
          <p className="text-center text-primary-foreground/80 text-sm">
            © 2025 Shan Z Innovations — Inspiring Gen Z from Scrolling to Building
          </p>
        </div>
      </div>
    </footer>
  );
};
