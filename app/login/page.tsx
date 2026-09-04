"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import axios from "axios";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <>
      <Header title="Login" />
      <Navigation />

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const result = loginSchema.safeParse({ email, password });

          if (!result.success) {
            setError(result.error.issues[0].message);
            return;
          }

          try {
            const roleResponse = await axios.get(
              process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/role",
              { params: { email } },
            );
            const role = roleResponse.data.role.toLowerCase();

            const loginResponse = await axios.post(
              process.env.NEXT_PUBLIC_API_ENDPOINT + "/" + role + "/login",
              { email, password },
            );

            setError("");

            if (loginResponse.data.accessToken) {
              localStorage.setItem("token", loginResponse.data.accessToken);
              localStorage.setItem("email", email);
              router.push("/dashboard");
            } else {
              localStorage.setItem("email", email);
              router.push("/" + role + "/login");
            }
          } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
              const message = err.response.data.message;
              setError(Array.isArray(message) ? message[0] : message);
            } else {
              setError("Login failed");
            }
          }
        }}
      >
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit">Login</button>
      </form>
    </>
  );
}
