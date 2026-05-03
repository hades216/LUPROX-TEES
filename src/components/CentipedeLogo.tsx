import { motion } from "motion/react";

export function CentipedeLogo() {
  const segments = 8;
  
  return (
    <div className="relative w-12 h-12 flex items-center justify-center overflow-visible">
      <div className="relative flex items-center">
        {Array.from({ length: segments }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full border border-white/40 bg-maroon-900"
            style={{
              left: i * 4,
              zIndex: segments - i,
              boxShadow: "0 0 8px rgba(176, 38, 255, 0.4)"
            }}
            animate={{
              y: [0, -4, 0, 4, 0],
              x: [0, 2, 0, -2, 0],
              scale: [1, 1.1, 1],
              backgroundColor: ["#4c0519", "#b026ff", "#4c0519"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut"
            }}
          >
            {/* Legs */}
            <motion.div 
              className="absolute -left-1 top-1/2 w-1 h-[1px] bg-white/20"
              animate={{ rotate: [0, 45, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
            />
            <motion.div 
              className="absolute -right-1 top-1/2 w-1 h-[1px] bg-white/20"
              animate={{ rotate: [0, -45, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
            />
          </motion.div>
        ))}
        {/* Head with antennae */}
        <motion.div
          className="absolute w-3 h-3 rounded-full border border-white bg-maroon-600 z-10"
          style={{ left: -4 }}
          animate={{
            y: [0, -4, 0, 4, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="absolute -top-2 -left-1 w-[1px] h-3 bg-white/40 rotate-[-30deg]" />
          <div className="absolute -top-2 right-0 w-[1px] h-3 bg-white/40 rotate-[30deg]" />
        </motion.div>
      </div>
    </div>
  );
}
