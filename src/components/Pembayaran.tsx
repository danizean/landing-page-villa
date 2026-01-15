"use client";

import { useState, useRef } from "react";
import { formatRupiah } from "../lib/formatRupiah";
import { motion } from "framer-motion";
import {
  CheckCircle,
  User,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  Coffee,
  Building2,
  Key,
  Ban,
  TrendingUp,
  Calculator,
  PieChart,
  ChevronRight,
  Lock,
  Info,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";

// --- STATIC DATA ---
const PRICE_TOTAL = 250_000_000;
const BOOKING_FEE = 5_000_000;
const PELUNASAN = PRICE_TOTAL - BOOKING_FEE;

const HARGA_SEWA = 500_000;
const HARI_TERISI = 15; // 50% Occupancy

// Monthly Calc
const OMSET_BULANAN = HARGA_SEWA * HARI_TERISI;
const OPERASIONAL_TOTAL = 100_000 * HARI_TERISI;
const MANAGEMENT_TOTAL = 120_000 * HARI_TERISI;
const NET_INVESTOR_BULAN = 280_000 * HARI_TERISI;

// Yearly Calc
const NET_INVESTOR_TAHUN = NET_INVESTOR_BULAN * 12;
const BALIK_MODAL_TAHUN = PRICE_TOTAL / NET_INVESTOR_TAHUN;

const PAYMENT_STEPS = [
  {
    step: 1,
    title: "Booking Fee",
    amount: BOOKING_FEE,
    desc: "Tanda jadi pemesanan unit.",
    icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
    highlight: false,
  },
  {
    step: 2,
    title: "Progres Pembangunan",
    amount: 0,
    desc: "Unit dibangun tanpa membebani cashflow Anda. 100% Bebas Risiko.",
    icon: <Building2 className="w-6 h-6 text-blue-500" />,
    highlight: true,
    customText: "TANPA DP / Termin",
  },
  {
    step: 3,
    title: "Pelunasan Unit",
    amount: PELUNASAN,
    desc: "Dibayarkan lunas HANYA saat unit sudah jadi & siap serah terima.",
    icon: <Key className="w-6 h-6 text-amber-500" />,
    highlight: false,
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// --- SUB-COMPONENT: FORM KONSULTASI ---
const InlinePromoForm = () => {
  const [form, setForm] = useState({
    nama: "",
    domisili: "",
    whatsapp: "",
    jadwal: "",
    keterangan: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phonePattern = /^(?:\+62|0)[0-9]{9,14}$/;

    if (!form.nama || !form.whatsapp) {
      toast.error("Mohon lengkapi Nama & WhatsApp.");
      return;
    }
    if (!phonePattern.test(form.whatsapp)) {
      toast.error("Nomor WhatsApp tidak valid.");
      return;
    }

    setIsSubmitting(true);

    try {
      let finalKeterangan = form.keterangan.trim();
      if (form.jadwal) {
        const tgl = new Date(form.jadwal).toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        finalKeterangan = `[Request Jadwal: ${tgl}] \n${finalKeterangan}`;
      }

      const { error } = await supabase.from("leads").insert({
        nama: form.nama.trim(),
        domisili: form.domisili.trim(),
        whatsapp: form.whatsapp.trim(),
        keterangan: finalKeterangan,
        source: "Payment Page (Promo 250jt)",
        status: "Baru",
      });

      if (error) throw new Error(error.message);

      toast.success("Permintaan terkirim. Admin akan segera menghubungi Anda.");
      setForm({
        nama: "",
        domisili: "",
        whatsapp: "",
        jadwal: "",
        keterangan: "",
      });
    } catch (error: any) {
      console.error("Submit Error:", error);
      toast.error("Gagal kirim data. Silakan coba via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden ring-1 ring-stone-900/5">
      {/* Header Form */}
      <div className="bg-stone-900 p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none transform rotate-12">
          <Coffee size={140} className="text-white" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-amber-500 text-stone-900 text-[11px] font-bold px-3 py-1 rounded-full shadow-lg animate-pulse border border-amber-400">
              HANYA 9 UNIT!
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
            Amankan Unit Sekarang!
          </h3>
          <p className="text-stone-300 text-sm sm:text-base max-w-md leading-relaxed">
            Isi data di bawah untuk amankan unit & jadwal survey lokasi.
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-5">
        <div className="space-y-4">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-stone-800 transition-colors" />
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Nama Lengkap"
              className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-800 focus:bg-white outline-none text-base transition-all placeholder:text-stone-400"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-stone-800 transition-colors" />
              <input
                type="tel"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="WhatsApp"
                className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-800 focus:bg-white outline-none text-base transition-all placeholder:text-stone-400"
                required
              />
            </div>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-stone-800 transition-colors" />
              <input
                type="text"
                name="domisili"
                value={form.domisili}
                onChange={handleChange}
                placeholder="Domisili"
                className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-800 focus:bg-white outline-none text-base transition-all placeholder:text-stone-400"
              />
            </div>
          </div>

          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 pointer-events-none z-10 group-focus-within:text-stone-800 transition-colors" />
            <input
              ref={dateInputRef}
              type="date"
              name="jadwal"
              min={today}
              value={form.jadwal}
              onChange={handleChange}
              onClick={() => dateInputRef.current?.showPicker()}
              className={`w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-800 focus:bg-white outline-none text-base cursor-pointer transition-all
                ${!form.jadwal ? "text-transparent" : "text-stone-800"}
              `}
            />
            {!form.jadwal && (
              <span
                onClick={() => dateInputRef.current?.showPicker()}
                className="absolute left-12 top-1/2 -translate-y-1/2 text-base text-stone-400 pointer-events-none bg-transparent pr-2"
              >
                Jadwalkan Survey (Opsional)
              </span>
            )}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-stone-900 hover:bg-stone-800 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-stone-900/10 transition-all disabled:opacity-70 flex items-center justify-center gap-2 group"
        >
          {isSubmitting ? (
            "Mengirim..."
          ) : (
            <>
              <Lock size={20} className="text-amber-500" /> Amankan Unit
              Sekarang!{" "}
              <ChevronRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </>
          )}
        </motion.button>

        <p className="text-xs text-stone-400 text-center flex items-center justify-center gap-1.5 pt-2">
          <ShieldCheck size={14} /> Data Anda dijamin aman & rahasia.
        </p>
      </form>
    </div>
  );
};

export default function PembayaranPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: "Investasi Villa Casa de Kayana",
    price: PRICE_TOTAL,
    priceCurrency: "IDR",
    availability: "https://schema.org/LimitedAvailability",
    description:
      "Investasi properti villa di Jogja harga 250 Juta, Tanpa DP, Potensi ROI ~20%.",
  };

  return (
    <section
      id="pembayaran"
      className="py-20 sm:py-32 bg-white relative overflow-hidden"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Ambient Background */}
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] bg-amber-50/60 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] -left-[10%] w-[400px] h-[400px] bg-stone-50/80 rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-10 h-[3px] bg-amber-500 inline-block rounded-full"></span>
              <span className="text-amber-600 font-bold text-sm tracking-widest uppercase">
                Investasi & Pembayaran
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 font-serif leading-[1.15]">
              Skema Aman, <br />
              <span className="text-stone-400 italic font-light">
                Profit Transparan
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-md"
          >
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed border-l-4 border-amber-500/30 pl-6">
              Kami menawarkan keamanan transaksi tertinggi. Cukup Booking Fee,
              sisanya dilunasi setelah bangunan berdiri.{" "}
              <strong className="text-stone-900">
                Tanpa DP, Tanpa Risiko Mangkrak.
              </strong>
            </p>
          </motion.div>
        </div>

        {/* --- CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* KOLOM KIRI (Konten Utama) - Span 7 */}
          <div className="lg:col-span-7 space-y-10">
            {/* Price Highlight */}
            <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-4">
              <div>
                <p className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-2">
                  Harga Launching Unit Villa
                </p>
                <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-amber-500 tracking-tight">
                  {formatRupiah(PRICE_TOTAL)}
                </p>
              </div>
            </div>

            {/* Payment Steps Timeline */}
            <div className="relative space-y-6">
              <div className="absolute left-[2.25rem] top-8 bottom-8 w-0.5 bg-stone-200 hidden sm:block z-0" />

              {PAYMENT_STEPS.map((item, index) => (
                <motion.article
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  key={index}
                  className={`relative z-10 p-6 sm:p-8 rounded-3xl border flex flex-col sm:flex-row items-start gap-6 transition-all duration-300 group
                    ${
                      item.highlight
                        ? "bg-amber-50/50 border-amber-200 shadow-lg shadow-amber-100/50"
                        : "bg-white border-stone-100 hover:border-stone-300 hover:shadow-md"
                    }
                  `}
                >
                  <div
                    className={`p-4 rounded-2xl flex-shrink-0 shadow-sm ${
                      item.highlight
                        ? "bg-amber-100 text-amber-600"
                        : "bg-stone-50 text-stone-500 group-hover:bg-stone-100"
                    }`}
                  >
                    {item.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h4 className="font-bold text-stone-900 text-xl">
                        {item.title}
                      </h4>
                      {item.highlight && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm animate-pulse">
                          AMAN
                        </span>
                      )}
                    </div>

                    {item.customText ? (
                      <p className="text-2xl sm:text-3xl font-black text-emerald-600 my-2 tracking-tight">
                        {item.customText}
                      </p>
                    ) : (
                      <p className="text-2xl sm:text-3xl font-extrabold text-stone-700 my-2 tracking-tight">
                        {formatRupiah(item.amount)}
                      </p>
                    )}
                    <p className="text-base text-stone-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="hidden lg:block">
              <InlinePromoForm />
            </div>
          </div>

          <div className="lg:col-span-5 w-full lg:sticky lg:top-28 h-fit space-y-6">
            <div className="bg-white border-l-4 border-red-500 shadow-lg shadow-red-100/30 p-6 rounded-r-2xl flex gap-4 items-start">
              <Ban className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-stone-900 text-base mb-1">
                  Kenapa Tanpa DP?
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Agar Anda merasa aman. Uang besar Anda (Pelunasan) hanya
                  keluar ketika bangunan sudah berdiri fisik. Tanpa Risiko.
                </p>
              </div>
            </div>

            {/* ROI Calculator Card */}
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-2xl shadow-stone-200/50 border border-stone-200 overflow-hidden relative">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900 leading-none">
                    Simulasi Profit 
                  </h3>
                  <p className="text-base text-stone-700 mt-2 font-medium flex flex-wrap items-center gap-1.5">
                    Basis Sewa:
                    <span className="bg-stone-100 text-stone-900 px-2 py-0.5 rounded-md font-bold border border-stone-200">
                      Rp500.000 / malam
                    </span>
                  </p>
                </div>
              </div>

              {/* Highlight Result */}
              <div className="bg-stone-900 rounded-3xl p-6 text-center text-white relative overflow-hidden mb-8 group cursor-default">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                  <PieChart size={100} />
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-2">
                    Estimasi Balik Modal (BEP)
                  </p>
                  <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 mb-2">
                    ± {BALIK_MODAL_TAHUN.toFixed(1)} Tahun
                  </p>
                  <div className="h-1 w-16 bg-stone-700 mx-auto rounded-full mt-4"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center bg-stone-50 p-4 rounded-2xl border border-stone-100">
                  <div className="flex flex-col">
                    <span className="text-stone-600 text-sm font-medium">
                      Omset Bulanan
                    </span>
                    <span className="text-[10px] text-stone-400">
                      (Asumsi 15 hari terisi)
                    </span>
                  </div>
                  <span className="text-lg font-bold text-stone-900">
                    {formatRupiah(OMSET_BULANAN)}
                  </span>
                </div>

                {/* Expenses */}
                <div className="pl-4 border-l-2 border-stone-100 space-y-3 py-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-stone-500 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                      Operasional
                    </span>
                    <span className="text-red-500 font-medium">
                      - {formatRupiah(OPERASIONAL_TOTAL)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-stone-500 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                      Management
                    </span>
                    <span className="text-red-500 font-medium">
                      - {formatRupiah(MANAGEMENT_TOTAL)}
                    </span>
                  </div>
                </div>

                {/* Net Result */}
                <div className="pt-6 border-t border-dashed border-stone-200">
                  <p className="text-center text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">
                    Net Diterima Investor
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex flex-col items-center text-center">
                      <span className="font-bold text-emerald-800 text-[10px] uppercase tracking-wider mb-1">
                        Per Bulan
                      </span>
                      <span className="text-xl font-black text-emerald-600 tracking-tight">
                        {formatRupiah(NET_INVESTOR_BULAN)}
                      </span>
                    </div>
                    <div className="bg-white border border-stone-200 p-4 rounded-2xl flex flex-col items-center text-center">
                      <span className="font-bold text-stone-500 text-[10px] uppercase tracking-wider mb-1">
                        Per Tahun
                      </span>
                      <span className="text-lg font-bold text-stone-800 tracking-tight">
                        {formatRupiah(NET_INVESTOR_TAHUN)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 mt-4 text-xs text-amber-900 bg-amber-50 p-4 rounded-2xl border border-amber-100">
                  <AlertCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-amber-600"
                  />
                  <p className="leading-relaxed font-medium">
                    <strong className="block text-amber-700 mb-1">
                      Catatan Penting:
                    </strong>
                    Angka di atas adalah simulasi. Pendapatan aktual dapat
                    naik/turun menyesuaikan kondisi pasar (High/Low Season).
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile-only Form Placement */}
            <div className="block lg:hidden mt-8">
              <InlinePromoForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
