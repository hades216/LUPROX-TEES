import { motion, AnimatePresence } from "motion/react";
import { useProgress } from "@react-three/drei";
import { CentipedeLogo } from "./CentipedeLogo";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const { progress, active } = useProgress();
  const [isLoading, setIsLoading] = useState(true);
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    setDisplayProgress(prev => Math.max(prev, progress));
    if (progress >= 100) {
      const timeout = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  // Bulletproof fallback - force loading screen to finish after 3 seeconds maximum
  useEffect(() => {
    const hardFallback = setTimeout(() => {
      setDisplayProgress(100);
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(hardFallback);
  }, []);

  return (
    <AnimatePresence>
      {(active || isLoading) && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center text-white overflow-hidden pointer-events-none"
        >
          <motion.div 
            animate={{ 
              scale: [1, 1.02, 1], 
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8"
          >
            <CentipedeLogo />
          </motion.div>
          
          <h2 className="relative z-10 mb-8 text-4xl tracking-tighter font-black text-white uppercase bg-red-600 px-4 py-2 brutal-border brutal-shadow">
            LUPROX
          </h2>
          
          <div className="relative z-10 flex flex-col items-center mt-12 w-full max-w-xs">
            <div className="w-full h-4 bg-black brutal-border relative overflow-hidden mb-4">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${displayProgress}%` }}
                transition={{ duration: 0.2, ease: "linear" }}
              />
            </div>
            
            <div className="text-xl font-black text-white tracking-widest uppercase bg-black px-2 brutal-border">
              {displayProgress.toFixed(0)}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function LorePopUp() {
  const [isVisible, setIsVisible] = useState(false);
  const [lore, setLore] = useState("");

  const loreSnippets = [
    "The signal is not broadcasting. It is growing.",
    "Do you remember the feel of real skin? Neither do I.",
    "Sigilism is the architecture of the void.",
    "Chrome is temporary. Data is forever.",
    "We are just ghosts in the machine's fever dream."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() < 0.2) {
        setLore(loreSnippets[Math.floor(Math.random() * loreSnippets.length)]);
        setIsVisible(true);
      }
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={() => setIsVisible(false)}
          className="fixed bottom-6 right-6 z-[70] w-64 p-4 bg-white border-2 border-black cursor-pointer brutal-shadow text-black"
        >
          <div className="absolute top-2 right-2 text-black cursor-pointer text-xs font-bold">X</div>
          <p className="text-xs font-black uppercase tracking-widest">{lore}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onRemove,
}: {
  isOpen: boolean;
  onClose: () => void;
  items: { id: string; name: string; price: number; qty: number }[];
  onRemove: (id: string) => void;
}) {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm cursor-pointer"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: [0.19, 1, 0.22, 1], duration: 0.6 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm z-[90] bg-black border-l-4 border-white flex flex-col pt-16"
          >
            <div className="flex justify-between items-center p-6 border-b-2 border-white">
              <h2 className="text-xl font-black tracking-widest text-white uppercase bg-red-600 px-2">Cart</h2>
              <button onClick={onClose} className="text-white hover:bg-white hover:text-black p-1 transition-colors brutal-border">
                <span className="text-2xl leading-none block px-2">&times;</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              {items.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center opacity-100">
                  <p className="text-xl font-black tracking-widest text-white uppercase bg-black p-4 brutal-border">Empty</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-black border-2 border-white p-4">
                      <div>
                        <h3 className="text-white text-sm font-black uppercase tracking-widest">{item.name}</h3>
                        <p className="text-white text-xs uppercase font-bold tracking-wider mt-2">QTY: {item.qty} | ${item.price}</p>
                      </div>
                      <button 
                        onClick={() => onRemove(item.id)}
                        className="text-white hover:bg-white hover:text-black bg-black transition-colors text-xs font-black tracking-widest uppercase px-2 py-1 brutal-border"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t-2 border-white bg-black">
                <div className="flex justify-between text-white text-xl font-black tracking-widest mb-6 uppercase">
                  <span>Total</span>
                  <span>${total}.00</span>
                </div>
                <button className="w-full py-4 bg-white hover:bg-black text-black hover:text-white uppercase tracking-[0.2em] text-sm font-black transition-colors brutal-border brutal-shadow brutal-shadow-hover">
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function Section({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`relative min-h-screen flex items-center justify-center ${className}`}>
      <div className="max-w-7xl mx-auto w-full z-20">
        {children}
      </div>
    </section>
  );
}
