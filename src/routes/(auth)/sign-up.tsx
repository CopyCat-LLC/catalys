import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { authClient } from "@/lib/auth-client";
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/(auth)/sign-up")({
	component: SignUpPage,
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
			.email("Please enter a valid email address"),
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

type SignUpFormValues = z.infer<typeof signUpSchema>;

function SignUpPage() {
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const createUserProfile = useMutation(api.userProfiles.create);

	const form = useForm<SignUpFormValues>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: SignUpFormValues) => {
		setError("");

		try {
			const result = await authClient.signUp.email({
				name: data.name,
				email: data.email,
				password: data.password,
			});

			if (result.error) {
				setError(result.error.message || "Failed to create account");
			} else if (result.data?.user) {
				// Create user profile with default FOUNDER type
				await createUserProfile({
					userId: result.data.user.id,
					userType: "FOUNDER",
				});

				// Send verification OTP
				await authClient.emailOtp.sendVerificationOtp({
					email: data.email,
					type: "email-verification",
				});

				// Redirect to email verification page
				navigate({
					to: "/verify-email",
					search: { email: data.email },
				});
			}
		} catch (err) {
			setError("An unexpected error occurred");
			console.error(err);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-secondary/20 p-4">
			<div className="w-full max-w-md">
				<div className="flex justify-center mb-8">
					<Logo />
				</div>

				<Card className="border-border/50 shadow-xl">
					<CardTitle className="text-3xl font-bold">
						Create an account
					</CardTitle>
					<CardDescription className="text-base">
						Enter your details to create your account
					</CardDescription>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input
													type="text"
													placeholder="John Doe"
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
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="you@example.com"
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
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="••••••••"
													className="h-11"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Must contain at least 8 characters, one uppercase, one
												lowercase, and one number
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Confirm Password</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="••••••••"
													className="h-11"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{error && (
									<div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
										{error}
									</div>
								)}

								<Button
									type="submit"
									className="w-full h-11 text-base"
									disabled={form.formState.isSubmitting}
								>
									{form.formState.isSubmitting
										? "Creating account..."
										: "Create account"}
								</Button>
							</form>
						</Form>

						<div className="mt-6 text-center">
							<p className="text-sm text-muted-foreground">
								Already have an account?{" "}
								<Link
									to="/sign-in"
									className="text-primary font-medium hover:underline"
								>
									Sign in
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>

				<p className="text-center text-xs text-muted-foreground mt-6">
					By continuing, you agree to our Terms of Service and Privacy Policy
				</p>
			</div>
		</div>
	);
}
