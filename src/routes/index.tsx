import { createFileRoute } from "@tanstack/react-router";
import ChatIllustration from "@/components/illustrations/chat";
import CodeEditorIllustration from "@/components/illustrations/code-editor";
import GlobeIllustration from "@/components/illustrations/globe";
import MockupMobileIllustration from "@/components/illustrations/mockup-mobile";
import RadarSmallIllustration from "@/components/illustrations/radar-small";
import BentoGrid from "@/components/landing/BentoGrid";
import CTA from "@/components/landing/CTA";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import HowWorks from "@/components/landing/HowWorks";
import Hero from "@/components/ui/hero";
import Logo from "@/components/ui/Logo";
import Screenshot from "@/components/ui/screenshot";

export const Route = createFileRoute("/")({
	component: App,
	head: () => ({
		meta: [
			{
				name: "description",
				content: "Get the most out of your startup",
			},
		],
	}),
});

function App() {
	return (
		<div className="flex flex-col">
			<Header />
			<Hero
				title="Get funded on your terms"
				description="Set your equity, choose your valuation, and let investors bid to back your vision. Raise capital without giving up control."
			/>
			<HowWorks
				title="Everything you need from a perfect calendar app"
				description="Saturn Calendar is a modern and intuitive calendar app that makes it easy to manage your schedule and stay on top of your commitments."
				slides={[
					{
						tagline: "Integrated AI",
						title: "Intelligent scheduling",
						description:
							"Saturn Calendar uses AI to suggest the best times for your meetings and events.",
						image: (
							<Screenshot
								srcDark="/app-settings-dark.png"
								alt="Navbars"
								width={900}
								height={600}
							/>
						),
					},
					{
						tagline: "Seamless syncing",
						title: "Sync all your calendars",
						description:
							"Saturn Calendar integrates with all your calendars, including Google Calendar, Outlook, and iCloud.",
						image: (
							<Screenshot
								srcDark="/app-mail-dark.png"
								alt="Bento grids"
								width={900}
								height={600}
							/>
						),
					},
					{
						tagline: "Team collaboration",
						title: "Collaborate with your team",
						description:
							"Saturn Calendar allows you to collaborate with your team on your schedule.",
						image: (
							<Screenshot
								srcDark="/dashboard-dark.png"
								alt="Hero sections"
								width={900}
								height={600}
							/>
						),
					},
					{
						tagline: "Mobile-first",
						title: "Start with the right impression",
						description:
							"Optimized to look and feel great on all devices, including mobile, tablet and desktop.",
						image: (
							<Screenshot
								srcDark="/app-settings-dark.png"
								alt="Navbars"
								width={900}
								height={600}
							/>
						),
					},
				]}
			/>
			<BentoGrid
				title="Finally, a calendar experience done right."
				description="Saturn Calendar is a modern and intuitive calendar app that makes it easy to manage your schedule and stay on top of your commitments."
				tiles={[
					{
						title: "Mobile-first",
						description: (
							<p>
								Optimized to look and feel great on all devices, including
								mobile, tablet and desktop.
							</p>
						),
						visual: (
							<div className="min-h-[300px] w-full py-12">
								<MockupMobileIllustration />
							</div>
						),
						size: "col-span-12 md:col-span-6 lg:col-span-5",
					},
					{
						title: "Connect to all your calendars at once",
						description: (
							<>
								<p className="max-w-[460px]">
									Integrate your landing page directly in the product and forget
									about multiple codebases and unnecessary APIs.
								</p>
								<p>No extra dependencies, no extra maintenance.</p>
							</>
						),
						visual: (
							<div className="mt-12 -mb-48 flex w-full grow items-center justify-center self-center">
								<RadarSmallIllustration
									className="max-w-[480px]"
									centerLogo={Logo}
								/>
							</div>
						),
						size: "col-span-12 md:col-span-6 lg:col-span-7",
					},
					{
						title: "Stay on top of your schedule",
						description: (
							<p className="max-w-[460px]">
								With Saturn Calendar, you&apos;ll never miss an important
								meeting or appointment again.
							</p>
						),
						visual: (
							<div className="min-h-[240px] w-full grow items-center self-center px-4 lg:px-12">
								<CodeEditorIllustration />
							</div>
						),
						size: "col-span-12 md:col-span-6 lg:col-span-7",
					},
					{
						title: "Support for multiple time zones",
						description:
							"Easily manage and visualize schedules across different time zones.",
						visual: (
							<div className="-mb-[96px] sm:-mb-[186px] md:-mx-32">
								<GlobeIllustration className="[&_svg]:h-full [&_svg]:w-full" />
							</div>
						),
						size: "col-span-12 md:col-span-6 lg:col-span-5",
					},
					{
						title: "Team centric",
						description: (
							<>
								<p>
									Saturn Calendar is designed to work seamlessly with your team.
								</p>
								<p>
									Easily add your team members to collaborate in real-time on
									shared calendars and events.
								</p>
							</>
						),
						visual: (
							<div className="w-full sm:p-4 md:p-8">
								<ChatIllustration />
							</div>
						),
						size: "col-span-12 md:col-span-6 lg:col-span-5",
					},
					{
						title: "Smart conflict prevention",
						description: (
							<p className="max-w-[460px]">
								Automatically blocks busy time slots across all your connected
								calendars.
							</p>
						),
						visual: (
							<div className="min-h-[240px] w-full grow items-center self-center px-4 lg:px-12">
								<CodeEditorIllustration />
							</div>
						),
						size: "col-span-12 md:col-span-6 lg:col-span-7",
					},
				]}
			/>
			<FAQ
				title="Questions & answers"
				items={[
					{
						question:
							"Which calendar provider(s) is Saturn Calendar compatible with?",
						answer: (
							<p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
								Currently, Saturn Calendar integrates and syncs with Google
								Calendar accounts. Adding support for other calendar providers
								such as Outlook and iCloud is on our roadmap.
							</p>
						),
					},
					{
						question: "Is Saturn Calendar available on mobile devices?",
						answer: (
							<p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
								Yes, Saturn Calendar is available for iPhone and Android
								devices. We&apos;re also working on an optimized version for
								tablet devices, such as iPad, to make Saturn Calendar the best
								experience on all platforms.
							</p>
						),
					},
					{
						question: "Can I share my calendar with team members?",
						answer: (
							<p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
								Yes, Saturn Calendar offers robust team sharing features. You
								can share your calendar with specific team members, set
								different permission levels, and even create team-wide calendars
								for better coordination and scheduling.
							</p>
						),
					},
					{
						question: "Does Saturn Calendar support multiple time zones?",
						answer: (
							<p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
								Absolutely! Saturn Calendar has comprehensive time zone support.
								You can view events in multiple time zones, schedule meetings
								across different regions, and automatically adjust times when
								traveling. The calendar will always show the correct local time
								for all participants.
							</p>
						),
					},
					{
						question: "What kind of customer support do you offer?",
						answer: (
							<p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
								We provide 24/7 email support for all users. Team and Enterprise
								plan subscribers get priority support with guaranteed response
								times and access to live chat. Enterprise customers also receive
								a dedicated account manager for personalized assistance.
							</p>
						),
					},
				]}
			/>
			<CTA
				title="Ready to transform your scheduling experience?"
				buttons={[
					{
						href: "/",
						text: "Get Started",
						variant: "default",
					},
					{
						href: "/",
						text: "Contact sales",
						variant: "glow",
					},
				]}
			/>
			<Footer
				name="Saturn"
				logo={<Logo />}
				copyright="© 2025 Catalys. All rights reserved."
				columns={[
					{
						title: "Product",
						links: [
							{ text: "Features", href: "/" },
							{ text: "Pricing", href: "/" },
							{ text: "Integrations", href: "/" },
							{ text: "Changelog", href: "/" },
						],
					},
					{
						title: "Resources",
						links: [
							{ text: "Documentation", href: "/" },
							{ text: "API", href: "/" },
							{ text: "Guides", href: "/" },
							{ text: "Help Center", href: "/" },
						],
					},
					{
						title: "Company",
						links: [
							{ text: "About", href: "/" },
							{ text: "Blog", href: "/" },
							{ text: "Careers", href: "/" },
							{ text: "Contact", href: "/" },
						],
					},
					{
						title: "Legal",
						links: [
							{ text: "Privacy", href: "/" },
							{ text: "Terms", href: "/" },
							{ text: "Cookie Policy", href: "/" },
						],
					},
				]}
				policies={[
					{ text: "Privacy Policy", href: "/" },
					{ text: "Terms of Service", href: "/" },
					{ text: "Cookie Settings", href: "/" },
				]}
			/>
		</div>
	);
}
