import { Link } from "@tanstack/react-router";
import { HugeiconsIcon } from '@hugeicons/react'
import { Rocket01Icon } from '@hugeicons-pro/core-bulk-rounded'

const Logo = () => {
	return (
		<Link to="/" className="flex items-center gap-2">
			<HugeiconsIcon icon={Rocket01Icon} size={24} color="white" />
			<h2 className="text-xl font-semibold">Catalys</h2>
		</Link>
	);
};

export default Logo;
