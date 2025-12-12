/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { Algorithm } from "./types";

// Size of each cell in the grid (in pixels)
export const CELL_SIZE = 25;

// Batch size for processing cells during pathfinding visualization
export const BATCH_SIZE = 5;

// Cellules colors
export const CELL_COLORS = {
	empty: "#141114",
	start: "#92FA13",
	end: "#FC2930",
	wall: "#3C393C",
	path: "#FAFA03",
	visited: "#1474FF",
};

// Non heuristic algorithms
export const NON_HEURISTIC_ALGOS: Algorithm[] = [
	Algorithm.DIJKSTRA,
	Algorithm.BFS,
	// Algorithm.DFS,
	// Algorithm.TRACE,
];
