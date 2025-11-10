import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import { Trusted } from "@/components/landing/Trusted";
import Wrapper from "@/components/ui/Wrapper";

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
			<Wrapper>
				<Hero />
				<Trusted />
			</Wrapper>
		</div>
	);
}
