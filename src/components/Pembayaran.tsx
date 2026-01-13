"use client";

import { useState, useRef } from "react";
import { formatRupiah } from "../lib/formatRupiah";
import { motion } from "framer-motion";
import {
  Wallet,
  CheckCircle,
  User,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  MessageCircleQuestion,
  Coffee,
  Building2,
  Key,
  Ban,
  Lock,
  TrendingUp,
  Calculator,
  PieChart,
  ChevronRight,
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
    desc: "Tanda jadi pemesanan unit & kunci harga promo.",
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    highlight: false,
  },
  {
    step: 2,
    title: "Masa Pembangunan",
    amount: 0,
    desc: "Unit dibangun tanpa DP atau Termin. Bebas cashflow.",
    icon: <Building2 className="w-5 h-5 text-blue-500" />,
    highlight: true,
    customText: "TANPA DP / Termin",
  },
  {
    step: 3,
    title: "Pelunasan Unit",
    amount: PELUNASAN,
    desc: "Dibayarkan lunas saat unit sudah jadi & pelunasan maksimal 3 hari setelah pemberitahuan unit jadi.",
    icon: <Key className="w-5 h-5 text-amber-500" />,
    highlight: false,
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// --- COMPONENT: FORM KONSULTASI (OPTIMIZED SIZE) ---
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
    <div className="mt-10 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
      {/* Header Form - Lebih Besar */}
      <div className="bg-slate-900 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Coffee size={120} aria-hidden="true" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-md shadow-sm animate-pulse border border-amber-400">
              UNIT TERBATAS!
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Amankan Unit Sekarang!
          </h3>
          <p className="text-slate-300 text-base">
            Isi data di bawah untuk mengunci harga promo & jadwal survey.
          </p>
        </div>
      </div>

      {/* Form Fields - Ukuran & Padding Diperbesar (py-4) */}
      <form onSubmit={handleSubmit} className="p-8 space-y-5">
        <div className="relative group">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
          <input
            type="text"
            name="nama"
            aria-label="Nama Lengkap"
            value={form.nama}
            onChange={handleChange}
            placeholder="Nama Lengkap"
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-800 outline-none text-base transition-all focus:bg-white focus:border-slate-400 placeholder:text-slate-400"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
            <input
              type="tel"
              name="whatsapp"
              aria-label="Nomor WhatsApp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="WhatsApp"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-800 outline-none text-base transition-all focus:bg-white focus:border-slate-400 placeholder:text-slate-400"
              required
            />
          </div>
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
            <input
              type="text"
              name="domisili"
              aria-label="Kota Domisili"
              value={form.domisili}
              onChange={handleChange}
              placeholder="Domisili"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-800 outline-none text-base transition-all focus:bg-white focus:border-slate-400 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="relative group">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none z-10 group-focus-within:text-slate-800 transition-colors" />
          <input
            ref={dateInputRef}
            type="date"
            name="jadwal"
            aria-label="Jadwal Survey"
            min={today}
            value={form.jadwal}
            onChange={handleChange}
            onClick={() => dateInputRef.current?.showPicker()}
            className={`w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-800 outline-none text-base cursor-pointer transition-all focus:bg-white focus:border-slate-400
              ${!form.jadwal ? "text-transparent" : "text-slate-800"}
            `}
          />
          {!form.jadwal && (
            <span
              onClick={() => dateInputRef.current?.showPicker()}
              className="absolute left-12 top-1/2 -translate-y-1/2 text-base text-slate-400 pointer-events-none bg-transparent pr-2"
              aria-hidden="true"
            >
              Jadwalkan Survey (Opsional)
            </span>
          )}
        </div>

        <div className="relative group">
          <MessageCircleQuestion className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
          <textarea
            name="keterangan"
            aria-label="Keterangan atau Pertanyaan"
            rows={2}
            value={form.keterangan}
            onChange={handleChange}
            placeholder="Ada pertanyaan khusus?"
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-800 outline-none text-base resize-none transition-all focus:bg-white focus:border-slate-400 placeholder:text-slate-400"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 active:scale-95 focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
        >
          {isSubmitting ? (
            "Mengirim..."
          ) : (
            <>
              <Lock size={20} /> Amankan Unit Sekarang!{" "}
              <ChevronRight size={20} />
            </>
          )}
        </motion.button>

        <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
          <ShieldCheck size={14} /> Data Anda dijamin aman & rahasia.
        </p>
      </form>
    </div>
  );
};

