/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { CELL_SIZE, GRID_COLS, GRID_ROWS } from "@/lib/constants";

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
	generateMaze: () => void;
	readyToRun: () => void;
	undo: () => void;
	redo: () => void;
}

export const useGridStore = create<GridStore>()(
	devtools(
		(set, get) => ({
			// Initial state
			cellSize: CELL_SIZE,
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

			generateMaze: () => {
				const { cellules, history, rows, cols } = get();

				// Save current state to history
				const newHistory = [...history, deepCopyGrid(cellules)];

				// Create new grid and preserve start/end positions
				const newGrid = deepCopyGrid(cellules);
				const { start, end } = findSpecialCells(newGrid);

				// Initialize all cells as walls (except start/end)
				for (const row of newGrid) {
					for (const cell of row) {
						if (cell.type !== "start" && cell.type !== "end") {
							cell.type = "wall";
						}
					}
				}

				// Use current time as seed for random generation
				const seed = Date.now();
				let randomState = seed;

				// Seeded random number generator
				const seededRandom = () => {
					randomState = (randomState * 9301 + 49297) % 233280;
					return randomState / 233280;
				};

				// Shuffle array helper
				const shuffle = <T>(array: T[]): T[] => {
					const arr = [...array];
					for (let i = arr.length - 1; i > 0; i--) {
						const j = Math.floor(seededRandom() * (i + 1));
						[arr[i], arr[j]] = [arr[j], arr[i]];
					}
					return arr;
				};

				// Recursive Backtracking Algorithm
				const visited: boolean[][] = Array.from({ length: rows }, () =>
					Array(cols).fill(false),
				);

				const directions = [
					{ dx: 0, dy: -2, name: "up" }, // up (skip one cell)
					{ dx: 2, dy: 0, name: "right" }, // right
					{ dx: 0, dy: 2, name: "down" }, // down
					{ dx: -2, dy: 0, name: "left" }, // left
				];

				const carvePassage = (x: number, y: number) => {
					visited[y][x] = true;

					// Mark current cell as passage
					if (
						newGrid[y][x].type !== "start" &&
						newGrid[y][x].type !== "end"
					) {
						newGrid[y][x].type = "empty";
					}

					// Randomize direction order
					const dirs = shuffle(directions);

					for (const dir of dirs) {
						const nx = x + dir.dx;
						const ny = y + dir.dy;

						// Check if new position is valid
						if (
							nx >= 0 &&
							nx < cols &&
							ny >= 0 &&
							ny < rows &&
							!visited[ny][nx]
						) {
							// Carve wall between current and next cell
							const wallX = x + dir.dx / 2;
							const wallY = y + dir.dy / 2;

							if (
								newGrid[wallY][wallX].type !== "start" &&
								newGrid[wallY][wallX].type !== "end"
							) {
								newGrid[wallY][wallX].type = "empty";
							}

							// Recursively carve from next cell
							carvePassage(nx, ny);
						}
					}
				};

				// Start carving from a valid position
				let startX = start ? start.x : 1;
				let startY = start ? start.y : 1;

				// Ensure start position is odd (for proper maze generation)
				if (startX % 2 === 0) startX = Math.max(1, startX - 1);
				if (startY % 2 === 0) startY = Math.max(1, startY - 1);

				// Generate the maze
				carvePassage(startX, startY);

				// Make sure start and end positions are passages
				if (start) {
					newGrid[start.y][start.x].type = "start";
					// Clear around start if needed
					for (const dir of [
						{ dx: 0, dy: -1 },
						{ dx: 1, dy: 0 },
						{ dx: 0, dy: 1 },
						{ dx: -1, dy: 0 },
					]) {
						const nx = start.x + dir.dx;
						const ny = start.y + dir.dy;
						if (
							isWithinBounds(nx, ny, newGrid) &&
							newGrid[ny][nx].type === "wall" &&
							seededRandom() > 0.5
						) {
							newGrid[ny][nx].type = "empty";
						}
					}
				}

				if (end) {
					newGrid[end.y][end.x].type = "end";
					// Clear around end if needed
					for (const dir of [
						{ dx: 0, dy: -1 },
						{ dx: 1, dy: 0 },
						{ dx: 0, dy: 1 },
						{ dx: -1, dy: 0 },
					]) {
						const nx = end.x + dir.dx;
						const ny = end.y + dir.dy;
						if (
							isWithinBounds(nx, ny, newGrid) &&
							newGrid[ny][nx].type === "wall" &&
							seededRandom() > 0.5
						) {
							newGrid[ny][nx].type = "empty";
						}
					}
				}

				// Ensure connectivity between start and end
				if (start && end) {
					ensurePathExists(newGrid, start, end, seededRandom);
				}

				// Add some random openings to make it less perfect (optional)
				const openingChance = 0.1; // 10% chance to remove some walls
				for (let y = 1; y < rows - 1; y++) {
					for (let x = 1; x < cols - 1; x++) {
						if (
							newGrid[y][x].type === "wall" &&
							seededRandom() < openingChance
						) {
							// Check if removing this wall doesn't create 2x2 empty spaces
							let emptyNeighbors = 0;
							for (const dir of [
								{ dx: 0, dy: -1 },
								{ dx: 1, dy: 0 },
								{ dx: 0, dy: 1 },
								{ dx: -1, dy: 0 },
							]) {
								const nx = x + dir.dx;
								const ny = y + dir.dy;
								if (
									isWithinBounds(nx, ny, newGrid) &&
									newGrid[ny][nx].type === "empty"
								) {
									emptyNeighbors++;
								}
							}

							// Only remove wall if it has 2 or fewer empty neighbors
							if (emptyNeighbors <= 2) {
								newGrid[y][x].type = "empty";
							}
						}
					}
				}

				set({
					cellules: newGrid,
					history: newHistory,
					future: [],
				});
			},

			readyToRun: () => {
				
				const { cellules } = get();

				// Check if the grid is valid (contains start, end cells)
				const {start, end} = findSpecialCells(cellules);
				if(!start || !end) throw new Error("Start or End cell are not provided");

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

				// Only update if something was actually cleared
				if (modified) {
					set({
						cellules: newGrid,
					});
				}
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

function ensurePathExists(
	grid: Cellule[][],
	start: Cellule,
	end: Cellule,
	random: () => number,
): void {
	// Simple BFS to check if path exists
	const queue: { x: number; y: number }[] = [{ x: start.x, y: start.y }];
	const visited: boolean[][] = Array.from({ length: grid.length }, () =>
		Array(grid[0].length).fill(false),
	);
	visited[start.y][start.x] = true;

	const directions = [
		{ dx: 0, dy: -1 },
		{ dx: 1, dy: 0 },
		{ dx: 0, dy: 1 },
		{ dx: -1, dy: 0 },
	];

	let pathExists = false;

	while (queue.length > 0) {
		const current = queue.shift()!;

		if (current.x === end.x && current.y === end.y) {
			pathExists = true;
			break;
		}

		for (const dir of directions) {
			const nx = current.x + dir.dx;
			const ny = current.y + dir.dy;

			if (
				isWithinBounds(nx, ny, grid) &&
				!visited[ny][nx] &&
				grid[ny][nx].type !== "wall"
			) {
				visited[ny][nx] = true;
				queue.push({ x: nx, y: ny });
			}
		}
	}

	// If no path exists, carve one
	if (!pathExists) {
		let cx = start.x;
		let cy = start.y;

		while (cx !== end.x || cy !== end.y) {
			// Move towards end
			if (cx < end.x && random() > 0.3) cx++;
			else if (cx > end.x && random() > 0.3) cx--;
			else if (cy < end.y) cy++;
			else if (cy > end.y) cy--;
			else if (cx < end.x) cx++;
			else if (cx > end.x) cx--;

			// Clear the cell if it's a wall
			if (grid[cy][cx].type === "wall") {
				grid[cy][cx].type = "empty";
			}
		}
	}
}
