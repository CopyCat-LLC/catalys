import {
	BarChart,
	Globe,
	Search,
	Shield,
	Target,
	TrendingUp,
} from "lucide-react";

const Investors = () => {
	const benefits = [
		{
			icon: Target,
			title: "Pre-Vetted Deals",
			description:
				"Access curated investment opportunities that match your thesis. Every startup is verified and ready for evaluation.",
		},
		{
			icon: Search,
			title: "Advanced Filtering",
			description:
				"Find exactly what you're looking for with powerful search filters by stage, industry, valuation, and more.",
		},
		{
			icon: BarChart,
			title: "Comprehensive Data",
			description:
				"Review detailed financials, traction metrics, and growth trajectories. Make informed decisions with complete transparency.",
		},
		{
			icon: TrendingUp,
			title: "Competitive Advantage",
			description:
				"Access deals before they hit the wider market. Submit offers with terms that work for your fund.",
		},
		{
			icon: Shield,
			title: "Secure Process",
			description:
				"All communications and documents are encrypted. Maintain confidentiality throughout the investment process.",
		},
		{
			icon: Globe,
			title: "Global Opportunities",
			description:
				"Discover startups from emerging ecosystems worldwide. Diversify your portfolio across geographies and sectors.",
		},
	];

	return (
		<section
			id="investors"
			className="relative overflow-hidden bg-slate-50 dark:bg-slate-900 py-24 sm:py-32"
		>
			{/* Subtle grid pattern */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px]" />

			{/* Gradient accent */}
			<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

			<div className="relative mx-auto max-w-7xl px-6 lg:px-8">
				{/* Header */}
				<div className="mx-auto max-w-2xl text-center mb-16">
					<h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl mb-6">
						Discover deals.{" "}
						<span className="text-slate-600 dark:text-slate-400">
							Submit offers.
						</span>
					</h2>
					<p className="text-lg leading-8 text-slate-600 dark:text-slate-400">
						Browse pre-vetted startups actively seeking investment. Review
						comprehensive data, submit competitive offers, and close deals
						faster.
					</p>
				</div>

				{/* Benefits Grid */}
				<div className="mx-auto max-w-6xl">
					<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{benefits.map((benefit) => {
							const Icon = benefit.icon;
							return (
								<div
									key={benefit.title}
									className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
								>
									{/* Icon */}
									<div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white group-hover:bg-indigo-600 dark:group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:text-white transition-all duration-300">
										<Icon className="h-6 w-6" />
									</div>

									{/* Content */}
									<h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
										{benefit.title}
									</h3>
									<p className="text-slate-600 dark:text-slate-400 leading-relaxed">
										{benefit.description}
									</p>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Investors;
