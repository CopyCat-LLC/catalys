import { ArrowRightIcon } from "lucide-react";
import { Button } from "../ui/button";
import Glow from "../ui/glow";
import { Mockup, MockupFrame } from "../ui/mockup";
import Screenshot from "../ui/screenshot";

const Hero = () => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center gap-16 pt-68">
			<h2 className="text-7xl font-bold">Get funded on your terms</h2>
			<p className="text-lg text-muted-foreground text-center font-semibold">
				Set your equity, choose your valuation, and let investors bid to back
				your vision.
				<br />
				Raise capital without giving up control.
			</p>
			<div className="flex gap-4 items-center z-10">
				<Button variant="default" className="h-10 gap-2">
					Start Raising
					<ArrowRightIcon size={16} color="black" />
				</Button>
				<Button className="h-10" variant="glow">
					Find Startups
				</Button>
			</div>
			<div className="relative w-full">
				<MockupFrame>
					<Mockup>
						<Screenshot
							srcDark="/dashboard-dark.png"
							alt="Dashboard"
							width={670}
							height={410}
						/>
					</Mockup>
				</MockupFrame>
				<Glow variant="center" />
			</div>
		</div>
	);
};

export default Hero;
