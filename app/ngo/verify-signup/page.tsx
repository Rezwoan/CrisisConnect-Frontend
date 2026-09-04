"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

export default function NgoVerifySignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setEmail(localStorage.getItem("email") || "");
  }, []);

  return (
    <>
      <Header title="Verify Your Email" />
      <Navigation />

      <p>Enter the code emailed to {email}.</p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            await axios.post(
              process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/verify-otp",
              { email, code },
            );
            setError("");
            router.push("/login");
          } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
              const message = err.response.data.message;
              setError(Array.isArray(message) ? message[0] : message);
            } else {
              setError("Verification failed");
            }
          }
        }}
      >
        <div>
          <label htmlFor="code">Verification Code</label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit">Verify</button>
      </form>
    </>
  );
}
