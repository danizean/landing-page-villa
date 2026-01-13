"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  ExternalLink,
  GraduationCap,
  ShoppingBag,
  Mountain,
  Coffee,
  Store,
  Zap,
  University,
} from "lucide-react";
import { ReactNode } from "react";

// --- TYPES ---
interface LocationHighlight {
  icon: ReactNode;
  text: string;
  sub: string;
  highlight: boolean;
}

// --- STATIC DATA (Moved outside component for performance) ---
const locationHighlights: LocationHighlight[] = [
  {
    icon: <GraduationCap className="w-5 h-5" />,
    text: "1 Menit ke Kampus UII",
    sub: "Pusat mahasiswa, target sewa utama.",
    highlight: true,
  },
  {
    icon: <Zap className="w-5 h-5" />,
    text: "Akses Jalan Kaliurang",
    sub: "Jalan utama wisata & kuliner Jogja.",
    highlight: false,
  },
  {
    icon: <Coffee className="w-5 h-5" />,
    text: "15 Menit ke Kopi Klotok",
    sub: "Destinasi kuliner legendaris.",
    highlight: false,
  },
  {
    icon: <ShoppingBag className="w-5 h-5" />,
    text: "15 Menit ke Sleman City Hall",
    sub: "Pusat perbelanjaan modern.",
    highlight: false,
  },
  {
    icon: <University className="w-5 h-5" />,
    text: "15 Menit ke UGM",
    sub: "Kampus negeri favorit.",
    highlight: false,
  },
  {
    icon: <Mountain className="w-5 h-5" />,
    text: "20 Menit ke Wisata Merapi",
    sub: "Jeep tour, museum, & alam.",
    highlight: false,
  },
  {
    icon: <Store className="w-5 h-5" />,
    text: "30 Menit ke Malioboro",
    sub: "Jantung kota Yogyakarta.",
    highlight: false,
  },
];

// Unused data commented out to reduce bundle size/linter warnings
/*
const investmentReasons = [
  "Captive Market Jelas (Ribuan Mahasiswa UII)",
  "Kenaikan Harga Tanah (Capital Gain) Tinggi",
  "Lokasi Favorit Wisatawan (Udara Sejuk)",
];
*/

// --- ANIMATION VARIANTS (Static) ---
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// --- SUB-COMPONENT (Memoized by default in Next.js distinct files, light enough here) ---
const LocationCard = ({ icon, text, sub, highlight }: LocationHighlight) => (
  <article
    className={`
      flex items-start gap-3 p-4 rounded-xl border transition-all duration-300
      ${
        highlight
          ? "bg-amber-50 border-amber-500 shadow-sm"
          : "bg-white border-stone-200 hover:border-amber-300 hover:shadow-md"
      }
    `}
  >
    <div
      className={`flex-shrink-0 p-2 rounded-lg mt-0.5 ${
        highlight ? "bg-amber-500 text-white" : "bg-stone-100 text-stone-500"
      }`}
      aria-hidden="true" // Icon is decorative
    >
      {icon}
    </div>
    <div>
      {/* Changed H4 to H3 for better SEO Hierarchy (H2 -> H3) */}
      <h3
        className={`text-sm sm:text-base font-bold leading-tight ${
          highlight ? "text-amber-900" : "text-stone-800"
        }`}
      >
        {text}
      </h3>
      <p className="text-xs text-stone-500 mt-1 leading-snug">{sub}</p>
    </div>
  </article>
);

export const LocationDetail = () => {
  // Schema Markup for Local SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: "Casa de Kayana",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sleman",
      addressRegion: "Yogyakarta",
      addressCountry: "ID",
    },
    description:
      "Villa eksklusif dekat kampus UII dan kawasan wisata Kaliurang.",
  };

  return (
    <section
      id="lokasi"
      className="py-20 sm:py-28 bg-[#faf9f6] relative overflow-hidden"
    >
      {/* Inject SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background Pattern - Optimized with CSS opacity instead of heavy SVG */}
      <div
        className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-[2px] bg-amber-500 inline-block rounded-full" />
              <span className="text-amber-600 font-bold text-sm tracking-widest uppercase">
                Peta Lokasi
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 font-serif leading-tight">
              Investasi Villa <br />
              <span className="text-stone-400 font-light italic">
                di Kawasan Strategis
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="max-w-md"
          >
            <p className="text-stone-600 text-base leading-relaxed border-l-2 border-stone-200 pl-4">
              Berada di Kawasan UII <strong> (Jakal)</strong>, kawasan potensial
              untuk bisnis penyewaan villa/kos. Titik temu ideal antara kawasan
              mahasiswa aktif dan destinasi wisata favorit Yogyakarta.
            </p>
          </motion.div>
        </div>

        {/* --- CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* KOLOM KIRI: DETAIL LOKASI (Span 7) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {locationHighlights.map((item, index) => (
                <LocationCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* KOLOM KANAN: PETA (Span 5 - Sticky) */}
          <div className="lg:col-span-5 w-full h-full lg:sticky lg:top-28">
            <div className="relative w-full h-[350px] lg:h-[550px] overflow-hidden rounded-3xl shadow-xl border-4 border-white bg-stone-200">
              {/* IFRAME OPTIMIZATION: Loading Lazy & Title for A11y */}
              <iframe
                title="Peta Lokasi Casa de Kayana"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.8892639018045!2d110.40762737476496!3d-7.69503189232235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5ff515647429%3A0x8baa86a35c538624!2sCasa%20De%20Kayana!5e0!3m2!1sid!2sid!4v1768290324149!5m2!1sid!2sid" // PERHATIAN: Ganti dengan link embed Google Maps asli
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full grayscale-[10%] hover:grayscale-0 transition-all duration-700"
              />

              {/* Overlay Button CTA */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-max max-w-[90%]">
                <a
                  href="https://goo.gl/maps/placeholder" // PERHATIAN: Ganti dengan link Google Maps asli
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/95 backdrop-blur-md text-stone-900 text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-all border border-stone-200 group"
                >
                  <ExternalLink
                    size={16}
                    className="text-amber-600 group-hover:text-amber-500"
                  />
                  Buka Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
