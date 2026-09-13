"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import axios from "axios";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { BackgroundGrid, AceternityCard } from "@/components/ui/aceternity";
import { KeyRound, ArrowRight, AlertCircle } from "lucide-react";

const verifyLoginSchema = z.object({
	email: z.email("Invalid email address"),
	code: z.string().length(6, "Code must be exactly 6 digits"),
});

export default function AdminLoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const storedEmail = localStorage.getItem("email");
		if (!storedEmail) {
			router.replace("/login");
			return;
		}
		setEmail(storedEmail);
	}, [router]);

	return (
		<BackgroundGrid className="flex min-h-screen flex-col">
			<TopBar />

			<div className="flex flex-1 items-center justify-center p-6 md:p-12">
				<div className="w-full max-w-xl mx-auto flex flex-col items-center">
					<Header
						title="Two-Factor Login"
						subtitle={`Enter the 6-digit authentication token sent to ${email}`}
						align="center"
					/>

					<AceternityCard className="w-full mt-1 p-6 md:p-8">
						<form
							onSubmit={async (e) => {
								e.preventDefault();
								setLoading(true);

								const result = verifyLoginSchema.safeParse({ email, code });
								if (!result.success) {
									setError(result.error.issues[0].message);
									setLoading(false);
									return;
								}

								try {
									const response = await axios.post(
										process.env.NEXT_PUBLIC_API_ENDPOINT +
											"/admin/verify-login-otp",
										{ email, code },
									);
									localStorage.setItem("token", response.data.accessToken);
									setError("");
									router.push("/admin/dashboard");
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
							className="flex flex-col gap-4 font-sans text-sm"
						>
							<div>
								<label
									htmlFor="code"
									className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-heading"
								>
									One-Time Login Code
								</label>
								<div className="relative">
									<KeyRound className="size-4 absolute left-3 top-3 text-slate-400" />
									<input
										type="text"
										id="code"
										maxLength={6}
										placeholder="123456"
										className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-foreground font-mono tracking-widest text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
										value={code}
										onChange={(e) => setCode(e.target.value)}
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
								{loading ? "Verifying..." : "Verify & Access Console"}
								<ArrowRight className="size-4" />
							</button>

							<div className="text-center pt-3 border-t border-slate-200/70 dark:border-slate-800/70 mt-1">
								<p className="font-sans text-xs text-slate-600 dark:text-slate-400">
									Wrong account or didn&apos;t receive code?{" "}
									<Link
										href="/login"
										className="font-heading font-semibold text-blue-600 hover:text-blue-700 hover:underline ml-1"
									>
										Back to Login
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
