/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import type { Cellule } from "@/types";

/**
 * @function clearWalls
 * Clears all walls from the grid, converting them to empty cells.
 * Returns the modified grid and a boolean indicating if any changes were made.
 *
 * @note Semantically, path and visited cells are also cleared when clearing walls.
 */
export function clearWalls(grid: Cellule[][]): { grid: Cellule[][]; modified: boolean } {
	let modified = false;

	for (const row of grid) {
		for (const cell of row) {
			if (cell.state === "wall" || cell.state === "path" || cell.state === "visited") {
				cell.state = "empty";
				modified = true;
			}
		}
	}

	return { grid, modified };
}

/**
 * @function clearPath
 * Clears all path and visited cells from the grid, converting them to empty cells.
 * Returns the modified grid and a boolean indicating if any changes were made.
 */
export function clearPath(grid: Cellule[][]): { grid: Cellule[][]; modified: boolean } {
	let modified = false;

	for (const row of grid) {
		for (const cell of row) {
			if (cell.state === "path" || cell.state === "visited") {
				cell.state = "empty";
				modified = true;
			}
		}
	}

	return { grid, modified };
}

/**
 * @function resetGrid
 * Resets the entire grid, converting all cells to empty state.
 * Returns the modified grid.
 */
export function resetGrid(grid: Cellule[][]): Cellule[][] {
	for (const row of grid) {
		for (const cell of row) {
			cell.state = "empty";
		}
	}

	return grid;
}

/**
 * @function prepareGrid
 * Prepares the grid for a new pathfinding run by clearing any existing path or visited cells.
 * Returns the modified grid and a boolean indicating if any changes were made.
 */
export function prepareGrid(grid: Cellule[][]): { grid: Cellule[][]; modified: boolean } {
	let modified = false;

	for (const row of grid) {
		for (const cell of row) {
			if (cell.state === "path" || cell.state === "visited") {
				cell.state = "empty";
				modified = true;
			}
		}
	}

	return { grid, modified };
}
