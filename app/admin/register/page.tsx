"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import axios from "axios";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { BackgroundGrid, AceternityCard } from "@/components/ui/aceternity";
import { ArrowRight, AlertCircle, ShieldAlert } from "lucide-react";

const registerSchema = z.object({
	fullName: z.string().min(1, "Full name is required"),
	email: z.email("Invalid email address"),
	phone: z.string().regex(/^[0-9]{10,15}$/, "Phone must be 10-15 digits"),
	city: z.string().min(1, "City is required"),
	age: z
		.string()
		.regex(/^[0-9]+$/, "Age must be a whole number")
		.refine((value) => Number(value) >= 18, "Age must be at least 18"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(50, "Password must be at most 50 characters"),
	confirmPassword: z.string().min(1, "Please confirm your password"),
});

export default function AdminRegisterPage() {
	const router = useRouter();
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [city, setCity] = useState("");
	const [age, setAge] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	return (
		<BackgroundGrid className="flex min-h-screen flex-col">
			<TopBar />

			<div className="flex flex-1 items-center justify-center p-6 md:p-12">
				<div className="w-full max-w-xl mx-auto flex flex-col items-center">
					<Header
						title="Admin Registration"
						subtitle="Provision a verified administrator coordination profile."
						align="center"
					/>

					<AceternityCard className="w-full mt-1 p-6 md:p-8">
						<form
							onSubmit={async (e) => {
								e.preventDefault();
								setLoading(true);

								const result = registerSchema.safeParse({
									fullName,
									email,
									phone,
									city,
									age,
									password,
									confirmPassword,
								});

								if (!result.success) {
									setError(result.error.issues[0].message);
									setLoading(false);
									return;
								}

								if (password !== confirmPassword) {
									setError("Passwords do not match");
									setLoading(false);
									return;
								}

								try {
									await axios.post(
										process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/signup",
										{
											email,
											password,
											fullName,
											phone,
											city,
											age: Number(age),
										},
									);
									localStorage.setItem("email", email);
									setError("");
									router.push("/admin/verify-signup");
								} catch (err: any) {
									const message =
										err.response &&
										err.response.data &&
										err.response.data.message;
									setError(
										Array.isArray(message)
											? message[0]
											: message || "Something went wrong",
									);
								} finally {
									setLoading(false);
								}
							}}
							className="grid gap-3.5 sm:grid-cols-2 font-sans text-xs"
						>
							<div className="sm:col-span-2">
								<label
									htmlFor="fullName"
									className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1"
								>
									Full Name
								</label>
								<input
									type="text"
									id="fullName"
									placeholder="John Doe"
									className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
									value={fullName}
									onChange={(e) => setFullName(e.target.value)}
								/>
							</div>

							<div className="sm:col-span-2">
								<label
									htmlFor="email"
									className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1"
								>
									Admin Email
								</label>
								<input
									type="email"
									id="email"
									placeholder="admin@crisisconnect.org"
									className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>

							<div>
								<label
									htmlFor="phone"
									className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1"
								>
									Phone Number
								</label>
								<input
									type="text"
									id="phone"
									placeholder="01712345678"
									className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
								/>
							</div>

							<div>
								<label
									htmlFor="city"
									className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1"
								>
									City
								</label>
								<input
									type="text"
									id="city"
									placeholder="Dhaka"
									className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
									value={city}
									onChange={(e) => setCity(e.target.value)}
								/>
							</div>

							<div className="sm:col-span-2">
								<label
									htmlFor="age"
									className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1"
								>
									Age (18+)
								</label>
								<input
									type="text"
									id="age"
									placeholder="28"
									className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
									value={age}
									onChange={(e) => setAge(e.target.value)}
								/>
							</div>

							<div>
								<label
									htmlFor="password"
									className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1"
								>
									Password
								</label>
								<input
									type="password"
									id="password"
									placeholder="••••••••"
									className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>

							<div>
								<label
									htmlFor="confirmPassword"
									className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1"
								>
									Confirm Password
								</label>
								<input
									type="password"
									id="confirmPassword"
									placeholder="••••••••"
									className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
							</div>

							{error && (
								<div className="sm:col-span-2 flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/50 text-xs">
									<AlertCircle className="size-4 shrink-0" />
									<span>{error}</span>
								</div>
							)}

							<div className="sm:col-span-2 pt-2">
								<button
									type="submit"
									disabled={loading}
									className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 px-4 font-heading text-sm font-semibold transition shadow-md shadow-blue-500/20 disabled:opacity-50"
								>
									{loading ? "Registering..." : "Register Admin"}
									<ArrowRight className="size-4" />
								</button>
							</div>

							<div className="sm:col-span-2 text-center pt-3 border-t border-slate-200/70 dark:border-slate-800/70 mt-1">
								<p className="font-sans text-xs text-slate-600 dark:text-slate-400">
									Already have an admin account?{" "}
									<Link
										href="/login"
										className="font-heading font-semibold text-blue-600 hover:text-blue-700 hover:underline ml-1"
									>
										Sign In
									</Link>
								</p>
							</div>
						</form>
					</AceternityCard>
				</div>
			</div>

			<Footer />
		</BackgroundGrid>
	);
}
