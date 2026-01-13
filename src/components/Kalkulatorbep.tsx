"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { NumericFormat } from "react-number-format";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Calendar, ChevronDown, BadgePercent } from "lucide-react";

// --- Helper Function ---
const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

// --- Konstanta (UPDATED HARGA PROMO) ---
const MODAL_INVESTASI = 250_000_000; // Harga Promo 250 Juta
const BIAYA_OPERASIONAL_PERSEN = 0.25; // 25% Biaya Ops
const BAGI_HASIL_INVESTOR_PERSEN = 0.7; // 70% Investor

export function BEPCalculator() {
  const [hargaSewa, setHargaSewa] = useState(350_000); // Default harga sewa harian realistis
  const [hariTerisi, setHariTerisi] = useState(20); // Default okupansi ~66%
  const [showDetails, setShowDetails] = useState(false);

  // Ref untuk tracking view
  const sectionRef = useRef<HTMLElement>(null);
  const hasTracked = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasTracked.current) {
          // GTM Event Trigger
          if (typeof window !== "undefined" && (window as any).dataLayer) {
            (window as any).dataLayer.push({
              event: "view_roi_section",
              section: "calculator_bep",
              interest_level: "high",
            });
          }
          hasTracked.current = true;
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // --- Kalkulasi Inti ---
  const {
    pendapatanKotor,
    biayaOperasional,
    profitBersih,
    investorBulanan,
    bepTahun,
    roiPersen,
  } = useMemo(() => {
    const gross = hariTerisi * hargaSewa;
    const operational = gross * BIAYA_OPERASIONAL_PERSEN;
    const net = gross - operational;
    const investor = net * BAGI_HASIL_INVESTOR_PERSEN;
    
    // Kalkulasi ROI & BEP
    const tahunan = investor * 12;
    const bep = tahunan > 0 ? MODAL_INVESTASI / tahunan : 0;
    const roi = (tahunan / MODAL_INVESTASI) * 100;

    return {
      pendapatanKotor: gross,
      biayaOperasional: operational,
      profitBersih: net,
      investorBulanan: investor,
      bepTahun: bep > 0 ? bep.toFixed(1) : "N/A",
      roiPersen: roi > 0 ? roi.toFixed(1) : "0",
    };
  }, [hargaSewa, hariTerisi]);

  return (
    <section
      ref={sectionRef}
      id="kalkulator"
      className="py-20 bg-slate-900 relative overflow-hidden"
      aria-labelledby="kalkulator-heading"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.1),transparent)] pointer-events-none" />

      <div className="container px-6 mx-auto relative z-10">
        
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center mb-14"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-bold tracking-widest uppercase mb-4 border border-yellow-500/30">
            Simulasi Profit
          </span>
          <h2
            id="kalkulator-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white"
          >
            Kalkulasi <span className="text-yellow-400">Balik Modal</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Hitung sendiri potensi <i>Passive Income</i> bulanan Anda dengan harga promo saat ini.
          </p>
        </motion.div>

        {/* Card Kalkulator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl p-6 sm:p-10 rounded-3xl shadow-2xl border border-white/10"
        >
          {/* Hasil Utama (Grid 3 Kolom di Desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-10">
            
            {/* Profit Bulanan */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-sm font-semibold text-slate-400 flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" /> Profit Investor / Bulan
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                {formatRupiah(investorBulanan)}
              </p>
            </div>

            {/* Estimasi BEP */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-sm font-semibold text-slate-400 flex items-center justify-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-400" /> Balik Modal (BEP)
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                {bepTahun} <span className="text-sm font-medium text-slate-400">Tahun</span>
              </p>
            </div>

            {/* ROI Tahunan */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-sm font-semibold text-slate-400 flex items-center justify-center gap-2 mb-2">
                <BadgePercent className="w-4 h-4 text-yellow-400" /> ROI Tahunan
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-yellow-400">
                {roiPersen}%
              </p>
            </div>

          </div>

          {/* Input & Slider */}
          <div className="space-y-8 pb-4 border-b border-white/10">
            {/* Harga Sewa Input */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Harga Sewa Rata-rata / Malam
              </label>
              <NumericFormat
                value={hargaSewa}
                onValueChange={({ floatValue }) => setHargaSewa(floatValue ?? 0)}
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp "
                className="w-full px-4 py-3 text-lg font-semibold bg-black/30 border border-white/20 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition"
              />
            </div>

            {/* Slider Okupansi */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <label className="text-sm font-bold text-slate-300">
                  Okupansi (Hari Terisi / Bulan)
                </label>
                <span className="text-xl font-bold text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-lg border border-yellow-400/20">
                  {hariTerisi} Hari
                </span>
              </div>
              
              <Slider
                min={1}
                max={30}
                value={hariTerisi}
                onChange={(v) => setHariTerisi(Number(v))}
                trackStyle={{ backgroundColor: "#facc15", height: 10, borderRadius: 5 }}
                handleStyle={{
                  borderColor: "#facc15",
                  height: 24,
                  width: 24,
                  marginTop: -7,
                  backgroundColor: "#fff",
                  opacity: 1,
                  boxShadow: "0 0 10px rgba(250, 204, 21, 0.5)",
                }}
                railStyle={{ backgroundColor: "rgba(255,255,255,0.1)", height: 10, borderRadius: 5 }}
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                <span>Sepi (1 Hari)</span>
                <span>Normal (15 Hari)</span>
                <span>Full (30 Hari)</span>
              </div>
            </div>
          </div>

          {/* Detail Breakdown Dropdown */}
          <div className="mt-6">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex justify-center items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <span>{showDetails ? "Sembunyikan" : "Lihat"} Rincian Perhitungan</span>
              <motion.div animate={{ rotate: showDetails ? 180 : 0 }}>
                <ChevronDown size={16} />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: "20px" }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 bg-black/40 p-5 rounded-xl text-sm border border-white/5">
                    <div className="flex justify-between text-slate-300">
                      <span>Pendapatan Kotor (Omset):</span>
                      <span className="font-semibold text-white">{formatRupiah(pendapatanKotor)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Biaya Operasional (25%):</span>
                      <span className="font-semibold text-red-400">- {formatRupiah(biayaOperasional)}</span>
                    </div>
                    <div className="h-px bg-white/10 my-1" />
                    <div className="flex justify-between text-slate-200">
                      <span>Profit Bersih Total:</span>
                      <span className="font-bold text-white">{formatRupiah(profitBersih)}</span>
                    </div>
                    <div className="flex justify-between text-yellow-200 font-medium">
                      <span>Bagian Investor (70%):</span>
                      <span className="font-bold text-yellow-400">{formatRupiah(investorBulanan)}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </motion.div>
      </div>
    </section>
  );
}