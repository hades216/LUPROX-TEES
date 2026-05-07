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
          
          <h2 className="relative z-10 mb-8 text-4xl tracking-tighter font-black text-white uppercase bg-[#9333ea] px-4 py-2 brutal-border brutal-shadow">
            LUPROX
          </h2>
          
          <div className="relative z-10 flex flex-col items-center mt-12 w-full max-w-xs">
            <div className="w-full h-4 bg-black brutal-border relative overflow-hidden mb-4">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-[#d8b4fe]"
                initial={{ width: 0 }}
                animate={{ width: `${displayProgress}%` }}
                transition={{ duration: 0.2, ease: "linear" }}
              />
            </div>
            
            <div className="text-xl font-black text-[#d8b4fe] tracking-widest uppercase bg-black px-2 brutal-border">
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
          <div className="absolute top-2 right-2 text-white cursor-pointer text-xs font-bold">X</div>
          <p className="text-xs font-black uppercase tracking-widest text-[#d8b4fe]">{lore}</p>
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
  onCheckout,
}: {
  isOpen: boolean;
  onClose: () => void;
  items: { id: string; name: string; price: number; qty: number }[];
  onRemove: (id: string) => void;
  onCheckout: () => void;
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
            className="fixed top-0 right-0 h-full w-full max-w-sm z-[90] bg-black border-l-4 border-[#9333ea] flex flex-col pt-16 shadow-[-10px_0_30px_rgba(147,51,234,0.1)]"
          >
            <div className="flex justify-between items-center p-6 border-b-2 border-[#d8b4fe]">
              <div className="relative">
                <h2 className="text-xl font-black tracking-widest text-white uppercase bg-[#9333ea] px-3 py-1 brutal-border">Cart</h2>
                {items.length > 0 && (
                  <span className="absolute -top-3 -right-3 text-xs bg-black text-[#d8b4fe] px-2 py-0.5 border-2 border-[#d8b4fe] font-bold">
                    {items.length}
                  </span>
                )}
              </div>
              <button onClick={onClose} className="text-[#d8b4fe] hover:bg-[#d8b4fe] hover:text-black p-1 transition-colors brutal-border">
                <span className="text-2xl leading-none block px-2">&times;</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              <AnimatePresence mode="wait">
                {items.length === 0 ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="h-full flex flex-col gap-6 items-center justify-center text-center opacity-100"
                  >
                    <div className="text-[#9333ea] border-4 border-[#9333ea] p-6 brutal-shadow rounded-full bg-black">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    </div>
                    <p className="text-xl font-black tracking-widest text-[#f3e8ff] uppercase bg-black p-4 brutal-border">Cart Empty</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="has-items"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1 }
                      }
                    }}
                    className="space-y-6"
                  >
                    <AnimatePresence>
                      {items.map((item) => (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9, x: 50, transition: { duration: 0.2 } }}
                          key={item.id} 
                          className="flex justify-between items-center bg-black border-2 border-[#d8b4fe] p-4 brutal-shadow group"
                        >
                          <div>
                            <h3 className="text-[#f3e8ff] text-sm font-black uppercase tracking-widest">{item.name}</h3>
                            <p className="text-[#d8b4fe] text-xs uppercase font-bold tracking-wider mt-2 bg-[#9333ea]/20 inline-block px-1.5 py-0.5">QTY: {item.qty} | ${item.price}</p>
                          </div>
                          <button 
                            onClick={() => onRemove(item.id)}
                            className="text-[#d8b4fe] hover:bg-[#881337] hover:text-white bg-black transition-colors text-xs font-black tracking-widest uppercase px-2 py-1 brutal-border group-hover:border-[#881337]"
                          >
                            Remove
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t-2 border-[#d8b4fe] bg-black">
                <div className="flex justify-between text-[#f3e8ff] text-xl font-black tracking-widest mb-6 uppercase">
                  <span>Total</span>
                  <span>${total}.00</span>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full py-4 bg-[#881337] hover:bg-[#d8b4fe] text-white hover:text-black uppercase tracking-[0.2em] text-sm font-black transition-colors brutal-border brutal-shadow brutal-shadow-hover"
                >
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

export function CheckoutOverlay({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState(1);
  useEffect(() => {
    if (!isOpen) setStep(1);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 overflow-y-auto"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            className="w-full max-w-xl bg-black border-4 border-[#9333ea] brutal-shadow p-8 relative my-8"
          >
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-[#d8b4fe] hover:bg-[#d8b4fe] hover:text-black p-1 transition-colors brutal-border z-10"
            >
              <span className="text-2xl leading-none block px-2">&times;</span>
            </button>
            
            <h2 className="text-4xl font-black tracking-widest text-[#f3e8ff] uppercase mb-8 pb-4 border-b-2 border-[#d8b4fe]">Secure Checkout</h2>
            
            {step === 1 ? (
              <motion.form 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={(e) => { e.preventDefault(); setStep(2); }}
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-[#d8b4fe] uppercase tracking-widest mb-2">Email Address</label>
                    <input type="email" required className="w-full bg-black/40 border-2 border-[#d8b4fe] p-3 text-[#f3e8ff] outline-none focus:border-[#9333ea]" placeholder="USER@EXAMPLE.COM" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#d8b4fe] uppercase tracking-widest mb-2">First Name</label>
                      <input type="text" required className="w-full bg-black/40 border-2 border-[#d8b4fe] p-3 text-[#f3e8ff] outline-none focus:border-[#9333ea]" placeholder="FIRST" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#d8b4fe] uppercase tracking-widest mb-2">Last Name</label>
                      <input type="text" required className="w-full bg-black/40 border-2 border-[#d8b4fe] p-3 text-[#f3e8ff] outline-none focus:border-[#9333ea]" placeholder="LAST" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#d8b4fe] uppercase tracking-widest mb-2">Shipping Address</label>
                    <input type="text" required className="w-full bg-black/40 border-2 border-[#d8b4fe] p-3 text-[#f3e8ff] outline-none focus:border-[#9333ea]" placeholder="123 SECTOR ST" />
                  </div>
                </div>
                <button type="submit" className="w-full mt-8 py-4 bg-[#9333ea] text-white font-black uppercase tracking-widest border-2 border-[#d8b4fe] hover:bg-[#d8b4fe] hover:text-black transition-colors brutal-shadow brutal-shadow-hover">
                  Continue to Payment
                </button>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-center py-12"
              >
                <div className="text-4xl text-[#9333ea] mb-6 animate-pulse">■</div>
                <h3 className="text-2xl font-black text-[#f3e8ff] uppercase tracking-widest mb-4">Payment Processing</h3>
                <p className="text-[#d8b4fe] uppercase tracking-widest text-sm mb-8">Please wait while encrypting terminal...</p>
                <button onClick={onClose} className="py-2 px-6 border-2 border-[#d8b4fe] text-[#d8b4fe] hover:bg-[#d8b4fe] text-xs font-bold uppercase hover:text-black transition-colors">
                  Cancel Simulation
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
