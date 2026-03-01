"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";

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
  }, []);

  async function fetchTrucks() {
    try {
      if (!API_BASE_URL) throw new Error("API not configured");

      const res = await fetch(
        "https://counting-dashboard-backend.onrender.com/totals/today",
        {
          method: "GET",
          headers: getAuthHeaders(),
          cache: "no-store",
        },
      );

      if (!res.ok) throw new Error("Failed to fetch trucks");

      const data = await res.json();
      setTrucks(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // ✅ FINAL TOTAL PDF ONLY
  // ✅ FINAL TOTAL PDF ONLY
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

      // ✅ FORCE NUMBER CONVERSION (THIS FIXES 6200 ISSUE)
      const approvedCount = Number(truck.totalApproved) || 0;
      const sqsCount = Number(countData.count) || 0;

      const finalTotal = approvedCount + sqsCount;

      const doc = new jsPDF();

      const logo = new Image();
      logo.src = "/blinkit.jpg";

      logo.onload = () => {
        doc.addImage(logo, "PNG", 20, 15, 50, 20);

        doc.setFontSize(16);
        doc.text("Truck Summary Report", 20, 45);

        doc.line(20, 50, 190, 50);

        doc.setFontSize(14);
        doc.text(`Truck Number: ${truck.truck_number}`, 20, 65);
        doc.text(`Date: ${truck.date}`, 20, 75);
        doc.text(`Generated Time: ${new Date().toLocaleTimeString()}`, 20, 85);

        doc.line(20, 95, 190, 95);

        // ✅ CORRECT FINAL TOTAL (NOW 206)
        doc.setFontSize(18);
        doc.text(`Final Total Count: ${finalTotal}`, 20, 115);

        doc.save(`Truck-${truck.truck_number}.pdf`);
      };
    } catch (err) {
      console.error("PDF Error:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">Truck History</h1>

          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg"
          >
            Back
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="p-4 text-left">Truck</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Approved</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : trucks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center">
                    No Data Found
                  </td>
                </tr>
              ) : (
                trucks.map((truck) => (
                  <tr key={truck._id} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-semibold">{truck.truck_number}</td>
                    <td className="p-4">{truck.date}</td>
                    <td className="p-4">{truck.totalApproved}</td>
                    <td className="p-4">
                      {truck.sqsCountComplete ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          Completed
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                          Processing
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {truck.sqsCountComplete ? (
                        <button
                          onClick={() => generatePDF(truck)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                          Download PDF
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
                        >
                          Please Wait
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
