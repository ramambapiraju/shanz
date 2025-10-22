import { Button } from "@/components/ui/button";
import { Package, Truck, BookOpen, Sparkles } from "lucide-react";
import subscriptionKit from "@/assets/subscription-kit.jpg";

export const SubscriptionSection = () => {
  const benefits = [
    {
      icon: Package,
      title: "Monthly Kits",
      description: "Curated DIY electronics and mechatronics components delivered to your door."
    },
    {
      icon: BookOpen,
      title: "Aligned Courses",
      description: "Each kit pairs with exclusive online courses and project tutorials."
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Reliable shipping ensures you never miss a learning opportunity."
    }
  ];

  return (
    <section id="kits" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in-left">
            <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">Subscribe & Save</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Hardware Subscription Kits
            </h2>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Get hands-on with carefully selected components delivered monthly. Each kit is designed to 
              complement our online courses, giving you everything you need to build real projects.
            </p>

            <div className="bg-card border border-border rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Kit Dimensions</h3>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">30</div>
                  <div className="text-sm">Length (cm)</div>
                </div>
                <div className="text-2xl text-border">×</div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">30</div>
                  <div className="text-sm">Width (cm)</div>
                </div>
                <div className="text-2xl text-border">×</div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">15</div>
                  <div className="text-sm">Height (cm)</div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-lg p-2 mt-1">
                    <benefit.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{benefit.title}</h4>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" variant="default" className="text-lg px-8">
              Start Subscription
            </Button>
          </div>

          <div className="animate-slide-in-right">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border animate-float">
              <img 
                src={subscriptionKit} 
                alt="Shan Z Subscription Kit" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
