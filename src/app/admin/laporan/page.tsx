"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Calendar, TrendingUp } from "lucide-react";

// Warna Chart Donat
const COLORS = [
  "#3b82f6",
  "#eab308",
  "#22c55e",
  "#a855f7",
  "#ef4444",
  "#6366f1",
];

export default function LaporanPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("leads").select("*");
      setLeads(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  // 1. Data untuk Donut Chart (Status Distribution)
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      const s = l.status || "Baru";
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.keys(counts).map((key) => ({
      name: key,
      value: counts[key],
    }));
  }, [leads]);

  // 2. Data untuk Bar Chart (Leads per Bulan)
  const monthlyData = useMemo(() => {
    const counts: Record<string, number> = {};
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];

    leads.forEach((l) => {
      const date = new Date(l.created_at);
      const monthIndex = date.getMonth();
      const key = months[monthIndex];
      counts[key] = (counts[key] || 0) + 1;
    });

    // Urutkan berdasarkan bulan tahun ini (sederhana)
    return Object.keys(counts).map((key) => ({
      name: key,
      leads: counts[key],
    }));
  }, [leads]);

  if (loading) return <div className="p-8 text-center">Memuat Analitik...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <TrendingUp className="text-amber-500" /> Laporan Performa
        </h1>
        <p className="text-slate-500 mt-1">
          Analisa visual data prospek yang masuk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: Komposisi Status (Donat) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-6 text-center">
            Distribusi Status Leads
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Tren Bulanan (Batang) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-6 text-center">
            Tren Leads Masuk (Bulanan)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="leads"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
