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
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import Logo from "@/components/ui/Logo";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/(auth)/verify-email")({
	component: VerifyEmailPage,
	validateSearch: (search: Record<string, unknown>) => {
		return {
			email: (search.email as string) || "",
		};
	},
});

const otpSchema = z.object({
	otp: z.string().min(6, "Please enter the 6-digit code"),
});

type OTPFormValues = z.infer<typeof otpSchema>;

function VerifyEmailPage() {
	const { email } = Route.useSearch();
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const navigate = useNavigate();

	const form = useForm<OTPFormValues>({
		resolver: zodResolver(otpSchema),
		defaultValues: {
			otp: "",
		},
	});

	const onSubmit = async (data: OTPFormValues) => {
		setError("");
		setSuccess("");

		try {
			const result = await authClient.emailOtp.checkVerificationOtp({
				email,
				type: "email-verification",
				otp: data.otp,
			});

			if (result.error) {
				setError(result.error.message || "Invalid verification code");
			} else {
				setSuccess("Email verified successfully! Redirecting to launch startup...");
				setTimeout(() => {
					navigate({ to: "/launch-startup" });
				}, 2000);
			}
		} catch (err) {
			setError("An unexpected error occurred");
			console.error(err);
		}
	};

	const resendCode = async () => {
		setError("");
		setSuccess("");

		try {
			const result = await authClient.emailOtp.sendVerificationOtp({
				email,
				type: "email-verification",
			});

			if (result.error) {
				setError(result.error.message || "Failed to resend code");
			} else {
				setSuccess("New verification code sent!");
			}
		} catch (err) {
			setError("Failed to resend code");
			console.error(err);
		}
	};

	if (!email) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-secondary/20 p-4">
				<Card className="w-full max-w-md border-border/50 shadow-xl">
					<CardHeader className="space-y-2 text-center">
						<CardTitle className="text-2xl font-bold">Email Required</CardTitle>
						<CardDescription>
							Please provide an email address to verify
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-center">
							<Link to="/sign-up">
								<Button>Go to Sign Up</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-secondary/20 p-4">
			<div className="w-full max-w-md">
				<div className="flex justify-center mb-8">
					<Logo />
				</div>

				<Card className="border-border/50 shadow-xl">
					<CardHeader className="space-y-2 text-center">
						<CardTitle className="text-3xl font-bold">
							Verify your email
						</CardTitle>
						<CardDescription className="text-base">
							We sent a 6-digit code to <strong>{email}</strong>
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
									name="otp"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Verification Code</FormLabel>
											<FormControl>
												<div className="flex justify-center">
													<InputOTP maxLength={6} {...field}>
														<InputOTPGroup>
															<InputOTPSlot index={0} />
															<InputOTPSlot index={1} />
															<InputOTPSlot index={2} />
															<InputOTPSlot index={3} />
															<InputOTPSlot index={4} />
															<InputOTPSlot index={5} />
														</InputOTPGroup>
													</InputOTP>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="text-center">
									<button
										type="button"
										onClick={resendCode}
										className="text-sm text-muted-foreground hover:text-primary transition-colors"
									>
										Didn't receive the code? Resend
									</button>
								</div>

								{error && (
									<div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
										{error}
									</div>
								)}

								{success && (
									<div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">
										{success}
									</div>
								)}

								<Button
									type="submit"
									className="w-full h-11 text-base"
									disabled={form.formState.isSubmitting}
								>
									{form.formState.isSubmitting
										? "Verifying..."
										: "Verify email"}
								</Button>
							</form>
						</Form>

						<div className="mt-6 text-center">
							<p className="text-sm text-muted-foreground">
								Wrong email?{" "}
								<Link
									to="/sign-up"
									className="text-primary font-medium hover:underline"
								>
									Sign up again
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>

				<p className="text-center text-xs text-muted-foreground mt-6">
					By verifying your email, you agree to our Terms of Service and Privacy
					Policy
				</p>
			</div>
		</div>
	);
}
