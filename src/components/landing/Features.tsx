import React, { useRef, useEffect } from "react";
import { Calendar, LineChart, Medal, Share2, Zap, Shield, Download, RefreshCw, CheckCircle, Clock, Sparkles, Target } from "lucide-react";
import { useScroll } from "@/context/ScrollContext";
import { mergeRefs } from "@/lib/mergeRefs";

const Features = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const { sections } = useScroll();

  useEffect(() => {
    if (!featuresRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            entry.target.classList.remove("opacity-0");
          }
        });
      },
      { threshold: 0.1 }
    );

    const childElements = featuresRef.current?.querySelectorAll(".feature-item");
    if (childElements) {
      childElements.forEach((el) => observer.observe(el));
    }

    return () => {
      if (childElements) {
        childElements.forEach((el) => observer.unobserve(el));
      }
    };
  }, []);

  const features = [
    {
      icon: <Calendar className="h-6 w-6 text-blue-500" />,
      title: "Habit Tracking",
      description: "Log your daily habits with a simple interface designed for minimal friction."
    },
    {
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      title: "Streak System",
      description: "Build momentum with visual streaks that keep you motivated and on track."
    },
    {
      icon: <LineChart className="h-6 w-6 text-green-500" />,
      title: "Reports & Analytics",
      description: "Gain insights into your habits with beautiful, easy-to-understand reports."
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-purple-500" />,
      title: "Daily Reminders",
      description: "Never miss a day with customizable reminders for each of your habits."
    },
    {
      icon: <Target className="h-6 w-6 text-red-500" />,
      title: "Goal Setting",
      description: "Set clear objectives for your habits and track your progress toward them."
    },
    {
      icon: <Medal className="h-6 w-6 text-yellow-500" />,
      title: "Achievement Badges",
      description: "Earn badges and rewards as you maintain consistency with your habits."
    },
    {
      icon: <Clock className="h-6 w-6 text-teal-500" />,
      title: "Habit Scheduling",
      description: "Schedule habits for specific days of the week to create a balanced routine."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-cyan-500" />,
      title: "Smart Suggestions",
      description: "Receive personalized suggestions to improve your habit-building journey."
    }
  ];

  return (
    <section ref={mergeRefs(sections.features, featuresRef)} id="features" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything You Need to Build Better Habits</h2>
          <p className="text-lg text-muted-foreground">
            Arl combines powerful features with beautiful simplicity to help you create lasting behavior change.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-item bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-border/50 opacity-0"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col h-full">
                <div className="p-2 rounded-lg bg-primary/10 w-fit mb-4">
                  {feature.icon}
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                
                <p className="text-muted-foreground text-sm flex-grow">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* <div className="mt-16 text-center">
          <div className="inline-block bg-primary/10 rounded-full px-6 py-3 mb-6">
            <span className="text-primary font-medium">Why choose Arl?</span>
          </div>
          
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-border/50 shadow-sm">
              <div className="rounded-full bg-blue-500/10 p-3 w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2">Time-Efficient</h3>
              <p className="text-sm text-muted-foreground">
                Track all your habits in one place with minimal effort
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-border/50 shadow-sm">
              <div className="rounded-full bg-green-500/10 p-3 w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <LineChart className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-semibold mb-2">Data-Driven</h3>
              <p className="text-sm text-muted-foreground">
                Make decisions based on clear visualizations of your progress
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-border/50 shadow-sm">
              <div className="rounded-full bg-amber-500/10 p-3 w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="font-semibold mb-2">Motivation-Focused</h3>
              <p className="text-sm text-muted-foreground">
                Stay motivated with streaks and achievement tracking
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Features;
