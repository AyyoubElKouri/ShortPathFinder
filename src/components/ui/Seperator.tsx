/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
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
					? "w-px h-[80%] bg-linear-to-b from-transparent via-white/40 to-transparent relative before:absolute before:inset-0 before:bg-linear-to-b before:from-transparent before:via-white/10 before:to-transparent before:blur-[0.5px]"
					: "h-px w-[80%] bg-linear-to-r from-transparent via-white/40 to-transparent relative before:absolute before:inset-0 before:bg-linear-to-r before:from-transparent before:via-white/10 before:to-transparent before:blur-[0.5px]"
			}
		/>
	);
}
