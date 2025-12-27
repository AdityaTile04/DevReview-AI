"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

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

        <nav className="hidden md:flex items-center gap-8">
          {["Features", "How it Works"].map((item) => (
            <Link
              key={item}
              href="#"
              className="relative text-sm text-zinc-300 hover:text-white transition"
            >
              <span className="after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-indigo-500 after:transition-all hover:after:w-full">
                {item}
              </span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
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
        </div>
      </div>
    </motion.header>
  );
}
