/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

// Different algorithms available for pathfinding
export enum Algorithm {
	ASTAR,
	// IDASTAR,
	DIJKSTRA,
	BFS,
	// DFS,
	// JUMPPOINT,
	// ORTHOGONALJUMPPOINT,
	// TRACE,
}

// Diffentent heuristics available for pathfinding
export enum Heuristic {
	MANHATTAN,
	EUCLIDEAN,
	OCTILE,
	CHEBYSHEV,
}

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
