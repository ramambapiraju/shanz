import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Globe, Share2, Trophy, Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const CommunitySection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thanks for reaching out! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  const features = [
    {
      icon: Globe,
      title: "Global Community",
      description: "Connect with young innovators from around the world"
    },
    {
      icon: Share2,
      title: "Share Projects",
      description: "Showcase your creations and inspire others"
    },
    {
      icon: Trophy,
      title: "Competitions",
      description: "Participate in challenges and win recognition"
    },
    {
      icon: Heart,
      title: "Collaborate",
      description: "Team up on projects and learn together"
    }
  ];

  return (
    <section id="join" className="py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Join Our Innovation Community
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Be part of a vibrant ecosystem where young creators collaborate, share, and grow together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all animate-scale-in border border-border"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto bg-card rounded-2xl p-8 shadow-xl border border-border">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Get in Touch</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Tell us about your interest in Shan Z..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="w-full min-h-32"
              />
            </div>

            <Button type="submit" size="lg" variant="default" className="w-full text-lg">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
