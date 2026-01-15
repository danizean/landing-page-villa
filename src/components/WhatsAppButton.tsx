"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Send, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [hasOpenedAuto, setHasOpenedAuto] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { root: null, threshold: 0.1 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

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

  if (!isMounted || pathname?.startsWith("/admin")) return null;

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem("wa_popup_closed", "true");
  };

  const handleToggle = () => {
    setOpen(!open);
    if (!open) {
      sessionStorage.removeItem("wa_popup_closed");
    }
  };

  const handleClick = () => {
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: "whatsapp_click",
        source: "floating_button",
        conversion_value: 0,
      });
    }

    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Contact", {
        content_name: "Floating WhatsApp Button",
        status: "clicked",
      });
    }

    try {
      const searchParams = new URLSearchParams(window.location.search);
      fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: "Visitor (Click Only)",
          whatsapp: "-",
          domisili: "-",
          keterangan: "User mengklik tombol WhatsApp Floating (Direct CTWA)",
          jadwal: new Date().toISOString(),
          utm_source: searchParams.get("utm_source") || "floating_button",
          utm_medium: searchParams.get("utm_medium") || "direct",
          utm_campaign: searchParams.get("utm_campaign") || "-",
          user_agent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.error("Background notify error:", error);
    }

    const message =
      "Halo Admin Casa de Kayana, saya tertarik dengan promo Villa 250 Juta (Tanpa DP). Boleh minta info detail & pricelist-nya?";
    const phoneNumber = "628138906004";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isFooterVisible ? 0 : 1,
        y: isFooterVisible ? 20 : 0,
        pointerEvents: isFooterVisible ? "none" : "auto",
      }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 font-sans"
    >
      {/* Popup Bubble Chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.2, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              y: 10,
              scale: 0.95,
              transition: { duration: 0.15, ease: "easeIn" },
            }}
            className="relative bg-white rounded-2xl shadow-2xl w-[300px] overflow-hidden border border-slate-100 origin-bottom-right transform-gpu will-change-transform"
          >
            {/* Header Admin */}
            <div className="bg-[#075e54] p-4 flex items-center justify-between shadow-md relative z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#075e54] shadow-sm">
                    <User className="w-6 h-6" />
                  </div>
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
        aria-label="Chat WhatsApp Admin"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative bg-[#25D366] hover:bg-[#20b858] text-white rounded-full p-4 shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-all duration-300 flex items-center justify-center group"
      >
        <MessageCircle size={36} className="fill-white" />

        {!open && (
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping duration-1000"></span>
        )}

        {/* Notification Badge */}
        {!open && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 z-20">
            <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 text-white text-[11px] font-bold items-center justify-center border-2 border-white shadow-sm">
              1
            </span>
          </span>
        )}
      </motion.button>
    </motion.div>
  );
}
