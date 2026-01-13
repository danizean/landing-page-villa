"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Maximize2,
  X,
  Map as MapIcon,
  LayoutTemplate,
  BrickWall,
  BedDouble,
  Armchair,
  Umbrella,
  DoorOpen,
  Waves,
  Mountain,
  Grid3X3,
  MoveVertical,
  PanelTop,
} from "lucide-react";

// --- IMPORT ASSETS ---
import SiteplanImg from "../assets/images/Denah Villa.png";
import UnitPlanImg from "../assets/images/Denah Kamar.png";

// --- DATA ---
const plans = [
  {
    id: "siteplan",
    title: "Siteplan",
    label: "Kawasan Eksklusif",
    desc: "One Gate System dengan akses jalan lebar, parkir luas, dan lobby resepsionis.",
    src: SiteplanImg,
    icon: <MapIcon className="w-4 h-4" />,
  },
  {
    id: "unit",
    title: "Layout Unit",
    label: "Type 30 Full Furnished",
    desc: "Desain efisien memaksimalkan ruang: Private Pool, Teras Santai, dan Kamar Luas.",
    src: UnitPlanImg,
    icon: <LayoutTemplate className="w-4 h-4" />,
  },
];

const techSpecs = [
  {
    icon: <BrickWall size={18} />,
    label: "Dinding",
    val: "Bata Ringan (Hebel)",
  },
  {
    icon: <MoveVertical size={18} />,
    label: "Struktur",
    val: "Beton Bertulang",
  },
  { icon: <Grid3X3 size={18} />, label: "Lantai", val: "Granit 60x60" },
  {
    icon: <Armchair size={18} />,
    label: "Interior",
    val: "Full Furnished Jati",
  },
  {
    icon: <BedDouble size={18} />,
    label: "Bedding",
    val: "King Size Standar Hotel",
  },
  { icon: <Umbrella size={18} />, label: "Atap", val: "Dak Beton (Cor)" },
  { icon: <PanelTop size={18} />, label: "Plafon", val: "PVC Motif Kayu" },
  {
    icon: <DoorOpen size={18} />,
    label: "Pintu",
    val: "Kayu Solid Engineering",
  },
  { icon: <Waves size={18} />, label: "Pool", val: "Cor Beton" },
  { icon: <Mountain size={18} />, label: "Fasad", val: "Batu Alam Andesit" },
];

export const FasilitasSection = () => {
  const [activePlan, setActivePlan] = useState(plans[0].id);
  const [isZoomed, setIsZoomed] = useState(false);

  const currentData = plans.find((p) => p.id === activePlan) || plans[0];

  // Fix: Lock Body Scroll when Modal Open & Handle ESC Key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomed(false);
    };

    if (isZoomed) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isZoomed]);

  return (
    // ID disesuaikan dengan Navbar Link: #layout
    <section id="layout" className="py-20 sm:py-28 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-[2px] bg-amber-500 inline-block rounded-full"></span>
              <span className="text-amber-600 font-bold text-sm tracking-widest uppercase">
                Layout & Konstruksi
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 font-serif leading-tight">
              Desain Efisien, <br />
              <span className="text-stone-400 italic font-light">
                Material Tahan Lama
              </span>
            </h2>
          </motion.div>

          {/* Bagian Kanan: Deskripsi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-md"
          >
            <p className="text-stone-600 text-base leading-relaxed border-l-2 border-stone-200 pl-4">
              Kami memprioritaskan material <i>low-maintenance</i> (minim
              perawatan) agar aset properti Anda tetap awet dan menekan biaya
              operasional jangka panjang.
            </p>
          </motion.div>
        </div>

        {/* --- MAIN CONTENT: TABS & VIEWER --- */}
        <div className="bg-stone-50 rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
          {/* 1. Tab Navigation - Accessible Role */}
          <div className="flex border-b border-stone-200" role="tablist">
            {plans.map((plan) => {
              const isActive = activePlan === plan.id;
              return (
                <button
                  key={plan.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${plan.id}`}
                  onClick={() => setActivePlan(plan.id)}
                  className={`flex-1 py-4 px-2 sm:px-6 text-sm sm:text-base font-bold flex items-center justify-center gap-2 transition-all relative outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 ${
                    isActive
                      ? "text-amber-700 bg-amber-50/50"
                      : "text-stone-500 hover:bg-stone-100"
                  }`}
                >
                  {plan.icon}
                  <span>{plan.title}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 rounded-t-full"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* 2. Content Area */}
          <div
            className="flex flex-col lg:flex-row"
            role="tabpanel"
            id={`panel-${currentData.id}`}
          >
            {/* Image Viewer */}
            <div
              className="w-full lg:w-2/3 bg-white relative group cursor-zoom-in border-b lg:border-b-0 lg:border-r border-stone-200 p-4 sm:p-6 min-h-[300px] flex items-center justify-center"
              onClick={() => setIsZoomed(true)}
              role="button"
              aria-label={`Perbesar gambar ${currentData.title}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setIsZoomed(true);
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentData.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full aspect-[4/3] sm:aspect-[16/9]"
                >
                  <Image
                    src={currentData.src}
                    alt={currentData.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 800px"
                    priority // Image ini penting di fold atas (relatif terhadap scroll posisi)
                  />
                </motion.div>
              </AnimatePresence>

              {/* Zoom Hint */}
              <div className="absolute bottom-4 right-4 bg-stone-900/80 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-lg pointer-events-none transition-opacity opacity-70 group-hover:opacity-100">
                <Maximize2 size={12} /> Tap untuk perbesar
              </div>
            </div>

            {/* Description Sidebar */}
            <div className="w-full lg:w-1/3 p-6 lg:p-8 flex flex-col justify-center bg-[#fffdf9]">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-stone-900 mb-1">
                  {currentData.label}
                </h3>
                <div className="h-1 w-12 bg-amber-500 rounded-full mb-3" />
                <p className="text-stone-600 text-sm leading-relaxed">
                  {currentData.desc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: TECH SPECS GRID --- */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-lg font-bold text-stone-800">
              Spesifikasi Material Utama
            </h3>
            <p className="text-sm text-stone-500">
              Standar bangunan komersial untuk daya tahan maksimal.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
            {techSpecs.map((spec, idx) => (
              <div
                key={idx}
                className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col items-center text-center hover:border-amber-300 transition-colors"
              >
                <div className="text-amber-500 mb-2 bg-amber-50 p-2 rounded-full">
                  {spec.icon}
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                    {spec.label}
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-stone-800 mt-0.5 leading-tight">
                    {spec.val}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- MODAL ZOOM (Portal Candidate) --- */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-stone-950/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setIsZoomed(false)}
            aria-modal="true"
            role="dialog"
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white"
              onClick={() => setIsZoomed(false)}
              aria-label="Tutup zoom"
            >
              <X size={24} />
            </button>
            <div
              className="relative w-full max-w-5xl h-auto max-h-[85vh] cursor-default"
              onClick={(e) => e.stopPropagation()} // Prevent close when clicking image
            >
              <Image
                src={currentData.src}
                alt={`Zoom View ${currentData.title}`}
                width={1200}
                height={800}
                className="object-contain w-full h-full rounded-lg"
                quality={90}
              />
              <p className="text-center text-white/80 mt-4 font-medium text-sm">
                {currentData.label}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
