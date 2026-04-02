"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import {
  ArrowLeft,
  Download,
  FileText,
  LoaderCircle,
  Truck,
} from "lucide-react";

type Truck = {
  _id: string;
  truck_number: string;
  totalApproved: number;
  entries: number;
  date: string;
  sqsCountComplete: boolean;
};

export default function HistoryPage({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [truckNumber, setTruckNumber] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({
    totalSessions: 0,
    completed: 0,
    pendingReports: 0,
  });

  const limit = 5; // you want 1 2 3 4 5 style

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }
    fetchTrucks();
  }, [page, truckNumber, date]);

  async function fetchTrucks() {
    try {
      if (!API_BASE_URL) throw new Error("API not configured");

      const query = new URLSearchParams({
        ...(truckNumber && { truck_number: truckNumber }),
        ...(date && { date }),
        page: page.toString(),
        limit: limit.toString(),
      });

      const res = await fetch(
        `https://counting-dashboard-backend-pd3y.onrender.com/totals/counts?${query.toString()}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          cache: "no-store",
        },
      );

      if (!res.ok) throw new Error("Failed to fetch trucks");

      const data = await res.json();
      setTrucks(data.data || []);
      setTotal(data.total || 0);
      setStats(
        data.stats || {
          totalSessions: 0,
          completed: 0,
          pendingReports: 0,
        },
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function generatePDF(truck: Truck) {
    try {
      if (!API_BASE_URL) throw new Error("API not configured");

      const countRes = await fetch(`${API_BASE_URL}/count`, {
        method: "GET",
        headers: getAuthHeaders(),
        cache: "no-store",
      });

      if (!countRes.ok) throw new Error("Failed to fetch count");

      const countData = await countRes.json();

      const approvedCount = Number(truck.totalApproved) || 0;
      const sqsCount = Number(countData.count) || 0;
      const finalTotal = approvedCount + sqsCount;

      const doc = new jsPDF();
      const logo = new Image();
      logo.src = "/blinkit.jpg";

      logo.onload = () => {
        const generatedAt = new Date();
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFillColor(255, 250, 230);
        doc.rect(0, 0, pageWidth, 297, "F");

        doc.setFillColor(255, 210, 31);
        doc.roundedRect(14, 14, pageWidth - 28, 34, 8, 8, "F");
        doc.addImage(logo, "JPEG", 20, 17, 32, 22);

        doc.setTextColor(17, 24, 39);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text("Truck Summary Report", 60, 28);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        doc.setFillColor(255, 255, 255);
        doc.roundedRect(14, 58, pageWidth - 28, 64, 8, 8, "F");

        doc.setTextColor(107, 114, 128);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("TRUCK NUMBER", 22, 74);
        doc.text("SESSION DATE", 22, 94);
        doc.text("GENERATED AT", 22, 114);

        doc.setTextColor(17, 24, 39);
        doc.setFontSize(16);
        doc.text(String(truck.truck_number), 90, 74);
        doc.text(formatDate(truck.date), 90, 94);
        doc.text(
          generatedAt.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          90,
          114,
        );

        doc.setFillColor(255, 255, 255);
        doc.roundedRect(14, 132, pageWidth - 28, 52, 8, 8, "F");
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(10);
        doc.text("COUNT BREAKDOWN", 22, 146);

        doc.setTextColor(17, 24, 39);
        doc.setFontSize(13);
        doc.text(`Manual Error Ai Analysis Count`, 22, 161);
        doc.text(String(approvedCount), pageWidth - 22, 161, {
          align: "right",
        });
        doc.text(`Total Analysis Count`, 22, 173);
        doc.text(String(sqsCount), pageWidth - 22, 173, { align: "right" });

        doc.setFillColor(22, 163, 74);
        doc.roundedRect(14, 194, pageWidth - 28, 34, 8, 8, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("FINAL TOTAL COUNT", 22, 208);
        doc.setFontSize(22);
        doc.text(String(finalTotal), pageWidth - 22, 210, { align: "right" });

        doc.setTextColor(107, 114, 128);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Generated for completed truck session records.", 14, 244);
        doc.save(`Truck-${truck.truck_number}.pdf`);
      };
    } catch (err) {
      console.error("PDF Error:", err);
    }
  }

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const completedCount = trucks.filter(
    (truck) => truck.sqsCountComplete,
  ).length;
  const pendingCount = trucks.length - completedCount;

  const clearFilters = () => {
    setTruckNumber("");
    setDate("");
    setPage(1);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-white/70 bg-white/80 p-4 shadow-[0_20px_80px_rgba(17,24,39,0.08)] backdrop-blur md:p-6">
          <div className="mb-6 flex flex-col gap-4 border-b border-black/5 pb-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-[#ffd21f] p-4 text-black">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-neutral-500">
                  Archived Sessions
                </p>
                <h1 className="text-3xl font-bold tracking-tight text-neutral-950">
                  Truck history and PDF reports
                </h1>
                <p className="mt-1 text-sm text-neutral-600">
                  Download the final summary once counting is completed.
                </p>
              </div>
            </div>

            <button
              onClick={onBack}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 transition hover:-translate-y-0.5 hover:border-neutral-900 hover:shadow-sm"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[26px] border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Total Sessions
              </p>
              <p className="mt-3 text-4xl font-bold text-neutral-950">
                {stats.totalSessions}
              </p>
            </div>

            <div className="rounded-[26px] border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Completed
              </p>
              <p className="mt-3 text-4xl font-bold text-emerald-700">
                {stats.completed}
              </p>
            </div>

            <div className="rounded-[26px] border border-amber-200 bg-[linear-gradient(135deg,#fffdf0_0%,#fff6c5_100%)] p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Pending Reports
              </p>
              <p className="mt-3 text-4xl font-bold text-neutral-950">
                {stats.pendingReports}
              </p>
            </div>
          </div>

          {/* ✅ FILTER */}
          <div className="mb-4 flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Truck Number"
              value={truckNumber}
              onChange={(e) => setTruckNumber(e.target.value)}
              className="border px-3 py-2 rounded"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border px-3 py-2 rounded"
            />

            <button
              onClick={() => {
                setPage(1);
                fetchTrucks();
              }}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Apply
            </button>

            {/* ✅ NEW BUTTON */}
            <button
              onClick={clearFilters}
              className="bg-gray-200 text-black px-4 py-2 rounded"
            >
              Clear
            </button>
          </div>

          {/* ✅ DATA LIST */}
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center gap-3 rounded-[28px] border border-neutral-200 bg-white px-6 py-14 text-neutral-600">
                <LoaderCircle className="animate-spin" size={18} />
                Loading history...
              </div>
            ) : trucks.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-neutral-300 bg-neutral-50 px-6 py-14 text-center text-neutral-500">
                No truck history found yet.
              </div>
            ) : (
              trucks.map((truck) => (
                <div
                  key={truck._id}
                  className="rounded-[28px] border border-neutral-200 bg-[linear-gradient(180deg,#ffffff_0%,#fffdf7_100%)] p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-neutral-100 p-3 text-neutral-700">
                        <Truck size={22} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                          Truck No.
                        </p>
                        <h2 className="mt-1 text-2xl font-bold text-neutral-950">
                          {truck.truck_number}
                        </h2>
                        <p className="mt-2 text-sm text-neutral-600">
                          {truck.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                          truck.sqsCountComplete
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-sky-100 text-sky-700"
                        }`}
                      >
                        {truck.sqsCountComplete ? "Completed" : "Processing"}
                      </span>

                      {truck.sqsCountComplete ? (
                        <button
                          onClick={() => generatePDF(truck)}
                          className="inline-flex items-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
                        >
                          <Download size={16} />
                          Download PDF
                        </button>
                      ) : (
                        <button
                          disabled
                          className="rounded-2xl bg-neutral-200 px-5 py-3 text-sm font-semibold text-neutral-500"
                        >
                          Please Wait
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-between mt-10">
            {/* 🔹 LEFT TEXT */}
            <div className="text-sm text-neutral-600">
              Showing{" "}
              <span className="font-semibold">{(page - 1) * limit + 1}</span> to{" "}
              <span className="font-semibold">
                {Math.min(page * limit, total)}
              </span>{" "}
              of <span className="font-semibold">{total}</span> records
            </div>

            {/* 🔹 RIGHT PAGINATION */}
            <div className="flex items-center gap-2">
              {/* ◀️ */}
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="px-2 py-1 text-black disabled:opacity-30"
              >
                {"<"}
              </button>

              {/* 🔢 NUMBERS */}
              {Array.from({ length: Math.ceil(total / limit) }, (_, i) => i + 1)
                .slice(page - 1, page + 4)
                .map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 rounded ${
                      page === p
                        ? "bg-black text-white font-semibold"
                        : "text-neutral-700"
                    }`}
                  >
                    {p}
                  </button>
                ))}

              {/* ▶️ */}
              <button
                disabled={page === Math.ceil(total / limit)}
                onClick={() =>
                  setPage((prev) =>
                    Math.min(prev + 1, Math.ceil(total / limit)),
                  )
                }
                className="px-2 py-1 text-black disabled:opacity-30"
              >
                {">"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
