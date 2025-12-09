/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { Keyboard } from "lucide-react";
import { useEffect, useState } from "react";

interface ButtonProps {
	isRun?: boolean;
	label?: string;
	icon: React.ReactNode;
	shortcut?: string;
	callback?: () => void;
}

export function Button({
	isRun = false,
	label,
	icon,
	shortcut,
	callback,
}: ButtonProps) {
	const [hovered, setHovered] = useState(false);

	useEffect(() => {
		if (!shortcut || !callback) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			// Parse the shortcut (ex: "ctrl+s", "a", "shift+r")
			const parts = shortcut.toLowerCase().split("+");
			const key = parts[parts.length - 1];
			const needsCtrl = parts.includes("ctrl");
			const needsShift = parts.includes("shift");
			const needsAlt = parts.includes("alt");

			// Verify if the combination matches
			const keyMatches = event.key.toLowerCase() === key;
			const ctrlMatches = needsCtrl
				? event.ctrlKey || event.metaKey
				: !event.ctrlKey && !event.metaKey;
			const shiftMatches = needsShift ? event.shiftKey : !event.shiftKey;
			const altMatches = needsAlt ? event.altKey : !event.altKey;

			if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
				event.preventDefault();
				callback();
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [shortcut, callback]);

	return (
		<button
			type="button"
			className="relative flex flex-col items-center"
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			{hovered && shortcut && (
				<div
					className="absolute -top-12 px-2 py-1 bg-[#383939] text-white text-md rounded
				 					whitespace-nowrap border border-white/10 flex items-center gap-2"
				>
					{shortcut} <Keyboard size={20} color="#ffffff80" />
				</div>
			)}

			<button
				type="button"
				onClick={callback}
				className={`h-8.5 border border-white/10 flex justify-center rounded-[5px] px-2 gap-1
					items-center ${isRun ? "bg-[#063636]" : "bg-[#383939]"}
					text-white active:scale-95 hover:brightness-130 whitespace-nowrap`}
			>
				{icon} {label ?? ""}
			</button>
		</button>
	);
}
