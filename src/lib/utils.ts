/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { CELL_COLORS } from "./constants";
import type { CellState } from "./types";

// get colors for different cell types
export function getCellColor(type: CellState): string {
	switch (type) {
		case "empty":
			return CELL_COLORS.empty;
		case "start":
			return CELL_COLORS.start;
		case "end":
			return CELL_COLORS.end;
		case "wall":
			return CELL_COLORS.wall;
		case "path":
			return CELL_COLORS.path;
		case "visited":
			return CELL_COLORS.visited;
		default:
			return CELL_COLORS.empty;
	}
}