export default function PaymentSchedulePage() {
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

      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40"
        aria-hidden="true"
      >
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-amber-50/50 rounded-full blur-3xl" />
      </div>

      {/* --- LEBAR CONTAINER DIPERBESAR (max-w-7xl) --- */}
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
              <span className="w-8 h-[2px] bg-amber-500 inline-block rounded-full"></span>
              <span className="text-amber-600 font-bold text-sm tracking-widest uppercase">
                Investasi & Pembayaran
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 font-serif leading-tight">
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
            <p className="text-stone-600 text-base leading-relaxed border-l-2 border-stone-200 pl-4">
              Kami menawarkan keamanan transaksi tertinggi. Cukup Booking Fee,
              sisanya dilunasi setelah bangunan berdiri.{" "}
              <strong>Tanpa DP, Tanpa Risiko Mangkrak.</strong>
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* --- KOLOM KIRI DIPERBESAR (Span 8 dari 12) --- */}
          {/* Ini membuat form terlihat lebih lebar dan proporsional */}
          <div className="lg:col-span-8 space-y-10">
            {/* Total Price Box */}
            <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-2">
                  Harga Launching Unit Villa
                </p>
                <p className="text-4xl sm:text-6xl font-black text-amber-500 tracking-tight">
                  {formatRupiah(PRICE_TOTAL)}
                </p>
              </div>
            </div>

            {/* Payment Steps */}
            <div className="space-y-5">
              {PAYMENT_STEPS.map((item, index) => (
                <article
                  key={index}
                  className={`p-6 rounded-3xl border flex items-start gap-5 transition-all
                    ${
                      item.highlight
                        ? "bg-amber-50/50 border-amber-200 shadow-sm"
                        : "bg-white border-stone-100 hover:border-stone-300"
                    }
                  `}
                >
                  <div
                    className={`mt-1 p-3 rounded-full flex-shrink-0 ${
                      item.highlight
                        ? "bg-amber-100 text-amber-600"
                        : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-xl flex items-center gap-3">
                      {item.title}
                      {item.highlight && (
                        <span className="bg-red-500 text-white text-[10px] px-2.5 py-1 rounded-full shadow-sm">
                          POPULER
                        </span>
                      )}
                    </h4>

                    {item.customText ? (
                      <p className="text-2xl sm:text-3xl font-black text-green-600 my-2 tracking-tight">
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
                </article>
              ))}
            </div>

            {/* Inline Form Component */}
            <InlinePromoForm />
          </div>

          {/* --- KOLOM KANAN DIPERKECIL (Span 4 dari 12) --- */}
          {/* Membuat sidebar lebih compact dan tidak "kosong" */}
          <div className="lg:col-span-4 w-full lg:sticky lg:top-28 space-y-8">
            {/* Note Box */}
            <div className="bg-red-50 border border-red-100 p-5 rounded-3xl flex gap-4 items-start text-sm text-red-800/90 leading-relaxed">
              <Ban className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <p>
                <strong className="block mb-1 text-red-700 text-base">
                  Kenapa Tanpa DP?
                </strong>
                Agar Anda merasa aman. Uang besar Anda (Pelunasan) hanya keluar
                ketika Anda sudah melihat fisik bangunan.
              </p>
            </div>

            {/* ROI Calculator */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-stone-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-2.5 rounded-xl text-green-600">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 leading-none">
                    Simulasi Profit
                  </h3>
                  <p className="text-xs text-stone-500 mt-1.5 font-medium">
                    Estimasi Occupancy 50%
                  </p>
                </div>
              </div>

              {/* Summary Box */}
              <div className="bg-stone-900 rounded-2xl p-6 text-center text-white relative overflow-hidden mb-6">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <PieChart size={80} aria-hidden="true" />
                </div>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-2">
                  Estimasi Balik Modal
                </p>
                <p className="text-4xl font-extrabold text-amber-400 mb-2">
                  ± {BALIK_MODAL_TAHUN.toFixed(1)} Thn
                </p>
                <div className="h-1 w-12 bg-white/20 mx-auto rounded-full"></div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center bg-stone-50 p-4 rounded-xl border border-stone-100">
                  <span className="text-stone-600 font-medium">
                    Omset (15 Hari terisi)
                  </span>
                  <span className="text-lg font-bold text-stone-900">
                    {formatRupiah(OMSET_BULANAN)}
                  </span>
                </div>

                {/* Pengeluaran */}
                <div className="pl-4 border-l-2 border-slate-100 space-y-3 py-1">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-stone-500 flex items-center gap-1.5">
                      <Calculator size={14} /> Operasional
                    </span>
                    <span className="text-red-500 font-medium">
                      - {formatRupiah(OPERASIONAL_TOTAL)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-stone-500 flex items-center gap-1.5">
                      <User size={14} /> Management
                    </span>
                    <span className="text-red-500 font-medium">
                      - {formatRupiah(MANAGEMENT_TOTAL)}
                    </span>
                  </div>
                </div>

                {/* Result Net */}
                <div className="pt-5 border-t border-dashed border-stone-200">
                  <p className="text-center text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">
                    Net Diterima Investor
                  </p>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 p-5 rounded-2xl flex flex-col items-center shadow-sm text-center">
                    <span className="font-bold text-green-800 text-xs uppercase tracking-wider mb-1">
                      Per Bulan
                    </span>
                    <span className="text-3xl font-black text-green-600 tracking-tight">
                      {formatRupiah(NET_INVESTOR_BULAN)}
                    </span>
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-xs text-stone-500 mb-1">
                      Potensi Per Tahun
                    </p>
                    <p className="text-lg font-extrabold text-stone-800">
                      {formatRupiah(NET_INVESTOR_TAHUN)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
