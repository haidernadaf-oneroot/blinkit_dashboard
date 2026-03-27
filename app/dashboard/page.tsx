"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import HistoryPage from "../components/history";

type TruckData = {
  _id: string;
  truck_number: string;
  totalApproved: number;
  date: string;
  sqsCountComplete: boolean;
};

export default function DashboardPage() {
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [showHistoryPage, setShowHistoryPage] = useState(false);
  const [truckNumber, setTruckNumber] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [liveData, setLiveData] = useState<TruckData[]>([]);

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
      router.replace("/login");
      return;
    }

    fetchYoutubeLink();
    fetchLiveStats();

    // ✅ AUTO REFRESH EVERY 10 SEC
    const interval = setInterval(fetchLiveStats, 10000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Fetch YouTube from backend
  const fetchYoutubeLink = async () => {
    if (!API_BASE_URL) return;

    try {
      const res = await fetch(`${API_BASE_URL}/youtube`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) return;

      const data = await res.json();

      if (!data.youtube_url) return;

      const videoId = new URL(data.youtube_url).searchParams.get("v");

      if (videoId) {
        setVideoUrl(`https://www.youtube.com/embed/${videoId}`);
      }
    } catch (err) {
      console.error("YouTube error:", err);
    }
  };

  // ✅ Fetch Live Stats
  const fetchLiveStats = async () => {
    if (!API_BASE_URL) return;

    try {
      const res = await fetch(
        "https://counting-dashboard-backend.onrender.com/totals/counts",
        {
          headers: getAuthHeaders(),
          cache: "no-store",
        },
      );

      if (!res.ok) return;

      const data = await res.json();
      setLiveData(data.data || []);
    } catch (err) {
      console.error("Live stats error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  const handleStart = async () => {
    if (!truckNumber.trim()) {
      alert("Enter Truck Number first");
      return;
    }

    if (!API_BASE_URL) return;

    try {
      setLoading(true);

      // 1️⃣ Update truck
      await fetch(`${API_BASE_URL}/update_truck`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ truck_number: truckNumber }),
      });

      // 2️⃣ Start
      await fetch(`${API_BASE_URL}/start`, {
        headers: getAuthHeaders(),
      });

      alert("Recording Started ✅");
    } catch (err) {
      console.error(err);
      alert("Start failed");
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    if (!API_BASE_URL) return;

    try {
      setLoading(true);

      await fetch(`${API_BASE_URL}/stop`, {
        headers: getAuthHeaders(),
      });

      alert("Recording Stopped ✅");
    } catch (err) {
      console.error(err);
      alert("Stop failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showHistoryPage ? (
        <HistoryPage onBack={() => setShowHistoryPage(false)} />
      ) : (
        <div className="min-h-screen bg-gray-50/50">
          <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl shadow p-6 flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Dashboard</h1>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowHistoryPage(true)}
                  className="px-5 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800"
                >
                  History
                </button>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LEFT SIDE */}
              <div className="space-y-6">
                {/* Video */}
                <div className="rounded-2xl overflow-hidden shadow bg-black">
                  <div className="aspect-video">
                    {videoUrl ? (
                      <iframe
                        className="w-full h-full"
                        src={videoUrl}
                        allowFullScreen
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-white">
                        Loading video...
                      </div>
                    )}
                  </div>
                </div>

                {/* Truck Input + Buttons */}
                <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow">
                  <input
                    placeholder="Enter Truck Number"
                    value={truckNumber}
                    onChange={(e) => setTruckNumber(e.target.value)}
                    className="w-full border p-3 rounded-lg mb-4 text-black"
                  />

                  <div className="flex gap-4">
                    <button
                      onClick={handleStart}
                      disabled={loading}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
                    >
                      {loading ? "Starting..." : "Start"}
                    </button>

                    <button
                      onClick={handleStop}
                      disabled={loading}
                      className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
                    >
                      {loading ? "Stopping..." : "End"}
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE - LIVE STATS */}
              <div className="bg-white rounded-2xl border-4 border-gray-200  shadow-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">Live Stats</h2>

                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">Truck</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Approved</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {liveData.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-4 text-center">
                          No Data
                        </td>
                      </tr>
                    ) : (
                      liveData.map((item) => (
                        <tr key={item._id} className="border-t">
                          <td className="p-3 font-semibold text-black">
                            {item.truck_number}
                          </td>
                          <td className="p-3 text-black">{item.date}</td>
                          <td className="p-3 text-black">
                            {item.totalApproved}
                          </td>
                          <td className="p-3 text-black">
                            {item.sqsCountComplete ? (
                              <span className="text-green-600 font-medium">
                                Completed
                              </span>
                            ) : (
                              <span className="text-yellow-600 font-medium">
                                Processing
                              </span>
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
        </div>
      )}
    </>
  );
}
