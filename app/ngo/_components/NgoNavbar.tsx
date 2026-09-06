"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NgoNavbar() {
  const router = useRouter();

  return (
    <nav className="flex items-center gap-4 bg-slate-800 px-4 py-3 text-white">
      <Link href="/ngo" className="font-semibold">CrisisConnect NGO</Link>
      <Link href="/ngo/crises">Crises</Link>
      <Link href="/ngo/my-crises">My Crises</Link>
      <Link href="/ngo/calls">Volunteer Calls</Link>
      <Link href="/ngo/donation-calls">Donation Calls</Link>
      <Link href="/ngo/dashboard">Dashboard</Link>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          router.push("/login");
        }}
        className="ml-auto rounded bg-slate-600 px-3 py-1"
      >
        Logout
      </button>
    </nav>
  );
}
