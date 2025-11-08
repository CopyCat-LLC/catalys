import { Clock, FileCheck, Shield, TrendingUp, Users, Zap } from "lucide-react";

const Founders = () => {
	const benefits = [
		{
			icon: TrendingUp,
			title: "Receive Multiple Offers",
			description:
				"Post your funding request and watch investors compete. Receive multiple offers with varying terms and valuations.",
		},
		{
			icon: Users,
			title: "Let Investors Come to You",
			description:
				"No more cold outreach. Qualified investors review your request and submit offers directly to you.",
		},
		{
			icon: Shield,
			title: "You Choose the Winner",
			description:
				"Compare all offers side-by-side and accept the one that best fits your needs. You're always in control.",
		},
		{
			icon: Clock,
			title: "Faster Fundraising",
			description:
				"Skip months of back-and-forth negotiations. Investors submit their best offers upfront, accelerating your timeline.",
		},
		{
			icon: FileCheck,
			title: "Transparent Process",
			description:
				"See all terms clearly. No hidden conditions or surprise clauses. Everything is standardized and visible.",
		},
		{
			icon: Zap,
			title: "Market-Driven Pricing",
			description:
				"Competition drives better valuations. When multiple investors bid, you get the best possible terms.",
		},
	];

	return (
		<section
			id="founders"
			className="relative overflow-hidden bg-white dark:bg-slate-950 py-24 sm:py-32"
		>
			{/* Subtle grid pattern */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px]" />

			{/* Gradient accent */}
			<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

			<div className="relative mx-auto max-w-7xl px-6 lg:px-8">
				{/* Header */}
				<div className="mx-auto max-w-2xl text-center mb-16">
					<h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl mb-6">
						Post once.{" "}
						<span className="text-slate-600 dark:text-slate-400">
							Receive multiple offers.
						</span>
					</h2>
					<p className="text-lg leading-8 text-slate-600 dark:text-slate-400">
						List your funding needs and let investors compete for your deal.
						Review all offers, compare terms, and accept the best one. It's that
						simple.
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
									className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
								>
									{/* Icon */}
									<div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-slate-900 transition-all duration-300">
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

export default Founders;
