"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, MessageCircle } from "lucide-react";

// --- TYPES & DATA ---
interface FAQItemData {
  question: string;
  answer: string;
}

// Static Data: Moved outside to prevent recreation
const faqItems: FAQItemData[] = [
  {
    question: "Apa konsep utama dari Casa de Kayana?",
    answer:
      "Casa de Kayana mengusung konsep 'Bohemian Modern' yang estetik dan timeless. Dirancang sebagai hunian eksklusif dengan Private Pool di setiap unit, sangat cocok untuk target pasar mahasiswa UII maupun wisatawan yang mencari penginapan instagramable.",
  },
  {
    question: "Bagaimana mekanisme pembayaran 'Tanpa DP'?",
    answer:
      "Skema ini dirancang agar aman bagi Anda. Anda cukup membayar Booking Fee Rp 5 Juta untuk mengunci harga promo. Pelunasan baru dilakukan 100% ketika bangunan fisik sudah jadi dan siap serah terima kunci.",
  },
  {
    question: "Apa status legalitas properti ini?",
    answer:
      "Legalitas aman dan jelas dengan skema Leasehold (Hak Pakai) selama 20 tahun. Seluruh transaksi dilakukan secara transparan melalui Akta Notaris.",
  },
  {
    question: "Apakah unit sudah termasuk perabotan (Full Furnished)?",
    answer:
      "Ya, harga Rp 250 Juta sudah termasuk Full Furnished standar interior hotel berbintang (Bed, AC, Water Heater, Furniture).",
  },
  {
    question: "Berapa estimasi kenaikan harga (Capital Gain)?",
    answer:
      "Berdasarkan data historis area Jakal (dekat kampus UII), kenaikan nilai aset properti rata-rata mencapai 10-15% per tahun, didorong oleh tingginya permintaan hunian mahasiswa.",
  },
];

// Animation Variants
const accordionVariants = {
  collapsed: { opacity: 0, height: 0, marginTop: 0 },
  expanded: { opacity: 1, height: "auto", marginTop: 12 },
};

// --- SUB-COMPONENT ---
const AccordionItem = ({
  item,
  isOpen,
  onClick,
  index,
}: {
  item: FAQItemData;
  isOpen: boolean;
  onClick: () => void;
  index: number;
}) => {
  const contentId = `faq-content-${index}`;
  const headerId = `faq-header-${index}`;

  return (
    <div className="border-b border-stone-200 last:border-0">
      <button
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={contentId}
        id={headerId}
        className="w-full flex justify-between items-start text-left gap-4 py-5 sm:py-6 group transition-colors hover:bg-stone-50/50 px-2 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
      >
        <h3
          className={`text-base sm:text-lg font-bold leading-snug transition-colors ${
            isOpen
              ? "text-amber-600"
              : "text-stone-800 group-hover:text-amber-600"
          }`}
        >
          {item.question}
        </h3>
        <div
          className={`flex-shrink-0 mt-0.5 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          {isOpen ? (
            <Minus className="w-5 h-5 text-amber-500" />
          ) : (
            <Plus className="w-5 h-5 text-stone-400 group-hover:text-amber-500" />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={accordionVariants}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }} // Spring-like easing
            className="overflow-hidden"
            id={contentId}
            role="region"
            aria-labelledby={headerId}
          >
            <div className="pb-6 px-2">
              <p className="text-stone-600 leading-relaxed text-sm sm:text-base border-l-2 border-amber-200 pl-4">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Generate JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section
      id="faq"
      className="py-20 sm:py-28 bg-[#fffdf9] relative overflow-hidden"
    >
      {/* Inject SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 sm:px-6 max-w-5xl relative z-10">
        {/* --- HEADER --- */}
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
                Informasi & Bantuan
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 font-serif leading-tight">
              Pertanyaan <br />
              <span className="text-stone-400 italic font-light">
                Yang Sering Diajukan
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-sm"
          >
            <p className="text-stone-600 text-base leading-relaxed border-l-2 border-stone-200 pl-4">
              Rangkuman hal-hal penting bagi calon investor mengenai legalitas,
              pembayaran, dan potensi keuntungan.
            </p>
          </motion.div>
        </div>

        {/* --- ACCORDION CONTENT --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white p-4 sm:p-8 rounded-3xl shadow-xl border border-stone-100"
        >
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              index={index}
              item={item}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </motion.div>

        {/* --- CTA BOX (Bottom) --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="bg-stone-900 p-8 rounded-3xl shadow-2xl relative overflow-hidden max-w-3xl mx-auto">
            {/* Background Decor - Lightweight */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <p className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-1">
                  Butuh Hitungan Detail?
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  Konsultasikan Rencana <br /> Investasi Anda
                </h3>
              </div>

              <a
                href="https://wa.me/628138906004?text=Halo%20Admin%20Casa%20de%20Kayana,%20saya%20ingin%20tanya%20lebih%20detail%20tentang%20proyek%20ini."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3.5 rounded-xl font-bold transition-all hover:shadow-lg hover:-translate-y-1 active:scale-95 border border-green-500/50"
              >
                <MessageCircle className="w-5 h-5" />
                Chat WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
