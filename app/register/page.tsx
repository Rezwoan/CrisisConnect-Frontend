"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

export default function RegisterPage() {
  return (
    <>
      <Header title="Register" />
      <Navigation />

      <p>Choose the type of account you want to register.</p>

      <ul>
        <li>
          <Link href="/ngo/register">NGO</Link>
        </li>
        <li>
          <Link href="/volunteer/register">Volunteer</Link>
        </li>
        <li>
          <Link href="/donor/register">Donor</Link>
        </li>
      </ul>
    </>
  );
}
