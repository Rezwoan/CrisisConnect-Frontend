"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { BackgroundGrid, AceternityCard } from "@/components/ui/aceternity";
import {
	Building2,
	HeartHandshake,
	CircleDollarSign,
	ArrowRight,
	ShieldCheck,
} from "lucide-react";

export default function RegisterPage() {
	const roles = [
		{
			title: "Non-Governmental Organization (NGO)",
			desc: "Deploy resources, coordinate rescue efforts, and manage field teams.",
			href: "/ngo/register",
			icon: Building2,
			tag: "Organizations",
		},
		{
			title: "Field Volunteer",
			desc: "Join active relief efforts, assist on-site operations, and get deployed.",
			href: "/volunteer/register",
			icon: HeartHandshake,
			tag: "Responders",
		},
		{
			title: "Crisis Donor",
			desc: "Supply humanitarian aid, capital contributions, and track impact.",
			href: "/donor/register",
			icon: CircleDollarSign,
			tag: "Aid & Supplies",
		},
	];

	return (
		<BackgroundGrid className="flex min-h-screen flex-col">
			{/* Full-width top header */}
			<TopBar />

			{/* Main Registration Content: max-w-xl */}
			<div className="flex flex-1 items-center justify-center p-6 md:p-12">
				<div className="w-full max-w-xl mx-auto flex flex-col items-center">
					<Header
						title="Choose Account Role"
						subtitle="Select the role that matches your engagement with CrisisConnect."
						align="center"
					/>

					<Navigation />

					<div className="grid gap-3.5 w-full mt-1">
						{roles.map((item) => {
							const Icon = item.icon;
							return (
								<Link key={item.href} href={item.href} className="group">
									<AceternityCard className="flex items-center justify-between p-5 transition-all duration-200 group-hover:translate-x-1">
										<div className="flex items-center gap-4">
											<div className="size-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800">
												<Icon className="size-5" />
											</div>
											<div>
												<span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
													{item.tag}
												</span>
												<h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
													{item.title}
												</h3>
												<p className="font-sans text-xs text-slate-500 dark:text-slate-400 mt-0.5">
													{item.desc}
												</p>
											</div>
										</div>
										<ArrowRight className="size-5 text-slate-400 group-hover:text-blue-600 transition shrink-0 ml-4" />
									</AceternityCard>
								</Link>
							);
						})}

						{/* Back link to login */}
						<div className="text-center pt-2">
							<p className="font-sans text-xs text-slate-500 dark:text-slate-400">
								Already have an account?{" "}
								<Link
									href="/login"
									className="font-heading font-semibold text-blue-600 hover:text-blue-700 hover:underline ml-1"
								>
									Sign In
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</BackgroundGrid>
	);
}
