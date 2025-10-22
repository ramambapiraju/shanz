import { Video, Users, Award, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DIYHubSection = () => {
  const offerings = [
    {
      icon: Video,
      title: "Exclusive Video Library",
      description: "Step-by-step tutorials covering electronics, robotics, and mechanical engineering projects.",
      color: "bg-blue-500"
    },
    {
      icon: Calendar,
      title: "Live Webinars",
      description: "Interactive sessions with industry experts sharing real-world insights and guidance.",
      color: "bg-purple-500"
    },
    {
      icon: Users,
      title: "1-on-1 Mentorship",
      description: "Personalized guidance from experienced mentors to help you overcome challenges.",
      color: "bg-green-500"
    },
    {
      icon: Award,
      title: "Project Showcase",
      description: "Share your innovations with a global community and get recognized for your creativity.",
      color: "bg-orange-500"
    }
  ];

  return (
    <section id="diy-hub" className="py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            DIY Hub & Learning Ecosystem
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Access a complete learning ecosystem designed to support your journey from beginner to expert innovator.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {offerings.map((offering, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all animate-scale-in border border-border hover:border-primary/30"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`${offering.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                <offering.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{offering.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">{offering.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="default" className="text-lg px-8">
            Explore Learning Hub
          </Button>
        </div>
      </div>
    </section>
  );
};
