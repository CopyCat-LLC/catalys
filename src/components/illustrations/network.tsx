import { useId } from "react";

import LaunchUI from "@/components/logos/launch-ui";
import { Beam } from "@/components/ui/beam";
import { cn } from "@/lib/utils";

import Glow from "../ui/glow";

interface NetworkIllustrationProps {
	className?: string;
	centerLogo?: React.ComponentType<{ className?: string }>;
}

function NetworkIllustration({
	className,
	centerLogo: CenterLogo = LaunchUI,
}: NetworkIllustrationProps) {
	const svgTitleId = useId();
	const dots = [
		{
			id: "dot-42-10",
			top: "42%",
			left: "10%",
			size: 3,
		},
		{
			id: "dot-31-24",
			top: "31%",
			left: "24%",
			size: 3,
		},
		{
			id: "dot-79-39",
			top: "79%",
			left: "39%",
			size: 3,
		},
		{
			id: "dot-24-75",
			top: "24%",
			left: "75%",
			size: 3,
		},
		{
			id: "dot-57-95",
			top: "57%",
			left: "95%",
			size: 3,
		},
		{
			id: "dot-80-81",
			top: "80%",
			left: "81%",
			size: 3,
		},
	];

	return (
		<div
			className={cn(
				"group relative flex aspect-video w-full items-center justify-center",
				className,
			)}
		>
			<div className="text-muted-foreground/20 h-full w-full">
				<svg
					width="512"
					height="256"
					viewBox="0 0 512 256"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="fade-top relative h-full! w-full!"
					role="img"
					aria-labelledby={svgTitleId}
				>
					<title id={svgTitleId}>Network connection illustration</title>
					<path
						d="M254.884 128.439L386 53M254.884 128.439L201.555 210.908M254.884 128.439L122.687 71.6579M254.884 128.439L194.795 -24.3298M254.884 128.439L414 215M254.884 128.439L487.682 146.015M386 53L194.795 -24.3298M386 53L487.682 146.015M386 53L454.633 -18.922M201.555 210.908L414 215M201.555 210.908L122.687 71.6579M201.555 210.908L52.5 103.5M201.555 210.908L144 289.771M201.555 210.908H-49.9724M414 215L487.682 146.015M414 215L144 289.771M414 215L323.187 365.479M414 215L563.434 333.082M122.687 71.6579L52.5 103.5M122.687 71.6579L194.795 -24.3298M194.795 -24.3298L52.5 103.5M194.795 -24.3298L454.633 -18.922M194.795 -24.3298H-9.50954L52.5 103.5M52.5 103.5L-49.9724 210.908M487.682 146.015L614.552 365.479M487.682 146.015L679.2 188.425L454.633 -18.922M144 289.771L-49.9724 210.908"
						stroke="currentColor"
					/>
				</svg>
			</div>
			<div className="bg-background/20 absolute top-1/2 left-1/2 z-1 -translate-x-1/2 -translate-y-1/2 rounded-full p-2 transition-transform duration-300 group-hover:scale-110">
				<div className="glass-5 bg-background relative z-10 rounded-full p-3 shadow">
					<Beam tone="brand">
						<CenterLogo className="text-light size-10" />
					</Beam>
				</div>
			</div>

			{dots.map((dot) => (
				<div
					className="glass-4 bg-background ring-background/50 absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full p-1.5 ring-4 transition-transform duration-300 group-hover:scale-110"
					style={{
						top: dot.top,
						left: dot.left,
						width: `${dot.size * 6}px`,
						height: `${dot.size * 6}px`,
					}}
					key={dot.id}
				/>
			))}
			<Glow
				variant="center"
				className="pointer-events-none z-10 scale-x-[1.5] opacity-20 transition-all duration-300 group-hover:opacity-30"
			/>
		</div>
	);
}

export default NetworkIllustration;
