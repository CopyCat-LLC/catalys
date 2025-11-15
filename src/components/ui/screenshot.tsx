"use client";

import { cn } from "@/lib/utils";

interface ScreenshotProps {
	srcDark?: string;
	alt: string;
	width: number;
	height: number;
	className?: string;
}

export default function Screenshot({
	srcDark,
	alt,
	width,
	height,
	className,
}: ScreenshotProps) {
	if (!srcDark) {
		return (
			<div style={{ width, height }} className={cn("bg-muted", className)} />
		);
	}

	return (
		<img
			src={srcDark}
			alt={alt}
			width={"100%"}
			height={height}
			className={className}
			loading="lazy"
			decoding="async"
		/>
	);
}
