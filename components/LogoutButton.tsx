"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      disabled={loading}
      className="rounded-lg border border-[#D8D3C7] px-3 py-1.5 text-sm font-medium text-[#151814] transition hover:bg-[#E8E3D8] disabled:opacity-50"
    >
      {loading ? "..." : "Log out"}
    </button>
  );
}