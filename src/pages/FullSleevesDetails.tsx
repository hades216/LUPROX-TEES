import { motion } from "motion/react";
import { ChevronLeft, ShoppingCart, Star, ShieldCheck, Shirt, Box } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../lib/CartContext";
import { ProductViewer3D } from "../components/ProductViewer3D";

export default function FullSleevesDetails() {
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState<number | "3d">(0);

  const images = [
    "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1588667523910-b49bcfbc16bc?auto=format&fit=crop&q=80&w=800"
  ];

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden pt-24 pb-32 px-6">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center text-pink-400 hover:text-white transition-colors mb-10 text-sm tracking-widest uppercase">
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
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-indigo-400/20 mix-blend-overlay z-10 pointer-events-none" />
              {activeImage === "3d" ? (
                <ProductViewer3D color="#ff00ff" />
              ) : (
                <img 
                  src={images[activeImage as number]} 
                  alt="Full Sleeves View" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              {/* Fake 3D Badge */}
              {activeImage !== "3d" && (
                <button onClick={() => setActiveImage("3d")} className="absolute top-6 left-6 z-20 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-pink-400/30 text-pink-400 text-[10px] tracking-widest uppercase flex items-center gap-2 hover:bg-black/80 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" /> 3D View Available
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <button 
                  onClick={() => setActiveImage("3d")}
                  className={`aspect-square rounded-xl overflow-hidden transition-all flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 text-pink-400 ${activeImage === "3d" ? 'ring-2 ring-pink-400 opacity-100' : 'opacity-50 hover:opacity-100'}`}
                >
                  <Box size={24} className="mb-2" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">3D View</span>
              </button>
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square rounded-xl overflow-hidden transition-all ${activeImage === idx ? 'ring-2 ring-pink-400 opacity-100' : 'opacity-50 hover:opacity-100'}`}
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
              Model: CS-02-FS / Synth-Runner Collection
            </div>
            <h1 className="text-5xl md:text-7xl font-light text-glow-neon mb-6">
              FULL SLEEVES
            </h1>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-500">$180.00</span>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" />)}
              </div>
              <span className="text-white/40 text-sm">(84 Reviews)</span>
            </div>

            <p className="text-white/70 leading-relaxed mb-8 max-w-lg">
              Compressive tech-wear inspired by futuristic armor. Intricate sigil patterns woven into the fabric for a second-skin feel. Engineered with kinetic thermal regulation and synthetic musculature support.
            </p>

            <div className="space-y-4 mb-10 text-sm tracking-widest uppercase">
              <div className="flex items-center gap-4 text-white/70">
                <Shirt size={18} className="text-pink-400" />
                <span>Kinetic Composite Fabric</span>
              </div>
              <div className="flex items-center gap-4 text-white/70">
                <ShieldCheck size={18} className="text-indigo-400" />
                <span>Thermal Regulation Mesh</span>
              </div>
              <div className="flex items-center gap-4 text-white/70">
                <Star size={18} className="text-purple-400" />
                <span>Micro-Sigil Textures</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button 
                onClick={() => addToCart({ id: 'cs-02-fs', name: 'Full Sleeves Shirt', price: 180 })}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-indigo-600 rounded-full text-white font-bold tracking-widest uppercase shadow-[0_0_30px_rgba(255,0,255,0.3)] hover:shadow-[0_0_40px_rgba(255,0,255,0.5)] transition-all group"
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
