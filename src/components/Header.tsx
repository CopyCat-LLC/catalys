import { Link } from "@tanstack/react-router";
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
	return (
		<div className="h-14 rounded-full fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-7xl mx-auto flex justify-between items-center px-4">
			<div className="flex items-center w-1/6">
				<Logo />
			</div>
			<div className="flex items-center gap-12 w-4/6 justify-center">
				{MenuItems.map((item) => (
					<Link to={item.href} className="text-sm" key={item.label}>
						{item.label}
					</Link>
				))}
			</div>
			<div className="flex items-center gap-4 w-1/6 justify-end">
				<Button variant="secondary">Sign in</Button>
				<Button variant="default">Sign up</Button>
			</div>
		</div>
	);
};

export default Header;
