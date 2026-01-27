/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { Heuristic, type PathfindingConfig } from "@/types";

/**
 * @constant DEFAULT_CONFIG
 * The default configuration for pathfinding algorithms.
 */
export const DEFAULT_CONFIG: PathfindingConfig = {
	allowDiagonal: true,
	bidirectional: false,
	dontCrossCorners: false,
	heuristic: Heuristic.EUCLIDEAN,
};
