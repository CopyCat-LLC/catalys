import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
	type OnboardingFormValues,
	StartupApplicationForm,
} from "@/components/launch-startup/StartupApplicationForm";
import { StartupPreviewCard } from "@/components/launch-startup/StartupPreviewCard";
import { authClient } from "@/lib/auth-client";
import { api } from "../../convex/_generated/api";

export const Route = createFileRoute("/launch-startup")({
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

const onboardingSchema = z.object({
	// Startup Section
	companyName: z.string().min(2, "Startup name is required"),
	shortDescription: z
		.string()
		.max(50, "Must be 50 characters or less")
		.min(1, "Description is required"),
	companyUrl: z
		.string()
		.url("Please enter a valid URL")
		.optional()
		.or(z.literal("")),
	demoVideo: z
		.string()
		.url("Please enter a valid URL")
		.optional()
		.or(z.literal("")),
	whatMaking: z.string().min(20, "Please describe what you're making"),
	futureLocation: z
		.string()
		.min(2, "Please enter where startup would be based"),
	locationExplanation: z
		.string()
		.min(10, "Please explain your location decision"),

	// Progress Section
	howFarAlong: z.string().min(20, "Please describe your progress"),
	workingTime: z.string().min(10, "Please describe working time"),
	techStack: z.string().min(10, "Please list your tech stack"),
	peopleUsing: z.enum(["yes", "no"]),
	versionTimeline: z.string().optional(),
	hasRevenue: z.enum(["yes", "no"]),
	appliedBefore: z.enum(["same_idea", "different_idea", "first_time"]),
	previousApplicationNotes: z.string().optional(),
	incubatorInfo: z.string().optional(),

	// Idea Section
	whyThisIdea: z.string().min(20, "Please explain why you picked this idea"),
	customerNeed: z
		.string()
		.min(20, "Please explain how you know people need this"),
	competitors: z.string().min(10, "Please list your competitors"),
	monetization: z.string().min(20, "Please explain how you'll make money"),
	category: z.string().min(1, "Please select a category"),

	// Equity Section
	hasLegalEntity: z.enum(["yes", "no"]),
	legalEntities: z.string().optional(),
	equityBreakdown: z.string().optional(),
	investmentTaken: z.enum(["yes", "no"]),
	currentlyFundraising: z.enum(["yes", "no"]),
});

function OnboardingPage() {
	const [currentStep, setCurrentStep] = useState(1);
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const createStartup = useMutation(api.startups.create);

	const session = authClient.useSession();

	const form = useForm<OnboardingFormValues>({
		resolver: zodResolver(onboardingSchema),
		defaultValues: {
			companyName: "",
			shortDescription: "",
			companyUrl: "",
			demoVideo: "",
			whatMaking: "",
			futureLocation: "",
			locationExplanation: "",
			howFarAlong: "",
			workingTime: "",
			techStack: "",
			peopleUsing: "no",
			versionTimeline: "",
			hasRevenue: "no",
			appliedBefore: "first_time",
			previousApplicationNotes: "",
			incubatorInfo: "",
			whyThisIdea: "",
			customerNeed: "",
			competitors: "",
			monetization: "",
			category: "",
			hasLegalEntity: "no",
			legalEntities: "",
			equityBreakdown: "",
			investmentTaken: "no",
			currentlyFundraising: "no",
		},
	});

	const validateStep = async (step: number) => {
		const fieldsToValidate: (keyof OnboardingFormValues)[] = [];

		switch (step) {
			case 1: // Startup
				fieldsToValidate.push(
					"companyName",
					"shortDescription",
					"whatMaking",
					"futureLocation",
					"locationExplanation",
				);
				break;
			case 2: // Idea
				fieldsToValidate.push(
					"whyThisIdea",
					"customerNeed",
					"competitors",
					"monetization",
					"category",
				);
				break;
			case 3: // Progress
				fieldsToValidate.push(
					"companyUrl",
					"demoVideo",
					"howFarAlong",
					"workingTime",
					"techStack",
					"peopleUsing",
					"hasRevenue",
					"appliedBefore",
				);
				break;
			case 4: // Equity
				fieldsToValidate.push(
					"hasLegalEntity",
					"investmentTaken",
					"currentlyFundraising",
				);
				break;
		}

		const isValid = await form.trigger(fieldsToValidate);
		return isValid;
	};

	const nextStep = async (e?: React.MouseEvent) => {
		e?.preventDefault();
		const isValid = await validateStep(currentStep);
		if (isValid && currentStep < 4) {
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
				name: data.companyName,
				slug: data.companyName
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

			console.log("Creating startup in Convex...");
			// Create startup in Convex with application data
			await createStartup({
				// Startup info
				name: data.companyName,
				shortDescription: data.shortDescription,
				description: data.whatMaking,
				website: data.companyUrl || undefined,
				demoVideo: data.demoVideo || undefined,
				futureLocation: data.futureLocation,
				locationExplanation: data.locationExplanation,

				// Progress
				howFarAlong: data.howFarAlong,
				workingTime: data.workingTime,
				techStack: data.techStack,
				peopleUsing: data.peopleUsing === "yes",
				versionTimeline: data.versionTimeline,
				hasRevenue: data.hasRevenue === "yes",
				appliedBefore: data.appliedBefore,
				previousApplicationNotes: data.previousApplicationNotes,
				incubatorInfo: data.incubatorInfo,

				// Idea
				whyThisIdea: data.whyThisIdea,
				customerNeed: data.customerNeed,
				competitors: data.competitors,
				monetization: data.monetization,
				category: data.category,

				// Equity
				hasLegalEntity: data.hasLegalEntity === "yes",
				legalEntities: data.legalEntities,
				equityBreakdown: data.equityBreakdown,
				investmentTaken: data.investmentTaken === "yes",
				currentlyFundraising: data.currentlyFundraising === "yes",

				organizationId,
				userId: session.data.user.id,
			});
			console.log("Startup created successfully");

			console.log("Setting active organization...");
			// Set active organization
			await authClient.organization.setActive({
				organizationId,
			});
			console.log("Active organization set");

			// Small delay to ensure membership is fully propagated
			await new Promise((resolve) => setTimeout(resolve, 500));

			console.log("Navigating to dashboard...");
			// Force a full page reload to ensure server-side checks pick up the new organization
			window.location.href = "/dashboard";
		} catch (err) {
			console.error("Onboarding error:", err);
			setError("Failed to complete onboarding. Please try again.");
			setIsSubmitting(false);
		}
	};

	// Watch form values for preview
	const formValues = form.watch();

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
			<StartupApplicationForm
				form={form}
				onSubmit={onSubmit}
				currentStep={currentStep}
				nextStep={nextStep}
				prevStep={prevStep}
				error={error}
				isSubmitting={isSubmitting}
			/>
			<StartupPreviewCard formValues={formValues} />
		</div>
	);
}
