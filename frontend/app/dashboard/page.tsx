"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Optional: fetch profile later
    // For now just confirm dashboard loads
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="text-zinc-400">
          Welcome to <span className="text-white">DevReview AI</span>
        </p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">You are logged in 🎉</h2>
          <p className="text-zinc-400">This page is protected by middleware.</p>
        </div>

        <Button onClick={logout} className="bg-red-600 hover:bg-red-700">
          Logout
        </Button>
      </div>
    </div>
  );
}
