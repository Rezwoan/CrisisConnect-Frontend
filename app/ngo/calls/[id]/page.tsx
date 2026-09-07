"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header";

export default function CallApplicantsPage() {
  const params = useParams();
  const router = useRouter();
  const [applicants, setApplicants] = useState<any[]>([]);
  const [error, setError] = useState("");

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
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/volunteer-call/" + params.id + "/applicants",
        { headers: { Authorization: "Bearer " + token } },
      );
      setApplicants(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Header title="Applicants" />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {applicants.map((application, index) => (
          <div key={index} className="rounded-lg border border-slate-200 p-4 shadow-sm">
            <h3 className="text-lg font-semibold">{application.volunteer.fullName}</h3>
            <p className="text-sm text-slate-600">{application.volunteer.city}</p>
            <p className="mt-1 text-sm">{application.message}</p>
            <p className="mt-1 text-sm">Status: {application.status}</p>
            {application.status === "PENDING" && (
              <div className="mt-2 flex gap-2">
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");
                      await axios.post(
                        process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/application/" + application.id + "/approve",
                        {},
                        { headers: { Authorization: "Bearer " + token } },
                      );
                      fetchData();
                    } catch (err: any) {
                      const message = err.response && err.response.data && err.response.data.message;
                      setError(Array.isArray(message) ? message[0] : message || "Something went wrong");
                    }
                  }}
                  className="rounded bg-blue-600 px-3 py-1 text-white"
                >
                  Approve
                </button>
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");
                      await axios.patch(
                        process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/application/" + application.id + "/reject",
                        {},
                        { headers: { Authorization: "Bearer " + token } },
                      );
                      fetchData();
                    } catch (err: any) {
                      const message = err.response && err.response.data && err.response.data.message;
                      setError(Array.isArray(message) ? message[0] : message || "Something went wrong");
                    }
                  }}
                  className="rounded bg-red-600 px-3 py-1 text-white"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
