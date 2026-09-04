// Only edit files inside app/ngo/ for this role. Don't touch anything
// outside this folder unless the change is genuinely needed for every role.
"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

export default function NgoDashboardPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(localStorage.getItem("email") || "");
  }, []);

  return (
    <>
      <Header title="Dashboard" />
      <Navigation />
      <p>Welcome to your NGO dashboard, {email}.</p>
    </>
  );
}
