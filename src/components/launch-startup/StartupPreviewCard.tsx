import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { OnboardingFormValues } from "./StartupApplicationForm";

interface StartupPreviewCardProps {
	formValues: Partial<OnboardingFormValues>;
}

export function StartupPreviewCard({ formValues }: StartupPreviewCardProps) {
	return (
		<div className="w-1/2 relative flex items-center justify-center p-8">
			<Card className="border-border/50 shadow-2xl bg-[#161617] max-h-[90vh] overflow-y-auto">
				<CardHeader className="space-y-3">
					<div>
						{formValues.companyName ? (
							<CardTitle className="text-2xl">
								{formValues.companyName}
							</CardTitle>
						) : (
							<div className="h-8 w-48 bg-muted/30 rounded animate-pulse" />
						)}
						{formValues.category && (
							<Badge variant="secondary" className="mt-2">
								{formValues.category}
							</Badge>
						)}
					</div>
					{formValues.shortDescription ? (
						<CardDescription className="text-base">
							{formValues.shortDescription}
						</CardDescription>
					) : (
						<div className="space-y-2">
							<div className="h-4 w-full bg-muted/30 rounded animate-pulse" />
							<div className="h-4 w-3/4 bg-muted/30 rounded animate-pulse" />
						</div>
					)}
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Basic Info */}
					{formValues.companyUrl && (
						<div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
							{formValues.companyUrl &&
								(() => {
									try {
										return (
											<span className="flex items-center gap-1">
												🔗 {new URL(formValues.companyUrl).hostname}
											</span>
										);
									} catch {
										return (
											<span className="flex items-center gap-1">
												🔗 {formValues.companyUrl}
											</span>
										);
									}
								})()}
						</div>
					)}

					{/* Status Badges */}
					{(formValues.peopleUsing || formValues.hasRevenue) && (
						<div className="flex flex-wrap gap-2">
							{formValues.peopleUsing === "yes" && (
								<Badge variant="outline">✓ People using product</Badge>
							)}
							{formValues.hasRevenue === "yes" && (
								<Badge variant="outline">💰 Has revenue</Badge>
							)}
							{formValues.currentlyFundraising === "yes" && (
								<Badge variant="outline">📈 Currently fundraising</Badge>
							)}
						</div>
					)}

					{/* What Making */}
					{formValues.whatMaking && (
						<div className="pt-4 border-t">
							<h4 className="text-sm font-semibold mb-2">What We're Making</h4>
							<p className="text-sm text-muted-foreground line-clamp-4">
								{formValues.whatMaking}
							</p>
						</div>
					)}

					{/* Tech Stack */}
					{formValues.techStack && (
						<div className="pt-4 border-t">
							<h4 className="text-sm font-semibold mb-2">Tech Stack</h4>
							<p className="text-sm text-muted-foreground line-clamp-3">
								{formValues.techStack}
							</p>
						</div>
					)}

					{/* Why This Idea */}
					{formValues.whyThisIdea && (
						<div className="pt-4 border-t">
							<h4 className="text-sm font-semibold mb-2">Why This Idea</h4>
							<p className="text-sm text-muted-foreground line-clamp-3">
								{formValues.whyThisIdea}
							</p>
						</div>
					)}

					{/* Monetization */}
					{formValues.monetization && (
						<div className="pt-4 border-t">
							<h4 className="text-sm font-semibold mb-2">Business Model</h4>
							<p className="text-sm text-muted-foreground line-clamp-3">
								{formValues.monetization}
							</p>
						</div>
					)}

					{/* Competitors */}
					{formValues.competitors && (
						<div className="pt-4 border-t">
							<h4 className="text-sm font-semibold mb-2">Competitors</h4>
							<p className="text-sm text-muted-foreground line-clamp-3">
								{formValues.competitors}
							</p>
						</div>
					)}

					{/* Progress */}
					{formValues.howFarAlong && (
						<div className="pt-4 border-t">
							<h4 className="text-sm font-semibold mb-2">Progress</h4>
							<p className="text-sm text-muted-foreground line-clamp-3">
								{formValues.howFarAlong}
							</p>
						</div>
					)}

					{/* Empty State */}
					{!formValues.companyName && !formValues.shortDescription && (
						<div className="text-center py-8">
							<p className="text-sm text-muted-foreground">
								Start filling out the form to see your preview
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
