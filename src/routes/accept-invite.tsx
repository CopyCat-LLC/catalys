import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/Logo";
import { authClient } from "@/lib/auth-client";
import { api } from "../../convex/_generated/api";

type InvitationDetails = {
	id: string;
	email: string;
	role: string | string[];
	organizationId: string;
	organizationName?: string;
	organizationSlug?: string;
	inviterEmail?: string;
	expiresAt?: string | Date;
	status: string;
};

const signInSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(100, "Password must be less than 100 characters"),
});

const signUpSchema = z
	.object({
		name: z
			.string()
			.min(2, "Name must be at least 2 characters")
			.max(50, "Name must be less than 50 characters"),
		email: z
			.string()
			.min(1, "Email is required")
			.email("Please enter a valid email"),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.max(100, "Password must be less than 100 characters")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Password must contain at least one uppercase letter, one lowercase letter, and one number",
			),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

type AuthMode = "signIn" | "signUp";
type AcceptStatus = "idle" | "accepting" | "accepted" | "error";

export const Route = createFileRoute("/accept-invite")({
	component: AcceptInvitePage,
	validateSearch: (search: Record<string, unknown>) => {
		return {
			invitationId: (search.invitationId as string) || "",
		};
	},
});

function AcceptInvitePage() {
	const { invitationId } = Route.useSearch();
	const navigate = useNavigate();
	const session = authClient.useSession();
	const createUserProfile = useMutation(api.userProfiles.create);

	const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
	const [invitationLoading, setInvitationLoading] = useState(true);
	const [invitationError, setInvitationError] = useState("");

	const [authMode, setAuthMode] = useState<AuthMode>("signIn");
	const [signInError, setSignInError] = useState("");
	const [signUpError, setSignUpError] = useState("");
	const [signUpSuccess, setSignUpSuccess] = useState("");

	const [acceptStatus, setAcceptStatus] = useState<AcceptStatus>("idle");
	const [acceptError, setAcceptError] = useState("");
	const hasAttemptedAcceptRef = useRef(false);

	const signInForm = useForm<SignInFormValues>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const signUpForm = useForm<SignUpFormValues>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	useEffect(() => {
		let cancelled = false;

		const fetchInvitation = async () => {
			if (!invitationId) {
				setInvitationError("Missing invitation identifier.");
				setInvitationLoading(false);
				return;
			}

			setInvitationLoading(true);
			setInvitationError("");

			try {
				const result = await authClient.organization.getInvitation({
					query: { id: invitationId },
				});

				if (!cancelled) {
					if (result.error) {
						setInvitationError(
							result.error.message || "Unable to load invitation details.",
						);
						setInvitation(null);
					} else {
						setInvitation(result.data as InvitationDetails);
					}
				}
			} catch (error) {
				if (!cancelled) {
					console.error("Failed to fetch invitation", error);
					setInvitationError("Unable to load invitation details.");
					setInvitation(null);
				}
			} finally {
				if (!cancelled) {
					setInvitationLoading(false);
				}
			}
		};

		fetchInvitation();

		return () => {
			cancelled = true;
		};
	}, [invitationId]);

	const organizationName = useMemo(() => {
		return invitation?.organizationName || "this organization";
	}, [invitation?.organizationName]);

	const acceptInvitation = useCallback(async () => {
		if (
			!invitationId ||
			acceptStatus === "accepting" ||
			acceptStatus === "accepted"
		) {
			return;
		}

		setAcceptStatus("accepting");
		setAcceptError("");

		try {
			const result = await authClient.organization.acceptInvitation({
				invitationId,
			});

			if (result.error) {
				setAcceptStatus("error");
				setAcceptError(result.error.message || "Failed to accept invitation.");
			} else {
				setAcceptStatus("accepted");
				setAcceptError("");
				setTimeout(() => {
					navigate({ to: "/dashboard" });
				}, 1200);
			}
		} catch (error) {
			console.error("Failed to accept invitation", error);
			setAcceptStatus("error");
			setAcceptError("Failed to accept invitation. Please try again.");
		}
	}, [acceptStatus, invitationId, navigate]);

	useEffect(() => {
		if (
			invitationId &&
			session.data?.session &&
			!hasAttemptedAcceptRef.current &&
			acceptStatus !== "accepted"
		) {
			hasAttemptedAcceptRef.current = true;
			void acceptInvitation();
		}
	}, [acceptInvitation, acceptStatus, invitationId, session.data?.session]);

	const handleSignIn = async (data: SignInFormValues) => {
		setSignInError("");

		try {
			const result = await authClient.signIn.email({
				email: data.email,
				password: data.password,
			});

			if (result.error) {
				setSignInError(result.error.message || "Failed to sign in.");
			} else {
				hasAttemptedAcceptRef.current = false;
				void acceptInvitation();
			}
		} catch (error) {
			console.error("Sign in failed", error);
			setSignInError("Sign in failed. Please try again.");
		}
	};

	const handleSignUp = async (data: SignUpFormValues) => {
		setSignUpError("");
		setSignUpSuccess("");

		try {
			const result = await authClient.signUp.email({
				name: data.name,
				email: data.email,
				password: data.password,
			});

			if (result.error) {
				setSignUpError(result.error.message || "Failed to create account.");
				return;
			}

			if (result.data?.user) {
				try {
					await createUserProfile({
						userId: result.data.user.id,
						userType: "FOUNDER",
					});
				} catch (profileError) {
					console.error("Failed to create user profile", profileError);
				}

				try {
					await authClient.emailOtp.sendVerificationOtp({
						email: data.email,
						type: "email-verification",
					});
					setSignUpSuccess(
						"Account created! Check your email to verify your account.",
					);
				} catch (otpError) {
					console.error("Failed to send verification OTP", otpError);
				}
			}

			hasAttemptedAcceptRef.current = false;
			void acceptInvitation();
		} catch (error) {
			console.error("Sign up failed", error);
			setSignUpError("Failed to create account. Please try again.");
		}
	};

	const renderAuthForms = () => (
		<Card className="border-border/50 shadow-xl">
			<CardHeader className="space-y-2 text-center">
				<CardTitle className="text-2xl font-semibold">
					{authMode === "signIn" ? "Sign in to accept" : "Create an account"}
				</CardTitle>
				<CardDescription className="text-base">
					{authMode === "signIn"
						? "Use your existing Catalys account to join this organization."
						: "Create a Catalys account to accept your invitation."}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="flex items-center justify-center gap-2 rounded-full bg-muted/20 p-1">
					<Button
						type="button"
						variant={authMode === "signIn" ? "default" : "ghost"}
						className="w-full"
						onClick={() => setAuthMode("signIn")}
					>
						Sign In
					</Button>
					<Button
						type="button"
						variant={authMode === "signUp" ? "default" : "ghost"}
						className="w-full"
						onClick={() => setAuthMode("signUp")}
					>
						Sign Up
					</Button>
				</div>

				{authMode === "signIn" ? (
					<Form {...signInForm}>
						<form
							onSubmit={signInForm.handleSubmit(handleSignIn)}
							className="space-y-4"
						>
							<FormField
								control={signInForm.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="you@example.com"
												className="h-11"
												autoComplete="email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={signInForm.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="••••••••"
												className="h-11"
												autoComplete="current-password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{signInError && (
								<div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
									{signInError}
								</div>
							)}

							<Button
								type="submit"
								className="w-full h-11 text-base"
								disabled={signInForm.formState.isSubmitting}
							>
								{signInForm.formState.isSubmitting
									? "Signing in..."
									: "Sign in"}
							</Button>

							<div className="text-center text-sm text-muted-foreground">
								Forgot your password?{" "}
								<Link
									to="/forgot-password"
									className="text-primary font-medium hover:underline"
								>
									Reset it
								</Link>
							</div>
						</form>
					</Form>
				) : (
					<Form {...signUpForm}>
						<form
							onSubmit={signUpForm.handleSubmit(handleSignUp)}
							className="space-y-4"
						>
							<FormField
								control={signUpForm.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												type="text"
												placeholder="Jane Doe"
												className="h-11"
												autoComplete="name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={signUpForm.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="you@example.com"
												className="h-11"
												autoComplete="email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={signUpForm.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="••••••••"
												className="h-11"
												autoComplete="new-password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={signUpForm.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="••••••••"
												className="h-11"
												autoComplete="new-password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{signUpError && (
								<div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
									{signUpError}
								</div>
							)}

							{signUpSuccess && (
								<div className="rounded-lg border border-primary/20 bg-primary/10 p-3 text-sm text-primary">
									{signUpSuccess}
								</div>
							)}

							<Button
								type="submit"
								className="w-full h-11 text-base"
								disabled={signUpForm.formState.isSubmitting}
							>
								{signUpForm.formState.isSubmitting
									? "Creating account..."
									: "Create account"}
							</Button>
						</form>
					</Form>
				)}
			</CardContent>
		</Card>
	);

	const renderAuthenticatedState = () => (
		<Card className="border-border/50 shadow-xl">
			<CardHeader className="space-y-2 text-center">
				<CardTitle className="text-2xl font-semibold">
					Accept your invitation
				</CardTitle>
				<CardDescription className="text-base">
					You're signed in as{" "}
					<span className="font-medium">
						{session.data?.user?.email ||
							session.data?.user?.name ||
							"a member"}
					</span>
					. Accept the invitation to join {organizationName}.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4 text-center">
				{acceptError && (
					<div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
						{acceptError}
					</div>
				)}

				<Button
					type="button"
					className="w-full h-11 text-base"
					disabled={acceptStatus === "accepting" || acceptStatus === "accepted"}
					onClick={() => {
						hasAttemptedAcceptRef.current = true;
						void acceptInvitation();
					}}
				>
					{acceptStatus === "accepted"
						? "Invitation accepted"
						: acceptStatus === "accepting"
							? "Accepting..."
							: "Accept invitation"}
				</Button>

				<p className="text-sm text-muted-foreground">
					Not you?{" "}
					<button
						type="button"
						className="text-primary font-medium hover:underline"
						onClick={async () => {
							await authClient.signOut();
							hasAttemptedAcceptRef.current = false;
						}}
					>
						Sign out
					</button>{" "}
					and switch accounts.
				</p>
			</CardContent>
		</Card>
	);

	return (
		<div className="min-h-screen bg-[#0D0D0D]">
			<div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10">
				<div className="absolute left-1/2 top-6 -translate-x-1/2">
					<Logo />
				</div>

				<div className="mt-16 w-full max-w-5xl">
					<div className="grid gap-6 md:grid-cols-[1.1fr_1fr]">
						<Card className="border-border/50 bg-zinc-900/60 shadow-2xl backdrop-blur">
							<CardHeader className="space-y-3">
								<CardTitle className="text-3xl font-bold text-foreground">
									You're invited to join
								</CardTitle>
								<CardDescription className="text-base text-muted-foreground">
									{invitationLoading
										? "Fetching invitation details..."
										: invitation
											? `${invitation.organizationName ?? "An organization"}`
											: "We couldn't find this invitation."}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{invitationError && (
									<div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
										{invitationError}
									</div>
								)}

								{invitation && (
									<div className="space-y-4 rounded-xl border border-border/50 bg-zinc-950/70 p-6">
										<div>
											<p className="text-sm text-muted-foreground">
												Organization
											</p>
											<p className="text-lg font-semibold">
												{invitation.organizationName ??
													invitation.organizationId}
											</p>
										</div>
										<div className="grid gap-4 sm:grid-cols-2">
											<div>
												<p className="text-sm text-muted-foreground">
													Invited email
												</p>
												<p className="font-medium">{invitation.email}</p>
											</div>
											<div>
												<p className="text-sm text-muted-foreground">Role</p>
												<p className="font-medium capitalize">
													{Array.isArray(invitation.role)
														? invitation.role.join(", ")
														: invitation.role}
												</p>
											</div>
										</div>
										{invitation.inviterEmail && (
											<div>
												<p className="text-sm text-muted-foreground">
													Invited by
												</p>
												<p className="font-medium">{invitation.inviterEmail}</p>
											</div>
										)}
										<div className="rounded-lg border border-primary/20 bg-primary/10 p-3 text-sm text-primary">
											Accepting this invitation will add you to the organization
											and give you access immediately.
										</div>
									</div>
								)}

								{!invitation && !invitationLoading && (
									<div className="rounded-lg border border-border/40 bg-zinc-950/60 p-4 text-sm text-muted-foreground">
										The invitation may have been revoked, expired, or already
										used. Contact the person who sent it for a new link.
									</div>
								)}
							</CardContent>
						</Card>

						<div className="space-y-4">
							{session.data?.session
								? renderAuthenticatedState()
								: renderAuthForms()}

							{acceptStatus === "accepted" && (
								<div className="rounded-lg border border-primary/30 bg-primary/10 p-4 text-sm text-primary">
									Invitation accepted! Redirecting you to the dashboard...
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
