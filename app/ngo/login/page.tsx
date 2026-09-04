"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

export default function NgoLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) {
      router.replace("/login");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  return (
    <>
      <Header title="Verify Login" />
      <Navigation />

      <p>Enter the login code emailed to {email}.</p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            const response = await axios.post(
              process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/verify-login-otp",
              { email, code },
            );
            localStorage.setItem("token", response.data.accessToken);
            setError("");
            router.push("/dashboard");
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
          <label htmlFor="code">Login Code</label>
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
