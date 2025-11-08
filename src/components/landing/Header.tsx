import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import UserDropdown from "@/components/landing/UserDropdown";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";

const MenuItems = [
	{
		label: "For founders",
		href: "#",
	},
	{
		label: "For investors",
		href: "#",
	},
	{
		label: "About",
		href: "#",
	},
];

const Header = () => {
	const [scrolled, setScrolled] = useState(false);

	const { data: session } = useQuery({
		queryKey: ["session"],
		queryFn: async () => {
			const { data } = await authClient.getSession();
			return data;
		},
	});

	const handleSignOut = async () => {
		await authClient.signOut();
		window.location.href = "/";
	};

	useEffect(() => {
		const handleScroll = () => {
			const isScrolled = window.scrollY > 0;
			setScrolled(isScrolled);
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div
			className={cn(
				"h-16 rounded-full fixed top-4 left-1/2 -translate-x-1/2 bg-transparent w-full max-w-7xl mx-auto flex justify-between items-center px-4 backdrop-blur-sm z-50 transition-all duration-300 ease-in-out",
				scrolled && "my-2 backdrop-blur-sm bg-white/30 shadow",
			)}
		>
			<div className="flex items-center w-1/6 pl-2">
				<Logo />
			</div>
			<div className="flex items-center gap-12 w-4/6 justify-center">
				{MenuItems.map((item) => (
					<Link
						to={item.href}
						className="text-sm font-medium hover:text-primary transition-colors"
						key={item.label}
					>
						{item.label}
					</Link>
				))}
			</div>
			<div className="flex items-center gap-4 w-1/6 justify-end">
				{session?.user ? (
					<UserDropdown user={session.user} onSignOut={handleSignOut} />
				) : (
					<>
						<Link to="/sign-in">
							<Button variant="secondary" className="h-11 px-6 font-medium">
								Login
							</Button>
						</Link>
						<Link to="/sign-up">
							<Button variant="default" className="bg-indigo-600 font-medium h-11 px-6">
								Get Started
							</Button>
						</Link>
					</>
				)}
			</div>
		</div>
	);
};

export default Header;
