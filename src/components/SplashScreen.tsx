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

		const timer = setTimeout(() => setIsVisible(false), 2000);
		return () => clearTimeout(timer);
	}, []);

	const shortcut = platform === "mac" ? "⌃⌘F" : "F11";

	return (
		<motion.div
			initial={{ opacity: 1 }}
			animate={{ opacity: isVisible ? 1 : 0 }}
			transition={{ duration: 0.6 }}
			className="fixed inset-0 z-50 flex items-center justify-center bg-none"
			style={{ pointerEvents: isVisible ? "auto" : "none" }}
		>
			<motion.div
				initial={{ opacity: 0, y: 5 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
				className="text-center px-6"
			>
				<h1 className="text-4xl font-light text-white/90 italic font-serif">
					Switch to fullscreen for a better experience
				</h1>

				<button
					type="button"
					onClick={() => document.documentElement.requestFullscreen()}
					className="mt-4 px-5 py-2 bg-[#1F1F1F] text-white/90 font-mono text-lg
                       border border-[#2C2D2D] rounded hover:bg-[#2A2A2A] transition"
				>
					Press {shortcut}
				</button>
			</motion.div>
		</motion.div>
	);
}
