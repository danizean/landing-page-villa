"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  Search,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  X,
  Save,
  Filter,
  Download,
  Users,
  CheckCircle,
  Clock,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";

// Interface disesuaikan dengan DB: public.leads
interface Lead {
  id: string;
  created_at: string;
  nama: string;
  domisili: string;
  no_wa?: string; // Ubah jadi optional untuk menghindari crash jika undefined
  whatsapp?: string; // Tambahkan fallback untuk data lama
  jadwal_cek_lokasi?: string | null;
  status: string;
  keterangan?: string;
  source?: string;
  admin_notes?: string;
}

// Konfigurasi Warna Status
const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  Baru: {
    label: "Baru Masuk",
    color: "#3b82f6",
    bg: "bg-blue-50 text-blue-700 border-blue-200",
  },
  Dihubungi: {
    label: "Follow Up",
    color: "#6366f1",
    bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  Prospek: {
    label: "Prospek Hot",
    color: "#eab308",
    bg: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  Survei: {
    label: "Jadwal Survei",
    color: "#a855f7",
    bg: "bg-purple-50 text-purple-700 border-purple-200",
  },
  Closing: {
    label: "Closing / Deal",
    color: "#22c55e",
    bg: "bg-green-50 text-green-700 border-green-200",
  },
  Batal: {
    label: "Junk / Batal",
    color: "#ef4444",
    bg: "bg-red-50 text-red-700 border-red-200",
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editForm, setEditForm] = useState({ status: "", admin_notes: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }
      fetchLeads();
    };
    init();
  }, [router]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error: any) {
      console.error("Fetch Error:", error);
      toast.error("Gagal memuat data leads.");
    } finally {
      setLoading(false);
    }
  };

  // Helper aman untuk ambil nomor HP (mendukung 'no_wa' atau 'whatsapp')
  const getPhone = (lead: Lead) => lead.no_wa || lead.whatsapp || "";

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const phone = getPhone(lead);
      const matchSearch =
        lead.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm) ||
        lead.domisili?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === "All" || lead.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [leads, searchTerm, statusFilter]);

  const handleExportCSV = () => {
    const headers = [
      "Tanggal Masuk",
      "Nama",
      "Domisili",
      "WhatsApp",
      "Rencana Cek Lokasi",
      "Status",
      "Catatan Admin",
      "Pesan User",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredLeads.map((lead) =>
        [
          `"${new Date(lead.created_at).toLocaleDateString("id-ID")}"`,
          `"${lead.nama}"`,
          `"${lead.domisili}"`,
          `'${getPhone(lead)}`, // Gunakan helper
          `"${
            lead.jadwal_cek_lokasi
              ? new Date(lead.jadwal_cek_lokasi).toLocaleDateString("id-ID")
              : "-"
          }"`,
          `"${lead.status}"`,
          `"${lead.admin_notes || ""}"`,
          `"${lead.keterangan || ""}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Leads_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const openEditModal = (lead: Lead) => {
    setSelectedLead(lead);
    setEditForm({
      status: lead.status || "Baru",
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
        .update({
          status: editForm.status,
          admin_notes: editForm.admin_notes,
        })
        .eq("id", selectedLead.id);

      if (error) throw error;

      toast.success("Data berhasil diperbarui!");
      setIsModalOpen(false);
      fetchLeads();
    } catch (error: any) {
      console.error("Update Error:", error);
      toast.error("Gagal update: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG["Baru"];
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] md:text-xs font-semibold border ${config.bg}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-amber-500" /> Manajemen Leads
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Monitoring data calon pembeli villa secara realtime.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              Total Masuk
            </p>
            <p className="text-2xl font-extrabold text-slate-900">
              {leads.length}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              Jadwal Survei
            </p>
            <p className="text-2xl font-extrabold text-slate-900">
              {
                leads.filter(
                  (l) => l.jadwal_cek_lokasi !== null || l.status === "Survei"
                ).length
              }
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              Closing
            </p>
            <p className="text-2xl font-extrabold text-slate-900">
              {leads.filter((l) => l.status === "Closing").length}
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama / No WA..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm transition"
            />
          </div>
          <div className="relative">
            <div className="absolute left-3 top-2.5 pointer-events-none">
              <Filter className="w-4 h-4 text-slate-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm appearance-none cursor-pointer"
            >
              <option value="All">Semua Status</option>
              {Object.keys(STATUS_CONFIG).map((s) => (
                <option key={s} value={s}>
                  {STATUS_CONFIG[s].label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex flex-1 sm:flex-none justify-center items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-900 transition shadow-md"
          >
            <Download className="w-4 h-4" />{" "}
            <span className="">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-slate-200 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">
            Tidak ada data ditemukan.
          </p>
          <p className="text-slate-400 text-sm">
            Coba ubah filter pencarian Anda.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile View (Card List) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredLeads.map((lead) => {
              const phone = getPhone(lead);
              return (
                <div
                  key={lead.id}
                  className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 active:scale-[0.99] transition-transform"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900">{lead.nama}</h4>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <Clock className="w-3 h-3" />
                        {new Date(lead.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <StatusBadge status={lead.status} />
                  </div>

                  <div className="space-y-2 text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />{" "}
                      {lead.domisili}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <a
                        href={`https://wa.me/${(phone || "")
                          .replace(/^0/, "62")
                          .replace(/\+/g, "")}`}
                        target="_blank"
                        className="text-green-600 font-medium hover:underline"
                      >
                        {phone || "-"}
                      </a>
                    </div>
                    {lead.jadwal_cek_lokasi && (
                      <div className="flex items-center gap-2 text-amber-600 font-medium">
                        <Calendar className="w-4 h-4" />
                        Cek Lokasi:{" "}
                        {new Date(lead.jadwal_cek_lokasi).toLocaleDateString(
                          "id-ID"
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs text-slate-400 italic max-w-[60%] truncate">
                      {lead.admin_notes || "Belum ada catatan"}
                    </span>
                    <button
                      onClick={() => openEditModal(lead)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md hover:bg-slate-900 transition shadow-md"
                    >
                      <Edit3 className="w-3 h-3" /> Kelola
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop View (Table) */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                    User Info
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                    Jadwal Cek Lokasi
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                    Catatan
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => {
                  const phone = getPhone(lead);
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50 transition group"
                    >
                      <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        <br />
                        <span className="text-xs text-slate-400">
                          {new Date(lead.created_at).toLocaleTimeString(
                            "id-ID",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">
                            {lead.nama}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" /> {phone || "-"}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" /> {lead.domisili}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {lead.jadwal_cek_lokasi ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium border border-amber-100">
                            <Calendar size={12} />
                            {new Date(
                              lead.jadwal_cek_lokasi
                            ).toLocaleDateString("id-ID")}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        {lead.admin_notes ? (
                          <span
                            className="text-xs text-slate-600 block truncate"
                            title={lead.admin_notes}
                          >
                            {lead.admin_notes}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-300 italic">
                            -
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          <a
                            href={`https://wa.me/${(phone || "")
                              .replace(/^0/, "62")
                              .replace(/\+/g, "")}`}
                            target="_blank"
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition border border-transparent hover:border-green-200"
                            title="Chat WhatsApp"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => openEditModal(lead)}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-full transition border border-transparent hover:border-amber-200"
                            title="Edit Status"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal Edit Status */}
      {isModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">
                Update Status Prospek
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* User Detail Card in Modal */}
              <div className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-xl border border-amber-100 shadow-sm">
                <p className="text-xs text-amber-600 uppercase font-bold tracking-wider mb-2 flex items-center gap-1">
                  <Users size={12} /> Data User
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {selectedLead.nama}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />{" "}
                    {getPhone(selectedLead) || "-"}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />{" "}
                    {selectedLead.domisili}
                  </div>
                </div>

                {selectedLead.jadwal_cek_lokasi && (
                  <div className="mt-3 bg-white p-2 rounded-lg border border-amber-100 flex items-center gap-2 text-sm text-amber-700">
                    <Calendar size={14} />
                    Rencana cek lokasi:{" "}
                    <span className="font-semibold">
                      {new Date(
                        selectedLead.jadwal_cek_lokasi
                      ).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-amber-200/50">
                  <p className="text-xs text-amber-800 italic flex gap-2">
                    <MessageSquare size={12} className="shrink-0 mt-0.5" />
                    &quot;{selectedLead.keterangan || "Tidak ada pesan khusus"}
                    &quot;
                  </p>
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Pilih Status Baru
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(STATUS_CONFIG).map((key) => (
                    <button
                      key={key}
                      onClick={() => setEditForm({ ...editForm, status: key })}
                      className={`text-xs py-3 px-3 rounded-lg border transition-all duration-200 text-left flex items-center gap-2 font-medium ${
                        editForm.status === key
                          ? `ring-2 ring-offset-1 ${STATUS_CONFIG[key].bg
                              .replace("bg-", "bg-white ")
                              .replace("text-", "ring-")}`
                          : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: STATUS_CONFIG[key].color }}
                      ></div>
                      {STATUS_CONFIG[key].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Catatan Internal (Admin)
                </label>
                <textarea
                  rows={3}
                  value={editForm.admin_notes}
                  onChange={(e) =>
                    setEditForm({ ...editForm, admin_notes: e.target.value })
                  }
                  placeholder="Tulis progress follow-up, jadwal meeting, dll..."
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition"
              >
                Batal
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={saving}
                className="px-6 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition"
              >
                {saving ? (
                  "Menyimpan..."
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Simpan Perubahan
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
