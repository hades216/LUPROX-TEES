import { motion } from "motion/react";
import { ChevronLeft, ShoppingCart, Star, ShieldCheck, Shirt, Box } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../lib/CartContext";
import { ProductViewer3D } from "../components/ProductViewer3D";

export default function DropDownDetails() {
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState<number | "3d">(0);

  const images = [
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1596755094514-f87e32f059cb?auto=format&fit=crop&q=80&w=800"
  ];

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden pt-24 pb-32 px-6">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center text-cyan-400 hover:text-white transition-colors mb-10 text-sm tracking-widest uppercase">
          <ChevronLeft className="mr-2" size={16} /> Back to Signal
        </Link>
        
        <div className="grid md:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-white/5 relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-cyan-400/20 mix-blend-overlay z-10 pointer-events-none" />
              {activeImage === "3d" ? (
                <ProductViewer3D color="#00ffff" />
              ) : (
                <img 
                  src={images[activeImage as number]} 
                  alt="Drop Down Shirt View" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              {/* Fake 3D Badge */}
              {activeImage !== "3d" && (
                <button onClick={() => setActiveImage("3d")} className="absolute top-6 left-6 z-20 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-cyan-400/30 text-cyan-400 text-[10px] tracking-widest uppercase flex items-center gap-2 hover:bg-black/80 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> 3D View Available
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <button 
                  onClick={() => setActiveImage("3d")}
                  className={`aspect-square rounded-xl overflow-hidden transition-all flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 text-cyan-400 ${activeImage === "3d" ? 'ring-2 ring-cyan-400 opacity-100' : 'opacity-50 hover:opacity-100'}`}
                >
                  <Box size={24} className="mb-2" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">3D View</span>
              </button>
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square rounded-xl overflow-hidden transition-all ${activeImage === idx ? 'ring-2 ring-cyan-400 opacity-100' : 'opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-4 text-xs font-mono text-white/40 tracking-widest uppercase">
              Model: CS-01-DD / Neo-Tokyo Collection
            </div>
            <h1 className="text-5xl md:text-7xl font-light text-glow-neon mb-6">
              DROP DOWN
            </h1>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">$120.00</span>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" />)}
              </div>
              <span className="text-white/40 text-sm">(42 Reviews)</span>
            </div>

            <p className="text-white/70 leading-relaxed mb-8 max-w-lg">
              The 'Drop Down' shirt represents the pinnacle of urban cyber-wear. Constructed from 100% heavyweight comb-cotton with an oversized boxy fit, featuring reactive sigil printing that glows intensely under UV light. Includes integrated NFC tag in the hem for digital authentication.
            </p>

            <div className="space-y-4 mb-10 text-sm tracking-widest uppercase">
              <div className="flex items-center gap-4 text-white/70">
                <Shirt size={18} className="text-cyan-400" />
                <span>Heavyweight 320gsm Cotton</span>
              </div>
              <div className="flex items-center gap-4 text-white/70">
                <ShieldCheck size={18} className="text-purple-400" />
                <span>NFC Authenticated Asset</span>
              </div>
              <div className="flex items-center gap-4 text-white/70">
                <Star size={18} className="text-pink-400" />
                <span>UV-Reactive Sigil Prints</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button 
                onClick={() => addToCart({ id: 'cs-01-dd', name: 'Drop Down Shirt', price: 120 })}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-white font-bold tracking-widest uppercase shadow-[0_0_30px_rgba(0,255,255,0.3)] hover:shadow-[0_0_40px_rgba(0,255,255,0.5)] transition-all group"
              >
                <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                Add to Cart
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
