import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import clsx from "clsx";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

// Load Google Font with Swap to prevent FOIT
const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans", // Optional: for Tailwind config if needed
});

// --- 1. SETUP VIEWPORT ---
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbbf24", // Matches Amber-500 brand color
  maximumScale: 5, // Accessibility: Allow users to zoom
};

// --- 2. SEO METADATA (DIPERKAYA) ---
export const metadata: Metadata = {
  metadataBase: new URL("https://www.casadekayana.com"),
  title: {
    default: "Casa de Kayana | Investasi Villa Jogja Dekat UII Tanpa DP",
    template: "%s | Casa de Kayana",
  },
  description:
    "Miliki aset produktif villa bohemian modern di Jalan Kaliurang Yogyakarta mulai Rp250 juta. Fasilitas Private Pool, Full Furnished, Legalitas Aman (SHM), dan Potensi Passive Income Tinggi. Investasi properti terbaik di Sleman.",
  keywords: [
    "casa de kayana",
    "casa de kayana jogja",
    "villa bohemian modern",
    "villa dijual yogyakarta",
    "villa jalan kaliurang",
    "investasi properti jakal",
    "villa dekat kampus UII",
    "properti sleman yogyakarta",
    "villa dekat merapi",
    "tanah dijual kaliurang",
    "villa murah jogja 250 juta",
    "investasi villa modal kecil",
    "investasi tanpa dp jogja",
    "passive income properti",
    "properti produktif jogja",
    "jual beli villa jogja",
    "harga villa casa de kayana",
    "investasi properti aman jogja",
    "beli villa untuk pensiun",
    "villa private pool jogja",
    "hunian mahasiswa eksklusif",
    "kost elit yogyakarta",
    "villa full furnished jogja",
    "smart home system villa",
    "villa instagramable jogja",
    "investasi untuk milenial",
    "tabungan properti",
    "rumah kedua di jogja",
    "staycation jogja",
    "management asset properti",
  ],
  authors: [{ name: "Casa de Kayana Team" }],
  creator: "Casa de Kayana",
  publisher: "Casa de Kayana Property",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "F7BmAIc2TrhpbXx5VJqFRf2rSQvKNekU0AsSxxjG4oA",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Investasi Villa Jogja Rp250 Juta | Casa de Kayana",
    description:
      "Peluang investasi properti di Jogja dengan skema Tanpa DP. Lokasi strategis selangkah dari UII Jakal. Private Pool & Full Furnished. Booking sekarang!",
    url: "https://www.casadekayana.com",
    siteName: "Casa de Kayana Property",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "https://www.casadekayana.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Casa de Kayana - Investasi Villa Terbaik di Yogyakarta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa de Kayana - Investasi Villa Jogja Paling Aman",
    description:
      "Miliki aset produktif di Jogja mulai Rp250 Juta. Tanpa DP, Private Pool, Dekat UII. Potensi sewa tinggi.",
    images: ["https://www.casadekayana.com/og-image.jpg"],
    creator: "@casadekayana",
  },
  alternates: {
    canonical: "https://www.casadekayana.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const PIXEL_ID = "1547111949891286";
  const GTM_ID = "GTM-WT79LLNQ";
  const CLARITY_ID = "uvr74fo44y";
  const GA_ID = "G-EF6RLJYKKH";

  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={clsx(
          dmSans.className,
          "antialiased bg-[#F9FAFB] text-slate-900"
        )}
      >
        {/* --- 1. GOOGLE ANALYTICS (GA4) --- */}
        {/* Menggunakan lazyOnload agar tidak memblokir rendering awal */}
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        {/* --- 2. GOOGLE TAG MANAGER (HEAD SCRIPT) --- */}
        {/* Diubah ke lazyOnload untuk mengurangi TBT */}
        <Script
          id="gtm-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />

        {/* --- 3. GOOGLE TAG MANAGER (BODY NOSCRIPT) --- */}
        {/* Noscript tetap dirender server-side, tidak perlu strategi JS */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="GTM"
          ></iframe>
        </noscript>

        {/* --- 4. META PIXEL SCRIPT --- */}
        {/* Diubah ke lazyOnload */}
        <Script
          id="fb-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
        {/* Meta Pixel NoScript */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>

        {/* --- 5. MICROSOFT CLARITY --- */}
        {/* Diubah ke lazyOnload */}
        <Script
          id="microsoft-clarity"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_ID}");
            `,
          }}
        />

        {children}

        {/* Third Party Components */}
        <Analytics />
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
        <WhatsAppButton />
      </body>
    </html>
  );
}
