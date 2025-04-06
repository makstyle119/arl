import React, { createContext, useRef, useContext } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ScrollContext = createContext<any>(null);

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
    const sections = {
        hero: useRef<HTMLElement | null>(null),
        features: useRef<HTMLElement | null>(null),
        pricing: useRef<HTMLElement | null>(null),
        faqs: useRef<HTMLElement | null>(null),
        contact: useRef<HTMLElement | null>(null),
        // Add more sections as needed
    };

    const scrollTo = (section: keyof typeof sections) => {
        sections[section]?.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <ScrollContext.Provider value={{ sections, scrollTo }}>
            {children}
        </ScrollContext.Provider>
    );
};

export const useScroll = () => useContext(ScrollContext);
