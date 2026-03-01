// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const router = useRouter();

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = () => {
//     // dummy credentials
//     if (username === "blinkit" && password === "123456") {
//       localStorage.setItem("isLoggedIn", "true");
//       router.push("/dashboard");
//     } else {
//       alert("Invalid credentials");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-neutral-100">
//       <div className="bg-white p-8 rounded-3xl shadow w-[380px]">
//         <div className="flex flex-col items-center mb-6">
//           <div className="bg-yellow-400 w-20 h-20 rounded-2xl flex items-center justify-center text-xl font-bold">
//             blinkit
//           </div>

//           <h1 className="text-xl font-semibold mt-4">Operator Login</h1>
//           <p className="text-sm text-gray-500">Secure Logistics Access</p>
//         </div>

//         <div className="space-y-4">
//           <input
//             placeholder="Username"
//             className="w-full border p-3 rounded-xl"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             className="w-full border p-3 rounded-xl"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <button
//             onClick={handleLogin}
//             className="w-full bg-yellow-400 p-3 rounded-xl font-semibold"
//           >
//             Sign In
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!API_BASE_URL) {
      setError("API URL not configured");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Invalid username or password");
        }
        throw new Error("Login failed");
      }

      const data = await res.json();

      if (!data.access_token) {
        throw new Error("Invalid response from server");
      }

      // ✅ Store token
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", username);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <div className="bg-white p-8 rounded-3xl shadow w-[380px] text-gray-800">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-yellow-400 w-20 h-20 rounded-2xl flex items-center justify-center text-xl font-bold text-black">
            blinkit
          </div>

          <h1 className="text-xl font-semibold mt-4 text-gray-900">
            Operator Login
          </h1>
          <p className="text-sm text-gray-600">Secure Logistics Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            placeholder="Username"
            className="w-full border border-gray-300 p-3 rounded-xl text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-3 rounded-xl text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="text-red-600 text-sm bg-red-100 p-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black p-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
