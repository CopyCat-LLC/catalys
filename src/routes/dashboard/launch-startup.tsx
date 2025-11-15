import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { CheckCircle2, Loader2, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/card";
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
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/dashboard/launch-startup")({
	beforeLoad: ({ context, location }) => {
		// Require authentication to access launch-startup
		if (!context.userId) {
			throw redirect({
				to: "/sign-in",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: OnboardingPage,
});

const coFounderSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters").optional(),
	email: z.string().email("Please enter a valid email"),
	role: z.string().min(2, "Role is required"),
	equityPercentage: z
		.number()
		.min(0, "Equity must be at least 0%")
		.max(100, "Equity cannot exceed 100%"),
});

const onboardingSchema = z.object({
	// Step 1: Basic Info
	name: z.string().min(2, "Startup name must be at least 2 characters"),
	shortDescription: z
		.string()
		.min(10, "Description must be at least 10 characters")
		.max(100, "Keep it under 100 characters"),
	industry: z.string().min(1, "Please select an industry"),
	location: z.string().optional(),
	website: z
		.string()
		.url("Please enter a valid URL")
		.optional()
		.or(z.literal("")),

	// Step 2: Details
	description: z
		.string()
		.min(50, "Please provide a detailed description (at least 50 characters)"),
	problemSolving: z
		.string()
		.min(20, "Please describe the problem you're solving"),
	targetMarket: z.string().min(20, "Please describe your target market"),
	stage: z.enum(["IDEA", "MVP", "LAUNCHED", "GROWTH", "SCALING"]),
	foundedDate: z.string().optional(),

	// Step 3: Traction & Funding
	traction: z.string().optional(),
	fundingStage: z
		.enum([
			"PRE_SEED",
			"SEED",
			"SERIES_A",
			"SERIES_B",
			"SERIES_C_PLUS",
			"BOOTSTRAPPED",
		])
		.optional(),
	teamSize: z.number().min(1).optional(),

	// Step 4: Co-founders
	coFounders: z.array(coFounderSchema).optional(),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

const STEPS = [
	{ id: 1, title: "Basic Info", description: "Tell us about your startup" },
	{ id: 2, title: "Details", description: "Share your vision" },
	{
		id: 3,
		title: "Traction",
		description: "Current progress & funding",
	},
	{ id: 4, title: "Team", description: "Invite co-founders" },
];

const INDUSTRIES = [
	"Artificial Intelligence",
	"B2B Software",
	"Biotech",
	"Consumer",
	"Developer Tools",
	"Education",
	"Enterprise",
	"Fintech",
	"Healthcare",
	"Infrastructure",
	"Marketplace",
	"Real Estate",
	"SaaS",
	"Other",
];

function OnboardingPage() {
	const [currentStep, setCurrentStep] = useState(1);
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();
	const createStartup = useMutation(api.startups.create);

	const session = authClient.useSession();

	const form = useForm<OnboardingFormValues>({
		resolver: zodResolver(onboardingSchema),
		defaultValues: {
			name: "",
			shortDescription: "",
			industry: "",
			location: "",
			website: "",
			description: "",
			problemSolving: "",
			targetMarket: "",
			stage: "IDEA",
			foundedDate: "",
			traction: "",
			teamSize: 1,
			coFounders: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "coFounders",
	});

	const progress = (currentStep / STEPS.length) * 100;

	const validateStep = async (step: number) => {
		const fieldsToValidate: (keyof OnboardingFormValues)[] = [];

		switch (step) {
			case 1:
				fieldsToValidate.push(
					"name",
					"shortDescription",
					"industry",
					"location",
					"website",
				);
				break;
			case 2:
				fieldsToValidate.push(
					"description",
					"problemSolving",
					"targetMarket",
					"stage",
					"foundedDate",
				);
				break;
			case 3:
				fieldsToValidate.push("traction", "fundingStage", "teamSize");
				break;
			case 4:
				fieldsToValidate.push("coFounders");
				break;
		}

		const isValid = await form.trigger(fieldsToValidate);
		return isValid;
	};

	const nextStep = async (e?: React.MouseEvent) => {
		e?.preventDefault();
		const isValid = await validateStep(currentStep);
		if (isValid && currentStep < STEPS.length) {
			setCurrentStep((prev) => prev + 1);
		}
	};

	const prevStep = (e?: React.MouseEvent) => {
		e?.preventDefault();
		if (currentStep > 1) {
			setCurrentStep((prev) => prev - 1);
		}
	};

	const onSubmit = async (data: OnboardingFormValues) => {
		setError("");
		setIsSubmitting(true);

		try {
			// Get current user
			if (!session.data?.user) {
				setError("You must be logged in to create a startup");
				setIsSubmitting(false);
				return;
			}

			// Create organization in Better Auth
			const orgResult = await authClient.organization.create({
				name: data.name,
				slug: data.name
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/^-+|-+$/g, ""),
			});

			if (!orgResult.data?.id) {
				setError("Failed to create organization");
				setIsSubmitting(false);
				return;
			}

			const organizationId = orgResult.data.id;

			// Invite co-founders to the organization
			if (data.coFounders && data.coFounders.length > 0) {
				for (const coFounder of data.coFounders) {
					await authClient.organization.inviteMember({
						organizationId,
						email: coFounder.email,
						role: "member", // You can customize roles as needed
					});
				}
			}

			// Create startup in Convex
			await createStartup({
				name: data.name,
				shortDescription: data.shortDescription,
				description: data.description,
				website: data.website || undefined,
				industry: data.industry,
				stage: data.stage,
				foundedDate: data.foundedDate,
				location: data.location,
				problemSolving: data.problemSolving,
				targetMarket: data.targetMarket,
				traction: data.traction,
				fundingStage: data.fundingStage,
				teamSize: data.teamSize,
				organizationId,
				userId: session.data.user.id,
				coFounders: data.coFounders,
			});

			// Set active organization
			await authClient.organization.setActive({
				organizationId,
			});

			// Navigate to dashboard
			navigate({ to: "/dashboard" });
		} catch (err) {
			console.error("Onboarding error:", err);
			setError("Failed to complete onboarding. Please try again.");
			setIsSubmitting(false);
		}
	};

	const addCoFounder = () => {
		append({
			name: "",
			email: "",
			role: "",
			equityPercentage: 0,
		});
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-background to-secondary/20 py-8 px-4">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-center mb-8">
					<Logo />
				</div>

				{/* Progress Bar */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h2 className="text-2xl font-bold">Create Your Startup</h2>
							<p className="text-muted-foreground">
								{STEPS[currentStep - 1].description}
							</p>
						</div>
						<Badge variant="secondary" className="text-sm">
							Step {currentStep} of {STEPS.length}
						</Badge>
					</div>
					<Progress value={progress} className="h-2" />
				</div>

				{/* Steps Indicator */}
				<div className="grid grid-cols-4 gap-4 mb-8">
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

				<Card className="border-border/50 shadow-xl">
					<CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
					<CardDescription>
						{STEPS[currentStep - 1].description}
					</CardDescription>
					<CardContent>
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
								{/* Step 1: Basic Info */}
								{currentStep === 1 && (
									<div className="space-y-4">
										<FormField
											control={form.control}
											name="name"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Startup Name *</FormLabel>
													<FormControl>
														<Input
															placeholder="Acme Inc."
															className="h-11"
															{...field}
														/>
													</FormControl>
													<FormDescription>
														The official name of your startup
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
													<FormLabel>One-liner Pitch *</FormLabel>
													<FormControl>
														<Input
															placeholder="AI-powered platform that helps teams collaborate better"
															className="h-11"
															{...field}
														/>
													</FormControl>
													<FormDescription>
														A short, compelling description (max 100 characters)
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="industry"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Industry *</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<FormControl>
															<SelectTrigger className="h-11">
																<SelectValue placeholder="Select an industry" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{INDUSTRIES.map((industry) => (
																<SelectItem key={industry} value={industry}>
																	{industry}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="location"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Location</FormLabel>
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
												name="website"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Website</FormLabel>
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
										</div>
									</div>
								)}

								{/* Step 2: Details */}
								{currentStep === 2 && (
									<div className="space-y-4">
										<FormField
											control={form.control}
											name="description"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Detailed Description *</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Tell us more about your startup, your vision, and what makes you unique..."
															className="min-h-32 resize-none"
															{...field}
														/>
													</FormControl>
													<FormDescription>
														Provide a comprehensive overview of your startup
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="problemSolving"
											render={({ field }) => (
												<FormItem>
													<FormLabel>What problem are you solving? *</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Describe the problem your startup addresses..."
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
											name="targetMarket"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Who is your target customer? *</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Describe your ideal customer or target market..."
															className="min-h-24 resize-none"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="stage"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Current Stage *</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
														>
															<FormControl>
																<SelectTrigger className="h-11">
																	<SelectValue placeholder="Select stage" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="IDEA">Idea</SelectItem>
																<SelectItem value="MVP">MVP</SelectItem>
																<SelectItem value="LAUNCHED">
																	Launched
																</SelectItem>
																<SelectItem value="GROWTH">Growth</SelectItem>
																<SelectItem value="SCALING">Scaling</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="foundedDate"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Founded Date</FormLabel>
														<FormControl>
															<Input type="month" className="h-11" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>
								)}

								{/* Step 3: Traction & Funding */}
								{currentStep === 3 && (
									<div className="space-y-4">
										<FormField
											control={form.control}
											name="traction"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Traction & Metrics (Optional)</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Share key metrics: users, revenue, growth rate, partnerships, etc."
															className="min-h-32 resize-none"
															{...field}
														/>
													</FormControl>
													<FormDescription>
														What progress have you made so far?
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="fundingStage"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Funding Stage</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
														>
															<FormControl>
																<SelectTrigger className="h-11">
																	<SelectValue placeholder="Select funding stage" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="PRE_SEED">
																	Pre-Seed
																</SelectItem>
																<SelectItem value="SEED">Seed</SelectItem>
																<SelectItem value="SERIES_A">
																	Series A
																</SelectItem>
																<SelectItem value="SERIES_B">
																	Series B
																</SelectItem>
																<SelectItem value="SERIES_C_PLUS">
																	Series C+
																</SelectItem>
																<SelectItem value="BOOTSTRAPPED">
																	Bootstrapped
																</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="teamSize"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Team Size</FormLabel>
														<FormControl>
															<Input
																type="number"
																min="1"
																placeholder="5"
																className="h-11"
																{...field}
																onChange={(e) =>
																	field.onChange(
																		Number.parseInt(e.target.value),
																	)
																}
															/>
														</FormControl>
														<FormDescription>
															Total number of team members
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>
								)}

								{/* Step 4: Co-founders */}
								{currentStep === 4 && (
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<div>
												<h3 className="text-lg font-medium">
													Invite Co-founders
												</h3>
												<p className="text-sm text-muted-foreground">
													Add your co-founders with their equity split
												</p>
											</div>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={addCoFounder}
											>
												<PlusCircle className="w-4 h-4 mr-2" />
												Add Co-founder
											</Button>
										</div>

										{fields.length === 0 ? (
											<Card className="border-dashed">
												<CardContent className="py-8 text-center">
													<p className="text-muted-foreground mb-4">
														No co-founders added yet
													</p>
													<Button
														type="button"
														variant="outline"
														onClick={addCoFounder}
													>
														<PlusCircle className="w-4 h-4 mr-2" />
														Add Your First Co-founder
													</Button>
												</CardContent>
											</Card>
										) : (
											<div className="space-y-4">
												{fields.map((field, index) => (
													<Card key={field.id}>
														<CardContent className="pt-6">
															<div className="flex items-start justify-between mb-4">
																<h4 className="font-medium">
																	Co-founder {index + 1}
																</h4>
																<Button
																	type="button"
																	variant="ghost"
																	size="sm"
																	onClick={() => remove(index)}
																>
																	<Trash2 className="w-4 h-4" />
																</Button>
															</div>

															<div className="grid gap-4">
																<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
																	<FormField
																		control={form.control}
																		name={`coFounders.${index}.name`}
																		render={({ field }) => (
																			<FormItem>
																				<FormLabel>Name</FormLabel>
																				<FormControl>
																					<Input
																						placeholder="John Doe"
																						{...field}
																					/>
																				</FormControl>
																				<FormMessage />
																			</FormItem>
																		)}
																	/>

																	<FormField
																		control={form.control}
																		name={`coFounders.${index}.email`}
																		render={({ field }) => (
																			<FormItem>
																				<FormLabel>Email *</FormLabel>
																				<FormControl>
																					<Input
																						type="email"
																						placeholder="john@example.com"
																						{...field}
																					/>
																				</FormControl>
																				<FormMessage />
																			</FormItem>
																		)}
																	/>
																</div>

																<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
																	<FormField
																		control={form.control}
																		name={`coFounders.${index}.role`}
																		render={({ field }) => (
																			<FormItem>
																				<FormLabel>Role *</FormLabel>
																				<FormControl>
																					<Input
																						placeholder="Co-Founder & CTO"
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
																				<FormLabel>Equity % *</FormLabel>
																				<FormControl>
																					<Input
																						type="number"
																						min="0"
																						max="100"
																						step="0.1"
																						placeholder="25"
																						{...field}
																						onChange={(e) =>
																							field.onChange(
																								Number.parseFloat(
																									e.target.value,
																								),
																							)
																						}
																					/>
																				</FormControl>
																				<FormMessage />
																			</FormItem>
																		)}
																	/>
																</div>
															</div>
														</CardContent>
													</Card>
												))}
											</div>
										)}

										<Card className="bg-muted/50">
											<CardContent className="pt-4">
												<p className="text-sm text-muted-foreground">
													<strong>Note:</strong> Invitations will be sent to
													co-founders after you complete onboarding. They'll be
													able to join your organization and access the
													dashboard.
												</p>
											</CardContent>
										</Card>
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
			</div>
		</div>
	);
}
