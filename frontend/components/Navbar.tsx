"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [emailInitial, setEmailInitial] = useState<string>("U");
  const router = useRouter();
  const pathname = usePathname();

  const decodeJwtEmail = (jwt: string) => {
    // Token is created server-side with { userId, email }
    // We only decode payload client-side for displaying avatar initials.
    try {
      const parts = jwt.split(".");
      if (parts.length < 2) return null;

      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded =
        base64 + "=".repeat((4 - (base64.length % 4)) % 4);
      const json = atob(padded);
      const payload = JSON.parse(json);
      return typeof payload?.email === "string" ? payload.email : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);

    const decodedEmail = t ? decodeJwtEmail(t) : null;
    if (decodedEmail) {
      setEmailInitial(decodedEmail.trim().charAt(0).toUpperCase());
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Clear cookie if it exists (some flows set it)
    document.cookie = "token=; path=/; max-age=0";

    setToken(null);
    setEmailInitial("U");
    router.replace("/");
  };

  const loggedIn = Boolean(token);
  const minimalMode = pathname?.startsWith("/dashboard");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all ${
        scrolled
          ? "backdrop-blur-xl bg-black/70 border-b border-zinc-800"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">
            DevReview<span className="text-indigo-400">AI</span>
          </span>
        </Link>

        {!minimalMode && (
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#"
              className="relative text-sm text-zinc-300 hover:text-white transition"
            >
              <span className="after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-indigo-500 after:transition-all hover:after:w-full">
                Features
              </span>
            </Link>

            <Link
              href="#"
              className="relative text-sm text-zinc-300 hover:text-white transition"
            >
              <span className="after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-indigo-500 after:transition-all hover:after:w-full">
                How it Works
              </span>
            </Link>

            {loggedIn && (
              <Link
                href="/dashboard"
                className="relative text-sm text-zinc-300 hover:text-white transition"
              >
                <span className="after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-indigo-500 after:transition-all hover:after:w-full">
                  Dashboard
                </span>
              </Link>
            )}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {!loggedIn ? (
            <>
              {!minimalMode && (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="text-black">
                      Sign In
                    </Button>
                  </Link>

                  <Link href="/signup">
                    <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-zinc-800/60"
                  aria-label="User menu"
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-zinc-900 text-white ring-1 ring-zinc-800">
                      {emailInitial}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  onSelect={handleLogout}
                  className="text-red-400 focus:text-red-400"
                >
                  <LogOut className="mr-2 size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </motion.header>
  );
}
