"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Menu, X } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Jika halaman login, render polosan saja
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Desktop (Hidden on Mobile) */}
      <div className="hidden md:block sticky top-0 h-screen">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar (Drawer) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm md:hidden">
          <div className="w-64 h-full bg-white shadow-xl animate-in slide-in-from-left duration-200">
            <div className="flex justify-end p-2">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-500"
              >
                <X size={24} />
              </button>
            </div>
            <AdminSidebar
              isMobile
              closeMobile={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header Toggle */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-40">
          <span className="font-bold text-slate-800">Dashboard</span>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 bg-slate-100 rounded-lg"
          >
            <Menu size={20} className="text-slate-600" />
          </button>
        </header>

        {/* Halaman yang dirender (Dashboard / Laporan) */}
        <div className="flex-1 overflow-auto p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
