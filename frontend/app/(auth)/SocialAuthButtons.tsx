"use client";

import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    google: any;
  }
}

export default function SocialAuthButtons() {
  const router = useRouter();

  const handleGoogleLogin = async (credential: string) => {
    const res = await api.post("/auth/google", {
      idToken: credential,
    });
    localStorage.setItem("token", res.data.token);
    document.cookie = `token=${res.data.token}; path=/`;

    router.push("/dashboard");
  };

  const handleGoogleClick = () => {
    const initAndPrompt = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: (response: any) => {
          handleGoogleLogin(response.credential);
        },
        ux_mode: "popup",
        use_fedcm: false,
      });

      window.google.accounts.id.prompt();
    };

    if (window.google) {
      initAndPrompt();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = initAndPrompt;

    document.body.appendChild(script);
  };

  const handleGitHubLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/github/callback`;

    window.location.href =
      `https://github.com/login/oauth/authorize` +
      `?client_id=${clientId}` +
      `&scope=user:email` +
      `&redirect_uri=${redirectUri}`;
  };

  return (
    <div className="flex gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleClick}
        className="flex-1 h-11 bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="h-5 w-5"
        />
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={handleGitHubLogin}
        className="flex-1 h-11 bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
      >
        <Github className="h-5 w-5 text-white" />
      </Button>
    </div>
  );
}
