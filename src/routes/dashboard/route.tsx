import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { BarChart3, Home, Settings, Users } from "lucide-react";
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

// Server function to check if user has any organizations
const checkUserOrganizations = createServerFn({ method: "GET" }).handler(
	async () => {
		try {
			const { api } = await import("../../../convex/_generated/api");
			const { fetchQuery } = await import("@/lib/auth-server");

			console.log("Checking organizations via Convex query...");

			// Use the Convex query which checks the member table directly
			const hasOrgs = await fetchQuery(api.organizations.hasOrganizations, {});

			console.log("Organization check result:", { hasOrgs });
			return { hasOrganizations: hasOrgs };
		} catch (error) {
			console.error("Error checking organizations:", error);
			// On error, assume no organizations and redirect to launch-startup
			return { hasOrganizations: false };
		}
	},
);

export const Route = createFileRoute("/dashboard")({
	beforeLoad: async ({ context, location }) => {
		// Check authentication
		if (!context.userId) {
			throw redirect({
				to: "/sign-in",
				search: {
					redirect: location.href,
				},
			});
		}

		// Check if user has organizations server-side
		const { hasOrganizations } = await checkUserOrganizations();

		if (!hasOrganizations) {
			throw redirect({
				to: "/launch-startup",
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
					<Workspace />
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
