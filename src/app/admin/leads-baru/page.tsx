"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  Phone,
  MapPin,
  Calendar,
  Edit3,
  X,
  Save,
  Sparkles,
  MessageCircle,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

interface Lead {
  id: number;
  created_at: string;
  nama: string;
  domisili: string;
  whatsapp: string;
  keterangan: string;
  status: string;
  admin_notes: string;
}

const STATUS_OPTIONS = [
  { value: "Baru", label: "Baru Masuk", color: "bg-blue-100 text-blue-800" },
  {
    value: "Dihubungi",
    label: "Sudah Dihubungi",
    color: "bg-indigo-100 text-indigo-800",
  },
  {
    value: "Prospek",
    label: "Prospek Hot",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "Survei",
    label: "Jadwal Survei",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "Closing",
    label: "Closing / Deal",
    color: "bg-green-100 text-green-800",
  },
  { value: "Batal", label: "Junk / Batal", color: "bg-red-100 text-red-800" },
];

export default function LeadsBaruPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editForm, setEditForm] = useState({ status: "", admin_notes: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNewLeads();
  }, []);

  const fetchNewLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("status", "Baru")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error: any) {
      toast.error("Gagal memuat data leads baru.");
    } finally {
      setLoading(false);
    }
  };

  const openProcessModal = (lead: Lead) => {
    setSelectedLead(lead);
    setEditForm({
      status: "Dihubungi",
      admin_notes: lead.admin_notes || "",
    });
    setIsModalOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedLead) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status: editForm.status, admin_notes: editForm.admin_notes })
        .eq("id", selectedLead.id);
      if (error) throw error;
      toast.success("Lead berhasil diproses!");
      setIsModalOpen(false);
      fetchNewLeads();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 rounded-2xl shadow-lg text-white flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="text-yellow-300 animate-pulse" /> Leads Baru
            Masuk
          </h1>
          <p className="text-blue-100 text-sm mt-1">
            Daftar calon customer yang <strong>belum dihubungi</strong>. Segera
            follow up!
          </p>
        </div>
        <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/30 text-center min-w-[100px]">
          <p className="text-xs font-semibold uppercase opacity-80">
            Total Antrian
          </p>
          <p className="text-3xl font-extrabold">{leads.length}</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-slate-200 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="text-green-600 w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Semua Beres!</h3>
          <p className="text-slate-500">Tidak ada lead baru yang menunggu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                BARU
              </div>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-lg text-slate-900">
                      {lead.nama}
                    </h4>
                    <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(lead.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-slate-400" />{" "}
                      {lead.domisili}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4 text-slate-400" />{" "}
                      {lead.whatsapp}
                    </div>
                  </div>
                  {lead.keterangan && (
                    <div className="bg-amber-50 border-l-2 border-amber-400 p-2 rounded-r-lg">
                      {/* FIX 1: Menggunakan &quot; untuk kutip */}
                      <p className="text-xs text-amber-800 italic">
                        &quot;{lead.keterangan}&quot;
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-row md:flex-col justify-end gap-2 min-w-[140px]">
                  <a
                    href={`https://wa.me/${lead.whatsapp
                      .replace(/^0/, "62")
                      .replace(/\+/g, "")}?text=Halo%20Kak%20${
                      lead.nama
                    },%20terima%20kasih%20sudah%20tertarik%20dengan%20Villa%20Lodji%20Svarga...`}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-700 hover:bg-green-100 px-4 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                  <button
                    onClick={() => openProcessModal(lead)}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-lg text-sm font-semibold transition shadow-md"
                  >
                    <Edit3 className="w-4 h-4" /> Proses
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Proses Lead Baru</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">
                {/* FIX 2: Mengganti "Baru" menjadi &quot;Baru&quot; */}
                Update status untuk <strong>{selectedLead.nama}</strong> agar
                hilang dari list &quot;Baru&quot;.
              </p>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Pilih Status Lanjutan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {STATUS_OPTIONS.filter((s) => s.value !== "Baru").map(
                    (opt) => (
                      <button
                        key={opt.value}
                        onClick={() =>
                          setEditForm({ ...editForm, status: opt.value })
                        }
                        className={`text-xs py-2 px-3 rounded-lg border text-left font-medium transition ${
                          editForm.status === opt.value
                            ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
                            : "border-slate-200 hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        {opt.label}
                      </button>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Catatan Admin
                </label>
                <textarea
                  rows={2}
                  value={editForm.admin_notes}
                  onChange={(e) =>
                    setEditForm({ ...editForm, admin_notes: e.target.value })
                  }
                  placeholder="Contoh: Sudah dichat, respon positif..."
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <button
                onClick={handleSaveChanges}
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition flex justify-center items-center gap-2"
              >
                {saving ? (
                  "Menyimpan..."
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Simpan & Selesaikan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
