"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, AlertCircle } from "lucide-react";

export default function CrisisActions(props: { crisisId: number }) {
	const { crisisId } = props;
	const router = useRouter();
	const [message, setMessage] = useState("");

	return (
		<div className="mt-6 border-t border-slate-200/80 dark:border-slate-800 pt-4">
			<div className="flex flex-wrap gap-2">
				<Button
					nativeButton={false}
					className="bg-blue-600 hover:bg-blue-700 text-white font-heading text-xs font-semibold gap-1.5"
					render={<Link href={"/admin/crises/" + crisisId + "/edit"} />}
				>
					<Pencil className="size-3.5" /> Edit crisis
				</Button>

				<Button
					variant="destructive"
					className="font-heading text-xs font-semibold gap-1.5"
					onClick={async () => {
						const token = localStorage.getItem("token");
						if (!token) {
							setMessage("Log in as an admin to manage crises.");
							return;
						}
						if (!window.confirm("Delete this crisis record permanently?")) {
							return;
						}
						try {
							await axios.delete(
								process.env.NEXT_PUBLIC_API_ENDPOINT +
									"/admin/crisis/" +
									crisisId,
								{ headers: { Authorization: "Bearer " + token } },
							);
							router.push("/admin/crises");
							router.refresh();
						} catch (err: any) {
							const message =
								err.response && err.response.data && err.response.data.message;
							setMessage(
								Array.isArray(message)
									? message[0]
									: message || "Something went wrong",
							);
						}
					}}
				>
					<Trash2 className="size-3.5" /> Delete crisis
				</Button>
			</div>
			{message && (
				<div className="mt-3 flex items-center gap-2 text-xs font-sans text-rose-600 dark:text-rose-400">
					<AlertCircle className="size-4 shrink-0" />
					<span>{message}</span>
				</div>
			)}
		</div>
	);
}
