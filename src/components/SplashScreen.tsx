/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function SplashScreen() {
	const [isVisible, setIsVisible] = useState(true);
	const [platform, setPlatform] = useState<"windows" | "mac" | "other">(
		"other",
	);

	useEffect(() => {
		const userAgent = window.navigator.userAgent.toLowerCase();
		if (userAgent.includes("mac")) setPlatform("mac");
		else if (userAgent.includes("win")) setPlatform("windows");

		const timer = setTimeout(() => setIsVisible(false), 4000);
		return () => clearTimeout(timer);
	}, []);

	const shortcut = platform === "mac" ? "⌃⌘F" : "F11";

	return (
		<motion.div
			initial={{ opacity: 1 }}
			animate={{ opacity: isVisible ? 1 : 0 }}
			transition={{ duration: 0.6 }}
			className="fixed inset-0 z-50 flex items-center justify-center bg-[#141114]"
			style={{ pointerEvents: isVisible ? "auto" : "none" }}
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
				className="text-center space-y-12"
			>
				<h1 className="text-6xl font-extralight text-white/90 tracking-tight">
					Switch to fullscreen for a better experience
				</h1>

				<div className="inline-flex items-baseline gap-3 text-[#6B7280]">
					<span className="text-sm uppercase tracking-widest">Press</span>
					<kbd
						className="px-5 py-2.5 bg-[#1A1A1A] text-white/95 font-mono text-2xl
                             font-light tracking-wider border border-[#2C2D2D] rounded"
					>
						{shortcut}
					</kbd>
				</div>
			</motion.div>
		</motion.div>
	);
}
