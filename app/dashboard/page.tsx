// "use client";

// import { useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Truck, Calendar, Package, AlertCircle, LogOut } from "lucide-react";

// type Row = {
//   date: string;
//   vendor: string;
//   count: number;
//   manual: number;
// };

// const data: Row[] = [
//   { date: "2026-02-20", vendor: "Vendor A", count: 120, manual: 10 },
//   { date: "2026-02-21", vendor: "Vendor B", count: 90, manual: 5 },
//   { date: "2026-02-22", vendor: "Vendor C", count: 150, manual: 12 },
//   { date: "2026-02-23", vendor: "Vendor A", count: 80, manual: 7 },
// ];

// export default function DashboardPage() {
//   const router = useRouter();
//   const totals = useMemo(() => {
//     return {
//       count: data.reduce((a, b) => a + b.count, 0),
//       manual: data.reduce((a, b) => a + b.manual, 0),
//     };
//   }, []);

//   const [showHistoryModal, setShowHistoryModal] = useState(false);
//   const [truckNumber, setTruckNumber] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleHistorySubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!truckNumber.trim()) return;

//     setIsLoading(true);
//     setTimeout(() => {
//       setIsLoading(false);
//       alert(`History search for truck: ${truckNumber.trim().toUpperCase()}`);
//       setShowHistoryModal(false);
//       setTruckNumber("");
//     }, 1800);
//   };

//   const handleLogout = () => {
//     // Add your logout logic here (e.g. clear token, redirect)
//     router.push("/login");
//     // Example: window.location.href = "/login";
//   };

//   return (
//     <div className="min-h-screen bg-gray-50/50">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2">
//         {/* Header */}

//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight text-gray-900">
//               Dashboard
//             </h1>
//             <p className="mt-1 text-gray-500">Overview of recent shipments</p>
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setShowHistoryModal(true)}
//               className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition shadow-sm font-medium"
//             >
//               <Truck size={18} />
//               History
//             </button>

//             <button
//               onClick={handleLogout}
//               className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 border border-red-200 transition font-medium"
//             >
//               <LogOut size={18} />
//               Logout
//             </button>
//           </div>
//         </div>

//         {/* Main two-column layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
//           {/* LEFT COLUMN - Video */}
//           <div className="space-y-6">
//             <div className="rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-900 to-black border border-gray-800/30">
//               <div className="aspect-video">
//                 <iframe
//                   className="w-full h-full"
//                   src="https://www.youtube.com/embed/YtFuY6kFVKQ?si=XYMtT2j36c--yQS2"
//                   title="Company Introduction"
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                   allowFullScreen
//                 />
//               </div>
//             </div>
//             <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-12">
//               {/* Start Button */}
//               <button
//                 className={`
//       group relative inline-flex items-center gap-2.5
//       px-7 py-3.5 min-w-[140px]
//       bg-gradient-to-r from-green-600 to-emerald-600
//       hover:from-green-700 hover:to-emerald-700
//       text-white font-medium rounded-xl
//       shadow-lg shadow-green-900/20 hover:shadow-green-900/30
//       transition-all duration-300 transform hover:-translate-y-0.5
//       focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2
//     `}
//               >
//                 <Truck
//                   size={20}
//                   className="transition-transform group-hover:scale-110"
//                 />
//                 <span>Start</span>

//                 {/* Optional: subtle shine effect on hover */}
//                 <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
//               </button>

//               {/* End Button */}
//               <button
//                 className={`
//       group relative inline-flex items-center gap-2.5
//       px-7 py-3.5 min-w-[140px]
//       bg-gradient-to-r from-red-600 to-rose-600
//       hover:from-red-700 hover:to-rose-700
//       text-white font-medium rounded-xl
//       shadow-lg shadow-red-900/20 hover:shadow-red-900/30
//       transition-all duration-300 transform hover:-translate-y-0.5
//       focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
//     `}
//               >
//                 <Truck
//                   size={20}
//                   className="transition-transform group-hover:scale-110"
//                 />
//                 <span>End</span>

//                 <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
//               </button>
//             </div>
//           </div>

//           {/* RIGHT COLUMN - Stats + Table */}
//           <div className="space-y-6">
//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Total Count
//                     </p>
//                     <p className="mt-2 text-3xl font-bold text-gray-900">
//                       {totals.count}
//                     </p>
//                   </div>
//                   <Package
//                     className="text-indigo-500"
//                     size={36}
//                     strokeWidth={1.5}
//                   />
//                 </div>
//               </div>

