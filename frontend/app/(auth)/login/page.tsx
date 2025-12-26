"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import SocialAuthButtons from "../SocialAuthButtons";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await api.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Card className="bg-zinc-950 border-zinc-800 shadow-xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-white">
          Welcome back
        </CardTitle>
        <p className="text-center text-sm text-zinc-400">
          Sign in to DevReview AI
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="text-red-400 text-sm bg-red-950/40 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            placeholder="Email"
            type="email"
            {...register("email")}
            className="bg-zinc-900 border-zinc-800 text-white"
          />

          <Input
            placeholder="Password"
            type="password"
            {...register("password")}
            className="bg-zinc-900 border-zinc-800 text-white"
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-black hover:bg-zinc-200"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-950 px-2 text-zinc-400">
              Or continue with
            </span>
          </div>
        </div>

        <SocialAuthButtons />

        <div className="text-center text-sm text-zinc-400">
          Don’t have an account?{" "}
          <span
            className="text-white cursor-pointer hover:underline"
            onClick={() => router.push("/signup")}
          >
            Sign up
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
