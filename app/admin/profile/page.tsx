"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import axios from "axios";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/BackButton";
import { statusColor } from "../_components/statusColor";
import { AceternityCard } from "@/components/ui/aceternity";
import {
	User,
	Phone,
	MapPin,
	Calendar,
	CheckCircle2,
	AlertCircle,
	Save,
	Camera,
	ArrowLeft,
	ShieldCheck,
	Mail,
} from "lucide-react";

const profileSchema = z.object({
	fullName: z.string().min(1, "Full name is required"),
	phone: z.string().regex(/^[0-9]{10,15}$/, "Phone must be 10-15 digits"),
	city: z.string().min(1, "City is required"),
	age: z
		.string()
		.regex(/^[0-9]+$/, "Age must be a whole number")
		.refine((value) => Number(value) >= 18, "Age must be at least 18"),
});

export default function AdminProfilePage() {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [profile, setProfile] = useState<any>(null);
	const [email, setEmail] = useState("");
	const [fullName, setFullName] = useState("");
	const [phone, setPhone] = useState("");
	const [city, setCity] = useState("");
	const [age, setAge] = useState("");
	const [status, setStatus] = useState("ACTIVE");
	const [uploadingImage, setUploadingImage] = useState(false);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");

	useEffect(() => {
		fetchProfile();
	}, []);

	async function fetchProfile() {
		setEmail(localStorage.getItem("email") || "");
		const token = localStorage.getItem("token");
		if (!token) {
			router.replace("/login");
			return;
		}
		try {
			const response = await axios.get(
				process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/profile",
				{ headers: { Authorization: "Bearer " + token } },
			);
			setProfile(response.data);
			setFullName(response.data.fullName || "");
			setPhone(String(response.data.phone || ""));
			setCity(response.data.city || "");
			setAge(String(response.data.age || ""));
			setStatus(response.data.status || "ACTIVE");
		} catch (err: any) {
			console.error(err);
		}
	}

	async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		const token = localStorage.getItem("token");
		if (!token) return;

		const formData = new FormData();
		formData.append("image", file);

		setUploadingImage(true);
		setError("");
		setMessage("");

		try {
			await axios.post(
				process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/profile/image",
				formData,
				{
					headers: {
						Authorization: "Bearer " + token,
						"Content-Type": "multipart/form-data",
					},
				},
			);
			setMessage("Profile avatar updated successfully.");
			fetchProfile();
		} catch (err: any) {
			const msg = err.response?.data?.message;
			setError(Array.isArray(msg) ? msg[0] : msg || "Failed to upload image");
		} finally {
			setUploadingImage(false);
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<Header
					title="Admin Profile"
					subtitle="Manage your personal identity, crisis dispatcher badge, and duty availability."
				/>
				<BackButton
					href="/admin/dashboard"
					label="Back to Dashboard"
					className="hidden sm:inline-flex"
				/>
			</div>

			{error && (
				<div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/30 dark:border-rose-900 text-xs font-sans">
					<AlertCircle className="size-4 shrink-0" />
					<span>{error}</span>
				</div>
			)}
			{message && (
				<div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900 text-xs font-sans">
					<CheckCircle2 className="size-4 shrink-0" />
					<span>{message}</span>
				</div>
			)}

			<div className="grid gap-6 lg:grid-cols-3">
				{/* Profile Card & Avatar */}
				<AceternityCard className="flex flex-col justify-between">
					<div>
						<div className="flex flex-col items-center text-center pb-4 border-b border-slate-100 dark:border-slate-800">
							<div className="relative group">
								{profile?.profileImage ? (
									<img
										src={
											process.env.NEXT_PUBLIC_API_ENDPOINT +
											profile.profileImage
										}
										alt={profile.fullName}
										className="size-24 rounded-2xl object-cover border-2 border-blue-600/30 shadow-md"
									/>
								) : (
									<div className="size-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-heading font-bold text-3xl shadow-md">
										{profile?.fullName
											? profile.fullName.charAt(0).toUpperCase()
											: "A"}
									</div>
								)}

								<button
									type="button"
									onClick={() => fileInputRef.current?.click()}
									disabled={uploadingImage}
									aria-label="Upload profile image"
									className="absolute -bottom-1 -right-1 size-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg hover:bg-slate-800 transition"
								>
									<Camera className="size-3.5" />
								</button>
								<input
									type="file"
									ref={fileInputRef}
									className="hidden"
									accept="image/*"
									onChange={handleImageUpload}
								/>
							</div>

							<h3 className="font-heading text-lg font-bold mt-3 text-slate-900 dark:text-white">
								{profile?.fullName || "Administrator"}
							</h3>
							<p className="font-sans text-xs text-slate-500 flex items-center gap-1 mt-0.5">
								<Mail className="size-3" /> {email}
							</p>
							<Badge
								className={`border font-heading text-[10px] mt-2 ${statusColor(status)}`}
							>
								{status}
							</Badge>
						</div>

						<div className="mt-4 space-y-2.5 font-sans text-xs text-slate-600 dark:text-slate-400">
							<div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
								<span className="flex items-center gap-2 text-slate-500">
									<ShieldCheck className="size-3.5 text-blue-600" /> Clearance
									Role
								</span>
								<span className="font-semibold text-slate-900 dark:text-white font-heading">
									System Admin
								</span>
							</div>
							<div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
								<span className="flex items-center gap-2 text-slate-500">
									<Phone className="size-3.5" /> Phone
								</span>
								<span className="font-medium text-slate-800 dark:text-slate-200">
									{profile?.phone || "—"}
								</span>
							</div>
							<div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
								<span className="flex items-center gap-2 text-slate-500">
									<MapPin className="size-3.5" /> Station City
								</span>
								<span className="font-medium text-slate-800 dark:text-slate-200">
									{profile?.city || "—"}
								</span>
							</div>
							<div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
								<span className="flex items-center gap-2 text-slate-500">
									<User className="size-3.5" /> Age
								</span>
								<span className="font-medium text-slate-800 dark:text-slate-200">
									{profile?.age ? `${profile.age} years` : "—"}
								</span>
							</div>
							{profile?.user?.createdAt && (
								<div className="flex items-center justify-between py-1">
									<span className="flex items-center gap-2 text-slate-500">
										<Calendar className="size-3.5" /> Registered
									</span>
									<span className="font-medium text-slate-800 dark:text-slate-200">
										{new Date(profile.user.createdAt).toLocaleDateString()}
									</span>
								</div>
							)}
						</div>
					</div>

					{/* Quick Duty Availability Toggle */}
					<div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
						<label
							htmlFor="status"
							className="font-heading text-xs font-semibold block mb-1"
						>
							Duty Availability Status
						</label>
						<div className="flex gap-2">
							<select
								id="status"
								className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2 font-sans text-xs focus:ring-2 focus:ring-blue-500/40"
								value={status}
								onChange={(e) => setStatus(e.target.value)}
							>
								<option value="ACTIVE">ACTIVE</option>
								<option value="ON_LEAVE">ON_LEAVE</option>
								<option value="SUSPENDED">SUSPENDED</option>
							</select>
							<button
								type="button"
								onClick={async () => {
									try {
										const token = localStorage.getItem("token");
										const response = await axios.patch(
											process.env.NEXT_PUBLIC_API_ENDPOINT +
												"/admin/profile/status",
											{ status },
											{ headers: { Authorization: "Bearer " + token } },
										);
										setProfile(response.data);
										setError("");
										setMessage("Availability status updated.");
									} catch (err: any) {
										const msg = err.response?.data?.message;
										setError(
											Array.isArray(msg)
												? msg[0]
												: msg || "Status update failed",
										);
									}
								}}
								className="rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 text-white px-3 py-1.5 font-heading text-xs font-semibold transition"
							>
								Update
							</button>
						</div>
					</div>
				</AceternityCard>

				{/* Update Profile Form */}
				<AceternityCard className="lg:col-span-2">
					<h2 className="font-heading text-lg font-bold mb-1">
						Edit Account Details
					</h2>
					<p className="font-sans text-xs text-slate-500 dark:text-slate-400 mb-6">
						Modify identity records and contact channels displayed across
						dispatcher bulletins.
					</p>

					<form
						onSubmit={async (e) => {
							e.preventDefault();

							const result = profileSchema.safeParse({
								fullName,
								phone,
								city,
								age,
							});
							if (!result.success) {
								setError(result.error.issues[0].message);
								return;
							}

							try {
								const token = localStorage.getItem("token");
								const response = await axios.put(
									process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/profile",
									{ fullName, phone, city, age: Number(age) },
									{ headers: { Authorization: "Bearer " + token } },
								);
								setProfile(response.data);
								setError("");
								setMessage("Profile credentials saved successfully.");
							} catch (err: any) {
								const msg = err.response?.data?.message;
								setError(
									Array.isArray(msg) ? msg[0] : msg || "Something went wrong",
								);
							}
						}}
						className="grid gap-4 sm:grid-cols-2 font-sans text-xs"
					>
						<div>
							<label
								htmlFor="fullName"
								className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1"
							>
								Full Name
							</label>
							<input
								id="fullName"
								className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
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
								id="phone"
								className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
							/>
						</div>

						<div>
							<label
								htmlFor="city"
								className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1"
							>
								Station City
							</label>
							<input
								id="city"
								className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
								value={city}
								onChange={(e) => setCity(e.target.value)}
							/>
						</div>

						<div>
							<label
								htmlFor="age"
								className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1"
							>
								Age
							</label>
							<input
								id="age"
								className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
								value={age}
								onChange={(e) => setAge(e.target.value)}
							/>
						</div>

						<div className="sm:col-span-2 pt-2">
							<button
								type="submit"
								className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-heading font-semibold py-2.5 px-5 text-xs transition shadow-md shadow-blue-500/20"
							>
								<Save className="size-3.5" /> Save Changes
							</button>
						</div>
					</form>
				</AceternityCard>
			</div>
		</div>
	);
}
