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
  // This prevents infinite loading if no heavy assets are mounted in the scene (e.g. mobile fallback materials).
  useEffect(() => {
    const hardFallback = setTimeout(() => {
      setDisplayProgress(100);
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(hardFallback);
  }, []);

  const getLoadingText = (p: number) => {
    if (p < 25) return "INITIATING BLOOD-PACT SEQUENCE...";
    if (p < 50) return "ALIGNING VOID LATTICES...";
    if (p < 85) return "SYNTHESIZING FORBIDDEN CHROME...";
    if (p < 100) return "FINALIZING NEURAL DESCENT...";
    return "NEURAL LINK ESTABLISHED.";
  };

  return (
    <AnimatePresence>
      {(active || isLoading) && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: 1.2, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] bg-[#050000] flex flex-col items-center justify-center text-white overflow-hidden pointer-events-none"
        >
          {/* Deep Abyssal Glow */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#083344_0%,_transparent_60%)] mix-blend-screen pointer-events-none"
          />

          {/* Noise overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://picsum.photos/seed/organic/1920/1080')] mix-blend-screen grayscale pointer-events-none" />
          
          {/* Rotating Occult Rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute border border-red-900/30 rounded-full w-96 h-96 opacity-20 border-dashed pointer-events-none"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute border border-cyan-400/20 rounded-full w-64 h-64 border-dotted pointer-events-none shadow-[0_0_20px_#00ffff_inset]"
          />

          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1, 1.02, 1], 
              opacity: [0.7, 1, 0.8, 1, 0.7],
              filter: ["brightness(1)", "brightness(1.5)", "brightness(1)", "brightness(1)", "brightness(1)"]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 scale-125 md:scale-150 mb-4 drop-shadow-[0_0_15px_#00ffff]"
          >
            <CentipedeLogo />
          </motion.div>
          
          <h2 className="relative z-10 mt-12 text-3xl md:text-4xl tracking-[0.5em] font-light text-cyan-400 mix-blend-screen drop-shadow-[0_0_15px_#00ffff] uppercase">
            LUPROX
          </h2>
          
          <div className="relative z-10 flex flex-col items-center mt-8">
            <div className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/50 mb-2 h-4 font-mono text-center">
              {getLoadingText(displayProgress)}
            </div>
            
            <div className="text-xl md:text-2xl font-mono text-cyan-400 font-bold mb-6 tracking-widest drop-shadow-[0_0_8px_#00ffff]">
              {displayProgress.toFixed(0)}%
            </div>

            <div className="w-64 md:w-96 h-[2px] bg-white/5 relative overflow-hidden rounded-full">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-cyan-400 shadow-[0_0_15px_#00ffff]"
                initial={{ width: 0 }}
                animate={{ width: `${displayProgress}%` }}
                transition={{ duration: 0.2, ease: "linear" }}
              />
              {/* Scanline passing over the loading bar */}
              <motion.div 
                className="absolute top-0 left-0 h-full w-10 bg-white/50 blur-[2px]"
                animate={{ x: [-50, 400] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
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
          className="fixed bottom-6 right-6 z-[70] w-64 p-4 glossy-panel rounded-2xl cursor-pointer"
        >
          <div className="absolute top-2 right-3 text-cyan-400 cursor-pointer text-[10px]">X</div>
          <p className="text-[10px] font-mono text-cyan-100 uppercase tracking-widest">{lore}</p>
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
            className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm cursor-pointer"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: [0.19, 1, 0.22, 1], duration: 0.6 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm z-[90] bg-black/40 backdrop-blur-3xl border-l border-white/10 shadow-[0_0_50px_rgba(0,255,255,0.1)] flex flex-col pt-16"
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-light tracking-widest text-cyan-400 text-glow">VOID CART</h2>
              <button onClick={onClose} className="text-cyan-400/60 hover:text-cyan-400 transition-colors">
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <p className="text-sm font-mono tracking-widest text-white mb-2">THE CART IS EMPTY.</p>
                  <p className="text-[10px] tracking-widest text-cyan-400/50">MANIFEST YOUR DESIRES INTO THIS VOID.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center glossy-panel p-4 rounded-2xl">
                      <div>
                        <h3 className="text-white text-xs font-light uppercase tracking-widest">{item.name}</h3>
                        <p className="text-cyan-400 text-[10px] uppercase font-mono tracking-wider mt-1">QTY: {item.qty} | VOL: ${item.price}</p>
                      </div>
                      <button 
                        onClick={() => onRemove(item.id)}
                        className="text-white/40 hover:text-pink-500 transition-colors text-xs tracking-widest underline decoration-white/20 hover:decoration-pink-500 underline-offset-4"
                      >
                        REMOVE
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-xl">
                <div className="flex justify-between text-white text-sm tracking-widest mb-6 font-mono">
                  <span>TOTAL MASS</span>
                  <span className="text-cyan-400">${total}.00</span>
                </div>
                <button className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 rounded-full text-white uppercase tracking-[0.3em] text-xs font-bold transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                  INITIATE SECURE CHECKOUT
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function DangerBulletin({ position = 'top' }: { position?: 'top' | 'bottom' }) {
  const messages = position === 'top' ? [
    "!!! DANGER: NEURAL INTERFACE INSTABILITY DETECTED !!!",
    "!!! LUPROX CORE TEMPERATURE AT CRITICAL LEVELS !!!",
    "!!! VOID FRAGMENTS DETECTED - PROCEED WITH CAUTION !!!",
    "!!! UNAUTHORIZED ACCESS TO CORE SIGILS BLOCKED !!!"
  ] : [
    "!!! WARNING: SIGIL CORRUPTION IN SECTOR 7 !!!",
    "!!! SYSTEM INTEGRITY COMPROMISED !!!",
    "!!! NEURAL FEEDBACK LOOP ACTIVE !!!",
    "!!! EVACUATE VIRTUAL ENVIRONMENTS IMMEDIATELY !!!"
  ];

  return (
    <motion.div 
      className={`fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 w-full z-[55] bg-black/40 backdrop-blur-sm border-${position === 'top' ? 'b' : 't'} border-cyan-400/20 overflow-hidden py-1.5 pointer-events-none`}
      animate={{ y: [0, -1, 1, 0] }}
      transition={{ 
        duration: 0.8, 
        repeat: Infinity, 
        repeatDelay: position === 'top' ? 5 : 6.5,
        ease: "linear"
      }}
    >
      <motion.div 
        className="flex gap-16 whitespace-nowrap"
        animate={{ x: position === 'top' ? ["100%", "-100%"] : ["-100%", "100%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {[...messages, ...messages].map((msg, i) => (
          <span key={i} className="text-cyan-400/80 font-mono text-[10px] tracking-[0.2em] uppercase text-glow">
            {msg}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}

export function SigilOverlay() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  if (isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden opacity-20 scare-flicker">
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute top-10 left-10 w-64 h-64 text-cyan-900/20"
        animate={{ 
          rotate: 360,
          x: isMobile ? 0 : [0, 1, -1, 0],
          y: isMobile ? 0 : [0, -1, 1, 0]
        }}
        transition={{ 
          rotate: { duration: 60, repeat: Infinity, ease: "linear" },
          x: { duration: 0.2, repeat: Infinity, repeatType: "reverse" },
          y: { duration: 0.1, repeat: Infinity, repeatType: "reverse" }
        }}
      >
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <path d="M50 5 L50 95 M5 50 L95 50" stroke="currentColor" strokeWidth="0.5" />
        <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="0.5" transform="rotate(45 50 50)" />
      </motion.svg>

      <motion.svg
        viewBox="0 0 100 100"
        className="absolute bottom-10 right-10 w-96 h-96 text-purple-900/20"
        animate={{ 
          rotate: -360,
          scale: [1, 1.02, 0.98, 1]
        }}
        transition={{ 
          rotate: { duration: 90, repeat: Infinity, ease: "linear" },
          scale: { duration: 0.5, repeat: Infinity }
        }}
      >
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.2" />
        <path d="M20 20 L80 80 M80 20 L20 80" stroke="currentColor" strokeWidth="0.2" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.2" />
      </motion.svg>
      
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-50" />
    </div>
  );
}

export function Scanlines() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  if (isMobile) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[70] opacity-[0.03] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,black_50%)] bg-[length:100%_4px]" />
    </div>
  );
}

export function CinematicEffects() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  if (isMobile) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[65]">
      {/* Random Glitch Interference */}
      {!isMobile && (
        <motion.div 
          animate={{ opacity: [0, 0.05, 0] }}
          transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 5 }}
          className="absolute inset-0 bg-white mix-blend-overlay"
        />
      )}
      {/* Abyssal Pulse */}
      <motion.div 
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-purple-900/10 mix-blend-screen"
      />
    </div>
  );
}

export function DecorativeFloatingElements() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  if (isMobile) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          animate={{ 
            y: [0, -50, 0],
            rotate: [0, 90, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 10 + i * 5, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute text-[8px] font-mono whitespace-nowrap text-white/50 select-none"
          style={{ 
            left: `${10 + i * 20}%`, 
            top: `${20 + i * 15}%` 
          }}
        >
          {`[VOID_FRAGMENT_${i + 1}] // ORIGIN: LUPROX_CORE // STATUS: UNSTABLE`}
        </motion.div>
      ))}
    </div>
  );
}

export function MovingShadows() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  if (isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
      {[1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute bg-black rounded-full filter blur-[60px] md:blur-[120px]"
          style={{
            width: `${300 + i * 100}px`,
            height: `${200 + i * 50}px`,
            left: `${(i - 1) * 40}%`,
            top: `${(i - 1) * 20}%`,
          }}
          animate={{
            x: [0, 50, -25, 0],
            y: [0, -25, 25, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 20 + i * 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function Section({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`relative min-h-screen flex items-center justify-center px-6 py-20 ${className}`}>
      <div className="max-w-7xl mx-auto w-full z-20">
        {children}
      </div>
    </section>
  );
}
