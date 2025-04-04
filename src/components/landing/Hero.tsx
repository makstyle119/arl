import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ButtonCustom } from "@/components/ui/button-custom";
import { ArrowRight, Check } from "lucide-react";
import { useScroll } from "@/context/ScrollContext";
import { mergeRefs } from "@/lib/mergeRefs";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
    const { sections } = useScroll();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    <div ref={mergeRefs(sections.hero, heroRef)} className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.08),transparent_50%)]"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Hero Content */}
          <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left staggered-fade-in">
            <div className="inline-flex items-center px-3 py-1 mb-6 text-sm rounded-full bg-primary/10 text-primary">
              <span className="mr-1">✨</span> Your daily habit companion
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              <span className="text-gradient-subtle block mb-2">Build better habits</span>
              <span>One day at a time</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 mx-auto lg:mx-0 max-w-lg">
              Track your habits, maintain streaks, and achieve your goals with our intuitive habit tracking app.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <ButtonCustom size="lg" gradient asChild className="font-medium">
                <Link to="/auth?type=register" className="flex">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </ButtonCustom>
              
              <ButtonCustom size="lg" variant="outline" asChild className="font-medium">
                <Link to="/#features">
                  Learn More
                </Link>
              </ButtonCustom>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-primary mr-2" />
                <span>Free plan available</span>
              </div>
              
              <div className="flex items-center">
                <Check className="h-4 w-4 text-primary mr-2" />
                <span>No credit card required</span>
              </div>
              
              <div className="flex items-center">
                <Check className="h-4 w-4 text-primary mr-2" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative mx-auto lg:mr-0 lg:ml-auto max-w-lg">
            {/* Main image with glass morphism effect */}
            <div className="relative z-10 rounded-xl overflow-hidden premium-glass animate-scale-in">
              <div className="aspect-[4/3] p-2 sm:p-4">
                <img
                  src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.0.3"
                  alt="Arl Dashboard Preview"
                  className="w-full h-full object-cover rounded-lg shadow-sm"
                />
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -top-6 -left-6 w-36 h-36 bg-cyan-500/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
