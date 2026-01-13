"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  MapPin,
  MousePointer2,
  TrendingUp,
  Sparkles,
} from "lucide-react";

// --- ASSETS ---
// Pastikan path ini benar di project Anda
import VillaExterior from "../assets/images/fasad.png";
import LivingRoom from "../assets/images/fasad-unit.png";
import Bedroom from "../assets/images/private-pool.png";

const images = [
  {
    src: VillaExterior,
    alt: "Fasad Casa de Kayana - Villa Bohemian Modern Jogja Dekat UII",
    priority: true, // Hanya gambar pertama yang diprioritaskan untuk LCP
  },
  {
    src: LivingRoom,
    alt: "Interior Mewah Casa de Kayana - Passive Income Stabil di Yogyakarta",
    priority: false,
  },
  {
    src: Bedroom,
    alt: "Private Pool Villa Casa de Kayana - Aset Produktif Sertifikat Aman",
    priority: false,
  },
];

// --- ANIMATIONS ---
// Defined outside component to prevent recreation on render
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const bgVariants = {
  initial: { opacity: 0, scale: 1.1 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0 },
};

export const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  // Memoized function for slide change
  const nextSlide = useCallback(() => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    // ID 'hero' untuk anchor link. h-[100dvh] untuk mobile browser toolbar support.
    <header
      id="hero"
      className="relative w-full h-[100dvh] min-h-[600px] overflow-hidden bg-gray-950 font-sans"
    >
      {/* --- BACKGROUND SLIDER --- */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentImage}
            variants={bgVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 1.5, ease: "easeOut" }} // Durasi sedikit dipercepat agar tidak terasa 'lag'
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={images[currentImage].src}
              alt={images[currentImage].alt}
              fill
              priority={images[currentImage].priority}
              sizes="100vw"
              quality={85} // Turunkan sedikit dari 90 ke 85 (kasat mata sama, file size jauh lebih kecil)
              className="object-cover"
              placeholder="blur" // Opsional: jika import static, nextjs otomatis generate blurDataURL
            />
            {/* Gradient Overlays combined to reduce DOM nodes if possible, but kept separate for specific layering */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/50 to-black/20" />
            <div className="absolute inset-0 bg-black/10" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 flex h-full items-center px-4 sm:px-10 lg:px-16">
        <div className="container mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-3xl lg:max-w-4xl pt-16 sm:pt-0" // Tambah padding top di mobile agar tidak ketabrak navbar
          >
            {/* 1. BADGES (Trust & Location) */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center gap-3 mb-6"
            >
              <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-gray-100">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500" />
                <span>1 Menit dari Kampus UII</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-amber-400">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Bohemian Modern Concept</span>
              </div>
            </motion.div>

            {/* 2. HEADLINE (Selling Point Utama) */}
            <motion.h1
              variants={fadeInUp}
              className="font-extrabold text-white text-[clamp(2.5rem,5vw,5rem)] leading-[1.1] tracking-tight mb-4 sm:mb-6 drop-shadow-xl"
            >
              Villa Eksklusif <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
                Private Pool 250 Juta
              </span>
            </motion.h1>

            {/* 3. SUB-HEADLINE (Value Proposition) */}
            <motion.p
              variants={fadeInUp}
              className="text-gray-100 text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed mb-8 sm:mb-10 font-medium drop-shadow-md opacity-90"
            >
              <strong>Casa de Kayana</strong> hadir sebagai solusi investasi
              cerdas. Hunian estetik dengan fasilitas lengkap, lokasi strategis
              di Jakal, dan skema pembayaran <strong>Tanpa DP</strong> yang aman
              & transparan.
            </motion.p>

            {/* 4. CTA SECTION */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              {/* BUTTON CTA */}
              <a
                href="#konsep"
                title="Lihat Detail Casa de Kayana"
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-amber-500 px-8 py-3.5 text-lg font-bold text-gray-950 shadow-[0_4px_15px_rgba(245,158,11,0.3)] transition-all duration-300 hover:bg-amber-400 hover:shadow-[0_6px_20px_rgba(245,158,11,0.4)] hover:-translate-y-0.5"
              >
                <span>Lihat Detail Unit</span>
                <ArrowRight className="h-5 w-5 stroke-[2.5px] transition-transform group-hover:translate-x-1" />

                {/* Shine Effect */}
                <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                  <div className="absolute -left-full top-0 h-full w-full skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50 transition-all duration-700 group-hover:left-full" />
                </div>
              </a>

              {/* Trust Signal - Hidden on very small screens if needed, but kept for value prop */}
              <div className="flex flex-col gap-1 pl-4 border-l-2 border-white/20 w-full sm:w-auto">
                <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-gray-200">
                  <TrendingUp className="h-4 w-4 text-green-400 shrink-0" />
                  <span>Potensi ROI Tinggi</span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-gray-200">
                  <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>Legalitas Aman (Hak Pakai 20 Tahun)</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* --- SCROLL INDICATOR --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold">
          Scroll Down
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-full border border-white/20 bg-white/5 p-1.5 backdrop-blur-sm"
        >
          <MousePointer2 className="h-4 w-4 text-amber-400" />
        </motion.div>
      </motion.div>

      {/* --- SIDE PROGRESS (Hidden on Mobile) --- */}
      <div className="absolute bottom-1/2 translate-y-1/2 right-6 sm:right-10 z-20 flex flex-col gap-3 hidden sm:flex">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            aria-label={`Lihat gambar ke-${index + 1}`}
            className="group flex items-center gap-4 outline-none focus:ring-2 focus:ring-amber-500 rounded-full"
          >
            <div
              className={`w-1 rounded-full transition-all duration-500 ease-out ${
                currentImage === index
                  ? "bg-amber-500 h-12 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                  : "bg-white/20 h-6 group-hover:bg-white/50"
              }`}
            />
          </button>
        ))}
      </div>
    </header>
  );
};
