/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

// Algorithms supported by the pathfinding visualizer
export enum AlgorithmType {
	ASTAR = "ASTAR",
	IDASTAR = "IDASTAR",
	DIJKSTRA = "DIJKSTRA",
	BFS = "BFS",
	DFS = "DFS",
	JUMPPOINT = "JUMPPOINT",
	ORTHOGONALJUMPPOINT = "ORTHOGONALJUMPPOINT",
	TRACE = "TRACE",
}

// List of algorithms with display names for UI
export const ALGORITHMS = [
	{ display: "A*", value: AlgorithmType.ASTAR },
	{ display: "IDA*", value: AlgorithmType.IDASTAR },
	{ display: "Dijkstra", value: AlgorithmType.DIJKSTRA },
	{ display: "Breadth-First Search", value: AlgorithmType.BFS },
	{ display: "Depth-First Search", value: AlgorithmType.DFS },
	{ display: "Jump Point", value: AlgorithmType.JUMPPOINT },
	{ display: "Orthogonal Jump Point", value: AlgorithmType.ORTHOGONALJUMPPOINT },
	{ display: "Trace", value: AlgorithmType.TRACE },
] as const;

// Heuristics supported by the pathfinding visualizer
export enum HeuristicType {
  MANHATTAN = "MANHATTAN",
  EUCLIDEAN = "EUCLIDEAN",
  OCTILE = "OCTILE",
  CHEBYSHEV = "CHEBYSHEV",
}

export const HEURISTICS = [
	{ display: "Manhattan", value: HeuristicType.MANHATTAN },
	{ display: "Euclidean", value: HeuristicType.EUCLIDEAN },
	{ display: "Octile", value: HeuristicType.OCTILE },
	{ display: "Chebyshev", value: HeuristicType.CHEBYSHEV },
] as const;

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
