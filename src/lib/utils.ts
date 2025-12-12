/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { CELL_COLORS } from "./constants";
import { Algorithm, type CellState, Heuristic } from "./types";

// Get colors for different cell types
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

// Get display name from Algorithm
export function getAlgorithmDisplayName(algorithm: Algorithm): string {
	switch (algorithm) {
		// case Algorithm.ASTAR:
		// 	return "A*";
		// case Algorithm.IDASTAR:
		// 	return "IDA*";
		case Algorithm.DIJKSTRA:
			return "Dijkstra";
		case Algorithm.BFS:
			return "Breadth-First Search";
		// case Algorithm.DFS:
		// 	return "Depth-First Search";
		// case Algorithm.JUMPPOINT:
		// 	return "Jump Point";
		// case Algorithm.ORTHOGONALJUMPPOINT:
		// 	return "Orthogonal Jump Point";
		// case Algorithm.TRACE:
		//    return "Trace";
	}
}

// Get algorithm type from name
export function getAlgorithmFromDisplayName(name: string): Algorithm {
	switch (name) {
		// case "A*":
		// 	return Algorithm.ASTAR;
		// case "IDA*":
		// 	return Algorithm.IDASTAR;
		case "Dijkstra":
			return Algorithm.DIJKSTRA;
		case "Breadth-First Search":
			return Algorithm.BFS;
		// case "Depth-First Search":
		// 	return Algorithm.DFS;
		// case "Jump Point":
		// 	return Algorithm.JUMPPOINT;
		// case "Orthogonal Jump Point":
		// 	return Algorithm.ORTHOGONALJUMPPOINT;
		// case "Trace":
		// 	return Algorithm.TRACE;

		default:
			return Algorithm.DIJKSTRA;
	}
}

// Get display name from Heuristic
export function getHeuristicDisplayName(heuristic: Heuristic): string {
	switch (heuristic) {
		case Heuristic.MANHATTAN:
			return "Manhattan";
		case Heuristic.EUCLIDEAN:
			return "Euclidean";
		case Heuristic.OCTILE:
			return "Octile";
		case Heuristic.CHEBYSHEV:
			return "Chebyshev";
	}
}

// Get a list of algorithms names
export function getAlgorithmDisplayNames(): string[] {
	return Object.values(Algorithm)
		.filter((v) => typeof v === "number")
		.map((v) => getAlgorithmDisplayName(v as Algorithm));
}

// Mapping to WebAssembly Algorithm
export function toWasmAlgorithm(Module: any, algo: Algorithm) {
	switch (algo) {
		// case Algorithm.ASTAR:
		// 	return Module.Algorithm.ASTAR;
		// case Algorithm.IDASTAR:
		// 	return Module.Algorithm.IDASTAR;
		case Algorithm.DIJKSTRA:
			return Module.Algorithm.DIJKSTRA;
		case Algorithm.BFS:
			return Module.Algorithm.BFS;
		// case Algorithm.DFS:
		// 	return Module.Algorithm.DFS;
		// case Algorithm.JUMPPOINT:
		// 	return Module.Algorithm.JUMPPOINT;
		// case Algorithm.ORTHOGONALJUMPPOINT:
		// return Module.Algorithm.ORTHOGONALJUMPPOINT;
		// case Algorithm.TRACE:
		// 	return Module.Algorithm.TRACE;
	}
}

// Mapping to WebAssembly Heuristic
export function toWasmHeuristic(Module: any, heuristic: Heuristic) {
	switch (heuristic) {
		case Heuristic.MANHATTAN:
			return Module.Heuristic.MANHATTAN;
		case Heuristic.EUCLIDEAN:
			return Module.Heuristic.EUCLIDEAN;
		case Heuristic.OCTILE:
			return Module.Heuristic.OCTILE;
		case Heuristic.CHEBYSHEV:
			return Module.Heuristic.CHEBYSHEV;
	}
}
