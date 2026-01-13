"use client";

import { useState, useEffect } from "react";
import LogoImage from "../assets/icons/logo-casadekayana.svg"; // Pastikan config SVGR next.js aktif
import MenuIcon from "../assets/icons/menu.svg";
import { X } from "lucide-react";

// Tipe data untuk Link
type NavLink = {
  name: string;
  href: string;
};

const navLinks: NavLink[] = [
  { name: "Beranda", href: "#hero" },
  { name: "Konsep", href: "#konsep" },
  { name: "Layout", href: "#layout" },
  { name: "Lokasi", href: "#lokasi" },
  { name: "Harga & Skema", href: "#pembayaran" },
  { name: "FAQ", href: "#faq" },
];

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 1. Optimized Scroll Handler
  useEffect(() => {
    const handleScroll = () => {
      // Mengurangi re-render: hanya set state jika status benar-benar berubah
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Passive listener improve scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  // 2. Body Scroll Lock (UX Fix untuk Mobile Menu)
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  // 3. Safe Pixel Tracking Helper
  const handleSurveyClick = () => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Contact", {
        content_name: "Navbar Survey Button",
        status: "clicked",
      });
    }
  };

  const waLink =
    "https://wa.me/628138906004?text=Halo%20Admin,%20saya%20tertarik%20dengan%20Casa%20de%20Kayana.%20Saya%20ingin%20*Jadwalkan%20Survey%20Lokasi*,%20apakah%20bisa%20dibantu?";

  return (
    <>
      <header
        role="banner"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out will-change-transform ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          {/* Logo Brand - Wrapped in Link for SEO */}
          <a
            href="#hero"
            aria-label="Kembali ke Beranda"
            className="flex items-center gap-2 sm:gap-3 z-50 relative group cursor-pointer"
          >
            <LogoImage
              className={`transition-all duration-300 ${
                scrolled ? "h-8 w-8 text-amber-600" : "h-10 w-10 text-amber-600"
              }`}
              aria-hidden="true"
            />
            <span
              className={`font-bold tracking-tight font-serif transition-colors duration-300 ${
                scrolled
                  ? "text-lg text-stone-800"
                  : "text-xl text-white drop-shadow-md"
              }`}
            >
              Casa De Kayana
            </span>
          </a>

          {/* Desktop Menu - Semantic HTML (nav > ul > li) */}
          <nav
            className={`hidden lg:flex items-center gap-8 text-sm font-medium transition-colors duration-300 ${
              scrolled ? "text-stone-600" : "text-white/90"
            }`}
            aria-label="Desktop Navigation"
          >
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-amber-500 transition-colors relative py-2 group"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 ease-out group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer" // Security best practice
              onClick={handleSurveyClick}
              className={`px-6 py-2.5 rounded-full font-bold transition-all duration-300 shadow-md hover:-translate-y-0.5 active:scale-95 ${
                scrolled
                  ? "bg-amber-500 hover:bg-amber-600 text-white"
                  : "bg-white text-amber-600 hover:bg-amber-50"
              }`}
              aria-label="Hubungi WhatsApp untuk Jadwalkan Survey"
            >
              Jadwalkan Survey
            </a>
          </nav>

          {/* Mobile Menu Button - Accessible Touch Target */}
          <button
            className={`lg:hidden p-2 -mr-2 rounded-lg transition-colors z-50 relative focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              scrolled && !menuOpen
                ? "text-stone-800 hover:bg-stone-100"
                : "text-white hover:bg-white/10"
            }`}
            onClick={() => setMenuOpen(true)}
            aria-label="Buka menu navigasi"
            aria-expanded={menuOpen}
          >
            <MenuIcon
              className={`h-8 w-8 ${menuOpen ? "opacity-0" : "opacity-100"}`}
            />
          </button>
        </div>
      </header>

      {/* --- MOBILE FULLSCREEN MENU OVERLAY --- */}
      {/* Optimized: Hidden from DOM when closed mostly for screen readers, but kept for transition */}
      <div
        className={`fixed inset-0 z-[60] bg-white flex flex-col justify-center items-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          menuOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-full"
        }`}
        aria-hidden={!menuOpen}
      >
        {/* Tombol Close (X) */}
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-5 right-4 p-3 rounded-full bg-stone-50 text-stone-600 hover:bg-red-50 hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
          aria-label="Tutup menu"
        >
          <X size={28} />
        </button>

        <nav className="w-full px-6" aria-label="Mobile Navigation">
          <ul className="flex flex-col gap-6 text-center w-full">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-2xl font-medium text-stone-700 hover:text-amber-600 transition-colors border-b border-stone-100 pb-3"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex justify-center">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                handleSurveyClick();
                setMenuOpen(false);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white w-full max-w-xs py-4 rounded-xl text-center font-bold text-lg shadow-lg active:scale-95 transition-transform"
            >
              Jadwalkan Survey
            </a>
          </div>
        </nav>
      </div>
    </>
  );
};
