"use client";

import { Mountain, Bike, Tent, Backpack } from "lucide-react";
import { useEffect, useState } from "react";

export function AnimatedHeroBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 animate-gradient" />
      
      {/* Floating Shapes */}
      <div className="absolute inset-0">
        {/* Floating Icons */}
        <div 
          className="absolute top-20 right-[10%] text-primary/10 animate-float"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <Mountain className="h-24 w-24 md:h-32 md:w-32" />
        </div>
        
        <div 
          className="absolute top-40 left-[15%] text-secondary/10 animate-float-delayed"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          <Bike className="h-20 w-20 md:h-28 md:w-28" />
        </div>
        
        <div 
          className="absolute bottom-32 right-[20%] text-accent/10 animate-float-slow"
          style={{ transform: `translateY(${scrollY * 0.4}px)` }}
        >
          <Tent className="h-16 w-16 md:h-24 md:w-24" />
        </div>
        
        <div 
          className="absolute top-1/2 left-[5%] text-primary/10 animate-float"
          style={{ transform: `translateY(${scrollY * 0.6}px)` }}
        >
          <Backpack className="h-18 w-18 md:h-20 md:w-20" />
        </div>

        {/* SVG Animated Shapes */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.1 }} />
              <stop offset="100%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 0.1 }} />
            </linearGradient>
          </defs>
          
          <circle cx="10%" cy="20%" r="100" fill="url(#grad1)" className="animate-pulse-slow">
            <animate attributeName="r" values="100;120;100" dur="8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="8s" repeatCount="indefinite" />
          </circle>
          
          <circle cx="85%" cy="70%" r="80" fill="url(#grad1)" className="animate-pulse-slower">
            <animate attributeName="r" values="80;100;80" dur="10s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="10s" repeatCount="indefinite" />
          </circle>
          
          <circle cx="75%" cy="30%" r="60" fill="hsl(var(--secondary) / 0.1)">
            <animate attributeName="r" values="60;75;60" dur="7s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0.4;0.2" dur="7s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
    </div>
  );
}
