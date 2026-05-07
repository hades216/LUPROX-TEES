import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown, Menu, ShoppingBag, X } from "lucide-react";
import { useState, useRef } from "react";
import ThreeScene from "./components/ThreeScene";
import { Section, LoadingScreen, CartDrawer, CheckoutOverlay } from "./components/UI";
import { CentipedeLogo } from "./components/CentipedeLogo";
import { cn } from "./lib/utils";

function SlideReveal({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: "-100%" }}
        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
        className="absolute inset-0 bg-white z-20"
      />
      {children}
    </div>
  );
}

type CartItem = { id: string; name: string; price: number; qty: number };

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const addToCart = (item: Omit<CartItem, 'qty'>) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const parallaxNear = useTransform(scrollYProgress, [0, 1], [0, -400]);

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    viewport: { once: true, margin: "-50px" }
  };

  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    whileInView: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }
    }
  };

  const blurIn = {
    initial: { opacity: 0, filter: "blur(5px)", y: 15 },
    whileInView: { 
      opacity: 1, 
      filter: "blur(0px)",
      y: 0,
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as any }
    }
  };

  return (
    <>
      <div className="fixed inset-0 w-full h-full overflow-hidden">
        <div ref={containerRef} className="absolute inset-0 overflow-y-auto overflow-x-hidden selection:bg-[#9333ea] selection:text-white">
          <LoadingScreen />
          <CartDrawer 
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cartItems}
            onRemove={removeFromCart}
            onCheckout={() => {
              setIsCartOpen(false);
              setIsCheckoutOpen(true);
            }}
          />
          <CheckoutOverlay isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

          {/* Abstract backgrounds */}
          <ThreeScene scrollProgress={scrollYProgress} />
          <div className="fixed inset-0 pointer-events-none z-0 minimal-fade" />
          
          {/* Navigation */}
          <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-black border-b-2 border-[#d8b4fe]">
            <div className="flex items-center gap-4">
              <CentipedeLogo />
              <span className="text-2xl font-black tracking-widest text-white uppercase bg-[#881337] px-3 py-1 brutal-border">LUPROX</span>
            </div>
            
            <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest text-[#d8b4fe] font-bold">
              <a href="#home" className="hover:bg-[#d8b4fe] hover:text-black px-2 py-1 transition-colors">Home</a>
              <a href="#dropdown" className="hover:bg-[#d8b4fe] hover:text-black px-2 py-1 transition-colors">Drop Down</a>
              <a href="#fullsleeves" className="hover:bg-[#d8b4fe] hover:text-black px-2 py-1 transition-colors">Full Sleeves</a>
              <a href="#about" className="hover:bg-[#d8b4fe] hover:text-black px-2 py-1 transition-colors">About</a>
            </div>

            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsCartOpen(true)} 
                className="relative text-[#d8b4fe] font-bold hover:bg-[#d8b4fe] hover:text-black px-3 py-1 transition-colors brutal-border brutal-shadow-hover bg-black"
              >
                <span className="uppercase text-xs tracking-widest">Cart [{cartItems.reduce((acc, i) => acc + i.qty, 0)}]</span>
              </button>
              <button 
                className="md:hidden text-[#d8b4fe] brutal-border p-1 hover:bg-[#d8b4fe] hover:text-black"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center gap-8 text-3xl uppercase tracking-widest font-black"
            >
              <a href="#home" onClick={() => setIsMenuOpen(false)} className="text-[#d8b4fe] hover:bg-[#d8b4fe] hover:text-black px-6 py-2 brutal-border brutal-shadow-hover">Home</a>
              <a href="#dropdown" onClick={() => setIsMenuOpen(false)} className="text-[#d8b4fe] hover:bg-[#d8b4fe] hover:text-black px-6 py-2 brutal-border brutal-shadow-hover">Drop Down</a>
              <a href="#fullsleeves" onClick={() => setIsMenuOpen(false)} className="text-[#d8b4fe] hover:bg-[#d8b4fe] hover:text-black px-6 py-2 brutal-border brutal-shadow-hover">Full Sleeves</a>
              <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-[#d8b4fe] hover:bg-[#d8b4fe] hover:text-black px-6 py-2 brutal-border brutal-shadow-hover">About</a>
            </motion.div>
          )}

          {/* Main Content */}
          <main className="relative z-10 pt-24 md:pt-0">
            {/* Hero Section */}
            <Section id="home" className="flex flex-col items-center justify-center text-center min-h-screen">
              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                className="max-w-4xl px-4"
              >
                <motion.h1 variants={staggerItem} className="text-6xl md:text-9xl font-black mb-6 tracking-tighter text-[#f3e8ff] reveal-text is-visible uppercase">
                  Functional<br />
                  <span className="bg-[#9333ea] text-white px-4 inline-block mt-2 brutal-shadow">Aesthetics</span>
                </motion.h1>
                <motion.p variants={staggerItem} className="text-base md:text-xl font-bold tracking-widest text-[#d8b4fe] mb-12 max-w-2xl mx-auto uppercase bg-black/40 backdrop-blur-md p-4 brutal-border">
                  Engineered garments bridging the gap between minimalist form and enduring utility.
                </motion.p>
                <motion.div variants={staggerItem} className="flex flex-col md:flex-row gap-6 justify-center items-center">
                  <button 
                    onClick={() => setIsCartOpen(true)}
                    className="w-full md:w-auto px-8 py-4 bg-[#d8b4fe] text-black font-black uppercase tracking-widest text-sm brutal-border brutal-shadow brutal-shadow-hover"
                  >
                    Shop Collection
                  </button>
                  <button className="w-full md:w-auto px-8 py-4 bg-black text-[#d8b4fe] font-black uppercase tracking-widest text-sm brutal-border brutal-shadow brutal-shadow-hover">
                    Lookbook
                  </button>
                </motion.div>
              </motion.div>
            </Section>

            {/* Drop Down Section */}
            <Section id="dropdown" className="py-24">
              <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
                <motion.div 
                  initial="initial"
                  whileInView="whileInView"
                  viewport={{ once: false, amount: 0.3 }}
                  variants={{
                    initial: { opacity: 0 },
                    whileInView: {
                      opacity: 1,
                      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
                    }
                  }}
                  className="px-4"
                >
                  <motion.h2 
                    variants={{
                      initial: { opacity: 0, x: -50, rotate: -2 },
                      whileInView: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", stiffness: 100 } }
                    }}
                    className="text-5xl md:text-7xl mb-6 font-black text-[#f3e8ff] uppercase tracking-tighter inline-block bg-transparent p-2 brutal-border brutal-shadow"
                  >
                    Drop Down<br/>Shirts
                  </motion.h2>
                  <motion.p 
                    variants={{
                      initial: { opacity: 0, y: 30 },
                      whileInView: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                    }}
                    className="text-[#d8b4fe] font-bold leading-relaxed mb-8 max-w-md bg-transparent p-4 brutal-border uppercase text-sm"
                  >
                    Oversized, technical silhouette providing comfort without compromising structure. Heavyweight cotton treated for durability.
                  </motion.p>
                  <motion.ul 
                    variants={{
                      initial: { opacity: 0, y: 20 },
                      whileInView: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                    }}
                    className="space-y-4 mb-10 text-sm font-black tracking-widest text-[#f3e8ff] uppercase"
                  >
                    <li className="flex items-center gap-4"><span className="w-4 h-4 bg-[#9333ea] block"></span> 100% Heavyweight Cotton</li>
                    <li className="flex items-center gap-4"><span className="w-4 h-4 bg-[#9333ea] block"></span> Minimalist Seam Detailing</li>
                    <li className="flex items-center gap-4"><span className="w-4 h-4 bg-[#9333ea] block"></span> Boxy Fit</li>
                  </motion.ul>
                  <motion.div 
                    variants={{
                      initial: { opacity: 0, scale: 0.9 },
                      whileInView: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 120 } }
                    }}
                    className="flex flex-col sm:flex-row gap-4 mt-6"
                  >
                    <button 
                      onClick={() => addToCart({ id: 'cs-01-dd', name: 'Drop Down Shirt', price: 120 })}
                      className="px-8 py-4 bg-[#d8b4fe] text-black font-black uppercase tracking-widest text-sm w-full sm:w-auto text-center brutal-border brutal-shadow brutal-shadow-hover"
                    >
                      Add to Cart — $120
                    </button>
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, x: 50 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 80, damping: 20 }}
                  viewport={{ once: false, amount: 0.3 }}
                  style={{ y: parallaxNear }}
                  className="relative aspect-[4/5] bg-transparent mx-4 md:mx-0 group brutal-border brutal-shadow"
                >
                  <div className="absolute top-4 left-4 text-sm text-white bg-[#9333ea] px-2 font-bold uppercase tracking-widest z-10">
                    CS-01-DD
                  </div>
                </motion.div>
              </div>
            </Section>

            {/* Full Sleeves Section */}
            <Section id="fullsleeves" className="py-24 bg-transparent">
              <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center relative z-10 px-4">
                <motion.div 
                   initial={{ opacity: 0, scale: 0.8, x: -50, rotate: -3 }}
                   whileInView={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
                   transition={{ type: "spring", stiffness: 80, damping: 20 }}
                   viewport={{ once: false, amount: 0.3 }}
                   className="order-2 md:order-1"
                >
                  <SlideReveal>
                    <div className="relative aspect-[4/5] bg-transparent overflow-hidden group brutal-border brutal-shadow">
                      <div className="absolute top-4 left-4 text-sm text-white bg-[#881337] px-2 font-bold uppercase tracking-widest z-10">
                        CS-02-FS
                      </div>
                    </div>
                  </SlideReveal>
                </motion.div>

                <motion.div 
                  initial="initial"
                  whileInView="whileInView"
                  viewport={{ once: false, amount: 0.3 }}
                  variants={{
                    initial: { opacity: 0 },
                    whileInView: {
                      opacity: 1,
                      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
                    }
                  }}
                  className="order-1 md:order-2"
                >
                  <motion.h2 
                    variants={{
                      initial: { opacity: 0, x: 50, rotate: 2 },
                      whileInView: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", stiffness: 100 } }
                    }}
                    className="text-5xl md:text-7xl mb-6 font-black text-[#f3e8ff] uppercase tracking-tighter inline-block bg-transparent p-2 brutal-border brutal-shadow"
                  >
                    Full<br/>Sleeves
                  </motion.h2>
                  <motion.p 
                    variants={{
                      initial: { opacity: 0, y: 30 },
                      whileInView: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                    }}
                    className="text-[#d8b4fe] font-bold leading-relaxed mb-8 max-w-md bg-transparent p-4 brutal-border uppercase text-sm"
                  >
                    Compressive tech-wear inspired by futuristic utility. Clean aesthetic with subtle technical capabilities.
                  </motion.p>
                  <motion.div 
                    variants={{
                      initial: { opacity: 0, scale: 0.9 },
                      whileInView: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 120 } }
                    }}
                    className="flex flex-col sm:flex-row gap-4 mt-6"
                  >
                    <button 
                      onClick={() => addToCart({ id: 'cs-02-fs', name: 'Full Sleeves Tech', price: 180 })}
                      className="px-8 py-4 bg-[#881337] text-white font-black uppercase tracking-widest text-sm w-full sm:w-auto text-center brutal-border brutal-shadow brutal-shadow-hover"
                    >
                      Add to Cart — $180
                    </button>
                  </motion.div>
                </motion.div>
              </div>
            </Section>

            {/* Footer */}
            <footer id="about" className="relative z-10 py-24 px-6 border-t-4 border-[#d8b4fe] bg-transparent">
              <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 md:gap-16 relative z-10">
                <motion.div 
                  variants={blurIn}
                  initial="initial"
                  whileInView="whileInView"
                  viewport={{ once: true }}
                  className="col-span-2 md:col-span-2 lg:col-span-2"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-3xl font-black tracking-widest text-white uppercase bg-[#9333ea] px-4 py-2 brutal-border brutal-shadow">LUPROX</span>
                  </div>
                  <p className="text-[#d8b4fe] font-bold text-sm max-w-md leading-relaxed uppercase p-4 brutal-border bg-black/40 backdrop-blur-md mb-8">
                    A minimalist approach to technical apparel. Form meets uncompromised function in every piece.
                  </p>
                  <div className="max-w-md mt-6">
                    <h4 className="text-sm font-black uppercase tracking-widest mb-4 text-[#d8b4fe] bg-black/40 backdrop-blur-md inline-block p-2 brutal-border">Newsletter</h4>
                    <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to the newsletter!'); }} className="flex flex-col sm:flex-row gap-2">
                      <input 
                        type="email" 
                        placeholder="ENTER EMAIL" 
                        required 
                        className="bg-black/80 backdrop-blur-md border-2 border-[#d8b4fe] p-3 text-[#f3e8ff] placeholder:text-[#d8b4fe]/50 font-bold uppercase tracking-widest outline-none focus:border-[#9333ea] w-full" 
                      />
                      <button 
                        type="submit" 
                        className="bg-[#9333ea] text-white font-black uppercase tracking-widest px-6 py-3 border-2 border-[#d8b4fe] hover:bg-[#d8b4fe] hover:text-black transition-colors brutal-shadow brutal-shadow-hover whitespace-nowrap"
                      >
                        Sign Up
                      </button>
                    </form>
                  </div>
                </motion.div>
                
                <motion.div variants={staggerItem} initial="initial" whileInView="whileInView">
                  <h4 className="text-sm font-black uppercase tracking-widest mb-6 text-[#d8b4fe] bg-black/40 backdrop-blur-md inline-block p-2 brutal-border">Explore</h4>
                  <ul className="space-y-4 text-sm font-bold text-[#d8b4fe] uppercase">
                    <li><a href="#" className="hover:bg-[#d8b4fe] hover:text-black inline-block px-2 py-1 transition-colors">Collection</a></li>
                    <li><a href="#" className="hover:bg-[#d8b4fe] hover:text-black inline-block px-2 py-1 transition-colors">Archive</a></li>
                    <li><a href="#" className="hover:bg-[#d8b4fe] hover:text-black inline-block px-2 py-1 transition-colors">Info</a></li>
                  </ul>
                </motion.div>

                <motion.div variants={staggerItem} initial="initial" whileInView="whileInView">
                  <h4 className="text-sm font-black uppercase tracking-widest mb-6 text-[#d8b4fe] bg-black/40 backdrop-blur-md inline-block p-2 brutal-border">Social</h4>
                  <ul className="space-y-4 text-sm font-bold text-[#d8b4fe] uppercase">
                    <li><a href="#" className="hover:bg-[#d8b4fe] hover:text-black inline-block px-2 py-1 transition-colors">Instagram</a></li>
                    <li><a href="#" className="hover:bg-[#d8b4fe] hover:text-black inline-block px-2 py-1 transition-colors">Twitter</a></li>
                  </ul>
                </motion.div>
              </div>
              
              <div className="max-w-7xl mx-auto mt-24 pt-8 border-t-2 border-[#d8b4fe] flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-bold uppercase tracking-widest text-[#d8b4fe]">
                <p className="bg-black/40 backdrop-blur-md px-4 py-2 brutal-border">© 2026 LUPROX. ALL RIGHTS RESERVED.</p>
                <div className="flex gap-8">
                  <a href="#" className="hover:bg-[#d8b4fe] hover:text-black px-2 py-1 transition-colors">Privacy</a>
                  <a href="#" className="hover:bg-[#d8b4fe] hover:text-black px-2 py-1 transition-colors">Terms</a>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}
