"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { siteConfig } from "@/lib/site";

export default function LoginForm({ from }: { from?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // only allow internal paths, blocks open redirects
      const safe = from && from.startsWith("/") && !from.startsWith("//");
      router.replace(safe ? from : "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm space-y-4 rounded-xl border border-[#DED9CE] bg-[#FAF8F2] p-6 shadow-[0_8px_24px_rgba(23,59,42,0.08)]"
    >
      <div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#315B46]">
          {siteConfig.name}
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-[#151814]">
          Admin login
        </h1>
      </div>

      <input
        type="email"
        required
        autoComplete="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg border border-[#D8D3C7] bg-white px-3 py-2 text-sm text-[#151814] outline-none placeholder:text-[#77776F] focus:border-[#315B46]"
      />
      <input
        type="password"
        required
        autoComplete="current-password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-lg border border-[#D8D3C7] bg-white px-3 py-2 text-sm text-[#151814] outline-none placeholder:text-[#77776F] focus:border-[#315B46]"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        disabled={loading}
        className="w-full rounded-lg bg-[#173B2A] py-2.5 text-sm font-semibold text-white transition hover:bg-[#315B46] disabled:opacity-50"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}