/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import type { ALGORITHMS, HEURISTICS } from "./constants";

// Different algorithms available for pathfinding
export type Algorithm = (typeof ALGORITHMS)[number];

// Diffentent heuristics available for pathfinding
export type Heuristic = (typeof HEURISTICS)[number];

// Different states a cell can have
export type CellState = "empty" | "start" | "end" | "wall" | "path" | "visited";

// Cellule type in the grid
export interface Cellule {
	x: number;
	y: number;
	state: CellState;
}

// The result received from the pathfinding algorithm in WebAssembly module
export interface PathfindingResult {
	visited: number[];
	path: number[];
	success: boolean;
	cost: number;
}
