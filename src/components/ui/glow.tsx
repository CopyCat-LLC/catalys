import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glowVariants = cva("absolute w-full", {
	variants: {
		variant: {
			top: "top-0",
			above: "-top-[128px]",
			bottom: "bottom-0",
			below: "-bottom-[128px]",
			center: "top-[50%]",
		},
		intensity: {
			subtle: "opacity-50",
			normal: "opacity-100",
			strong: "opacity-100",
		},
	},
	defaultVariants: {
		variant: "top",
		intensity: "normal",
	},
});

function Glow({
	className,
	variant,
	intensity = "normal",
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof glowVariants>) {
	// Intensity-specific opacity values for the glow layers
	const intensityStyles = {
		subtle: {
			outer: "opacity-15 dark:opacity-70",
			inner: "opacity-15 dark:opacity-60",
		},
		normal: {
			outer: "opacity-20 dark:opacity-100",
			inner: "opacity-20 dark:opacity-100",
		},
		strong: {
			outer: "opacity-30 dark:opacity-100",
			inner: "opacity-30 dark:opacity-100",
		},
	};

	const currentIntensity = intensityStyles[intensity || "normal"];

	return (
		<div
			data-slot="glow"
			className={cn(glowVariants({ variant, intensity }), className)}
			{...props}
		>
			<div
				className={cn(
					"from-brand-foreground/50 to-brand-foreground/0 absolute left-1/2 h-[256px] w-[60%] -translate-x-1/2 scale-[2.5] rounded-[50%] bg-radial from-10% to-60% sm:h-[512px]",
					currentIntensity.outer,
					variant === "center" && "-translate-y-1/2",
				)}
			/>
			<div
				className={cn(
					"from-brand/30 to-brand-foreground/0 absolute left-1/2 h-[128px] w-[40%] -translate-x-1/2 scale-200 rounded-[50%] bg-radial from-10% to-60% sm:h-[256px]",
					currentIntensity.inner,
					variant === "center" && "-translate-y-1/2",
				)}
			/>
		</div>
	);
}

export default Glow;
