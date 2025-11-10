import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import UserDropdown from "@/components/landing/UserDropdown";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const MenuItems = [
	{
		label: "For founders",
		href: "#founders",
	},
	{
		label: "For investors",
		href: "#investors",
	},
	{
		label: "About",
		href: "#about",
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

	const handleSmoothScroll = (
		e: React.MouseEvent<HTMLAnchorElement>,
		href: string,
	) => {
		if (href.startsWith("#")) {
			e.preventDefault();
			const targetId = href.substring(1);
			const element = document.getElementById(targetId);
			if (element) {
				element.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		}
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
			className={
				"h-16 rounded-full fixed top-4 left-1/2 -translate-x-1/2 bg-transparent w-full max-w-7xl mx-auto flex justify-between items-center px-4 backdrop-blur-sm z-50 transition-all duration-300 ease-in-out"
			}
		>
			<div className="flex items-center w-1/6 pl-2">
				<Logo />
			</div>
			<div className="flex items-center gap-12 w-4/6 justify-center">
				{MenuItems.map((item) => (
					<a
						href={item.href}
						onClick={(e) => handleSmoothScroll(e, item.href)}
						className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
						key={item.label}
					>
						{item.label}
					</a>
				))}
			</div>
			<div className="flex items-center gap-4 w-1/6 justify-end">
				{session?.user ? (
					<UserDropdown user={session.user} onSignOut={handleSignOut} />
				) : (
					<>
						<Link to="/sign-in">
							<Button
								variant="outline"
								className="font-medium h-9 px-5 cursor-pointer"
							>
								Sign in
							</Button>
						</Link>
						<Link to="/sign-up">
							<Button variant="default">Start Raising</Button>
						</Link>
					</>
				)}
			</div>
		</div>
	);
};

export default Header;
