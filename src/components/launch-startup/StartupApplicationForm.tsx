import { CheckCircle2, Loader2, Plus, X } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/Logo";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const STEPS = [
	{ id: 1, title: "Startup", description: "Startup information" },
	{ id: 2, title: "Idea", description: "Vision & strategy" },
	{ id: 3, title: "Progress", description: "Development & traction" },
	{ id: 4, title: "Equity", description: "Legal & funding" },
];

const CATEGORIES = [
	"B2B",
	"Education",
	"Fintech",
	"Healthcare",
	"Consumer",
	"Enterprise",
	"Developer Tools",
	"Climate",
	"Biotech",
	"Hardware",
	"Government",
	"Industrials",
	"Real Estate and Construction",
	"Other",
];

export type CoFounder = {
	email: string;
	role: string;
	equityPercentage: number;
};

export type OnboardingFormValues = {
	companyName: string;
	shortDescription: string;
	companyUrl?: string;
	whatMaking: string;
	futureLocation: string;
	locationExplanation: string;
	howFarAlong: string;
	workingTime: string;
	techStack: string;
	peopleUsing: "yes" | "no";
	versionTimeline?: string;
	hasRevenue: "yes" | "no";
	whyThisIdea: string;
	customerNeed: string;
	competitors: string;
	monetization: string;
	category: string;
	hasLegalEntity: "yes" | "no";
	legalEntities?: string;
	coFounders: CoFounder[];
	equityBreakdown?: string;
	investmentTaken: "yes" | "no";
	currentlyFundraising: "yes" | "no";
};

interface StartupApplicationFormProps {
	form: UseFormReturn<OnboardingFormValues>;
	onSubmit: (data: OnboardingFormValues) => Promise<void>;
	currentStep: number;
	nextStep: (e?: React.MouseEvent) => Promise<void>;
	prevStep: (e?: React.MouseEvent) => void;
	error: string;
	isSubmitting: boolean;
}

