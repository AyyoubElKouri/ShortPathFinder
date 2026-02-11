/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

/**
 * @enum Algorithm
 * Various pathfinding algorithms available in the application.
 */
export enum Algorithm {
	DIJKSTRA = "Dijkstra",
	ASTAR = "A*",
	// IDASTAR = "IDA*",
	BFS = "Breadth First Search",
	DFS = "Depth First Search",
	// JUMPPOINT = "Jump Point",
	// ORTHOGONALJUMPPOINT = "Orthogonal Jump Point",
	// TRACE = "Trace",
}

/**
 * @enum Heuristic
 * Different heuristics used by algorithms like A* and IDA*.
 */
export enum Heuristic {
	MANHATTAN = "Manhattan",
	EUCLIDEAN = "Euclidean",
	OCTILE = "Octile",
	CHEBYSHEV = "Chebyshev",
}

/**
 * @type PathfindingParams
 * Parameters required to execute a pathfinding algorithm.
 */
export interface PathfindingParams {
	grid: Uint8Array | number[];
	width: number;
	height: number;
	startIndex: number;
	goalIndex: number;
	algorithm: AlgorithmType;
	heuristic?: HeuristicType;
	allowDiagonal?: boolean;
	bidirectional?: boolean;
	dontCrossCorners?: boolean;
}

/**
 * @interface PathfindingResponse
 * The result of a pathfinding algorithm execution.
 */
export interface PathfindingResponse {
	path: number[];
	visited: number[];
	success: boolean;
	cost: number;
	time: number;
}

/**
 * @interface PathfindingConfig
 * Configuration options for pathfinding algorithms.
 */
export interface PathfindingConfig {
	allowDiagonal: boolean;
	bidirectional: boolean;
	dontCrossCorners: boolean;
	heuristic?: Heuristic;
}
