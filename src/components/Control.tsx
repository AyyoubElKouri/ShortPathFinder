/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

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
import { ControlButton } from "./ControlButton";
import { Seperator } from "./Seperator";
import { AlgoSelector } from "./selectors/AlgoSelector";
import { ConfigSelector } from "./selectors/ConfigSelector";

export function Control() {
	const { clearWalls, clearPath, resetGrid } = useGrid();
	const { execute } = useRun();

	return (
		<div
			className="absolute h-13 bottom-5 left-1/2 -translate-x-1/2 flex justify-center items-center
							 gap-[9px] bg-[#2C2D2D] px-[9px] rounded-lg"
		>
			<ControlButton content={<Settings />} message="Settings" />
			<Seperator />

			<AlgoSelector />
			<ConfigSelector />
			<Seperator />

			<ControlButton content={<Atom />} message="Generate Maze" />
			<Seperator />

			<ControlButton
				content={<RotateCcw />}
				message="Reset Grid"
				callback={resetGrid}
			/>

			<ControlButton
				content={<BrickWall />}
				message="Clear Walls"
				callback={clearWalls}
			/>

			<ControlButton
				content={<Route />}
				message="Clear Path"
				callback={clearPath}
			/>

			<ControlButton
				isRun={true}
				content={<Play />}
				message="Start Pathfinding"
				callback={execute}
			/>
		</div>
	);
}
