import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import StartupCard from "./StartupCard";

const Hero = () => {
	return (
		<section
			id="home"
			className="relative overflow-hidden bg-linear-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen flex items-center justify-center"
		>
			{/* Subtle grid pattern */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px]" />

			{/* Subtle gradient accent - top */}
			<div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

			{/* Sophisticated radial gradient */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-slate-100/40 via-transparent to-transparent dark:from-slate-800/40" />

			<div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
					{/* Left Column - Text Content */}
					<div className="space-y-8">
						{/* Professional Badge */}
						<div className="inline-flex items-center gap-2 rounded-md border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm">
							<div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
							<span>Trusted by institutional investors</span>
						</div>

						{/* Professional Headline */}
						<h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl leading-[1.1]">
							Secure capital.{" "}
							<span className="text-slate-600 dark:text-slate-400">
								On your terms.
							</span>
						</h1>

						{/* Clear Value Proposition */}
						<p className="text-lg leading-8 text-slate-600 dark:text-slate-400 sm:text-xl max-w-xl">
							A transparent marketplace connecting startups with qualified
							investors. Streamlined due diligence, competitive terms, and
							faster closes.
						</p>

						{/* Professional CTAs */}
						<div className="flex flex-col sm:flex-row items-start gap-4 pt-2">
							<Button
								asChild
								size="lg"
								className="h-12 px-8 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
							>
								<Link to="/sign-up">Start Raising Capital</Link>
							</Button>
							<Button
								asChild
								size="lg"
								variant="outline"
								className="h-12 px-8 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 font-semibold w-full sm:w-auto"
							>
								<Link to="/dashboard">View Investment Opportunities</Link>
							</Button>
						</div>

						{/* Trust Metrics */}
						<div className="grid grid-cols-3 gap-8 pt-4 border-t border-slate-200 dark:border-slate-800">
							<div>
								<div className="text-3xl font-bold text-slate-900 dark:text-white">
									$2.4B+
								</div>
								<div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
									Capital raised
								</div>
							</div>
							<div>
								<div className="text-3xl font-bold text-slate-900 dark:text-white">
									850+
								</div>
								<div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
									Companies funded
								</div>
							</div>
							<div>
								<div className="text-3xl font-bold text-slate-900 dark:text-white">
									200+
								</div>
								<div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
									Active investors
								</div>
							</div>
						</div>
					</div>

					{/* Right Column - Startup Card Demo */}
					<div className="lg:pl-8">
						<div className="relative">
							{/* Subtle shadow card */}
							<div className="absolute inset-0 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl blur-3xl translate-y-8" />
							{/* Main card */}
							<div className="relative z-10">
								<StartupCard animate={true} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
