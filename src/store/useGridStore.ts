/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { GRID_COLS, GRID_ROWS } from "@/lib/constants";

export interface Cellule {
	x: number;
	y: number;
	type: "empty" | "wall" | "start" | "end" | "path" | "visited";
}

export interface GridStore {
	cellSize: number;
	rows: number;
	cols: number;
	cellules: Cellule[][];
	history: Cellule[][][];
	future: Cellule[][][];
	tempCellules?: Cellule[];

	setCellSize: (size: number) => void;
	setRows: (rows: number) => void;
	setCols: (cols: number) => void;
	updateCell: (cells: Cellule | Cellule[], commitHistory?: boolean) => void;
	clearWalls: () => void;
	clearPath: () => void;
	resetGrid: () => void;
	undo: () => void;
	redo: () => void;
}

export const useGridStore = create<GridStore>()(
	devtools(
		(set, get) => ({
			// Initial state
			cellSize: 20,
			rows: GRID_ROWS,
			cols: GRID_COLS,
			cellules: createInitialGrid(GRID_ROWS, GRID_COLS),
			history: [createInitialGrid(GRID_ROWS, GRID_COLS)],
			future: [],

			// Actions
			setCellSize: (size: number) => {
				set({ cellSize: size });
			},

			setRows: (rows: number) => {
				const { cols } = get();
				set({
					rows,
					cellules: createInitialGrid(rows, cols),
					history: [],
					future: [],
				});
			},

			setCols: (cols: number) => {
				const { rows } = get();
				set({
					cols,
					cellules: createInitialGrid(rows, cols),
					history: [],
					future: [],
				});
			},

			updateCell: (cells: Cellule | Cellule[], commitHistory?: boolean) => {
				const { cellules, history, tempCellules } = get();

				// Handle drag finalization
				if (shouldFinalizeDrag(cells, commitHistory)) {
					handleDragFinalization(tempCellules, set);
					return;
				}

				const cellsArray = Array.isArray(cells) ? cells : [cells];

				if (cellsArray.length === 0) {
					return;
				}

				// Process cell updates
				const newGrid = deepCopyGrid(cellules);
				const getSpecials = () => findSpecialCells(newGrid);

				cellsArray.forEach((cell) => {
					processCellUpdate(cell, newGrid, getSpecials);
				});

				// Handle different commit modes
				if (commitHistory === false) {
					if (isFirstDragCell(tempCellules)) {
						handleFirstDragCell(
							cellsArray,
							newGrid,
							cellules,
							history,
							tempCellules,
							set,
						);
					} else {
						handleSubsequentDragCell(
							cellsArray,
							newGrid,
							tempCellules,
							set,
						);
					}
					return;
				}

				// Immediate commit or default behavior
				handleImmediateCommit(
					newGrid,
					cellules,
					history,
					commitHistory,
					tempCellules,
					set,
				);
			},

			clearWalls: () => {
				const { cellules, history } = get();

				const newGrid = deepCopyGrid(cellules);
				let modified = false;

				for (const row of newGrid) {
					for (const cell of row) {
						if (cell.type === "wall") {
							cell.type = "empty";
							modified = true;
						}
					}
				}

				if (!modified) return;

				set({
					cellules: newGrid,
					history: [...history, deepCopyGrid(cellules)],
					future: [],
				});
			},

			clearPath: () => {
				const { cellules, history } = get();

				const newGrid = deepCopyGrid(cellules);
				let modified = false;

				for (const row of newGrid) {
					for (const cell of row) {
						if (cell.type === "path" || cell.type === "visited") {
							cell.type = "empty";
							modified = true;
						}
					}
				}

				if (!modified) return;

				set({
					cellules: newGrid,
					history: [...history, deepCopyGrid(cellules)],
					future: [],
				});
			},

			undo: () => {
				const { history, cellules, future } = get();

				if (history.length === 0) return;

				const previousState = history[history.length - 1];
				const newHistory = history.slice(0, -1);
				const newFuture = [deepCopyGrid(cellules), ...future];

				set({
					cellules: previousState,
					history: newHistory,
					future: newFuture,
				});
			},

			resetGrid: () => {
				const { cellules, history } = get();

				const newGrid = deepCopyGrid(cellules);

				for (const row of newGrid) {
					for (const cell of row) {
						cell.type = "empty";
					}
				}

				set({
					cellules: newGrid,
					history: [...history, deepCopyGrid(cellules)],
					future: [],
				});
			},

			redo: () => {
				const { future, cellules, history } = get();

				if (future.length === 0) return;

				const nextState = future[0];
				const newFuture = future.slice(1);
				const newHistory = [...history, deepCopyGrid(cellules)];

				set({
					cellules: nextState,
					history: newHistory,
					future: newFuture,
				});
			},
		}),
		{
			name: "grid-store",
		},
	),
);

