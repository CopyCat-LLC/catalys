import { createFileRoute } from "@tanstack/react-router";
import Header from "../components/Header";

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
		<div>
			<Header />
			<div className="min-h-screen flex items-center justify-center">asd</div>
			<div>asd</div>
		</div>
	);
}
