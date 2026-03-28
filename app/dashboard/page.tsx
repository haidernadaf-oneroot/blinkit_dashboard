"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Camera,
  CheckCircle2,
  LogOut,
  Play,
  Square,
  Truck,
  Video,
  X,
} from "lucide-react";
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
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [truckNumber, setTruckNumber] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [liveData, setLiveData] = useState<TruckData[]>([]);

  const activeLiveData = liveData.filter((item) => !item.sqsCountComplete);
  const latestTruck = activeLiveData[0];
  const liveCount = Number(latestTruck?.totalApproved || 0);
  const currentTruckNumber = truckNumber || latestTruck?.truck_number || "1234";
  const currentStatus = latestTruck ? "UNLOADING" : "STOPPED";

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, []);

  const fetchYoutubeLink = useCallback(async () => {
    if (!API_BASE_URL) return;

    try {
      const res = await fetch(`${API_BASE_URL}/youtube`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) return;

      const data = await res.json();
      if (!data.youtube_url) return;

      const parsedUrl = new URL(data.youtube_url);
      const videoId = parsedUrl.searchParams.get("v");

      if (videoId) {
        setVideoUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1`);
        return;
      }

      setVideoUrl(data.youtube_url);
    } catch (err) {
      console.error("YouTube error:", err);
    }
  }, [API_BASE_URL, getAuthHeaders]);

  const fetchLiveStats = useCallback(async () => {
    if (!API_BASE_URL) return;

    try {
      const res = await fetch(
        "https://counting-dashboard-backend-pd3y.onrender.com/totals/counts",
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
  }, [API_BASE_URL, getAuthHeaders]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    fetchYoutubeLink();
    fetchLiveStats();

    const interval = setInterval(fetchLiveStats, 30000);
    return () => clearInterval(interval);
  }, [fetchLiveStats, fetchYoutubeLink, router]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowVideoModal(false);
      }
    };

    if (showVideoModal) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showVideoModal]);

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

      await fetch(`${API_BASE_URL}/update_truck`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ truck_number: truckNumber }),
      });

      await fetch(`${API_BASE_URL}/start`, {
        headers: getAuthHeaders(),
      });

      alert("Recording Started");
      fetchLiveStats();
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

      alert("Recording Stopped");
      fetchLiveStats();
    } catch (err) {
      console.error(err);
      alert("Stop failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenVideo = () => {
    setShowVideoModal(true);
  };

  return showHistoryPage ? (
    <HistoryPage onBack={() => setShowHistoryPage(false)} />
  ) : (
    <>
      <div className="min-h-screen bg-[#fcfcf8] text-[#101010]">
        <header className="border-b border-black/10 bg-white/85 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex h-12 w-20 items-center justify-center rounded-2xl bg-[#ffd21f] text-lg font-black lowercase text-black shadow-[inset_0_-4px_8px_rgba(0,0,0,0.08)]">
              blinkit
            </div>

            <div className="flex items-center gap-3">
              <button className="rounded-full border border-black px-7 py-3 text-sm font-semibold text-black">
                Live Ops
              </button>
              <button
                onClick={() => setShowHistoryPage(true)}
                className="rounded-full border border-black/10 bg-white px-7 py-3 text-sm font-medium text-black transition hover:border-black/20"
              >
                History
              </button>
              <button
                onClick={handleLogout}
                className="rounded-full p-3 text-black/60 transition hover:bg-black/5 hover:text-black"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            <section className="rounded-[22px] border border-[#f2e7b5] bg-[#fffdf5] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#727272]">
                    Truck No.
                  </p>
                  <h2 className="mt-3 text-4xl font-bold text-[#f4bf22]">
                    {currentTruckNumber}
                  </h2>
                  <p className="mt-2 flex items-center gap-2 text-base text-[#2a2a2a]">
                    <ArrowUpRight size={15} />
                    Unloading Now
                  </p>
                </div>

                <div className="rounded-2xl bg-[#ffd240] p-4 text-white">
                  <Truck size={22} />
                </div>
              </div>
            </section>

            <section className="rounded-[22px] border border-black/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#727272]">
                    Computer Vision Count
                  </p>
                  <h2 className="mt-3 text-4xl font-bold text-black">
                    {liveCount}
                  </h2>
                  <p className="mt-2 flex items-center gap-2 text-base text-[#2a2a2a]">
                    <ArrowUpRight size={15} />
                    Live from Python Backend
                  </p>
                </div>

                <div className="rounded-2xl bg-[#fff8df] p-4 text-[#f4bf22]">
                  <Camera size={22} />
                </div>
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-[22px] border border-black/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-[#04102a]">
                  Truck {currentTruckNumber}
                </h2>
                <p className="mt-2 text-lg text-[#5b6475]">
                  Status:{" "}
                  <span className="font-semibold text-[#6b717d]">
                    {currentStatus}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {/* <label className="min-w-[220px] flex-1 lg:flex-none">
                  <span className="mb-2 block text-sm font-medium text-[#6b7280]">
                    Truck Number
                  </span>
                  <input
                    placeholder="Enter Truck Number"
                    value={truckNumber}
                    onChange={(e) => setTruckNumber(e.target.value)}
                    className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-3 text-base outline-none transition focus:border-[#ffd240] focus:bg-white"
                  />
                </label> */}

                <button
                  onClick={handleStart}
                  disabled={loading}
                  className="inline-flex min-w-32 items-center justify-center gap-3 rounded-2xl px-6 py-4 text-[17px] font-semibold text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Play size={20} fill="currentColor" />
                  {loading ? "Working..." : "Start"}
                </button>

                <button
                  onClick={handleStop}
                  disabled={loading}
                  className="inline-flex min-w-36 items-center justify-center gap-3 rounded-2xl bg-[#95d0aa] px-6 py-4 text-[17px] font-semibold text-[#6d7170] transition hover:bg-[#86c79d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Square size={18} fill="currentColor" />
                  {loading ? "Working..." : "Stop"}
                </button>
              </div>
            </div>
          </section>

          {/* <section className="mt-8 rounded-[22px] border border-[#ffb9b1] bg-[#fff1f0] p-4 shadow-[0_10px_30px_rgba(255,92,92,0.04)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#ff5648]">
                End Session & Invoice
              </p>

              <button className="rounded-2xl bg-[#ff3b34] px-7 py-4 text-xl font-semibold text-black shadow-[0_14px_30px_rgba(255,59,52,0.24)] transition hover:translate-y-[-1px] hover:shadow-[0_18px_34px_rgba(255,59,52,0.28)]">
                Terminate / Invoice
              </button>
            </div>
          </section> */}

          <section className="mt-8 rounded-[22px] border border-[#f4e3a4] bg-[#fffdf5] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-[#ffd240] p-3 text-[#10915e]">
                  <CheckCircle2 size={24} />
                </div>

                <div>
                  <h3 className="text-[18px] font-semibold text-black">
                    Entry Logged Successfully
                  </h3>
                  <p className="text-lg text-[#6b7280]">
                    Truck {currentTruckNumber}
                  </p>
                </div>
              </div>

              <button className="rounded-2xl bg-[#ffd240] px-6 py-3 text-lg font-medium text-[#0a8f5b] transition hover:bg-[#ffcb1b]">
                New Entry
              </button>
            </div>
          </section>

          <section className="mt-8 overflow-hidden rounded-[22px] border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <div className="px-6 py-5">
              <h2 className="text-[19px] font-semibold text-[#081124]">
                Session Entries
              </h2>
              <p className="mt-1 text-lg text-[#6b7280]">Live logs</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-[#c7e3cc] text-left">
                  <tr className="text-[15px] uppercase tracking-[0.08em] text-[#69707d]">
                    <th className="px-6 py-4 font-semibold">Stream</th>
                    <th className="px-6 py-4 font-semibold">Truck No</th>
                    <th className="px-6 py-4 font-semibold">CV Count</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeLiveData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-10 text-center text-base text-[#6b7280]"
                      >
                        No active live entries available yet.
                      </td>
                    </tr>
                  ) : (
                    activeLiveData.map((item) => (
                      <tr
                        key={item._id}
                        className="border-t border-black/5 bg-[#fffef9]"
                      >
                        <td className="px-6 py-5">
                          <button
                            onClick={handleOpenVideo}
                            className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-2 text-[18px] font-medium text-[#ff5148] shadow-sm transition hover:border-[#ffb5b0] hover:bg-[#fff6f5]"
                          >
                            <Play size={15} fill="currentColor" />
                            Watch Live
                          </button>
                        </td>
                        <td className="px-6 py-5 text-[18px] text-[#2c2c2c]">
                          {item.truck_number}
                        </td>
                        <td className="px-6 py-5 text-[22px] font-semibold text-[#f4bf22]">
                          {item.totalApproved}
                        </td>
                        <td className="px-6 py-5">
                          <span className="rounded-full border border-black/60 px-4 py-1.5 text-[15px] text-[#2c2c2c]">
                            {item.sqsCountComplete ? "Completed" : "Unloading"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {showVideoModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#7b8190]">
                  Live Feed
                </p>
                <h3 className="text-2xl font-bold text-[#0b1324]">
                  Truck {currentTruckNumber}
                </h3>
              </div>

              <button
                onClick={() => setShowVideoModal(false)}
                className="rounded-full p-2 text-black/60 transition hover:bg-black/5 hover:text-black"
                aria-label="Close video popup"
              >
                <X size={22} />
              </button>
            </div>

            <div className="bg-[#0f1117]">
              <div className="aspect-video">
                {videoUrl ? (
                  <iframe
                    className="h-full w-full"
                    src={videoUrl}
                    title="Live stream"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-4 text-white/80">
                    <div className="rounded-3xl bg-white/10 p-4">
                      <Video size={30} />
                    </div>
                    <p className="text-lg">Video stream is loading...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
