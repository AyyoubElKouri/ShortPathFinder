/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { motion } from "framer-motion";
import { useRun } from "@/hooks/useRun";
import {
	Atom,
	BrickWall,
	Play,
	RotateCcw,
	Route,
	Settings,
} from "lucide-react";
import { useGrid } from "@/hooks/useGrid";
import { Button } from "./ui/Button";
import { Seperator } from "./ui/Seperator";
import { AlgoSelector } from "./selectors/AlgoSelector";
import { ConfigSelector } from "./selectors/ConfigSelector";

export function Control() {
	const { clearWalls, clearPath, resetGrid, generateMaze } = useGrid();
	const { execute } = useRun();

	return (
		<motion.div
			layout
			className="absolute h-13 bottom-5 left-1/2 -translate-x-1/2 flex justify-center items-center
							 gap-[9px] bg-[#2C2D2D] px-[9px] rounded-lg
							 border border-[#404141] 
							 shadow-[0_4px_16px_rgba(0,0,0,0.6),0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.3)]"
			transition={{ type: "spring", stiffness: 300, damping: 30 }} // animation fluide
		>
			<Button icon={<Settings />} label="Settings" shortcut="S" />
			<Seperator />

			<AlgoSelector />
			<ConfigSelector />
			<Seperator />

			<Button
				label="Generate Maze"
				shortcut="M"
				icon={<Atom />}
				callback={generateMaze}
			/>
			<Seperator />

			<Button
				label="Reset Grid"
				shortcut="R"
				icon={<RotateCcw />}
				callback={resetGrid}
			/>

			<Button
				label="Clear Walls"
				shortcut="W"
				icon={<BrickWall />}
				callback={clearWalls}
			/>

			<Button
				label="Clear Path"
				shortcut="P"
				icon={<Route />}
				callback={clearPath}
			/>

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
