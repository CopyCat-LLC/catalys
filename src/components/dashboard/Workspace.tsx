"use client";

import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import {
	Building2,
	Check,
	ChevronsUpDown,
	Loader2,
	Plus,
	Rocket,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { api } from "../../../convex/_generated/api";

const STAGE_LABELS = {
	IDEA: "Idea Stage",
	MVP: "MVP",
	LAUNCHED: "Launched",
	GROWTH: "Growth",
	SCALING: "Scaling",
};

export function Workspace() {
	const { isMobile } = useSidebar();
	const navigate = useNavigate();
	const session = authClient.useSession();

	// Get organizations from Better Auth using the listOrganizations hook
	const { data: organizationsData, isPending: orgsPending } =
		authClient.useListOrganizations();
	const organizations = organizationsData || [];
	const activeOrgId = session.data?.session?.activeOrganizationId;

	// Get organization IDs to fetch startups
	const orgIds = useMemo(
		() => organizations.map((org: { id: string }) => org.id),
		[organizations],
	);

	// Fetch startups for all organizations
	const startups = useQuery(
		api.startups.getByOrganizationIds,
		orgIds.length > 0 ? { organizationIds: orgIds } : "skip",
	);

	// Create a map of startups by organizationId for easy lookup
	const startupsByOrgId = useMemo(() => {
		if (!startups) return {};
		const map: Record<string, NonNullable<typeof startups>[number]> = {};
		for (const startup of startups) {
			if (startup) {
				map[startup.organizationId] = startup;
			}
		}
		return map;
	}, [startups]);

	const activeOrg = useMemo(() => {
		if (!organizations) return null;
		// If no active org is set, use the first organization
		if (!activeOrgId) return organizations[0];
		return (
			organizations.find((org: { id: string }) => org.id === activeOrgId) ||
			organizations[0]
		);
	}, [organizations, activeOrgId]);

	// Auto-set active organization if none is set
	useEffect(() => {
		if (organizations.length > 0 && !activeOrgId && !orgsPending) {
			// Set the first organization as active
			authClient.organization
				.setActive({
					organizationId: organizations[0].id,
				})
				.catch((error) => {
					console.error("Failed to set default organization:", error);
				});
		}
	}, [organizations, activeOrgId, orgsPending]);

	const handleOrgChange = async (orgId: string) => {
		// Don't do anything if clicking on the already active organization
		if (orgId === activeOrgId) {
			return;
		}

		try {
			// Update the active organization in Better Auth
			await authClient.organization.setActive({
				organizationId: orgId,
			});

			// Refresh the page to reflect the new active organization
			window.location.reload();
		} catch (error) {
			console.error("Failed to change organization:", error);
		}
	};

	// Loading state
	if (session.isPending || orgsPending) {
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton size="lg" disabled>
						<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
							<Loader2 className="size-4 animate-spin" />
						</div>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">Loading...</span>
						</div>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		);
	}

	// If no active org or no organizations, return null
	// (The dashboard route redirects to launch-startup if no orgs exist)
	if (!activeOrg || !organizations || organizations.length === 0) {
		return null;
	}

	const getOrgIcon = (org: { id: string }) => {
		const startup = startupsByOrgId[org.id];
		if (startup) {
			return Rocket;
		}
		return Building2;
	};

	const getOrgSubtitle = (org: { id: string }) => {
		const startup = startupsByOrgId[org.id];
		if (startup?.stage) {
			return STAGE_LABELS[startup.stage as keyof typeof STAGE_LABELS];
		}
		return "Organization";
	};

	const OrgIcon = getOrgIcon(activeOrg);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
								<OrgIcon className="size-4" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{activeOrg.name}</span>
								<span className="truncate text-xs">
									{getOrgSubtitle(activeOrg)}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						align="start"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-muted-foreground text-xs">
							Startups
						</DropdownMenuLabel>
						{organizations.map(
							(org: { id: string; name: string }, index: number) => {
								const Icon = getOrgIcon(org);
								const startup = startupsByOrgId[org.id];
								const isActive = org.id === activeOrgId;
								return (
									<DropdownMenuItem
										key={org.id}
										onClick={() => handleOrgChange(org.id)}
										className="gap-2 p-2"
									>
										<div className="flex size-6 items-center justify-center rounded-md border">
											<Icon className="size-3.5 shrink-0" />
										</div>
										<div className="flex flex-col flex-1">
											<span className="font-medium">{org.name}</span>
											{startup && (
												<span className="text-xs text-muted-foreground">
													{startup.industry}
												</span>
											)}
										</div>
										{isActive ? (
											<Check className="size-4 text-primary" />
										) : (
											<DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
										)}
									</DropdownMenuItem>
								);
							},
						)}
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="gap-2 p-2"
							onClick={() => navigate({ to: "/launch-startup" })}
						>
							<div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
								<Plus className="size-4" />
							</div>
							<div className="text-muted-foreground font-medium">
								Launch a startup
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
