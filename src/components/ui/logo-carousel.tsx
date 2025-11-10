import { cn } from "@/lib/utils";

interface LogoCarouselProps {
	columnCount?: number;
	className?: string;
}

// Dummy company logos - using simple SVG placeholders
const dummyLogos = [
	{ name: "Acme Corp", color: "#3b82f6" },
	{ name: "TechFlow", color: "#8b5cf6" },
	{ name: "Nexus", color: "#ec4899" },
	{ name: "Quantum", color: "#06b6d4" },
	{ name: "Synergy", color: "#10b981" },
	{ name: "Velocity", color: "#f59e0b" },
	{ name: "Zenith", color: "#ef4444" },
	{ name: "Catalyst", color: "#6366f1" },
	{ name: "Innovate", color: "#14b8a6" },
	{ name: "Fusion", color: "#a855f7" },
];

const LogoItem = ({ name, color }: { name: string; color: string }) => {
	return (
		<div className="flex items-center justify-center px-8">
			<div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
				{/* Simple geometric logo placeholder */}
				<svg
					width="32"
					height="32"
					viewBox="0 0 32 32"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<rect
						x="4"
						y="4"
						width="24"
						height="24"
						rx="6"
						fill={color}
						fillOpacity="0.2"
					/>
					<circle cx="16" cy="16" r="6" fill={color} />
				</svg>
				<span className="text-lg font-semibold text-foreground/70 whitespace-nowrap">
					{name}
				</span>
			</div>
		</div>
	);
};

export default function LogoCarousel({ className }: LogoCarouselProps) {
	// Duplicate the logos array to create seamless loop
	const logosToDisplay = [...dummyLogos, ...dummyLogos];

	return (
		<div className={cn("w-full overflow-hidden relative", className)}>
			<div className="relative flex items-center">
				{/* First set of logos */}
				<div className="flex items-center shrink-0 animate-[scroll-left_30s_linear_infinite]">
					{logosToDisplay.map((logo, index) => (
						<LogoItem
							key={`first-${logo.name}-${index}`}
							name={logo.name}
							color={logo.color}
						/>
					))}
				</div>
				{/* Second set for seamless loop */}
				<div className="flex items-center shrink-0 animate-[scroll-left_30s_linear_infinite]">
					{logosToDisplay.map((logo, index) => (
						<LogoItem
							key={`second-${logo.name}-${index}`}
							name={logo.name}
							color={logo.color}
						/>
					))}
				</div>
			</div>

			{/* Left fade gradient */}
			<div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-background to-transparent pointer-events-none z-10" />

			{/* Right fade gradient */}
			<div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-background to-transparent pointer-events-none z-10" />
		</div>
	);
}