//               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Total Manual Count
//                     </p>
//                     <p className="mt-2 text-3xl font-bold text-gray-900">
//                       {totals.manual}
//                     </p>
//                   </div>
//                   <AlertCircle
//                     className="text-amber-500"
//                     size={36}
//                     strokeWidth={1.5}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Recent Records Table */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//               <div className="px-6 py-5 border-b border-gray-100">
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   Recent Records
//                 </h2>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="w-full min-w-max">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
//                         Date
//                       </th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
//                         Vendor
//                       </th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
//                         Count
//                       </th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
//                         Manual
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {data.map((row, i) => (
//                       <tr
//                         key={i}
//                         className="hover:bg-gray-50/70 transition-colors"
//                       >
//                         <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
//                           <div className="flex items-center gap-2">
//                             <Calendar size={16} className="text-gray-400" />
//                             {row.date}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                           {row.vendor}
//                         </td>
//                         <td className="px-6 py-4 text-sm font-semibold text-indigo-600">
//                           {row.count}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-700">
//                           {row.manual}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>

//                   <tfoot className="bg-gray-50 font-medium">
//                     <tr>
//                       <td
//                         colSpan={2}
//                         className="px-6 py-4 text-right text-gray-800"
//                       >
//                         Total
//                       </td>
//                       <td className="px-6 py-4 text-indigo-700 font-bold">
//                         {totals.count}
//                       </td>
//                       <td className="px-6 py-4 text-gray-800 font-bold">
//                         {totals.manual}
//                       </td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>

//               {data.length === 0 && (
//                 <div className="py-12 text-center text-gray-500">
//                   No records found
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* History Modal */}
//       {showHistoryModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
//             <div className="px-6 py-5 border-b border-gray-100">
//               <h3 className="text-xl font-semibold text-gray-900">
//                 Search Truck History
//               </h3>
//             </div>

//             <form onSubmit={handleHistorySubmit} className="p-6 space-y-5">
//               <div>
//                 <label
//                   htmlFor="truck"
//                   className="block text-sm font-medium text-gray-700 mb-1.5"
//                 >
//                   Truck Number
//                 </label>
//                 <input
//                   id="truck"
//                   type="text"
//                   value={truckNumber}
//                   onChange={(e) => setTruckNumber(e.target.value.toUpperCase())}
//                   placeholder="KA-01-AB-1234"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
//                   required
//                 />
//               </div>

//               <div className="flex items-center gap-3 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowHistoryModal(false)}
//                   className="flex-1 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={isLoading || !truckNumber.trim()}
//                   className="flex-1 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                 >
//                   {isLoading ? (
//                     <>
//                       <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                         <circle
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                           fill="none"
//                         />
//                       </svg>
//                       Searching...
//                     </>
//                   ) : (
//                     "Search"
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Truck, Calendar, Package, AlertCircle, LogOut } from "lucide-react";
// import HistoryPage from "../components/history";

// type Row = {
//   date: string;
//   vendor: string;
//   count: number;
//   manual: number;
// };

// const data: Row[] = [
//   { date: "2026-02-20", vendor: "Vendor A", count: 120, manual: 10 },
//   { date: "2026-02-21", vendor: "Vendor B", count: 90, manual: 5 },
//   { date: "2026-02-22", vendor: "Vendor C", count: 150, manual: 12 },
//   { date: "2026-02-23", vendor: "Vendor A", count: 80, manual: 7 },
// ];

// export default function DashboardPage() {
//   const router = useRouter();
//   const [showHistoryPage, setShowHistoryPage] = useState(false);

//   const totals = useMemo(() => {
//     return {
//       count: data.reduce((a, b) => a + b.count, 0),
//       manual: data.reduce((a, b) => a + b.manual, 0),
//     };
//   }, []);

//   const handleLogout = () => {
//     router.push("/login");
//   };

//   return (
//     <>
//       {showHistoryPage ? (
//         <HistoryPage onBack={() => setShowHistoryPage(false)} />
//       ) : (
//         <div className="min-h-screen bg-gray-50/50">
//           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2">
//             {/* Header */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex justify-between items-center mb-8">
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//                 <p className="mt-1 text-gray-500">
//                   Overview of recent shipments
//                 </p>
//               </div>

//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() => setShowHistoryPage(true)}
//                   className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800"
//                 >
//                   <Truck size={18} />
//                   History
//                 </button>

//                 <button
//                   onClick={handleLogout}
//                   className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 border border-red-200"
//                 >
//                   <LogOut size={18} />
//                   Logout
//                 </button>
//               </div>
//             </div>

//             {/* Layout */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Left Video */}
//               <div className="rounded-2xl overflow-hidden shadow-lg bg-black">
//                 <div className="aspect-video">
//                   <iframe
//                     className="w-full h-full"
//                     src="https://www.youtube.com/embed/YtFuY6kFVKQ"
//                     allowFullScreen
//                   />
//                 </div>
//               </div>

//               {/* Right Stats */}
//               <div className="space-y-6">
//                 <div className="grid grid-cols-2 gap-5">
//                   <div className="bg-white rounded-2xl shadow-sm border p-6">
//                     <p className="text-sm text-gray-500">Total Count</p>
//                     <p className="mt-2 text-3xl font-bold text-gray-900">
//                       {totals.count}
//                     </p>
//                   </div>

//                   <div className="bg-white rounded-2xl shadow-sm border p-6">
//                     <p className="text-sm text-gray-500">Total Manual Count</p>
//                     <p className="mt-2 text-3xl font-bold text-gray-900">
//                       {totals.manual}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Table */}
//                 <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
//                   <div className="px-6 py-5 border-b">
//                     <h2 className="text-lg font-semibold">Recent Records</h2>
//                   </div>

//                   <table className="w-full">
//                     <thead className="bg-gray-50 text-gray-600 text-sm">
//                       <tr>
//                         <th className="px-6 py-4 text-left">Date</th>
//                         <th className="px-6 py-4 text-left">Vendor</th>
//                         <th className="px-6 py-4 text-left">Count</th>
//                         <th className="px-6 py-4 text-left">Manual</th>
//                       </tr>
//                     </thead>

//                     <tbody className="divide-y">
//                       {data.map((row, i) => (
//                         <tr key={i}>
//                           <td className="px-6 py-4">{row.date}</td>
//                           <td className="px-6 py-4">{row.vendor}</td>
//                           <td className="px-6 py-4 font-semibold text-indigo-600">
//                             {row.count}
//                           </td>
//                           <td className="px-6 py-4">{row.manual}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
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
        "https://counting-dashboard-backend.onrender.com/totals/today",
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
