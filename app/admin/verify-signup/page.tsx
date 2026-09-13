"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import axios from "axios";
import Header from "@/components/Header";
import { BackgroundGrid, AceternityCard } from "@/components/ui/aceternity";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";

const verifySchema = z.object({
	email: z.email("Invalid email address"),
	code: z.string().length(6, "Code must be exactly 6 digits"),
});

export default function AdminVerifySignupPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setEmail(localStorage.getItem("email") || "");
	}, []);

	return (
		<BackgroundGrid className="flex min-h-screen flex-col">
			<TopBar />
			<div className="flex flex-1 items-center justify-center p-6 md:p-12">
				<div className="w-full max-w-xl mx-auto flex flex-col items-center">
					<Header
						title="Verify Account"
						subtitle={`Enter the 6-digit confirmation code sent to ${email}`}
					/>

					<AceternityCard className="mt-4">
						<form
							onSubmit={async (e) => {
								e.preventDefault();
								setLoading(true);

								const result = verifySchema.safeParse({ email, code });
								if (!result.success) {
									setError(result.error.issues[0].message);
									setLoading(false);
									return;
								}

								try {
									await axios.post(
										process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/verify-otp",
										{ email, code },
									);
									setError("");
									router.push("/login");
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
									Verification Code
								</label>
								<input
									type="text"
									id="code"
									maxLength={6}
									placeholder="123456"
									className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-foreground font-mono tracking-widest text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
									value={code}
									onChange={(e) => setCode(e.target.value)}
								/>
							</div>

							{error && (
								<div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-xs">
									<AlertCircle className="size-4 shrink-0" />
									<span>{error}</span>
								</div>
							)}

							<button
								type="submit"
								disabled={loading}
								className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 font-heading text-sm font-semibold transition shadow-md shadow-emerald-500/20 disabled:opacity-50"
							>
								<CheckCircle2 className="size-4" />
								{loading ? "Activating..." : "Complete Registration"}
							</button>
						</form>
					</AceternityCard>
				</div>
			</div>
			<Footer />
		</BackgroundGrid>
	);
}
