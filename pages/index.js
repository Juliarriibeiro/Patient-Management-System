// pages/index.js
import { useState } from "react";
import { useRouter } from "next/router";
import { users } from "../data/users";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      if (user.role === "patient") {
        router.push("/patient");
      } else if (user.role === "doctor") {
        router.push("/doctor");
      }
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-gray-200 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-2">Welcome to PMS+</h1>
          <p className="text-gray-600">Streamlining Patient Management for Better Care.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

