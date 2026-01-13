"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Send, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [hasOpenedAuto, setHasOpenedAuto] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Mencegah hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-open setelah 7 detik
  useEffect(() => {
    if (!isMounted) return;

    const timer = setTimeout(() => {
      const isClosed = sessionStorage.getItem("wa_popup_closed");
      if (!isClosed && !hasOpenedAuto) {
        setOpen(true);
        setHasOpenedAuto(true);
      }
    }, 7000);

    return () => clearTimeout(timer);
  }, [hasOpenedAuto, isMounted]);

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem("wa_popup_closed", "true");
  };

  const handleToggle = () => {
    setOpen(!open);
    if (!open) {
      // Reset session storage agar pop up tidak dianggap "closed permanently" jika user membuka manual
      sessionStorage.removeItem("wa_popup_closed");
    }
  };

  const handleClick = () => {
    // --- 1. TRACKING GTM ---
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: "whatsapp_click",
        source: "floating_button",
        conversion_value: 0,
      });
    }

    // --- 2. TRACKING META PIXEL ---
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Contact", {
        content_name: "Floating WhatsApp Button",
        status: "clicked",
      });
    }

    // --- 3. LOGIKA PESAN (Casa de Kayana Specific) ---
    let currentUrl = "";
    if (typeof window !== "undefined") {
      currentUrl = window.location.href;
    }

    // Pesan disesuaikan dengan Selling Point
    const baseMessage =
      "Halo Admin Casa de Kayana, saya tertarik dengan promo Villa 250 Juta (Tanpa DP). Boleh minta info detail & pricelist-nya?";
    const finalMessage = `${baseMessage}\n\n(Source: ${currentUrl})`;

    // Nomor Admin Casa de Kayana
    const phoneNumber = "628138906004";

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      finalMessage
    )}`;

    window.open(url, "_blank");
  };

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 font-sans">
      {/* Popup Bubble Chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="relative bg-white rounded-2xl shadow-2xl w-[300px] overflow-hidden border border-slate-100 origin-bottom-right"
          >
            {/* Header Admin */}
            <div className="bg-[#075e54] p-4 flex items-center justify-between shadow-md relative z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {/* Avatar Admin */}
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#075e54] shadow-sm">
                    <User className="w-6 h-6" />
                  </div>
                  {/* Green Dot Online */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#075e54] rounded-full animate-pulse"></div>
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">
                    Admin Casa de Kayana
                  </p>
                  <p className="text-green-100 text-xs">
                    Online, siap membantu
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white/70 hover:text-white transition p-1 hover:bg-white/10 rounded-full"
                aria-label="Tutup Chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="bg-[#e5ddd5] p-5 h-auto max-h-60 overflow-y-auto bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
              <div className="bg-white p-3.5 rounded-bl-xl rounded-tr-xl rounded-br-xl shadow-sm text-sm text-slate-700 leading-relaxed relative max-w-[90%]">
                <p>
                  Halo Kak! 👋 <br />
                  Ada yang bisa kami bantu terkait promo{" "}
                  <b className="text-[#075e54]">Villa 250 Juta</b>?
                </p>
                <div className="flex justify-end mt-1">
                  <span className="text-[10px] text-slate-400">
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Tombol Action */}
            <div className="p-3 bg-white border-t border-slate-100">
              <button
                onClick={handleClick}
                className="w-full bg-[#25D366] hover:bg-[#20b858] text-white font-bold py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group active:scale-95"
              >
                <MessageCircle size={20} className="fill-white" />
                <span>Balas via WhatsApp</span>
                <Send
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button Utama */}
      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative bg-[#25D366] hover:bg-[#20b858] text-white rounded-full p-4 shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-all duration-300 flex items-center justify-center group"
      >
        {/* Ikon WA */}
        <MessageCircle size={36} className="fill-white" />

        {/* Ping Animation (Ring Luar) */}
        {!open && (
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping duration-1000"></span>
        )}

        {/* Notification Badge (Merah) */}
        {!open && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 z-20">
            <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 text-white text-[11px] font-bold items-center justify-center border-2 border-white shadow-sm">
              1
            </span>
          </span>
        )}
      </motion.button>
    </div>
  );
}
