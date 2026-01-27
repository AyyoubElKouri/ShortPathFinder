/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { CELL_COLORS } from "@/constants/grid.constants";
import type { CellState, Cellule } from "@/types/grid";

/**
 * @function getCellColor
 * Returns the color associated with a given cell state.
 */
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
	}
}

/**
 * @function isWithinBounds
 * Checks if the given coordinates are within the bounds of the grid.
 */
export function isWithinBounds(x: number, y: number, grid: Cellule[][]): boolean {
	return y >= 0 && y < grid.length && x >= 0 && x < grid[0].length;
}

/**
 * @function findSpecialCells
 * Finds the special cells (start and end) in the grid.
 */
export function findSpecialCells(grid: Cellule[][]): {
	start: Cellule | null;
	end: Cellule | null;
} {
	let start: Cellule | null = null;
	let end: Cellule | null = null;

	for (const row of grid) {
		for (const cell of row) {
			if (cell.state === "start") start = cell;
			if (cell.state === "end") end = cell;
		}
	}

	return { start, end };
}

/**
 * @function createInitialGrid
 * Creates an initial grid with the specified number of rows and columns.
 * All cells are initialized to the "empty" state.
 */
export function createInitialGrid(rows: number, cols: number): Cellule[][] {
	return Array.from({ length: rows }, (_, y) =>
		Array.from({ length: cols }, (_, x) => ({
			id: y * cols + x,
			x,
			y,
			state: "empty" as const,
		})),
	);
}

/**
 * @function deepCopyGrid
 * Creates a deep copy of the given grid.
 */
export function deepCopyGrid(grid: Cellule[][]): Cellule[][] {
	return grid.map((row) => row.map((cell) => ({ ...cell })));
}
