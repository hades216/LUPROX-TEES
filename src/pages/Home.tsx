import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { Section, DecorativeFloatingElements } from "../components/UI";
import { CentipedeLogo } from "../components/CentipedeLogo";
import { useCart } from "../lib/CartContext";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

function NeonText({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cn("relative inline-block", className)}>
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10"
      >
        {text}
      </motion.span>
    </div>
  );
}

function SlideReveal({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <motion.div
        initial={{ scaleY: 1 }}
        whileInView={{ scaleY: 0 }}
        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
        className="absolute inset-0 bg-white/10 backdrop-blur-xl z-20 origin-bottom"
      />
      {children}
    </div>
  );
}

function CyberGlyph({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  return (
    <motion.span
      onViewportEnter={() => {
        let iterations = 0;
        const interval = setInterval(() => {
          setDisplayText(prev => 
            prev.split("").map((_, index) => {
              if (index < iterations) return text[index];
              return chars[Math.floor(Math.random() * chars.length)];
            }).join("")
          );
          if (iterations >= text.length) clearInterval(interval);
          iterations += 1/3;
        }, 30);
      }}
      className="font-mono text-cyan-400"
    >
      {displayText}
    </motion.span>
  );
}

export default function Home() {
  const { addToCart } = useCart();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const parallaxSlow = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const parallaxNear = useTransform(scrollYProgress, [0, 1], [0, -400]);

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    },
    viewport: { once: true, margin: "-100px" }
  };

  const staggerItem = {
    initial: { opacity: 0, y: 30 },
    whileInView: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }
    }
  };

  const blurIn = {
    initial: { opacity: 0, filter: "blur(10px)", y: 20 },
    whileInView: { 
      opacity: 1, 
      filter: "blur(0px)",
      y: 0,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as any }
    }
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -50 },
    whileInView: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 1, ease: "easeOut" as any }
    }
  };

  const slideInRight = {
    initial: { opacity: 0, x: 50 },
    whileInView: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 1, ease: "easeOut" as any }
    }
  };

  return (
    <div ref={containerRef} className="h-full overflow-y-auto overflow-x-hidden pt-24 selection:bg-cyan-500 selection:text-white pb-32">
        {/* Hero Section */}
        <Section id="home" className="flex flex-col items-center justify-center text-center">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <motion.h1 variants={staggerItem} className="text-6xl md:text-8xl mb-4 text-glow-neon font-light">
              LUPROX<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 font-bold">
                SIGILISM
              </span>
            </motion.h1>
            <motion.p variants={staggerItem} className="text-xs md:text-sm tracking-[0.3em] text-white/50 mb-12 font-mono">
              Cyber-Chrome Apparel for the Digital Era <span className="text-white/20 select-none cursor-help hover:text-white/60 transition-colors">[SECURE]</span>
            </motion.p>
            <motion.div variants={staggerItem} className="flex flex-col md:flex-row gap-6 justify-center">
              <button 
                onClick={() => document.getElementById('dropdown')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 glossy-panel rounded-full text-white tracking-widest hover:bg-white/10 transition-all border-glow"
              >
                Shop Collection
              </button>
              <button className="px-8 py-4 bg-transparent border border-white/10 rounded-full text-white/70 tracking-widest hover:bg-white/5 hover:text-white transition-all">
                Lookbook
              </button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
          >
            <ChevronDown size={32} />
          </motion.div>
        </Section>

        {/* Drop Down Section */}
        <Section id="dropdown">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
            >
              <motion.h2 variants={staggerItem} className="text-4xl md:text-6xl mb-6 font-light">
                DROP DOWN<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-bold text-glow-neon">SHIRTS</span>
              </motion.h2>
              <motion.p variants={staggerItem} className="text-white/70 leading-relaxed mb-8 max-w-md italic">
                "They were never just clothes. They were vessels for the signal." — <span className="text-cyan-400 cursor-help px-2 border border-cyan-400/30 rounded-full text-xs not-italic">SECURE_LINK</span>
              </motion.p>
              <motion.ul variants={staggerItem} className="space-y-4 mb-10 text-sm uppercase tracking-widest text-white/50">
                <li className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00ffff]" /> 100% Heavyweight Cotton
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00ffff]" /> Reflective Sigil Prints
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00ffff]" /> Cyber-Chrome Hardware
                </li>
              </motion.ul>
              <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link to="/dropdown" className="px-6 py-3 border border-purple-500/50 rounded-full text-purple-400 hover:bg-purple-500/10 transition-all uppercase tracking-widest text-xs flex justify-center items-center">
                  Explore Drop Down
                </Link>
                <button 
                  onClick={() => addToCart({ id: 'cs-01-dd', name: 'Drop Down Shirt', price: 120 })}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full border border-pink-500 text-white hover:opacity-90 shadow-[0_0_20px_rgba(219,39,119,0.4)] transition-all uppercase tracking-widest text-xs"
                >
                  Add to Cart
                </button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              style={{ y: parallaxNear }}
              className="relative aspect-square glossy-panel flex items-center justify-center group overflow-hidden rounded-[2rem]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay z-10" />
              <div className="absolute top-6 left-6 text-xs text-white/50 uppercase tracking-widest z-20">
                Model: <CyberGlyph text="CS-01-DD" />
              </div>
              <img src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800" alt="Drop Down Shirt Pattern" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
            </motion.div>
          </div>
        </Section>

        {/* Full Sleeves Section */}
        <Section id="fullsleeves" className="overflow-hidden">
          <DecorativeFloatingElements />
          
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10 max-w-6xl mx-auto">
            <motion.div 
               variants={blurIn}
               initial="initial"
               whileInView="whileInView"
               viewport={{ once: true, margin: "-100px" }}
               className="order-2 md:order-1"
            >
              <SlideReveal>
                <div className="relative aspect-square glossy-panel flex items-center justify-center group overflow-hidden rounded-[2rem]">
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/30 to-pink-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay z-10" />
                  <div className="absolute bottom-6 right-6 text-xs text-white/50 uppercase tracking-widest z-20">
                    Model: <CyberGlyph text="CS-02-FS" />
                  </div>
                  <img src="https://images.unsplash.com/photo-1596755094514-f87e32f059cb?auto=format&fit=crop&q=80&w=800" alt="Tech Sleeves" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 mix-blend-screen" />
                </div>
              </SlideReveal>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="order-1 md:order-2"
            >
              <motion.h2 variants={blurIn} className="text-4xl md:text-6xl mb-6 relative">
                <NeonText text="FULL" className="text-glow-neon text-cyan-400" /><br />
                <span className="text-white relative z-10 italic font-light tracking-tighter">SLEEVES</span>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"
                />
              </motion.h2>
              <motion.p variants={staggerItem} className="text-white/70 leading-relaxed mb-8 max-w-md border-l-2 border-cyan-400/50 pl-6 py-2">
                Compressive tech-wear inspired by futuristic armor. Intricate sigil patterns woven into the fabric for a second-skin feel.
              </motion.p>
              <motion.ul className="space-y-6 mb-10 text-sm uppercase tracking-widest text-white/50">
                {[
                  "Tech-Mesh Compression",
                  "Woven Sigil Patterns",
                  "Thumb-Hole Cuffs"
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    variants={i % 2 === 0 ? slideInLeft : slideInRight}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                    className="flex items-center gap-4 group cursor-default"
                  >
                    <div className="w-8 h-[2px] bg-cyan-400/30 group-hover:w-12 group-hover:bg-cyan-400 transition-all duration-500 shadow-[0_0_10px_#00ffff_inset]" />
                    <span className="group-hover:text-white transition-colors duration-300">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
              <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link 
                  to="/fullsleeves"
                  className="px-6 py-3 border border-cyan-400/50 rounded-full text-cyan-400 hover:bg-cyan-400/10 transition-all uppercase tracking-widest text-xs font-bold flex justify-center items-center"
                >
                  Explore Full Sleeves
                </Link>
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px #ff00ff" }}
                  onClick={() => addToCart({ id: 'cs-02-fs', name: 'Full Sleeves Tech-Silk', price: 180 })}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full border border-purple-400 text-white hover:opacity-90 transition-all uppercase tracking-widest text-xs font-bold"
                >
                  Add to Cart
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </Section>

        {/* Footer / About Section */}
        <footer id="about" className="relative z-10 py-32 px-6 border-t border-purple-500/20 bg-black/50 overflow-hidden backdrop-blur-md">
          <motion.div style={{ y: parallaxSlow }} className="absolute inset-0 pointer-events-none">
            <DecorativeFloatingElements />
          </motion.div>
          <motion.div 
            animate={{ opacity: [0.02, 0.05, 0.02] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-screen"
          />

          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16 relative z-10">
            <motion.div 
               variants={blurIn}
               initial="initial"
               whileInView="whileInView"
               viewport={{ once: true }}
               className="col-span-2"
            >
              <div className="flex items-center gap-6 mb-8">
                <CentipedeLogo />
                <NeonText text="LUPROX" className="text-2xl font-black tracking-widest text-glow-neon text-cyan-400" />
              </div>
              <p className="text-white/50 text-sm max-w-md leading-loose tracking-wide">
                Pushing the boundaries of digital fashion through <span className="text-pink-500 font-bold text-glow-neon">sigilism</span> and futuristic design. We manifest the unstable, bridging the gap between the virtual void and tactical reality.
              </p>
              <div className="mt-12 flex gap-4 items-center">
                 <motion.div className="h-[1px] w-12 bg-gradient-to-r from-cyan-400 to-purple-500 transition-all" />
                 <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Est. 2026 / Neo-Tokyo</span>
              </div>
            </motion.div>
            
            <motion.div variants={staggerItem} initial="initial" whileInView="whileInView">
              <SlideReveal>
                <h4 className="text-[10px] uppercase tracking-[0.4em] mb-8 text-cyan-400 font-bold bg-white/5 p-2 rounded-lg text-center backdrop-blur-sm border border-cyan-400/20">Protocol</h4>
              </SlideReveal>
              <ul className="space-y-4 text-xs text-white/40 font-medium mt-4">
                <li><motion.a whileHover={{ x: 5, color: "#00ffff" }} href="#" className="inline-block transition-all">The Collection</motion.a></li>
                <li><motion.a whileHover={{ x: 5, color: "#00ffff" }} href="#" className="inline-block transition-all">Digital Archive</motion.a></li>
                <li><motion.a whileHover={{ x: 5, color: "#00ffff" }} href="#" className="inline-block transition-all">Sigil Mapping</motion.a></li>
              </ul>
            </motion.div>

            <motion.div variants={staggerItem} initial="initial" whileInView="whileInView">
              <SlideReveal>
                <h4 className="text-[10px] uppercase tracking-[0.4em] mb-8 text-pink-400 font-bold bg-white/5 p-2 rounded-lg text-center backdrop-blur-sm border border-pink-400/20">Signal</h4>
              </SlideReveal>
              <ul className="space-y-4 text-xs text-white/40 font-medium mt-4">
                <li><motion.a whileHover={{ x: 5, color: "#ff00ff" }} href="#" className="inline-block transition-all">Instagram</motion.a></li>
                <li><motion.a whileHover={{ x: 5, color: "#ff00ff" }} href="#" className="inline-block transition-all">Twitter</motion.a></li>
                <li><motion.a whileHover={{ x: 5, color: "#ff00ff" }} href="#" className="inline-block transition-all">Discord</motion.a></li>
              </ul>
            </motion.div>
          </div>
        </footer>
    </div>
  );
}
