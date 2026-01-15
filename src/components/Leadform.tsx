"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  ChevronRight,
  ShieldCheck,
  MessageCircleQuestion,
  MapPin,
  Phone,
  User,
  Coffee,
} from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams } from "next/navigation";

const phonePattern = /^(?:\+62|0)[0-9]{9,14}$/;

// --- ANIMATION VARIANTS (Optimized) ---
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { y: "100%", opacity: 0.5 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: {
      type: "tween",
      ease: [0.32, 0.72, 0, 1],
      duration: 0.4,
    },
  },
  exit: {
    y: "100%",
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

// --- MAIN WRAPPER ---
export const LeadForm: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <LeadFormContent />
    </Suspense>
  );
};

// --- CONTENT COMPONENT ---
const LeadFormContent = () => {
  const [form, setForm] = useState({
    nama: "",
    domisili: "",
    whatsapp: "",
    jadwal: "",
    keterangan: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false); // State untuk deteksi footer

  // Hook Next.js
  const searchParams = useSearchParams();
  const dateInputRef = useRef<HTMLInputElement>(null);

  // --- 1. DETEKSI FOOTER (Agar tombol tidak menabrak footer) ---
  useEffect(() => {
    // Pastikan Anda memiliki tag <footer> di layout/halaman Anda
    const footer = document.querySelector("footer");

    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Jika footer terlihat (isIntersecting), set state true
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1, // Trigger saat 10% footer mulai masuk layar
      }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  // --- 2. AUTO OPEN LOGIC ---
  useEffect(() => {
    const alreadyClosed =
      typeof window !== "undefined"
        ? sessionStorage.getItem("consultation_popup_closed")
        : null;

    if (!hasOpened && !alreadyClosed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasOpened(true);
      }, 15000); // Delay 15 detik

      return () => clearTimeout(timer);
    }
  }, [hasOpened]);

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("consultation_popup_closed", "true");
    }
  };

  const handleOpen = () => setIsOpen(true);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const utmSource = searchParams?.get("utm_source") || "direct";
      const utmMedium = searchParams?.get("utm_medium") || "-";
      const utmCampaign = searchParams?.get("utm_campaign") || "-";

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
        source: `Popup (${utmSource} - ${utmMedium})`,
        status: "Baru",
      });

      if (error) throw new Error(error.message);

      const payload = JSON.stringify({
        ...form,
        jadwal: form.jadwal,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        user_agent:
          typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
      });

      try {
        fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
        });
      } catch (e) {
        console.warn("Notification API failed silently");
      }

      if (typeof window !== "undefined" && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: "lead_form_submit",
          form_type: "consultation_popup",
          user_data: {
            city: form.domisili,
          },
        });
      }

      toast.success("Berhasil! Tim kami akan menghubungi Anda segera.");
      setForm({
        nama: "",
        domisili: "",
        whatsapp: "",
        jadwal: "",
        keterangan: "",
      });
      handleClose();
    } catch (error: any) {
      console.error("Submit Error:", error);
      toast.error("Gagal mengirim data. Silakan coba hubungi via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      {/* --- FLOATING BUTTON (Dengan Footer Detection) --- */}
      <motion.button
        // LOGIKA ANIMASI: Jika footer terlihat, tombol hilang (opacity 0, y: 50)
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: isFooterVisible ? 0 : 1,
          y: isFooterVisible ? 50 : 0,
          pointerEvents: isFooterVisible ? "none" : "auto", // Nonaktifkan klik saat hidden
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }} // Transisi halus
        onClick={handleOpen}
        className="fixed bottom-6 left-6 z-[90] bg-white text-slate-800 pl-2 pr-5 py-2 rounded-full shadow-2xl hover:scale-105 transition-transform group flex items-center gap-3 border border-slate-200"
        aria-label="Buka formulir konsultasi"
      >
        <div className="bg-slate-900 text-white p-2.5 rounded-full shadow-md group-hover:bg-amber-500 transition-colors">
          <MessageCircleQuestion size={20} />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
            Butuh Bantuan?
          </p>
          <p className="text-sm font-bold text-slate-900 leading-none mt-0.5">
            Konsultasi Gratis
          </p>
        </div>
        <span className="sm:hidden font-bold text-sm text-slate-900">
          Tanya Kami
        </span>
      </motion.button>

      {/* --- MODAL POPUP --- */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={handleClose}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm will-change-opacity"
            />

            {/* Modal Card */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] transform-gpu will-change-transform"
            >
              {/* Header Visual */}
              <div className="bg-slate-900 relative text-white overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                  <Coffee size={120} />
                </div>

                <div className="px-6 py-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-500/30">
                          PRIORITAS
                        </span>
                      </div>
                      <h3
                        id="modal-title"
                        className="text-xl font-bold text-white leading-tight"
                      >
                        Konsultasi Investasi
                      </h3>
                      <p className="text-sm text-slate-300 mt-1 max-w-[95%] leading-relaxed">
                        Diskusikan potensi ROI, detail unit, dan skema
                        pembayaran.
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="text-white/40 hover:text-white transition p-2 bg-white/5 rounded-full hover:bg-white/10"
                      aria-label="Tutup popup"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Body */}
              <div className="px-6 py-6 bg-slate-50 overflow-y-auto flex-1 overscroll-contain">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-slate-800 transition-colors pointer-events-none" />
                    <input
                      type="text"
                      name="nama"
                      value={form.nama}
                      onChange={handleChange}
                      placeholder="Nama Lengkap"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-800 focus:border-slate-800 outline-none transition text-sm text-slate-800 shadow-sm placeholder:text-slate-400"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative group">
                      <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-slate-800 transition-colors pointer-events-none" />
                      <input
                        type="tel"
                        name="whatsapp"
                        value={form.whatsapp}
                        onChange={handleChange}
                        placeholder="WhatsApp (Aktif)"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-800 focus:border-slate-800 outline-none transition text-sm text-slate-800 shadow-sm placeholder:text-slate-400"
                        required
                      />
                    </div>
                    <div className="relative group">
                      <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-slate-800 transition-colors pointer-events-none" />
                      <input
                        type="text"
                        name="domisili"
                        value={form.domisili}
                        onChange={handleChange}
                        placeholder="Kota Domisili"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-800 focus:border-slate-800 outline-none transition text-sm text-slate-800 shadow-sm placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-slate-800 transition-colors z-10 pointer-events-none" />
                    <input
                      ref={dateInputRef}
                      type="date"
                      name="jadwal"
                      min={today}
                      value={form.jadwal}
                      onChange={handleChange}
                      onClick={() => dateInputRef.current?.showPicker()}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-800 focus:border-slate-800 outline-none transition text-sm text-slate-800 shadow-sm cursor-pointer relative"
                      style={{ colorScheme: "light" }}
                    />
                    {!form.jadwal && (
                      <span
                        onClick={() => dateInputRef.current?.showPicker()}
                        className="absolute left-10 top-3.5 text-sm text-slate-400 pointer-events-none bg-white pr-2"
                      >
                        Jadwalkan Cek Lokasi
                      </span>
                    )}
                  </div>

                  <div className="relative group">
                    <MessageCircleQuestion className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-slate-800 transition-colors pointer-events-none" />
                    <textarea
                      name="keterangan"
                      rows={2}
                      value={form.keterangan}
                      onChange={handleChange}
                      placeholder="Apa yang ingin Anda tanyakan?"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-800 focus:border-slate-800 outline-none transition text-sm text-slate-800 shadow-sm resize-none placeholder:text-slate-400"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold text-base shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-xl active:scale-[0.98]"
                    >
                      {isSubmitting ? (
                        "Sedang Mengirim..."
                      ) : (
                        <>
                          Hubungi Konsultan Kami <ChevronRight size={18} />
                        </>
                      )}
                    </button>
                    <div className="flex justify-center mt-4">
                      <p className="text-[10px] text-slate-500 flex items-center gap-1.5 text-center">
                        <ShieldCheck size={12} className="text-slate-400" />
                        Privasi Anda terjaga. Kami tidak melakukan spam.
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
