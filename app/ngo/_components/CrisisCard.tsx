import Link from "next/link";

export default function CrisisCard(props: {
  crisis: {
    id: number;
    title: string;
    category: string;
    severity: string;
    status: string;
    city: string;
  };
}) {
  const { crisis } = props;

  return (
    <div className="rounded-lg border border-slate-200 p-4 shadow-sm">
      <h3 className="text-lg font-semibold">{crisis.title}</h3>
      <p className="text-sm text-slate-600">{crisis.category} · {crisis.city}</p>
      <p className="mt-1 text-sm">Severity: {crisis.severity} · Status: {crisis.status}</p>
      <Link href={"/ngo/crises/" + crisis.id} className="mt-2 inline-block text-blue-600">
        View details
      </Link>
    </div>
  );
}
