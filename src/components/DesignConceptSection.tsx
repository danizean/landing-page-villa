"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// --- IMPORT ASSETS ---
// Pastikan path sesuai dengan struktur folder project Anda
import AreaDepanImg from "../assets/images/fasad.png";
import LobbyImg from "../assets/images/lobby.png";
import CorridorImg from "../assets/images/corridor.png";
import FasadImg from "../assets/images/fasad-unit.png";
import TerraceImg from "../assets/images/terrace.png";
import PoolImg from "../assets/images/private-pool.png";
import BedroomImg from "../assets/images/bedroom.png";
import PantryImg from "../assets/images/pantry.png";
import BathroomImg from "../assets/images/bathroom.png";

const galleryItems = [
  {
    id: 6,
    title: "Private Pool Unit",
    category: "Nilai Jual Tinggi",
    src: PoolImg,
    desc: "Fitur mewah yang menaikkan harga sewa harian secara signifikan.",
  },
  {
    id: 7,
    title: "Kamar Tidur Nyaman",
    category: "Standar Hotel",
    src: BedroomImg,
    desc: "Pencahayaan & layout dirancang agar betah tinggal lama.",
  },
  {
    id: 4,
    title: "Fasad Bohemian",
    category: "Timeless Design",
    src: FasadImg,
    desc: "Desain estetik yang tidak membosankan & minim biaya perawatan.",
  },
  {
    id: 1,
    title: "One Gate System",
    category: "Keamanan 24 Jam",
    src: AreaDepanImg,
    desc: "Keamanan terjamin dengan pos satpam & CCTV.",
  },
  {
    id: 8,
    title: "Compact Pantry",
    category: "Fasilitas Lengkap",
    src: PantryImg,
    desc: "Memudahkan penghuni menyiapkan makanan, hemat pengeluaran.",
  },
  {
    id: 2,
    title: "Managed Lobby",
    category: "Operasional Mudah",
    src: LobbyImg,
    desc: "Area penerimaan tamu yang dikelola manajemen, investor terima beres.",
  },
  {
    id: 9,
    title: "Modern Sanitary",
    category: "Mudah Dibersihkan",
    src: BathroomImg,
    desc: "Menggunakan sanitair berkualitas yang awet dan mudah perawatannya.",
  },
  {
    id: 3,
    title: "Koridor Estetik",
    category: "Instagramable",
    src: CorridorImg,
    desc: "Lorong unit yang terang, bersih, dan menarik untuk konten media sosial.",
  },
  {
    id: 5,
    title: "Teras Santai",
    category: "Ruang Terbuka",
    src: TerraceImg,
    desc: "Area sirkulasi udara yang baik untuk kesehatan penghuni.",
  },
];

export const DesignConceptSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Optimized Scroll Checker
  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      checkScroll();
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      // Scroll lebih jauh karena kartu sekarang lebih lebar (500px + gap)
      const scrollAmount = 520;
      scrollRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="konsep"
      className="py-20 sm:py-32 bg-white relative overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#fffdf9] to-white z-0 pointer-events-none" />

      {/* Gunakan max-w-7xl agar selaras dengan section Layout & Lokasi */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* --- 1. HEADER SECTION --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-[2px] bg-amber-500 inline-block rounded-full"></span>
              <span className="text-amber-600 font-bold text-sm tracking-widest uppercase">
                Konsep Villa
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 mb-6 font-serif leading-tight">
              Bohemian Modern <br className="hidden sm:block" />
              <span className="text-stone-400 font-light italic">
                Living Experience
              </span>
            </h2>

            <div className="prose prose-stone text-stone-600 leading-relaxed text-base sm:text-lg max-w-2xl">
              <p>
                Casa de Kayana dirancang bukan hanya untuk &quot;terlihat
                bagus&quot;, tapi untuk
                <strong> meminimalkan biaya perawatan</strong> jangka panjang.
                Kombinasi desain <i>Timeless</i> dan material berkualitas
                memastikan aset Anda tetap bernilai tinggi.
              </p>
            </div>
          </motion.div>

          {/* Navigation Arrows (Desktop Only) */}
          <div className="hidden lg:flex gap-3 mb-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Geser kiri"
              className={`w-14 h-14 rounded-full border border-stone-200 flex items-center justify-center transition-all ${
                !canScrollLeft
                  ? "text-stone-300 cursor-not-allowed opacity-50 bg-stone-50"
                  : "text-stone-600 hover:bg-amber-500 hover:text-white hover:border-amber-500 shadow-sm active:scale-95"
              }`}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Geser kanan"
              className={`w-14 h-14 rounded-full border border-stone-200 flex items-center justify-center transition-all ${
                !canScrollRight
                  ? "text-stone-300 cursor-not-allowed opacity-50 bg-stone-50"
                  : "text-stone-600 hover:bg-amber-500 hover:text-white hover:border-amber-500 shadow-sm active:scale-95"
              }`}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* --- 2. GALLERY SLIDER (WIDER & ALIGNED) --- */}
        {/* PERBAIKAN ALIGNMENT:
            - Menghapus negative margin pada desktop (lg:mx-0) agar slider start tepat di garis grid container.
            - Tetap menggunakan negative margin di mobile (-mx-4) agar full bleed edge-to-edge.
        */}
        <div
          ref={scrollRef}
          className="
            flex gap-5 sm:gap-6 overflow-x-auto pb-10 snap-x snap-mandatory scroll-smooth 
            -mx-4 px-4 
            lg:mx-0 lg:px-0 
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
          "
        >
          {galleryItems.map((item) => (
            <div
              key={item.id}
              tabIndex={0}
              className="
                relative flex-shrink-0 snap-center rounded-2xl overflow-hidden group border border-stone-100 bg-stone-50
                /* MOBILE: Tetap Portrait agar muat di layar HP */
                w-[85vw] aspect-[4/5]
                /* DESKTOP: Menjadi Landscape (Wide) agar lebih 'mahal' & detail terlihat */
                sm:w-[500px] sm:aspect-[16/10]
                cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500
                shadow-sm hover:shadow-lg transition-all duration-500
              "
            >
              <Image
                src={item.src}
                alt={`${item.title} - Casa de Kayana`}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 85vw, 500px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Enhanced Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full text-white transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-300 border border-white/10 shadow-sm">
                    <Sparkles size={12} /> {item.category}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold leading-tight mb-2 text-white">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-stone-200 leading-snug line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}

          {/* Spacer kanan untuk mobile & desktop agar card terakhir tidak mentok tepi */}
          <div className="w-1 shrink-0" />
        </div>

        {/* --- 3. MOBILE HINT --- */}
        <div className="lg:hidden flex items-center justify-center gap-2 mt-[-10px] text-stone-400 text-xs font-medium animate-pulse">
          <span>Geser untuk melihat detail</span> <ArrowRight size={14} />
        </div>
      </div>
    </section>
  );
};
