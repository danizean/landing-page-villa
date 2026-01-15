"use client";

import Image from "next/image";
import InstaIcon from "../assets/icons/instagram.png";
import TiktokIcon from "../assets/icons/tiktok.png";
import FacebookIcon from "../assets/icons/facebook.png";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-40 bg-[#0D1324] border-t border-white/10 mt-20 pt-12 pb-10">
      {/* Decorative Top Highlight */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        {/* 1. Brand & Management Info */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-white tracking-wide font-serif">
            CASA DE KAYANA
          </h3>
          <p className="text-sm text-slate-400">
            Managed by{" "}
            <span className="text-amber-500 font-semibold">
              Omzet Naik Properti
            </span>
          </p>
          <p className="text-xs text-slate-600 mt-1">
            © {currentYear} All rights reserved.
          </p>
        </div>

        {/* 2. Promo Highlight (Center Banner) */}
        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-sm max-w-sm w-full md:w-auto">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-semibold">
            Penawaran Eksklusif
          </p>
          <p className="text-sm sm:text-base font-bold text-white leading-snug">
            BOOKING 5 JUTA <span className="text-amber-500">TANPA DP</span>
            <br className="sm:hidden" /> {/* Line break di mobile agar rapi */}
            <span className="hidden sm:inline text-slate-600 mx-2">|</span>
            PELUNASAN SAAT UNIT JADI
          </p>
        </div>

        {/* 3. Social Media Icons */}
        <nav className="flex flex-col items-center md:items-end gap-3">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Ikuti Kami
          </span>
          <ul className="flex gap-3">
            {/* Instagram */}
            <li>
              <a
                href="https://www.instagram.com/casadekayana"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="group w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-amber-500/20 border border-white/5 hover:border-amber-500/50 transition-all duration-300"
              >
                <Image
                  src={InstaIcon}
                  alt="Instagram"
                  width={20}
                  height={20}
                  className="opacity-70 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                />
              </a>
            </li>

            {/* Facebook */}
            <li>
              <a
                href="https://www.facebook.com/casadekayana/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="group w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-blue-600/20 border border-white/5 hover:border-blue-500/50 transition-all duration-300"
              >
                <Image
                  src={FacebookIcon}
                  alt="Facebook"
                  width={20}
                  height={20}
                  className="opacity-70 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};