export function StartupApplicationForm({
	form,
	onSubmit,
	currentStep,
	nextStep,
	prevStep,
	error,
	isSubmitting,
}: StartupApplicationFormProps) {
	return (
		<div className="w-1/2 flex flex-col items-center justify-center border-r border-border/50 h-screen">
			<div className="flex flex-col items-center justify-center mb-8">
				<Logo />
			</div>
			<div className="bg-zinc-800 rounded-xl p-0.5 max-w-xl w-full transition-all ease-in-out">
				<div className="flex flex-col w-full p-6 gap-8">
					<h2 className="text-base font-semibold">Launch your Startup</h2>
					{/* Steps Indicator */}
					<div className="grid grid-cols-4 gap-4">
						{STEPS.map((step) => (
							<div
								key={step.id}
								className={`flex items-center gap-2 ${
									step.id === currentStep
										? "text-primary"
										: step.id < currentStep
											? "text-green-600"
											: "text-muted-foreground"
								}`}
							>
								{step.id < currentStep ? (
									<CheckCircle2 className="w-5 h-5" />
								) : (
									<div
										className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${
											step.id === currentStep
												? "border-primary bg-primary text-primary-foreground"
												: "border-muted-foreground"
										}`}
									>
										{step.id}
									</div>
								)}
								<span className="text-sm font-medium hidden sm:inline">
									{step.title}
								</span>
							</div>
						))}
					</div>
				</div>
				<Card className="bg-zinc-900 border-none rounded-xl px-6 pb-0 pt-6 transition-all ease-in-out">
					<Card className="bg-transparent border-none">
						<CardContent className="p-0">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-6"
									onKeyDown={(e) => {
										// Prevent Enter key from submitting form unless on last step
										if (e.key === "Enter" && currentStep < STEPS.length) {
											e.preventDefault();
										}
									}}
								>
									{/* Step 1: Startup */}
									{currentStep === 1 && (
										<div className="space-y-4">
											<FormField
												control={form.control}
												name="companyName"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Startup name *</FormLabel>
														<FormControl>
															<Input
																placeholder="Acme Inc."
																className="h-11"
																{...field}
															/>
														</FormControl>
														<FormDescription className="text-xs">
															What is your startup name?
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="shortDescription"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Short description (50 characters max) *
														</FormLabel>
														<FormControl>
															<Input
																placeholder="AI-powered recruiting platform"
																className="h-11"
																maxLength={50}
																{...field}
															/>
														</FormControl>
														<FormDescription className="text-xs">
															Describe what your startup does in 50 characters
															or less
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="whatMaking"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															What is your startup going to make? *
														</FormLabel>
														<FormControl>
															<Textarea
																placeholder="Please describe your product and what it does or will do..."
																className="min-h-32 resize-none"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="futureLocation"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Where would the startup be based after funding? *
														</FormLabel>
														<FormControl>
															<Input
																placeholder="San Francisco, CA"
																className="h-11"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="locationExplanation"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Explain your decision regarding location *
														</FormLabel>
														<FormControl>
															<Textarea
																placeholder="Why have you chosen this location for your startup?..."
																className="min-h-24 resize-none"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									)}

									{/* Step 3: Progress */}
									{currentStep === 3 && (
										<div className="space-y-4">
											<FormField
												control={form.control}
												name="companyUrl"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Startup URL (optional)</FormLabel>
														<FormControl>
															<Input
																placeholder="https://example.com"
																className="h-11"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="howFarAlong"
												render={({ field }) => (
													<FormItem>
														<FormLabel>How far along are you? *</FormLabel>
														<FormControl>
															<Textarea
																placeholder="Describe your current progress, what you've built, and where you are in development..."
																className="min-h-24 resize-none"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="workingTime"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															How long have each of you been working on this? *
														</FormLabel>
														<FormControl>
															<Textarea
																placeholder="How long have each of you been working on this? How much of that has been full-time? Please explain."
																className="min-h-24 resize-none"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="techStack"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															What tech stack are you using? *
														</FormLabel>
														<FormControl>
															<Textarea
																placeholder="Include AI models and AI coding tools you use, frameworks, databases, etc."
																className="min-h-24 resize-none"
																{...field}
															/>
														</FormControl>
														<FormDescription>
															What tech stack are you using, or planning to use,
															to build this product?
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="peopleUsing"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Are people using your product? *
														</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
														>
															<FormControl>
																<SelectTrigger className="h-11">
																	<SelectValue placeholder="Select..." />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="yes">Yes</SelectItem>
																<SelectItem value="no">No</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>

											{form.watch("peopleUsing") === "no" && (
												<FormField
													control={form.control}
													name="versionTimeline"
													render={({ field }) => (
														<FormItem>
															<FormLabel>
																When will you have a version people can use?
															</FormLabel>
															<FormControl>
																<Input
																	placeholder="e.g., 2 months, Q2 2024, etc."
																	className="h-11"
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											)}

											<FormField
												control={form.control}
												name="hasRevenue"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Do you have revenue? *</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
														>
															<FormControl>
																<SelectTrigger className="h-11">
																	<SelectValue placeholder="Select..." />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="yes">Yes</SelectItem>
																<SelectItem value="no">No</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>

										</div>
									)}

									{/* Step 2: Idea */}
									{currentStep === 2 && (
										<div className="space-y-4">
											<FormField
												control={form.control}
												name="category"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Which category best applies to your startup? *
														</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
														>
															<FormControl>
																<SelectTrigger className="h-11">
																	<SelectValue placeholder="Select a category" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																{CATEGORIES.map((category) => (
																	<SelectItem key={category} value={category}>
																		{category}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="whyThisIdea"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Why did you pick this idea to work on? *
														</FormLabel>
														<FormControl>
															<Textarea
																placeholder="Tell us what motivated you to work on this specific problem..."
																className="min-h-24 resize-none"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="customerNeed"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															How do you know people need what you're making? *
														</FormLabel>
														<FormControl>
															<Textarea
																placeholder="What evidence do you have that there's demand for your product?"
																className="min-h-24 resize-none"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="competitors"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Who are your competitors? *</FormLabel>
														<FormControl>
															<Textarea
																placeholder="List your main competitors and alternatives..."
																className="min-h-24 resize-none"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="monetization"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															How do or will you make money? *
														</FormLabel>
														<FormControl>
															<Textarea
																placeholder="Describe your business model and revenue streams..."
																className="min-h-24 resize-none"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									)}

									{/* Step 4: Equity */}
									{currentStep === 4 && (
										<div className="space-y-4">
											<FormField
												control={form.control}
												name="hasLegalEntity"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Have you formed ANY legal entity yet? *
														</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
														>
															<FormControl>
																<SelectTrigger className="h-11">
																	<SelectValue placeholder="Select..." />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="yes">Yes</SelectItem>
																<SelectItem value="no">No</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>

											{form.watch("hasLegalEntity") === "yes" && (
												<FormField
													control={form.control}
													name="legalEntities"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Entity details</FormLabel>
															<FormControl>
																<Textarea
																	placeholder="Please list all legal entities you have and in what state or country each was formed."
																	className="min-h-24 resize-none"
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											)}

											{/* Co-Founders Section */}
											<div className="space-y-4">
												<div className="flex items-center justify-between">
													<div>
														<h3 className="text-sm font-medium">
															Co-Founders & Equity Split
														</h3>
														<p className="text-xs text-muted-foreground mt-1">
															Invite co-founders and define equity distribution
														</p>
													</div>
													<Button
														type="button"
														variant="outline"
														size="sm"
														onClick={() => {
															const currentCoFounders =
																form.getValues("coFounders") || [];
															form.setValue("coFounders", [
																...currentCoFounders,
																{ email: "", role: "", equityPercentage: 0 },
															]);
														}}
													>
														<Plus className="w-4 h-4 mr-1" />
														Add Co-Founder
													</Button>
												</div>

												{form.watch("coFounders")?.map((_, index) => (
													<div
														key={index}
														className="space-y-3 p-3 border border-border/50 rounded-md relative"
													>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															className="absolute top-2 right-2 h-6 w-6 p-0"
															onClick={() => {
																const currentCoFounders =
																	form.getValues("coFounders");
																form.setValue(
																	"coFounders",
																	currentCoFounders.filter((_, i) => i !== index),
																);
															}}
														>
															<X className="w-4 h-4" />
														</Button>

														<FormField
															control={form.control}
															name={`coFounders.${index}.email`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel className="text-xs">
																		Email Address *
																	</FormLabel>
																	<FormControl>
																		<Input
																			placeholder="cofounder@example.com"
																			className="h-9"
																			{...field}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>

														<div className="grid grid-cols-2 gap-3">
															<FormField
																control={form.control}
																name={`coFounders.${index}.role`}
																render={({ field }) => (
																	<FormItem>
																		<FormLabel className="text-xs">
																			Role *
																		</FormLabel>
																		<FormControl>
																			<Input
																				placeholder="e.g., Co-Founder & CTO"
																				className="h-9"
																				{...field}
																			/>
																		</FormControl>
																		<FormMessage />
																	</FormItem>
																)}
															/>

															<FormField
																control={form.control}
																name={`coFounders.${index}.equityPercentage`}
																render={({ field }) => (
																	<FormItem>
																		<FormLabel className="text-xs">
																			Equity % *
																		</FormLabel>
																		<FormControl>
																			<Input
																				type="number"
																				placeholder="25"
																				min="0"
																				max="100"
																				step="0.01"
																				className="h-9"
																				{...field}
																				onChange={(e) =>
																					field.onChange(Number(e.target.value))
																				}
																			/>
																		</FormControl>
																		<FormMessage />
																	</FormItem>
																)}
															/>
														</div>
													</div>
												))}

												{form.watch("coFounders")?.length === 0 && (
													<p className="text-xs text-muted-foreground text-center py-4">
														No co-founders added yet. Click "Add Co-Founder" to
														invite team members.
													</p>
												)}
											</div>

											<FormField
												control={form.control}
												name="equityBreakdown"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Additional equity notes (optional)
														</FormLabel>
														<FormControl>
															<Textarea
																placeholder="Any additional details about equity distribution, vesting schedules, or other stockholders..."
																className="min-h-24 resize-none"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="investmentTaken"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Have you taken any investment yet? *
														</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
														>
															<FormControl>
																<SelectTrigger className="h-11">
																	<SelectValue placeholder="Select..." />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="yes">Yes</SelectItem>
																<SelectItem value="no">No</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="currentlyFundraising"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Are you currently fundraising? *
														</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
														>
															<FormControl>
																<SelectTrigger className="h-11">
																	<SelectValue placeholder="Select..." />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="yes">Yes</SelectItem>
																<SelectItem value="no">No</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									)}

									{error && (
										<div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
											{error}
										</div>
									)}

									{/* Navigation Buttons */}
									<div className="flex items-center justify-between pt-6 border-t">
										<Button
											type="button"
											variant="outline"
											onClick={prevStep}
											disabled={currentStep === 1 || isSubmitting}
										>
											Previous
										</Button>

										{currentStep < STEPS.length ? (
											<Button type="button" onClick={nextStep}>
												Next
											</Button>
										) : (
											<Button type="submit" disabled={isSubmitting}>
												{isSubmitting ? (
													<>
														<Loader2 className="w-4 h-4 mr-2 animate-spin" />
														Creating...
													</>
												) : (
													"Complete Onboarding"
												)}
											</Button>
										)}
									</div>
								</form>
							</Form>
						</CardContent>
					</Card>
				</Card>
			</div>
		</div>
	);
}
