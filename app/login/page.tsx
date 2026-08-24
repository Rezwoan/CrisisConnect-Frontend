"use client";

import { useState } from "react";
import { z } from "zod";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  return (
    <>
      <Header title="Login" subtitle="Login to your account" />
      <Navigation />

      <form
        onSubmit={(e) => {
          e.preventDefault();

          const result = loginSchema.safeParse({ email, password });

          if (!result.success) {
            setError(result.error.issues[0].message);
            setSuccess(false);
            return;
          }

          setError("");
          setSuccess(true);
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

      {success && <p>Login successful!</p>}
    </>
  );
}
