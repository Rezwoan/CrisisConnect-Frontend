import Navigation from "@/components/Navigation";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { LogIn, UserPlus, ArrowRight, ShieldCheck } from "lucide-react";
import { BackgroundGrid, AceternityCard } from "@/components/ui/aceternity";

export default function Home() {
	return (
		<BackgroundGrid className="flex min-h-screen flex-col">
			{/* Full-width top section covering the entire top edge */}
			<TopBar />

			{/* Main Centered Content */}
			<div className="flex flex-1 items-center justify-center p-6 md:p-12">
				<div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center">
					{/* Prominent CrisisConnect Hero Top Section */}
					<div className="mb-6 flex flex-col items-center">
						<div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3 font-heading">
							<ShieldCheck className="size-3.5" />
							<span>CrisisConnect Coordination Portal</span>
						</div>
						<h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
							Crisis
							<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
								Connect
							</span>
						</h1>
						<p className="font-sans text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-xl leading-relaxed">
							Crisis Response & Coordination Network
						</p>
						<div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full mt-4" />
					</div>

					<Navigation />

					{/* Exactly Two Cards: Login & Registration */}
					<div className="grid gap-6 sm:grid-cols-2 w-full mt-2">
						{/* Card 1: Login */}
						<AceternityCard className="flex flex-col justify-between text-left p-6">
							<div>
								<div className="size-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-4 border border-blue-100 dark:border-blue-800">
									<LogIn className="size-5" />
								</div>
								<span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
									Responders & Admins
								</span>
								<h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white mt-1">
									Login to Portal
								</h3>
								<p className="font-sans text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
									Sign in to access active crisis monitoring, responder
									dashboards, and incident updates.
								</p>
							</div>
							<Link
								href="/login"
								className="font-heading mt-6 inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 text-xs font-semibold shadow-md shadow-blue-500/20 transition"
							>
								<span>Proceed to Login</span>
								<ArrowRight className="size-3.5" />
							</Link>
						</AceternityCard>

						{/* Card 2: Register */}
						<AceternityCard className="flex flex-col justify-between text-left p-6">
							<div>
								<div className="size-11 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100 dark:border-indigo-800">
									<UserPlus className="size-5" />
								</div>
								<span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
									New Volunteers & Partners
								</span>
								<h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white mt-1">
									Register Account
								</h3>
								<p className="font-sans text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
									Join our disaster response network as a certified NGO, Field
									Volunteer, or Crisis Donor.
								</p>
							</div>
							<Link
								href="/register"
								className="font-heading mt-6 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/60 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-4 text-xs font-semibold transition"
							>
								<span>Choose Role & Register</span>
								<ArrowRight className="size-3.5" />
							</Link>
						</AceternityCard>
					</div>
				</div>
			</div>
			<Footer />
		</BackgroundGrid>
	);
}
