import { cn } from "@/lib/utils";

type MarqueeProps = {
	className?: string;
	reverse?: boolean;
	pauseOnHover?: boolean;
	playOnHover?: boolean;
	children?: React.ReactNode;
	vertical?: boolean;
	repeat?: number;
	[key: string]: number | boolean | React.ReactNode | undefined;
};

export default function Marquee({
	className,
	reverse,
	pauseOnHover = false,
	playOnHover = false,
	children,
	vertical = false,
	repeat = 4,
	...props
}: MarqueeProps) {
	return (
		<div
			{...props}
			data-slot="marquee"
			className={cn(
				"group flex gap:(--gap) overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
				{
					"flex-row": !vertical,
					"flex-col": vertical,
				},
				className,
			)}
		>
			{Array(repeat)
				.fill(0)
				.map((_, index) => (
					<div
						key={`marquee-item-${index}-${children}`}
						data-slot="marquee-item"
						className={cn("flex shrink-0 justify-around gap(--gap)", {
							"animate-marquee flex-row": !vertical,
							"animate-marquee-vertical flex-col": vertical,
							"group-hover:paused": pauseOnHover,
							"paused group-hover:running": playOnHover,
							"direction-[reverse]": reverse,
						})}
					>
						{children}
					</div>
				))}
		</div>
	);
}
