import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Check, Star, X } from "lucide-react";
import { useScroll } from "@/context/ScrollContext";
import { mergeRefs } from "@/lib/mergeRefs";

const Pricing = () => {
  const pricingRef = useRef<HTMLDivElement>(null);
  const { sections } = useScroll();

  useEffect(() => {
    if (!pricingRef.current) return; // Prevent errors
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            entry.target.classList.remove("opacity-0"); // Make it visible
          }
        });
      },
      { threshold: 0.1 }
    );
  
    // Select all pricing plan elements and observe them
    const pricingCards = pricingRef.current.querySelectorAll(".pricing-card");
    pricingCards.forEach((card) => observer.observe(card));
  
    return () => pricingCards.forEach((card) => observer.unobserve(card));
  }, []);
  

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started with habit tracking",
      features: [
        { included: true, text: "Track up to 5 habits" },
        { included: true, text: "Basic streak tracking" },
        { included: true, text: "Daily reminders" },
        { included: true, text: "Monthly reports" },
        { included: false, text: "Unlimited habits" },
        { included: false, text: "Detailed analytics" },
        { included: false, text: "Calendar integration" },
        { included: false, text: "Data export" },
        { included: false, text: "Priority support" }
      ],
      buttonText: "Get Started",
      buttonVariant: "outline",
      popular: false
    },
    {
      name: "Pro",
      price: "4.99/mo",
      description: "Advanced features for productivity pros.",
      features: [
        { included: true, text: "Unlimited habits" },
        { included: true, text: "Basic streak tracking" },
        { included: true, text: "Daily reminders" },
        { included: true, text: "Monthly reports" },
        { included: true, text: "Unlimited habits" },
        { included: true, text: "Detailed analytics" },
        { included: true, text: "Calendar integration" },
        { included: true, text: "Data export" },
        { included: true, text: "Priority support" }
      ],
      popular: false,
      buttonText: "Coming Soon",
      comingSoon: true,
    }
    // {
    //   name: "Premium",
    //   price: "$4.99",
    //   period: "/month",
    //   description: "Everything you need for serious habit building",
    //   features: [
    //     { included: true, text: "Unlimited habit tracking" },
    //     { included: true, text: "Advanced streak system" },
    //     { included: true, text: "Custom reminders" },
    //     { included: true, text: "Weekly & monthly reports" },
    //     { included: true, text: "Detailed analytics dashboard" },
    //     { included: true, text: "Calendar integration" },
    //     { included: true, text: "Data export (CSV & PDF)" },
    //     { included: true, text: "Habit templates" },
    //     { included: true, text: "Priority support" }
    //   ],
    //   buttonText: "Start Free Trial",
    //   buttonVariant: "gradient",
    //   popular: true,
    //   badge: "14-day free trial"
    // },
    // {
    //   name: "Lifetime",
    //   price: "$99",
    //   description: "One-time payment for permanent premium access",
    //   features: [
    //     { included: true, text: "All Premium features" },
    //     { included: true, text: "Lifetime updates" },
    //     { included: true, text: "No recurring payments" },
    //     { included: true, text: "Early access to new features" },
    //     { included: true, text: "VIP support" }
    //   ],
    //   buttonText: "Get Lifetime Access",
    //   buttonVariant: "outline",
    //   popular: false
    // }
  ];

  return (
    <section ref={mergeRefs(sections.pricing, pricingRef)} id="pricing" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that's right for your habit-building journey.
          </p>
        </div>

        <div className={`grid gap-8 max-w-6xl mx-auto ${
          plans.length === 2 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2" : "grid-cols-1 md:grid-cols-3"
        }`}>
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`pricing-card rounded-xl overflow-hidden border ${
                plan.popular ? "border-primary/20 shadow-lg shadow-primary/10" : "border-border"
              } bg-white dark:bg-gray-800 opacity-0 transition-opacity duration-500 ${
                plan.comingSoon ? "opacity-70 pointer-events-none" : ""
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {plan.popular && (
                <div className="bg-primary text-white text-center py-2 px-4 flex items-center justify-center">
                  <Star className="h-4 w-4 mr-1 fill-white" />
                  <span className="text-sm font-medium">MOST POPULAR</span>
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                
                <div className="flex items-baseline mb-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {/* {plan.period && (
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  )} */}
                </div>
                
                {/* {plan.badge && (
                  <div className="mb-4">
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )} */}
                
                <p className="text-muted-foreground mb-6">
                  {plan.description}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? "" : "text-muted-foreground"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <ButtonCustom
                  className="w-full"
                  size="lg"
                  gradient={plan.popular}
                  variant={plan.popular ? "default" : "outline"}
                  disabled={plan.comingSoon}
                  asChild={!plan.comingSoon}
                >
                  {plan.comingSoon ? (
                    <span className="cursor-not-allowed opacity-70">{plan.buttonText}</span>
                  ) : (
                    <Link to="/auth?type=register">{plan.buttonText}</Link>
                  )}
                </ButtonCustom>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
