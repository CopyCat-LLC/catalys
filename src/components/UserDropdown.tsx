import { LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface UserDropdownProps {
	user: {
		name?: string | null;
		email: string;
		image?: string | null;
	};
	onSignOut: () => void;
}

const UserDropdown = ({ user, onSignOut }: UserDropdownProps) => {
	// Get initials from name or email
	const getInitials = () => {
		if (user.name) {
			return user.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2);
		}
		return user.email[0].toUpperCase();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="outline-none focus:outline-none">
				<Avatar className="size-10 cursor-pointer hover:opacity-80 transition-opacity">
					<AvatarImage
						src={user.image || undefined}
						alt={user.name || user.email}
					/>
					<AvatarFallback className="bg-primary/10 text-primary font-medium">
						{getInitials()}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel>
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">
							{user.name || "User"}
						</p>
						<p className="text-xs leading-none text-muted-foreground">
							{user.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="cursor-pointer">
					<User />
					Profile
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="cursor-pointer"
					variant="destructive"
					onClick={onSignOut}
				>
					<LogOut />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserDropdown;
