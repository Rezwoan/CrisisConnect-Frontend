"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const AUTH_FLOW_PATHS = ["/ngo/register", "/ngo/verify-signup", "/ngo/login"];

export default function NgoNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  if (AUTH_FLOW_PATHS.includes(pathname)) {
    return null;
  }

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
