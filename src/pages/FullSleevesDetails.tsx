import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function FullSleevesDetails() {
  return (
    <div className="min-h-screen bg-black text-white p-10 mt-20">
      <Link to="/" className="flex items-center text-maroon-600 mb-10"><ChevronLeft /> Back</Link>
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-6xl font-black mb-6">FULL SLEEVES</motion.h1>
      <p className="text-white/70 max-w-2xl text-lg">Compressive tech-wear inspired by futuristic armor. Intricate sigil patterns woven into the fabric for a second-skin feel.</p>
    </div>
  );
}
