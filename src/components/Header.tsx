import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import UserDropdown from "./UserDropdown";
import { Button } from "./ui/button";
import Logo from "./ui/Logo";

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
				"h-14 rounded-full fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-7xl mx-auto flex justify-between items-center px-4 bg-card/80 backdrop-blur-sm z-50 transition-all duration-300 ease-in-out",
				scrolled && "my-2 border border-white-200 backdrop-blur-sm bg-white/70",
			)}
		>
			<div className="flex items-center w-1/6">
				<Link to="/">
					<Logo />
				</Link>
			</div>
			<div className="flex items-center gap-12 w-4/6 justify-center">
				{MenuItems.map((item) => (
					<Link
						to={item.href}
						className="text-sm hover:text-primary transition-colors"
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
							<Button variant="secondary" className="h-12 px-6">
								Sign in
							</Button>
						</Link>
						<Link to="/sign-up">
							<Button variant="default" className="h-12 px-6">
								Sign up
							</Button>
						</Link>
					</>
				)}
			</div>
		</div>
	);
};

export default Header;
