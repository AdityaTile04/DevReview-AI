"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";

export default function GitHubCallbackClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      router.replace("/login");
      return;
    }

    const exchangeCode = async () => {
      try {
        const res = await api.post("/auth/github", { code });

        localStorage.setItem("token", res.data.token);
        document.cookie = `token=${res.data.token}; path=/`;

        router.replace("/dashboard");
      } catch (err) {
        console.error("GitHub OAuth failed", err);
        router.replace("/login");
      }
    };

    exchangeCode();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Signing you in with GitHub…
    </div>
  );
}
