import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import {
	AudioWaveform,
	BarChart3,
	Command,
	GalleryVerticalEnd,
	Home,
	Settings,
	Users,
} from "lucide-react";
import { Workspace } from "@/components/dashboard/Workspace";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	teams: [
		{
			name: "Acme Inc",
			logo: GalleryVerticalEnd,
			plan: "Enterprise",
		},
		{
			name: "Acme Corp.",
			logo: AudioWaveform,
			plan: "Startup",
		},
		{
			name: "Evil Corp.",
			logo: Command,
			plan: "Free",
		},
	],
};

export const Route = createFileRoute("/dashboard")({
	beforeLoad: ({ context, location }) => {
		// Assume 'auth' is available in your router context and has isAuthenticated
		if (!context.userId) {
			throw redirect({
				to: "/sign-in",
				search: {
					// Save the current location to redirect back after a successful login
					redirect: location.href,
				},
			});
		}
	},
	// This component will only render if beforeLoad passes
	component: DashboardLayout,
});

function DashboardLayout() {
	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader className="px-4 pt-4">
					<Workspace teams={data.teams} />
				</SidebarHeader>
				<SidebarContent className="px-2">
					<SidebarGroup>
						<SidebarGroupLabel>Navigation</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton asChild>
										<Link to="/dashboard">
											<Home />
											<span>Home</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton asChild>
										<Link to="/dashboard/overview">
											<BarChart3 />
											<span>Overview</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton asChild>
										<Link to="/dashboard">
											<Users />
											<span>Users</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton asChild>
										<Link to="/dashboard">
											<Settings />
											<span>Settings</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter>
					<div className="px-2 py-2 text-xs text-muted-foreground">
						© 2025 Your App
					</div>
				</SidebarFooter>
			</Sidebar>
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger />
					<div className="flex items-center gap-2">
						<h1 className="text-lg font-semibold">Dashboard</h1>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
