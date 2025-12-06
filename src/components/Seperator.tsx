/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

export function Seperator({
	orientation = "vertical",
}: {
	orientation?: "vertical" | "horizontal";
}) {
	return (
		<div
			className={
				orientation === "vertical"
					? "w-[0.4px] h-full bg-white/30"
					: "h-[0.4px] w-full bg-white/30"
			}
		/>
	);
}
