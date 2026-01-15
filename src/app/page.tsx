"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";

const DesignConceptSection = dynamic(
  () =>
    import("@/components/DesignConceptSection").then(
      (mod) => mod.DesignConceptSection
    ),
  {
    loading: () => <div className="h-screen bg-white" />, 
  }
);

const FasilitasSection = dynamic(() =>
  import("@/components/LayoutSection").then((mod) => mod.FasilitasSection)
);

const LocationDetail = dynamic(() =>
  import("@/components/Lokasi").then((mod) => mod.LocationDetail)
);

const PaymentSchedulePage = dynamic(
  () => import("@/components/Pembayaran").then((mod) => mod.default) 
);

const FAQs = dynamic(() => import("@/components/FAQs").then((mod) => mod.FAQs));

const LeadForm = dynamic(() =>
  import("@/components/Leadform").then((mod) => mod.LeadForm)
);

const Footer = dynamic(() =>
  import("@/components/Footer").then((mod) => mod.Footer)
);

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="overflow-x-clip relative w-full">
        <Hero />
        <DesignConceptSection />
        <FasilitasSection />
        <LocationDetail />
        <PaymentSchedulePage />
        <FAQs />
        <LeadForm />
      </main>

      <Footer />
    </>
  );
}
