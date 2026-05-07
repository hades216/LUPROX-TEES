import { motion } from "motion/react";

export function CentipedeLogo({ className = "" }: { className?: string }) {
  return (
    <motion.div 
      className={`relative flex items-center justify-center ${className}`}
      whileHover={{ scale: 1.05 }}
    >
      <svg viewBox="0 0 100 100" className="w-10 h-10 fill-current text-[#d8b4fe] drop-shadow-[2px_2px_0px_#9333ea]">
         <path d="M50 10 C 65 25, 35 45, 50 60 C 65 75, 35 95, 50 95" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="square" />
         {/* Legs */}
         <line x1="30" y1="20" x2="70" y2="25" stroke="currentColor" strokeWidth="6" />
         <line x1="35" y1="40" x2="65" y2="45" stroke="currentColor" strokeWidth="6" />
         <line x1="30" y1="60" x2="70" y2="65" stroke="currentColor" strokeWidth="6" />
         <line x1="35" y1="80" x2="65" y2="85" stroke="currentColor" strokeWidth="6" />
         <circle cx="50" cy="15" r="10" fill="currentColor" />
      </svg>
    </motion.div>
  );
}
