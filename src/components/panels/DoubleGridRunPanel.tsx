/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { motion } from "framer-motion";
import {
	Atom,
	BrickWall,
	Play,
	RotateCcw,
	Route,
} from "lucide-react";


import { Button } from "@/components/ui/Button";
import { Seperator } from "@/components/ui/Seperator";
import { useGrid } from "@/hooks/useGrid";
import { useRun } from "@/hooks/useRun";
import { ModeSelector } from "../selectors/ModeSelector";

export function DoubleGridRunPanel() {
	const { actions } = useGrid();
	const { execute } = useRun();

	return (
		<motion.div
			layout
			className="absolute h-13 bottom-2 left-1/2 -translate-x-1/2 flex justify-center
						  items-center gap-[9px] bg-[#2C2D2D] px-[9px] rounded-lg border
						  border-[#404141] shadow-[0_4px_16px_rgba(0,0,0,0.6),0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.3)]"
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
		>
			<ModeSelector />
			<Seperator />

			<Button label="Generate Maze" shortcut="M" icon={<Atom />} callback={actions.generateMaze} />
			<Seperator />

			<Button label="Reset Grid" shortcut="R" icon={<RotateCcw />} callback={actions.resetGrid} />
			<Button label="Clear Walls" shortcut="W" icon={<BrickWall />} callback={actions.clearWalls} />
			<Button label="Clear Path" shortcut="P" icon={<Route />} callback={actions.clearPath} />


      <Button
				isRun={true}
				label="Start Algorithm"
				shortcut="Enter"
				icon={<Play />}
				callback={execute}
			/>
		</motion.div>
	);
}
