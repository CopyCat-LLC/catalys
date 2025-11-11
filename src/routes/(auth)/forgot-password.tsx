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
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import Logo from "@/components/ui/Logo";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/(auth)/forgot-password")({
	component: ForgotPasswordPage,
});

const emailSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address"),
});

const otpSchema = z.object({
	otp: z.string().min(6, "Please enter the 6-digit code"),
});

const passwordSchema = z
	.object({
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

type EmailFormValues = z.infer<typeof emailSchema>;
type OTPFormValues = z.infer<typeof otpSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

function ForgotPasswordPage() {
	const [step, setStep] = useState<"email" | "otp" | "password">("email");
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [verifiedOtp, setVerifiedOtp] = useState("");
	const navigate = useNavigate();

	const emailForm = useForm<EmailFormValues>({
		resolver: zodResolver(emailSchema),
		defaultValues: { email: "" },
	});

	const otpForm = useForm<OTPFormValues>({
		resolver: zodResolver(otpSchema),
		defaultValues: { otp: "" },
	});

	const passwordForm = useForm<PasswordFormValues>({
		resolver: zodResolver(passwordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const onEmailSubmit = async (data: EmailFormValues) => {
		setError("");
		setSuccess("");

		try {
			const result = await authClient.forgetPassword.emailOtp({
				email: data.email,
			});

			if (result.error) {
				setError(result.error.message || "Failed to send reset code");
			} else {
				setEmail(data.email);
				setStep("otp");
				setSuccess("Verification code sent to your email!");
			}
		} catch (err) {
			setError("An unexpected error occurred");
			console.error(err);
		}
	};

	const onOTPSubmit = async (data: OTPFormValues) => {
		setError("");
		setSuccess("");

		try {
			// Verify the OTP first
			const result = await authClient.emailOtp.checkVerificationOtp({
				email,
				type: "forget-password",
				otp: data.otp,
			});

			if (result.error) {
				setError(result.error.message || "Invalid verification code");
			} else {
				setVerifiedOtp(data.otp);
				setStep("password");
				setSuccess("Code verified! Please set your new password.");
			}
		} catch (err) {
			setError("An unexpected error occurred");
			console.error(err);
		}
	};

	const onPasswordSubmit = async (data: PasswordFormValues) => {
		setError("");
		setSuccess("");

		try {
			const result = await authClient.emailOtp.resetPassword({
				email,
				otp: verifiedOtp,
				password: data.password,
			});

			if (result.error) {
				setError(result.error.message || "Failed to reset password");
			} else {
				setSuccess("Password reset successfully! Redirecting...");
				setTimeout(() => {
					navigate({ to: "/sign-in" });
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
			const result = await authClient.forgetPassword.emailOtp({
				email,
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

	return (
		<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-secondary/20 p-4">
			<div className="w-full max-w-md">
				<div className="flex justify-center mb-8">
					<Logo />
				</div>

				<Card className="border-border/50 shadow-xl">
					<CardHeader className="space-y-2 text-center">
						<CardTitle className="text-3xl font-bold">
							{step === "email" && "Reset password"}
							{step === "otp" && "Enter verification code"}
							{step === "password" && "Set new password"}
						</CardTitle>
						<CardDescription className="text-base">
							{step === "email" &&
								"Enter your email to receive a verification code"}
							{step === "otp" && `We sent a 6-digit code to ${email}`}
							{step === "password" &&
								"Choose a strong password for your account"}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{/* Email Step */}
						{step === "email" && (
							<Form {...emailForm}>
								<form
									onSubmit={emailForm.handleSubmit(onEmailSubmit)}
									className="space-y-4"
								>
									<FormField
										control={emailForm.control}
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
										disabled={emailForm.formState.isSubmitting}
									>
										{emailForm.formState.isSubmitting
											? "Sending..."
											: "Send verification code"}
									</Button>
								</form>
							</Form>
						)}

						{/* OTP Step */}
						{step === "otp" && (
							<Form {...otpForm}>
								<form
									onSubmit={otpForm.handleSubmit(onOTPSubmit)}
									className="space-y-4"
								>
									<FormField
										control={otpForm.control}
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
										disabled={otpForm.formState.isSubmitting}
									>
										{otpForm.formState.isSubmitting
											? "Verifying..."
											: "Verify code"}
									</Button>
								</form>
							</Form>
						)}

						{/* Password Step */}
						{step === "password" && (
							<Form {...passwordForm}>
								<form
									onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
									className="space-y-4"
								>
									<FormField
										control={passwordForm.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>New Password</FormLabel>
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

									<FormField
										control={passwordForm.control}
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

									{success && (
										<div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">
											{success}
										</div>
									)}

									<Button
										type="submit"
										className="w-full h-11 text-base"
										disabled={passwordForm.formState.isSubmitting}
									>
										{passwordForm.formState.isSubmitting
											? "Resetting..."
											: "Reset password"}
									</Button>
								</form>
							</Form>
						)}

						<div className="mt-6 text-center">
							<p className="text-sm text-muted-foreground">
								Remember your password?{" "}
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
			</div>
		</div>
	);
}
