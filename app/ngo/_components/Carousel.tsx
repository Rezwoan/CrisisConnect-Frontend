"use client";

import { useState } from "react";
import Link from "next/link";

export default function Carousel(props: {
  crises: { id: number; title: string; category: string; city: string }[];
}) {
  const { crises } = props;
  const [index, setIndex] = useState(0);

  if (crises.length === 0) {
    return <p>No active crises right now.</p>;
  }

  const crisis = crises[index];

  return (
    <div className="max-w-sm rounded-lg border border-slate-200 p-6 text-center">
      <h3 className="text-xl font-semibold">{crisis.title}</h3>
      <p className="text-sm text-slate-600">{crisis.category} · {crisis.city}</p>
      <Link href={"/ngo/crises/" + crisis.id} className="mt-2 inline-block text-blue-600">
        View details
      </Link>
      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={() => setIndex((index - 1 + crises.length) % crises.length)}
          className="rounded bg-slate-200 px-3 py-1"
        >
          Prev
        </button>
        <button
          onClick={() => setIndex((index + 1) % crises.length)}
          className="rounded bg-slate-200 px-3 py-1"
        >
          Next
        </button>
      </div>
    </div>
  );
}
