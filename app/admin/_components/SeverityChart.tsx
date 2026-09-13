"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

const SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

const FILLS: Record<string, string> = {
	LOW: "#64748b",
	MEDIUM: "#f59e0b",
	HIGH: "#ea580c",
	CRITICAL: "#e11d48",
};

export default function SeverityChart(props: {
	crises: { severity: string }[];
}) {
	const { crises } = props;
	const svgRef = useRef<SVGSVGElement>(null);

	useEffect(() => {
		if (!svgRef.current || crises.length === 0) return;

		const counts = SEVERITIES.map((severity) => ({
			severity: severity,
			count: crises.filter((crisis) => crisis.severity === severity).length,
		}));

		const width = 500;
		const barHeight = 26;
		const gap = 12;
		const height = counts.length * (barHeight + gap);

		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();
		svg
			.attr("width", width)
			.attr("height", height)
			.attr("viewBox", "0 0 " + width + " " + height);

		const maxCount = d3.max(counts, (item) => item.count) || 1;
		const scale = d3
			.scaleLinear()
			.domain([0, maxCount])
			.range([0, width - 150]);

		const bars = svg
			.selectAll("g")
			.data(counts)
			.enter()
			.append("g")
			.attr(
				"transform",
				(_item, index) => "translate(0," + index * (barHeight + gap) + ")",
			);

		// Severity Label (Space Grotesk)
		bars
			.append("text")
			.attr("x", 0)
			.attr("y", barHeight / 2)
			.attr("dy", "0.35em")
			.attr("font-size", 11)
			.attr("font-family", "var(--font-space-grotesk), sans-serif")
			.attr("font-weight", "600")
			.attr("fill", "currentColor")
			.text((item) => item.severity);

		// Bar rect
		bars
			.append("rect")
			.attr("x", 90)
			.attr("y", 0)
			.attr("width", (item) =>
				Math.max(scale(item.count), item.count > 0 ? 8 : 0),
			)
			.attr("height", barHeight)
			.attr("rx", 6)
			.attr("fill", (item) => FILLS[item.severity]);

		// Value count (Inter)
		bars
			.append("text")
			.attr(
				"x",
				(item) => 98 + Math.max(scale(item.count), item.count > 0 ? 8 : 0),
			)
			.attr("y", barHeight / 2)
			.attr("dy", "0.35em")
			.attr("font-size", 11)
			.attr("font-family", "var(--font-sans), sans-serif")
			.attr("font-weight", "500")
			.attr("fill", "currentColor")
			.text((item) => item.count);
	}, [crises]);

	if (crises.length === 0) {
		return (
			<p className="text-xs font-sans text-slate-500">No crises logged yet.</p>
		);
	}

	return (
		<div className="rounded-xl border border-slate-200/80 bg-white/60 p-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60 max-w-lg">
			<svg
				ref={svgRef}
				className="max-w-full text-slate-800 dark:text-slate-200"
			/>
		</div>
	);
}
