"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header";

export default function MyCrisesPage() {
  const router = useRouter();
  const [crises, setCrises] = useState<any[]>([]);
  const [message, setMessage] = useState("");

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
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/my-crises",
        { headers: { Authorization: "Bearer " + token } },
      );
      setCrises(response.data.crises);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Header title="My Crises" />
      {message && <p className="text-sm">{message}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {crises.map((crisis, index) => (
          <div key={index} className="rounded-lg border border-slate-200 p-4 shadow-sm">
            <h3 className="text-lg font-semibold">{crisis.title}</h3>
            <p className="text-sm text-slate-600">{crisis.category} · {crisis.city}</p>
            <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem("token");
                  const response = await axios.delete(
                    process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/crisis/" + crisis.id + "/leave",
                    { headers: { Authorization: "Bearer " + token } },
                  );
                  setMessage(response.data.message);
                  fetchData();
                } catch (err: any) {
                  const msg = err.response && err.response.data && err.response.data.message;
                  setMessage(Array.isArray(msg) ? msg[0] : msg || "Something went wrong");
                }
              }}
              className="mt-2 rounded bg-red-600 px-3 py-1 text-white"
            >
              Leave
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
