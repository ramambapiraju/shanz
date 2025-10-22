import { Award, Users, Rocket, Target } from "lucide-react";

export const AboutSection = () => {
  const features = [
    {
      icon: Award,
      title: "Award-Winning Innovation",
      description: "Founded by the youngest finalist and 3rd Prize Winner of ASME IMECE 2025 International Pitchathon."
    },
    {
      icon: Users,
      title: "Youth-Driven",
      description: "Built by Gen Z, for Gen Z. We understand what inspires young innovators to create and learn."
    },
    {
      icon: Rocket,
      title: "Hands-On Learning",
      description: "Merge theory with practice through DIY electronics, mechanical, and mechatronics projects."
    },
    {
      icon: Target,
      title: "Future-Ready Skills",
      description: "Develop real-world STEM skills that prepare you for careers in technology and innovation."
    }
  ];

  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About Shan Z
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Founded by <span className="font-semibold text-primary">Jampana Shanmuka Sai Varma</span>, 
            Shan Z is revolutionizing STEM education for Gen Z. We empower young minds to transition 
            from passive consumers to active creators through innovative learning experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-all animate-fade-in border border-border hover:border-primary/30"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
