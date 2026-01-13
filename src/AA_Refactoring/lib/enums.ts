/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

/* Different pathfinding algorithms available */
export enum Algorithm {
	ASTAR = "A*",
	IDASTAR = "IDA*",
	DIJKSTRA = "Dijkstra",
	BFS = "Breadth-First Search",
	DFS = "Depth-First Search",
	JUMPPOINT = "JumpPoint",
	ORTHOGONALJUMPPOINT = "OrthogonalJumpPoint",
	TRACE = "Trace",
}

/* Diffentent heuristics available for pathfinding */
export enum Heuristic {
	MANHATTAN = "Manhattan",
	EUCLIDEAN = "Euclidean",
	OCTILE = "Octile",
	CHEBYSHEV = "Chebyshev",
}

/* Different modes available in the application */
export enum Mode {
	GRID = "Grid",
	GRAPH = "Graph",
	MAP = "Map",
	COMPARISON = "Comparison",
}
