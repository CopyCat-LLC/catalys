import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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

export const Route = createFileRoute("/(auth)/sign-in")({
	component: SignInPage,
});

const signInSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(100, "Password must be less than 100 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

function SignInPage() {
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const form = useForm<SignInFormValues>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: SignInFormValues) => {
		setError("");

		try {
			const result = await authClient.signIn.email({
				email: data.email,
				password: data.password,
			});

			if (result.error) {
				setError(result.error.message || "Failed to sign in");
			} else {
				// Successfully signed in, redirect to home
				navigate({ to: "/" });
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
					<CardHeader className="space-y-2 text-center">
						<CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
						<CardDescription className="text-base">
							Enter your credentials to access your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
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
											<div className="flex items-center justify-between">
												<FormLabel>Password</FormLabel>
												<Link
													to="/forgot-password"
													className="text-sm text-muted-foreground hover:text-primary transition-colors"
												>
													Forgot password?
												</Link>
											</div>
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
									{form.formState.isSubmitting ? "Signing in..." : "Sign in"}
								</Button>
							</form>
						</Form>

						<div className="mt-6 text-center">
							<p className="text-sm text-muted-foreground">
								Don't have an account?{" "}
								<Link
									to="/sign-up"
									className="text-primary font-medium hover:underline"
								>
									Sign up
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
