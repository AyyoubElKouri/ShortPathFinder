/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { motion } from "framer-motion";

import { AlgoSelector } from "@/components/selectors/AlgoSelector";
import { ConfigSelector } from "@/components/selectors/ConfigSelector";
import { Seperator } from "@/components/ui/Seperator";
import { isHeuristic } from "@/utils";
import { useAlgorithmStore, useSecondAlgorithm } from "@/stores";
import { HeuristicSelector } from "../selectors/HeuristicSelector";

export function DoubleGridConfigPanel() {
	const { algorithm } = useAlgorithmStore();
	const { algorithm: secondAlgorithm } = useSecondAlgorithm();

	return (
		<motion.div
			layout
			className="absolute h-13 bottom-18 left-1/2 -translate-x-1/2 flex justify-center
						  items-center gap-[9px] bg-[#2C2D2D] px-[9px] rounded-lg border
						  border-[#404141] shadow-[0_4px_16px_rgba(0,0,0,0.6),0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.3)]"
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
		>
			<span className="text-white/60 capitalize text-nowrap">First grid</span>
			<AlgoSelector />
			<ConfigSelector />
			{isHeuristic(algorithm) && <HeuristicSelector />}

			<Seperator />

			<span className="text-white/60 capitalize text-nowrap">Second grid</span>
			<AlgoSelector useSecondState />
			<ConfigSelector useSecondState />
			{isHeuristic(secondAlgorithm) && <HeuristicSelector useSecondState />}
		</motion.div>
	);
}