export default useGridStore;

// --------------------------------------- Internal Helpers ----------------------------------------

function createInitialGrid(rows: number, cols: number): Cellule[][] {
	return Array.from({ length: rows }, (_, y) =>
		Array.from({ length: cols }, (_, x) => ({
			x,
			y,
			type: "empty" as const,
		})),
	);
}

function deepCopyGrid(grid: Cellule[][]): Cellule[][] {
	return grid.map((row) => row.map((cell) => ({ ...cell })));
}

function findSpecialCells(grid: Cellule[][]): {
	start: Cellule | null;
	end: Cellule | null;
} {
	let start: Cellule | null = null;
	let end: Cellule | null = null;

	for (const row of grid) {
		for (const cell of row) {
			if (cell.type === "start") start = cell;
			if (cell.type === "end") end = cell;
		}
	}

	return { start, end };
}

function isWithinBounds(x: number, y: number, grid: Cellule[][]): boolean {
	return y >= 0 && y < grid.length && x >= 0 && x < grid[0].length;
}

function removeOtherSpecialCells(
	grid: Cellule[][],
	type: "start" | "end",
	exceptX: number,
	exceptY: number,
): void {
	for (const row of grid) {
		for (const c of row) {
			if (c.type === type && (c.x !== exceptX || c.y !== exceptY)) {
				c.type = "empty";
			}
		}
	}
}

function determineNewCellType(
	currentCell: Cellule,
	start: Cellule | null,
	end: Cellule | null,
	passedType?: Cellule["type"],
): Cellule["type"] {
	if (passedType === "path" || passedType === "visited") {
		return passedType;
	}

	if (currentCell.type === "start" || currentCell.type === "end") {
		return "empty";
	}

	if (!start) {
		return "start";
	}

	if (!end) {
		return "end";
	}

	return currentCell.type === "wall" ? "empty" : "wall";
}

function processCellUpdate(
	cell: Cellule,
	grid: Cellule[][],
	getSpecials: () => { start: Cellule | null; end: Cellule | null },
): void {
	const { x, y } = cell;

	if (!isWithinBounds(x, y, grid)) {
		return;
	}

	const currentCell = grid[y][x];
	const { start, end } = getSpecials();
	const newType = determineNewCellType(currentCell, start, end, cell.type);

	if (newType === "start") {
		removeOtherSpecialCells(grid, "start", x, y);
	} else if (newType === "end") {
		removeOtherSpecialCells(grid, "end", x, y);
	}

	grid[y][x].type = newType;
}

function shouldFinalizeDrag(
	cells: Cellule | Cellule[],
	commitHistory?: boolean,
): boolean {
	return commitHistory === true && Array.isArray(cells) && cells.length === 0;
}

function isFirstDragCell(tempCellules?: Cellule[]): boolean {
	const currentTemp = tempCellules || [];
	return currentTemp.length === 0;
}

function handleDragFinalization(
	tempCellules: Cellule[] | undefined,
	set: (partial: Partial<GridStore>) => void,
): void {
	if (tempCellules && tempCellules.length > 0) {
		set({
			future: [],
			tempCellules: undefined,
		});
	}
}

function handleFirstDragCell(
	cellsArray: Cellule[],
	newGrid: Cellule[][],
	cellules: Cellule[][],
	history: Cellule[][][],
	tempCellules: Cellule[] | undefined,
	set: (partial: Partial<GridStore>) => void,
): void {
	const currentTemp = tempCellules || [];
	set({
		cellules: newGrid,
		tempCellules: [...currentTemp, ...cellsArray],
		history: [...history, deepCopyGrid(cellules)],
		future: [],
	});
}

function handleSubsequentDragCell(
	cellsArray: Cellule[],
	newGrid: Cellule[][],
	tempCellules: Cellule[] | undefined,
	set: (partial: Partial<GridStore>) => void,
): void {
	const currentTemp = tempCellules || [];
	set({
		cellules: newGrid,
		tempCellules: [...currentTemp, ...cellsArray],
	});
}

function handleImmediateCommit(
	newGrid: Cellule[][],
	cellules: Cellule[][],
	history: Cellule[][][],
	commitHistory: boolean | undefined,
	tempCellules: Cellule[] | undefined,
	set: (partial: Partial<GridStore>) => void,
): void {
	set({
		cellules: newGrid,
		history: [...history, deepCopyGrid(cellules)],
		future: [],
		tempCellules: commitHistory === true ? undefined : tempCellules,
	});
}
