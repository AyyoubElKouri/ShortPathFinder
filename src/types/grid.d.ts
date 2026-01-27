/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

/**
 * @type CellState
 * Different states a cell can have in the grid for pathfinding visualization.
 */
export type CellState = "empty" | "start" | "end" | "wall" | "path" | "visited";

/**
 * @interface Cellule
 * Represents a cell in the grid with its coordinates and state.
 */
export interface Cellule {
	id: number;
	x: number;
	y: number;
	state: CellState;
}
