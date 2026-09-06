"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header";

export default function NgoDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/profile",
        { headers: { Authorization: "Bearer " + token } },
      );
      setProfile(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Header title="Dashboard" />
      {profile != null && (
        <div className="max-w-sm rounded-lg border border-slate-200 p-4 shadow-sm">
          <p className="text-lg font-semibold">{profile.orgName}</p>
          <p>Registration Number: {profile.regNumber}</p>
          <p>Phone: {profile.phone}</p>
          <p>City: {profile.city}</p>
          <p>Status: {profile.isActive ? "Active" : "Inactive"}</p>
        </div>
      )}
    </>
  );
}
