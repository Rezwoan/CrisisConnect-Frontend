"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import axios from "axios";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { BackgroundGrid, AceternityCard } from "@/components/ui/aceternity";
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";

const loginSchema = z.object({
	email: z.email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	return (
		<BackgroundGrid className="flex min-h-screen flex-col">
			{/* Full-width top header */}
			<TopBar />

			{/* Main Form: max-w-xl matches registration card width */}
			<div className="flex flex-1 items-center justify-center p-6 md:p-12">
				<div className="w-full max-w-xl mx-auto flex flex-col items-center">
					<Header
						title="Sign In"
						subtitle="Log in to access your coordination dashboard."
						align="center"
					/>

					<Navigation />

					<AceternityCard className="w-full mt-1 p-6 md:p-8">
						<form
							onSubmit={async (e) => {
								e.preventDefault();
								setLoading(true);

								const result = loginSchema.safeParse({ email, password });
								if (!result.success) {
									setError(result.error.issues[0].message);
									setLoading(false);
									return;
								}

								try {
									const roleResponse = await axios.get(
										process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/role",
										{ params: { email } },
									);
									const role = roleResponse.data.role.toLowerCase();

									const loginResponse = await axios.post(
										process.env.NEXT_PUBLIC_API_ENDPOINT +
											"/" +
											role +
											"/login",
										{ email, password },
									);

									setError("");

									if (loginResponse.data.accessToken) {
										localStorage.setItem(
											"token",
											loginResponse.data.accessToken,
										);
										localStorage.setItem("email", email);
										router.push("/" + role + "/dashboard");
									} else {
										localStorage.setItem("email", email);
										router.push("/" + role + "/login");
									}
								} catch (err: any) {
									if (
										err.response &&
										err.response.data &&
										err.response.data.message
									) {
										const message = err.response.data.message;
										setError(Array.isArray(message) ? message[0] : message);
									} else {
										setError("Login failed");
									}
								} finally {
									setLoading(false);
								}
							}}
							className="flex flex-col gap-4 font-sans text-sm"
						>
							<div>
								<label
									htmlFor="email"
									className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-heading"
								>
									Email Address
								</label>
								<div className="relative">
									<Mail className="size-4 absolute left-3 top-3 text-slate-400" />
									<input
										type="email"
										id="email"
										className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
										placeholder="admin@crisisconnect.org"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="password"
									className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-heading"
								>
									Password
								</label>
								<div className="relative">
									<Lock className="size-4 absolute left-3 top-3 text-slate-400" />
									<input
										type="password"
										id="password"
										className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
										placeholder="••••••••"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
								</div>
							</div>

							{error && (
								<div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs">
									<AlertCircle className="size-4 shrink-0" />
									<span>{error}</span>
								</div>
							)}

							<button
								type="submit"
								disabled={loading}
								className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 px-4 font-heading text-sm font-semibold transition shadow-md shadow-blue-500/20 disabled:opacity-50"
							>
								{loading ? "Authenticating..." : "Login"}
								<ArrowRight className="size-4" />
							</button>

							{/* Registration Link directly under login button */}
							<div className="text-center pt-3 border-t border-slate-200/70 dark:border-slate-800/70 mt-1">
								<p className="font-sans text-xs text-slate-600 dark:text-slate-400">
									Don&apos;t have an account?{" "}
									<Link
										href="/register"
										className="font-heading font-semibold text-blue-600 hover:text-blue-700 hover:underline ml-1"
									>
										Register
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
