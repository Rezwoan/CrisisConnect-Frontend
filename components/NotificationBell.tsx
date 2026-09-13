"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Pusher from "pusher-js";
import { Bell, AlertTriangle, Megaphone, CheckCircle2, X } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

interface NotificationItem {
	id: string;
	type: "crisis" | "announcement" | "status";
	title: string;
	message: string;
	timestamp: string;
	isUrgent?: boolean;
}

export default function NotificationBell() {
	const [notifications, setNotifications] = useState<NotificationItem[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [toast, setToast] = useState<NotificationItem | null>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);

		const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
		const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

		if (!pusherKey || !pusherCluster) {
			console.warn("Pusher keys are not configured in environment variables.");
			return;
		}

		// Initialize Pusher Client
		const pusher = new Pusher(pusherKey, {
			cluster: pusherCluster,
		});

		// Subscribe to the shared crisis channel
		const channel = pusher.subscribe("crisis-channel");

		// 1. Listen for New Crisis events
		channel.bind("new-crisis", (data: any) => {
			const newNotification: NotificationItem = {
				id: `${Date.now()}-crisis`,
				type: "crisis",
				title: `🚨 Escalation: ${data.title}`,
				message: `${data.severity} severity incident in ${data.city} declared by ${data.declaredBy || "Admin"}.`,
				timestamp: new Date().toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
				isUrgent: data.severity === "CRITICAL",
			};

			setNotifications((prev) => [newNotification, ...prev]);
			setUnreadCount((count) => count + 1);
			setToast(newNotification);
		});

		// 2. Listen for New Announcement events
		channel.bind("new-announcement", (data: any) => {
			const newNotification: NotificationItem = {
				id: `${Date.now()}-announcement`,
				type: "announcement",
				title: data.isUrgent
					? `📢 URGENT ALERT: ${data.title}`
					: `📢 Broadcast: ${data.title}`,
				message: data.body,
				timestamp: new Date().toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
				isUrgent: data.isUrgent,
			};

			setNotifications((prev) => [newNotification, ...prev]);
			setUnreadCount((count) => count + 1);
			setToast(newNotification);
		});

		// 3. Listen for Crisis Status Updates
		channel.bind("crisis-status-updated", (data: any) => {
			const newNotification: NotificationItem = {
				id: `${Date.now()}-status`,
				type: "status",
				title: `🔄 Status Change: ${data.title}`,
				message: `Incident lifecycle status transitioned to ${data.status}.`,
				timestamp: new Date().toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
				isUrgent: false,
			};

			setNotifications((prev) => [newNotification, ...prev]);
			setUnreadCount((count) => count + 1);
			setToast(newNotification);
		});

		// Cleanup subscriptions on unmount
		return () => {
			channel.unbind_all();
			channel.unsubscribe();
			pusher.disconnect();
		};
	}, []);

	// Auto-dismiss the live popup toast after 6 seconds
	useEffect(() => {
		if (!toast) return;
		const timer = setTimeout(() => setToast(null), 6000);
		return () => clearTimeout(timer);
	}, [toast]);

	function getNotificationIcon(type: NotificationItem["type"]) {
		switch (type) {
			case "crisis":
				return (
					<AlertTriangle className="size-4 text-rose-600 shrink-0 mt-0.5" />
				);
			case "announcement":
				return <Megaphone className="size-4 text-indigo-600 shrink-0 mt-0.5" />;
			case "status":
				return (
					<CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
				);
		}
	}

	return (
		<div className="relative">
			{/* Dropdown Menu for Historical Live Notifications */}
			<DropdownMenu>
				<DropdownMenuTrigger
					onClick={() => setUnreadCount(0)}
					className="relative flex size-8 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800 transition cursor-pointer focus:outline-none"
					aria-label="Notifications"
				>
					<Bell className="size-4" />
					{unreadCount > 0 && (
						<span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-sm animate-pulse">
							{unreadCount}
						</span>
					)}
				</DropdownMenuTrigger>

				<DropdownMenuContent
					align="end"
					className="w-80 sm:w-88 p-0 shadow-xl border border-slate-200 dark:border-slate-800"
				>
					<div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-2.5">
						<span className="font-heading text-xs font-bold text-slate-900 dark:text-white">
							Live Alerts
						</span>
						<span className="rounded-full bg-blue-50 dark:bg-blue-950 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400">
							Pusher Realtime
						</span>
					</div>

					<div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 font-sans text-xs">
						{notifications.length === 0 ? (
							<div className="p-4 text-center text-slate-400">
								No alerts received in this session.
							</div>
						) : (
							notifications.map((item) => (
								<div
									key={item.id}
									className={`p-3 transition hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
										item.isUrgent ? "bg-rose-50/50 dark:bg-rose-950/20" : ""
									}`}
								>
									<div className="flex items-start gap-2.5">
										{getNotificationIcon(item.type)}
										<div className="flex-1">
											<div className="flex items-center justify-between gap-1">
												<p className="font-heading font-semibold text-slate-900 dark:text-white">
													{item.title}
												</p>
												<span className="text-[10px] text-slate-400 shrink-0">
													{item.timestamp}
												</span>
											</div>
											<p className="text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
												{item.message}
											</p>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Slide-in Realtime Toast Notification Portalled to document.body */}
			{mounted &&
				toast &&
				createPortal(
					<div className="fixed bottom-6 right-6 z-50 flex w-[calc(100vw-3rem)] sm:w-96 items-start gap-3 rounded-xl border border-slate-200/90 bg-white/95 p-4 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 transition-all">
						<div
							className={`rounded-lg p-2 shrink-0 ${
								toast.type === "crisis"
									? "bg-rose-100 text-rose-600 dark:bg-rose-950/50"
									: toast.type === "status"
										? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50"
										: "bg-blue-100 text-blue-600 dark:bg-blue-950/50"
							}`}
						>
							{toast.type === "crisis" ? (
								<AlertTriangle className="size-5" />
							) : toast.type === "status" ? (
								<CheckCircle2 className="size-5" />
							) : (
								<Megaphone className="size-5" />
							)}
						</div>

						<div className="flex-1 min-w-0">
							<p className="font-heading text-xs font-bold text-slate-900 dark:text-white truncate">
								{toast.title}
							</p>
							<p className="font-sans text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
								{toast.message}
							</p>
						</div>

						<button
							onClick={() => setToast(null)}
							className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 shrink-0"
							aria-label="Dismiss alert"
						>
							<X className="size-4" />
						</button>
					</div>,
					document.body,
				)}
		</div>
	);
}
