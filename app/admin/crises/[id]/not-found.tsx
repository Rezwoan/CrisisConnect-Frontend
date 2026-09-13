import Link from "next/link";
import Header from "@/components/Header";

export default function CrisisNotFound() {
  return (
    <>
      <Header title="Crisis Not Found" />
      <p>We could not find that crisis.</p>
      <Link href="/admin/crises" className="text-blue-600">Back to crises</Link>
    </>
  );
}
