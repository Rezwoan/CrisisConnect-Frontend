"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header";

export default function DonationCallDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [donationCall, setDonationCall] = useState<any>(null);
  const [donations, setDonations] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    try {
      const callsResponse = await axios.get(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/donation-call",
        { headers: { Authorization: "Bearer " + token } },
      );
      const match = callsResponse.data.find((call: any) => String(call.id) === params.id);
      setDonationCall(match || null);

      const donationsResponse = await axios.get(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/donation-call/" + params.id + "/donations",
        { headers: { Authorization: "Bearer " + token } },
      );
      setDonations(donationsResponse.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Header title="Donation Call" />

      {donationCall != null && (
        <div className="mb-6 max-w-sm rounded-lg border border-slate-200 p-4 shadow-sm">
          <h3 className="text-lg font-semibold">{donationCall.title}</h3>
          <p className="text-sm text-slate-600">
            {donationCall.raisedAmount} / {donationCall.targetAmount} raised
          </p>
          <p className="text-sm">Status: {donationCall.status}</p>
        </div>
      )}

      <h2 className="mb-2 text-lg font-semibold">Donations</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {donations.map((donation, index) => (
          <div key={index} className="rounded-lg border border-slate-200 p-4 shadow-sm">
            <h3 className="text-lg font-semibold">{donation.donor.fullName}</h3>
            <p className="text-sm text-slate-600">{donation.donor.city}</p>
            <p className="mt-1 text-sm">Amount: {donation.amount}</p>
            {donation.message && <p className="mt-1 text-sm">"{donation.message}"</p>}
            <p className="mt-1 text-sm">Status: {donation.status}</p>
          </div>
        ))}
      </div>
    </>
  );
}
