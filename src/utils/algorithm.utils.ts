/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { Algorithm } from "@/types";

/**
 * @function isHeuristic
 * Determines if the given algorithm is a heuristic algorithm.
 */
export function isHeuristic(algorithm: Algorithm): boolean {
	return (
		algorithm === Algorithm.ASTAR //||
		// algorithm === Algorithm.IDASTAR ||
		// algorithm === Algorithm.JUMPPOINT ||
		// algorithm === Algorithm.ORTHOGONALJUMPPOINT
	);
}
