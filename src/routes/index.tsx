import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import BentoGrid from "@/components/landing/BentoGrid";
import Header from "@/components/landing/Header";
import HowWorks from "@/components/landing/HowWorks";
import Hero from "@/components/ui/hero";

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
			<HowWorks />
			<BentoGrid />
		</div>
	);
}
