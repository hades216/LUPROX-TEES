import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Strike {
  id: number;
  path: string;
  x: number;
  y: number;
  width: number;
}

export function Lightning() {
  const [strikes, setStrikes] = useState<Strike[]>([]);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const generatePath = useCallback(() => {
    let path = "M 0 0";
    let curX = 0;
    let curY = 0;
    const segments = isMobile ? 6 : (10 + Math.floor(Math.random() * 10));
    const height = isMobile ? 500 : (300 + Math.random() * 400);
    const stepY = height / segments;

    for (let i = 1; i <= segments; i++) {
      curX += (Math.random() - 0.5) * 60;
      curY += stepY;
      path += ` L ${curX} ${curY}`;
    }
    return path;
  }, []);

  const triggerStrike = useCallback(() => {
    const id = Date.now() + Math.random();
    const newStrike: Strike = {
      id,
      path: generatePath(),
      x: Math.random() * 100,
      y: -10,
      width: 1 + Math.random() * 2
    };

    setStrikes((prev) => [...prev, newStrike]);
    window.dispatchEvent(new Event('lightning-strike'));

    // Remove strike after animation
    setTimeout(() => {
      setStrikes((prev) => prev.filter((s) => s.id !== id));
    }, 500);
  }, [generatePath]);

  useEffect(() => {
    const minDelay = isMobile ? 4000 : 2000;
    const maxDelay = isMobile ? 12000 : 8000;

    let timeoutId: NodeJS.Timeout;

    const scheduleNext = () => {
      const delay = Math.random() * (maxDelay - minDelay) + minDelay;
      timeoutId = setTimeout(() => {
        triggerStrike();
        // Occasional double strike
        if (!isMobile && Math.random() > 0.6) {
          setTimeout(triggerStrike, 150);
        }
        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [triggerStrike]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <AnimatePresence>
        {strikes.map((strike) => (
          <motion.svg
            key={strike.id}
            viewBox="-100 0 200 800"
            className="absolute h-full overflow-visible"
            style={{ 
              left: `${strike.x}%`, 
              top: `${strike.y}%`,
              filter: "blur(6px) drop-shadow(0 0 25px #b026ff)",
              width: "250px"
            }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0.4, 1, 0],
              scaleX: [1, 1.3, 1]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "linear" }}
          >
            <path
              d={strike.path}
              fill="none"
              stroke="#b159ff"
              strokeWidth={strike.width * 1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Inner core for more brightness */}
            <path
              d={strike.path}
              fill="none"
              stroke="#ffffff"
              strokeWidth={strike.width * 0.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: "blur(1px)" }}
            />
          </motion.svg>
        ))}
      </AnimatePresence>
      
      {/* Occasional flash */}
      <AnimatePresence>
        {strikes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-purple-900/30"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
