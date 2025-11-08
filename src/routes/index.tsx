import { createFileRoute } from "@tanstack/react-router";
import About from "@/components/landing/About";
import Founders from "@/components/landing/Founders";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Investors from "@/components/landing/Investors";

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
			<Hero />
			<Founders />
			<Investors />
			<About />
		</div>
	);
}
