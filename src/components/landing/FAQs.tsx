import React, { useRef, useEffect } from "react";

const FAQs = () => {
  const faqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!faqRef.current) return; // Prevent errors
  
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
  
    // Select all faq plan elements and observe them
    const faqCards = faqRef.current.querySelectorAll(".faq-card");
    faqCards.forEach((card) => observer.observe(card));
  
    return () => faqCards.forEach((card) => observer.unobserve(card));
  }, []);

  return (
    <section id="faqs" className="py-20 bg-secondary/50" ref={faqRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
          
          <div className="grid md:grid-cols-2 gap-6 text-left mt-8">
            <div className="bg-secondary/50 rounded-lg p-6">
              <h4 className="font-medium mb-2">Can I cancel anytime?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, you can cancel your subscription at any time. Your Premium access will remain until the end of your billing period.
              </p>
            </div>
            
            <div className="bg-secondary/50 rounded-lg p-6">
              <h4 className="font-medium mb-2">Is there a free trial?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, Premium includes a 14-day free trial. You won't be charged until the trial period ends.
              </p>
            </div>
            
            <div className="bg-secondary/50 rounded-lg p-6">
              <h4 className="font-medium mb-2">What payment methods do you accept?</h4>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards, PayPal, and Apple Pay for your convenience.
              </p>
            </div>
            
            <div className="bg-secondary/50 rounded-lg p-6">
              <h4 className="font-medium mb-2">How does the Lifetime plan work?</h4>
              <p className="text-sm text-muted-foreground">
                The Lifetime plan is a one-time payment that gives you permanent access to all Premium features, including future updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
