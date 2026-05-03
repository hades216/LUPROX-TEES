import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Menu, ShoppingBag, X } from "lucide-react";
import { motion } from "motion/react";
import ThreeScene from "./components/ThreeScene";
import { CyberCentipede } from "./components/CyberCentipede";
import { SigilOverlay, MovingShadows, Scanlines, CinematicEffects, LoadingScreen, DangerBulletin, LorePopUp, CartDrawer } from "./components/UI";
import { CentipedeLogo } from "./components/CentipedeLogo";
import { Lightning } from "./components/Lightning";
import Home from "./pages/Home";
import DropDownDetails from "./pages/DropDownDetails";
import FullSleevesDetails from "./pages/FullSleevesDetails";
import { CartProvider, useCart } from "./lib/CartContext";

function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart } = useCart();

  return (
    <>
      <div className="fixed inset-0 w-full h-full overflow-hidden">
        <LoadingScreen />
        <DangerBulletin position="top" />
        <DangerBulletin position="bottom" />
        <LorePopUp />
        <CartDrawer 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onRemove={removeFromCart}
        />
        
        {/* Cinematic Overlays */}
        <div className="vignette" />
        <div className="grain" />
        <Scanlines />
        <CinematicEffects />
        <div className="fixed inset-0 pointer-events-none z-0">
          <MovingShadows />
        </div>

        {/* 3D Background */}
        <CyberCentipede />
        <ThreeScene scrollProgress={{ get: () => 0 }} />
        
        {/* Lightning Effect */}
        <Lightning />

        {/* Parallax Sigils */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]">
          <SigilOverlay />
        </div>
        
        {/* Navigation */}
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-black/20 backdrop-blur-2xl border-b border-white/5"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link to="/" className="flex items-center gap-6">
              <CentipedeLogo />
              <span className="text-xl tracking-tight text-glow-neon hidden sm:inline-block font-light text-cyan-400">LUPROX</span>
            </Link>
          </motion.div>
          
          <div className="hidden md:flex gap-8 text-xs uppercase tracking-widest text-white/70">
            {[
              { to: "/", label: "Home" },
              { to: "/dropdown", label: "Drop Down" },
              { to: "/fullsleeves", label: "Full Sleeves" },
              { href: "#about", label: "About" }
            ].map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
              >
                {link.to ? (
                  <Link to={link.to} className="hover:text-cyan-400 transition-colors">{link.label}</Link>
                ) : (
                  <a href={link.href} className="hover:text-cyan-400 transition-colors">{link.label}</a>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex items-center gap-4"
          >
            <button 
              onClick={() => setIsCartOpen(!isCartOpen)} 
              className="relative p-2 hover:bg-white/10 rounded-full transition-colors text-white"
            >
              <ShoppingBag size={20} />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-cyan-500 text-[10px] flex justify-center items-center rounded-full font-bold text-black">
                  {cartItems.reduce((acc, i) => acc + i.qty, 0)}
                </span>
              )}
            </button>
            <button 
              className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </motion.div>
        </motion.nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-3xl flex flex-col items-center justify-center gap-8 text-2xl uppercase tracking-widest text-white"
          >
            <button className="absolute top-6 right-6 p-2" onClick={() => setIsMenuOpen(false)}>
              <X size={32} />
            </button>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/dropdown" onClick={() => setIsMenuOpen(false)}>Drop Down</Link>
            <Link to="/fullsleeves" onClick={() => setIsMenuOpen(false)}>Full Sleeves</Link>
            <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
          </motion.div>
        )}

        {/* Main Content */}
        <main className="relative z-10 w-full h-full overflow-hidden">
          {children}
        </main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dropdown" element={<DropDownDetails />} />
            <Route path="/fullsleeves" element={<FullSleevesDetails />} />
          </Routes>
        </MainLayout>
      </CartProvider>
    </BrowserRouter>
  );
}
