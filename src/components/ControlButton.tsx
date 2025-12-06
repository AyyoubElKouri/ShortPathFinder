/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useState } from "react";

interface ControlButtonProps {
	isRun?: boolean;
	content: React.ReactNode;
	message?: string;
	callback?: () => void;
}

export function ControlButton({
	isRun = false,
	content,
	message,
	callback,
}: ControlButtonProps) {
	const [hovered, setHovered] = useState(false);

	return (
		<button
			type="button"
			className="relative flex flex-col items-center"
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			{hovered && message && (
				<div
					className="absolute -top-12 px-2 py-1 bg-[#383939] text-white text-md rounded
				 					whitespace-nowrap"
				>
					{message}
				</div>
			)}

			<button
				type="button"
				onClick={callback}
				className={`w-8.5 h-8.5 border border-white/10 flex justify-center rounded-[5px]
					items-center ${isRun ? "bg-[#063636]" : "bg-[#383939]"}
					text-white active:scale-95 hover:brightness-130`}
			>
				{content}
			</button>
		</button>
	);
}
