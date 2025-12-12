/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { motion } from "framer-motion";
import { Control } from "@/components/Control";
import { Grid } from "@/components/Grid";
import useGridStore from "@/store/useGridStore";

import { SplashScreen } from "./components/SplashScreen";

export default function Home() {
	const { isRunning } = useGridStore();

	return (
		<div className="relative w-full h-svh flex justify-center bg-[#141114]">
			<SplashScreen />
			<Grid />

			<motion.div
				className={isRunning ? "opacity-0 pointer-events-none" : ""}
				animate={{ opacity: isRunning ? 0 : 1 }}
				transition={{ duration: 0.3 }}
			>
				<Control />
			</motion.div>
		</div>
	);
}
