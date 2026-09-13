export default function Header(props: {
	title: string;
	subtitle?: string;
	align?: "left" | "center";
}) {
	const isCenter = props.align === "center";

	return (
		<header
			className={`mb-6 flex flex-col ${isCenter ? "items-center text-center" : "items-start text-left"}`}
		>
			<div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400 mb-2 font-heading">
				<span>CrisisConnect</span>
			</div>
			<h1 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
				{props.title}
			</h1>
			{props.subtitle && (
				<p className="font-sans text-sm text-slate-600 dark:text-slate-400 mt-1.5 max-w-xl leading-relaxed">
					{props.subtitle}
				</p>
			)}
			<div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full mt-3" />
		</header>
	);
}
