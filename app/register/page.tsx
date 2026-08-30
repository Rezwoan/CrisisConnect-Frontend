"use client";

import { useState } from "react";
import { z } from "zod";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
});

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  return (
    <>
      <Header title="Register" />
      <Navigation />

      <form
        onSubmit={(e) => {
          e.preventDefault();

          const result = registerSchema.safeParse({
            name,
            email,
            password,
            confirmPassword,
          });

          if (!result.success) {
            setError(result.error.issues[0].message);
            setSuccess(false);
            return;
          }

          if (password !== confirmPassword) {
            setError("Passwords do not match");
            setSuccess(false);
            return;
          }

          setError("");
          setSuccess(true);
        }}
      >
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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

        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit">Register</button>
      </form>

      {success && <p>Registration successful!</p>}
    </>
  );
}
