import { HugeiconsIcon } from "@hugeicons/react";
import { Link04Icon, Location04Icon } from "@hugeicons-pro/core-stroke-rounded";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Glow from "../ui/glow";
import type { OnboardingFormValues } from "./StartupApplicationForm";

interface StartupPreviewCardProps {
	formValues: Partial<OnboardingFormValues>;
	userFullName?: string;
}

// Dummy data to show initially
const DUMMY_DATA = {
	companyName: "Your Startup Name",
	shortDescription:
		"A brief description of what your startup does and the problem it solves for customers.",
	companyUrl: "https://yourstartup.com",
	category: "B2B",
	futureLocation: "San Francisco, CA",
	founders: ["Your Name"],
};

// Helper function to get initials from company name
function getInitials(name: string): string {
	const words = name.trim().split(/\s+/);
	if (words.length === 1) {
		return words[0].substring(0, 2).toUpperCase();
	}
	return words
		.slice(0, 2)
		.map((word) => word[0])
		.join("")
		.toUpperCase();
}

export function StartupPreviewCard({
	formValues,
	userFullName,
}: StartupPreviewCardProps) {
	// Use form values if available, otherwise use dummy data
	const displayData = {
		companyName: formValues.companyName || DUMMY_DATA.companyName,
		shortDescription:
			formValues.shortDescription || DUMMY_DATA.shortDescription,
		companyUrl: formValues.companyUrl || DUMMY_DATA.companyUrl,
		category: formValues.category || DUMMY_DATA.category,
		futureLocation: formValues.futureLocation || DUMMY_DATA.futureLocation,
		founders: formValues.coFounders?.length
			? [userFullName || "You", ...formValues.coFounders.map((cf) => cf.email)]
			: [userFullName || DUMMY_DATA.founders[0]],
	};

	// Check if user has started filling the form
	const hasUserData =
		formValues.companyName ||
		formValues.shortDescription ||
		formValues.category;

	// Get initials for avatar
	const initials = getInitials(displayData.companyName);

	return (
		<div className="w-1/2 relative flex flex-col gap-4 items-center justify-center p-8 overflow-hidden h-screen">
			<Glow variant="center" intensity="subtle" />
			<Card className="border-border/50 backdrop-blur-sm shadow-2xl bg-[#161617]/50 max-h-[90vh] overflow-y-auto w-full max-w-lg">
				<CardHeader className="space-y-3">
					<div className="flex items-start gap-4">
						<Avatar className="h-16 w-16 border-2 border-border/50 bg-[#fda123]">
							<AvatarFallback
								className={`text-xl font-semibold ${!hasUserData ? "bg-muted/30 text-white" : "bg-primary/10 text-white"}`}
							>
								{initials}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<CardTitle
								className={`text-2xl capitalize ${!hasUserData && "text-muted-foreground"}`}
							>
								{displayData.companyName}
							</CardTitle>
							<Badge variant="secondary" className="mt-2">
								{displayData.category}
							</Badge>
						</div>
					</div>
					<CardDescription
						className={`text-base ${!hasUserData && "text-muted-foreground/70"}`}
					>
						{displayData.shortDescription}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Startup URL - Only show if user has entered a URL */}
					{formValues.companyUrl && (
						<div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
							{(() => {
								try {
									return (
										<span className="flex items-center gap-2">
											<HugeiconsIcon
												icon={Link04Icon}
												size={16}
												color="currentColor"
												strokeWidth={1.5}
											/>
											{new URL(formValues.companyUrl).hostname}
										</span>
									);
								} catch {
									return (
										<span className="flex items-center gap-2">
											<HugeiconsIcon
												icon={Link04Icon}
												size={16}
												color="currentColor"
												strokeWidth={1.5}
											/>
											{formValues.companyUrl}
										</span>
									);
								}
							})()}
						</div>
					)}

					{/* Location */}
					<div className={formValues.companyUrl ? "pt-2" : ""}>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<HugeiconsIcon
								icon={Location04Icon}
								size={16}
								color="currentColor"
								strokeWidth={1.5}
							/>
							{displayData.futureLocation}
						</div>
					</div>

					{/* Founders */}
					<div className="pt-4 border-t">
						<h4 className="text-sm font-semibold mb-2">
							{displayData.founders.length === 1 ? "Founder" : "Founders"}
						</h4>
						<div className="flex flex-col gap-1.5">
							{displayData.founders.map((founder) => (
								<div
									key={founder}
									className={`text-sm ${!hasUserData ? "text-muted-foreground/70" : "text-muted-foreground"}`}
								>
									{founder}
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>
			{/* Hint for dummy data */}
			{!hasUserData && (
				<p className="text-sm text-muted-foreground/70 text-center">Preview</p>
			)}
		</div>
	);
}
