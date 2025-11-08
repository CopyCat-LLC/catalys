const About = () => {
	return (
		<section
			id="about"
			className="relative overflow-hidden bg-white dark:bg-slate-950 py-24 sm:py-32"
		>
			{/* Subtle grid pattern */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px]" />

			{/* Gradient accent */}
			<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

			<div className="relative mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-3xl">
					{/* Header */}
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl mb-6">
							About Catalys
						</h2>
						<p className="text-lg leading-8 text-slate-600 dark:text-slate-400">
							We're building the modern infrastructure for startup fundraising.
						</p>
					</div>

					{/* Content */}
					<div className="space-y-8 text-slate-600 dark:text-slate-400">
						<div>
							<h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
								Our Mission
							</h3>
							<p className="leading-relaxed">
								Traditional fundraising is broken. Founders spend months
								pitching investors one by one, often accepting the first offer
								they receive. Meanwhile, investors struggle to find quality
								deals and negotiate terms in isolation.
							</p>
						</div>

						<div>
							<h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
								A Better Way
							</h3>
							<p className="leading-relaxed">
								Catalys creates a transparent marketplace where startups and
								investors meet on equal terms. Founders post their funding needs
								once and receive multiple competing offers. Investors access
								pre-vetted deals and submit their best terms upfront.
							</p>
						</div>

						<div>
							<h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
								The Result
							</h3>
							<p className="leading-relaxed">
								Faster fundraising, better terms, and more transparency for
								everyone. We're empowering founders to focus on building while
								helping investors deploy capital efficiently.
							</p>
						</div>

						<div className="pt-8 border-t border-slate-200 dark:border-slate-800">
							<div className="grid grid-cols-3 gap-8 text-center">
								<div>
									<div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
										2023
									</div>
									<div className="text-sm">Founded</div>
								</div>
								<div>
									<div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
										850+
									</div>
									<div className="text-sm">Companies</div>
								</div>
								<div>
									<div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
										$2.4B+
									</div>
									<div className="text-sm">Raised</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default About;
