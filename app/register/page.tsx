"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import axios from "axios";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

const registerSchema = z.object({
  orgName: z.string().min(1, "Organization name is required"),
  regNumber: z.string().min(1, "Registration number is required"),
  phone: z.string().length(11, "Phone number must be 11 digits"),
  city: z.string().min(1, "City is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
});

export default function RegisterPage() {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <>
      <Header title="Register" />
      <Navigation />

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const result = registerSchema.safeParse({
            orgName,
            regNumber,
            phone,
            city,
            email,
            password,
            confirmPassword,
          });

          if (!result.success) {
            setError(result.error.issues[0].message);
            return;
          }

          if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
          }

          try {
            await axios.post(
              process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/signup",
              { orgName, regNumber, phone, city, email, password },
            );
            setError("");
            router.push("/login");
          } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
              const message = err.response.data.message;
              setError(Array.isArray(message) ? message[0] : message);
            } else {
              setError("Registration failed");
            }
          }
        }}
      >
        <div>
          <label htmlFor="orgName">Organization Name</label>
          <input
            type="text"
            id="orgName"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="regNumber">Registration Number</label>
          <input
            type="text"
            id="regNumber"
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
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
    </>
  );
}
