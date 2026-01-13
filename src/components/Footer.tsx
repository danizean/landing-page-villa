'use client';

import Image from 'next/image';
import InstaIcon from '../assets/icons/instagram.png';
import TiktokIcon from '../assets/icons/tiktok.png';
import FacebookIcon from '../assets/icons/facebook.png';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-40 bg-[#0D1324] border-t border-white/10 mt-20">
      {/* Gradient Divider */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Text */}
        <div className="text-center md:text-left">
          <p className="text-sm text-white/70">
            © {currentYear}{' '}
            <span className="font-semibold text-white">Haspro Agency</span>. All rights reserved.
          </p>
          <p className="text-xs text-white/50 mt-1">
            Empowering property investment with trust & transparency.
          </p>
        </div>

        {/* Social Media Icons */}
        <nav>
          <ul className="flex gap-4 items-center justify-center">
            {/* Instagram */}
            <li>
              <a
                href="https://www.instagram.com/hasproagency"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="group p-2 rounded-full hover:bg-white/10 transition"
              >
                <Image
                  src={InstaIcon}
                  alt="Instagram"
                  width={26}
                  height={26}
                  className="opacity-80 transition-transform duration-300 group-hover:scale-110 group-hover:opacity-100"
                />
              </a>
            </li>

            {/* TikTok */}
            <li>
              <a
                href="https://www.tiktok.com/@hasproagency_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="group p-2 rounded-full hover:bg-white/10 transition"
              >
                <Image
                  src={TiktokIcon}
                  alt="TikTok"
                  width={26}
                  height={26}
                  className="opacity-80 transition-transform duration-300 group-hover:scale-110 group-hover:opacity-100"
                />
              </a>
            </li>

            {/* Facebook */}
            <li>
              <a
                href="https://www.facebook.com/hasproagency1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="group p-2 rounded-full hover:bg-white/10 transition"
              >
                <Image
                  src={FacebookIcon}
                  alt="Facebook"
                  width={26}
                  height={26}
                  className="opacity-80 transition-transform duration-300 group-hover:scale-110 group-hover:opacity-100"
                />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};
