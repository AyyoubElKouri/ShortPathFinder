/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import type { Cellule } from "@/types";
import { findSpecialCells, isWithinBounds } from "@/utils";

interface UpdateCellResult {
	grid: Cellule[][];
	shouldUpdateHistory: boolean;
}

/**
 * @function updateCell
 *
 * Updates one or multiple cells in the grid based on their current state and available special cells.
 * Returns the modified grid and a flag indicating if history should be updated.
 */
export function updateCell(grid: Cellule[][], cells: Cellule | Cellule[]): UpdateCellResult {
	const cellsArray = Array.isArray(cells) ? cells : [cells];

	for (const cell of cellsArray) {
		const { x, y } = cell;

		// Check bounds
		if (!isWithinBounds(x, y, grid)) {
			continue;
		}

		const currentCell = grid[y][x];
		const { start, end } = findSpecialCells(grid);
		const newState = determineNewCellState(currentCell, start, end, cell.state);

		// Remove other special cells if needed
		if (newState === "start") {
			removeOtherSpecialCells(grid, "start", x, y);
		} else if (newState === "end") {
			removeOtherSpecialCells(grid, "end", x, y);
		}

		grid[y][x].state = newState;
	}

	return {
		grid,
		shouldUpdateHistory: true,
	};
}

/**
 * @helper
 * Removes other special cells (start or end) from the grid, except for the specified coordinates.
 */
function removeOtherSpecialCells(
	grid: Cellule[][],
	state: "start" | "end",
	exceptX: number,
	exceptY: number,
): void {
	for (const row of grid) {
		for (const cell of row) {
			if (cell.state === state && (cell.x !== exceptX || cell.y !== exceptY)) {
				cell.state = "empty";
			}
		}
	}
}

/**
 * @helper
 * Determines the new state for a cell based on its current state and the presence of start/end cells.
 */
function determineNewCellState(
	currentCell: Cellule,
	start: Cellule | null,
	end: Cellule | null,
	passedState?: Cellule["state"],
): Cellule["state"] {
	if (passedState === "path" || passedState === "visited") {
		return passedState;
	}

	if (currentCell.state === "start" || currentCell.state === "end") {
		return "empty";
	}

	if (!start) {
		return "start";
	}

	if (!end) {
		return "end";
	}

	return currentCell.state === "wall" ? "empty" : "wall";
}
