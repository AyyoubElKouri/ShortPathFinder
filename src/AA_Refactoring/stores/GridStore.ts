/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { CELL_SIZE } from "@/lib/constants";
import type { Cellule } from "@/lib/types";

interface GridStore {
	/**
	 * Size of each grid cell in pixels
	 */
	cellSize: number;

	/**
	 * Number of rows in the grid
	 */
	rows: number;

	/**
	 * Number of columns in the grid
	 */
	cols: number;

	/**
	 * 2D array representing all cells in the grid
	 */
	cellules: Cellule[][];

	/**
	 * Stack of previous grid states for undo operations
	 */
	history: Cellule[][][];

	/**
	 * Stack of future grid states for redo operations
	 */
	future: Cellule[][][];

	/**
	 * Temporary cells storage during drag operations
	 */
	tempCellules?: Cellule[];

	/**
	 * Indicates if a pathfinding algorithm is currently running
	 */
	isRunning: boolean;

	/**
	 * Updates the cell size for grid rendering
	 *
	 * @param size - New cell size in pixels
	 */
	setCellSize: (size: number) => void;

	/**
	 * Updates the number of rows and resets the grid
	 *
	 * @param rows - New number of rows
	 */
	setRows: (rows: number) => void;

	/**
	 * Updates the number of columns and resets the grid
	 *
	 * @param cols - New number of columns
	 */
	setCols: (cols: number) => void;

	/**
	 * Updates one or multiple cells in the grid
	 *
	 * @param cells - Single cell or array of cells to update
	 * @param commitHistory - Whether to immediately commit changes to history (default: true)
	 */
	updateCell: (cells: Cellule | Cellule[], commitHistory?: boolean) => void;

	/**
	 * Removes all wall cells while preserving start and end cells
	 */
	clearWalls: () => void;

	/**
	 * Clears all path and visited cells while preserving walls and special cells
	 */
	clearPath: () => void;

	/**
	 * Resets the entire grid to empty state
	 */
	resetGrid: () => void;

	/**
	 * Generates a random maze using recursive backtracking algorithm
	 */
	generateMaze: () => void;

	/**
	 * Prepares the grid for pathfinding execution
	 *
	 * @throws GridValidationError - If start or end cells are not present
	 */
	readyToRun: () => void;

	/**
	 * Updates the running state of pathfinding algorithms
	 *
	 * @param running - Boolean indicating if algorithm is running
	 */
	setIsRunning: (running: boolean) => void;

	/**
	 * Reverts the grid to the previous state from history
	 */
	undo: () => void;

	/**
	 * Reapplies a previously undone change from future stack
	 */
	redo: () => void;
}

/**
 * @hook useGridStore
 * @brief Manages grid state for pathfinding visualization
 * @description Central store for grid operations including cell updates, maze generation,
 *              history management, and pathfinding preparation.
 *
 * @return GridStore - Object containing grid state and all grid manipulation functions
 * 
 * @dependencies 
 *  - zustand: For state management
 *  - zustand/middleware/devtools: For development tooling
 *  - Cellule type: Grid cell structure definition
 *  - CELL_SIZE constant: Default grid cell size
 * 
 * @example
 * ```tsx
 * const { 
 *   cellules, 
 *   updateCell, 
 *   generateMaze, 
 *   clearPath,
 *   undo, 
 *   redo 
 * } = useGridStore();
 * ```
 * 
 * @throws
 *  - GridValidationError - When readyToRun is called without start or end cells
 * 
 */
export const useGridStore = create<GridStore>()(
	devtools(
		(set, get) => ({
			cellSize: CELL_SIZE,
			rows: 30,
			cols: 50,
			cellules: createInitialGrid(30, 50),
			history: [createInitialGrid(30, 50)],
			future: [],
			isRunning: false,

			/** 
			 * Updates cell size and triggers grid re-render
			 */
			setCellSize: (size: number) => {
				set({ cellSize: size });
			},

			/** 
			 * Updates rows count and resets grid with new dimensions
			 */
			setRows: (rows: number) => {
				const { cols } = get();
				set({
					rows,
					cellules: createInitialGrid(rows, cols),
					history: [],
					future: [],
				});
			},

			/** 
			 * Updates columns count and resets grid with new dimensions
			 */
			setCols: (cols: number) => {
				const { rows } = get();
				set({
					cols,
					cellules: createInitialGrid(rows, cols),
					history: [],
					future: [],
				});
			},

			/** 
			 * Controls the running state of pathfinding algorithms
			 */
			setIsRunning: (running: boolean) => {
				set({ isRunning: running });
			},

			/** 
			 * Core cell update handler for single and drag operations
			 */
			updateCell: (cells: Cellule | Cellule[], commitHistory?: boolean) => {
				const { cellules, history, tempCellules } = get();
				const cellsArray = Array.isArray(cells) ? cells : [cells];

				// Handle drag finalization when called with empty array
				if (commitHistory === true && cellsArray.length === 0) {
					if (tempCellules && tempCellules.length > 0) {
						set({ future: [], tempCellules: undefined });
					}
					return;
				}

				// Skip if no cells to update
				if (cellsArray.length === 0) return;

				// Process cell updates on a copy of the grid
				const gridCopy = createDeepGridCopy(cellules);
				const getSpecialCells = () => findSpecialCells(gridCopy);

				cellsArray.forEach(cell => {
					updateSingleCell(cell, gridCopy, getSpecialCells);
				});

				// Handle drag operations without committing to history
				if (commitHistory === false) {
					handleDragUpdate(cellsArray, gridCopy, cellules, history, tempCellules, set);
					return;
				}

				// Handle immediate commit to history (single click or drag finalization)
				handleHistoryCommit(gridCopy, cellules, history, commitHistory, tempCellules, set);
			},

			/** 
			 * Removes all wall cells while preserving start and end positions
			 */
			clearWalls: () => {
				const { cellules, history } = get();
				const gridCopy = createDeepGridCopy(cellules);
				let hasModified = false;

				// Clear all wall cells
				for (const row of gridCopy) {
					for (const cell of row) {
						if (cell.state === "wall") {
							cell.state = "empty";
							hasModified = true;
						}
					}
				}

				// Only update state if changes were made
				if (!hasModified) return;

				set({
					cellules: gridCopy,
					history: [...history, createDeepGridCopy(cellules)],
					future: [],
				});
			},

			/** 
			 * Clears pathfinding results for new algorithm runs
			 */
			clearPath: () => {
				const { cellules, history } = get();
				const gridCopy = createDeepGridCopy(cellules);
				let hasModified = false;

				// Clear path and visited cells
				for (const row of gridCopy) {
					for (const cell of row) {
						if (cell.state === "path" || cell.state === "visited") {
							cell.state = "empty";
							hasModified = true;
						}
					}
				}

				// Only update state if changes were made
				if (!hasModified) return;

				set({
					cellules: gridCopy,
					history: [...history, createDeepGridCopy(cellules)],
					future: [],
				});
			},

			/** 
			 * Generates a random maze using recursive backtracking
			 */
			generateMaze: () => {
				const { cellules, history, rows, cols } = get();
				const mazeGenerator = new MazeGenerator(rows, cols, cellules);
				const newGrid = mazeGenerator.generate();

				set({
					cellules: newGrid,
					history: [...history, createDeepGridCopy(cellules)],
					future: [],
				});
			},

			/** 
			 * Validates grid and clears previous pathfinding results
			 *
			 * @throws GridValidationError - If start or end cells are missing
			 */
			readyToRun: () => {
				const { cellules } = get();
				const { start, end } = findSpecialCells(cellules);

				// Validate grid contains both start and end
				if (!start || !end) {
					throw new Error("GridValidationError: Start or End cell are not provided");
				}

				// Clear any existing pathfinding results
				const gridCopy = createDeepGridCopy(cellules);
				let hasModified = false;

				for (const row of gridCopy) {
					for (const cell of row) {
						if (cell.state === "path" || cell.state === "visited") {
							cell.state = "empty";
							hasModified = true;
						}
					}
				}

				// Update state only if something was cleared
				if (hasModified) {
					set({ cellules: gridCopy });
				}
			},

			/** 
			 * Resets the entire grid to empty state
			 */
			resetGrid: () => {
				const { cellules, history } = get();
				const gridCopy = createDeepGridCopy(cellules);

				// Set all cells to empty
				for (const row of gridCopy) {
					for (const cell of row) {
						cell.state = "empty";
					}
				}

				set({
					cellules: gridCopy,
					history: [...history, createDeepGridCopy(cellules)],
					future: [],
				});
			},

			/** 
			 * Undoes the last grid modification
			 */
			undo: () => {
				const { history, cellules, future } = get();
				if (history.length === 0) return;

				const previousState = history[history.length - 1];
				const newHistory = history.slice(0, -1);
				const newFuture = [createDeepGridCopy(cellules), ...future];

				set({
					cellules: previousState,
					history: newHistory,
					future: newFuture,
				});
			},

			/** 
			 * Redoes a previously undone modification
			 */
			redo: () => {
				const { future, cellules, history } = get();
				if (future.length === 0) return;

				const nextState = future[0];
				const newFuture = future.slice(1);
				const newHistory = [...history, createDeepGridCopy(cellules)];

				set({
					cellules: nextState,
					history: newHistory,
					future: newFuture,
				});
			},
		}),
		{ name: "grid-store" }
	)
);

/** 
 * Creates an initial grid with specified dimensions
 */
function createInitialGrid(rows: number, cols: number): Cellule[][] {
	return Array.from({ length: rows }, (_, y) =>
		Array.from({ length: cols }, (_, x) => ({
			x,
			y,
			state: "empty" as const,
		}))
	);
}

/** 
 * Creates a deep copy of a grid to ensure state immutability
 */
function createDeepGridCopy(grid: Cellule[][]): Cellule[][] {
	return grid.map(row => row.map(cell => ({ ...cell })));
}

/** 
 * Finds start and end cells in the grid
 */
function findSpecialCells(grid: Cellule[][]): {
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
 * Checks if coordinates are within grid bounds
 */
function isWithinGridBounds(x: number, y: number, grid: Cellule[][]): boolean {
	return y >= 0 && y < grid.length && x >= 0 && x < grid[0].length;
}

/** 
 * Determines the new state for a cell based on current state and context
 */
function determineCellState(
	currentCell: Cellule,
	start: Cellule | null,
	end: Cellule | null,
	forcedState?: Cellule["state"]
): Cellule["state"] {
	// Allow forced states for pathfinding results
	if (forcedState === "path" || forcedState === "visited") {
		return forcedState;
	}

	// Clicking on start/end removes them
	if (currentCell.state === "start" || currentCell.state === "end") {
		return "empty";
	}

	// Place start if none exists
	if (!start) return "start";

	// Place end if none exists
	if (!end) return "end";

	// Default: toggle between wall and empty
	return currentCell.state === "wall" ? "empty" : "wall";
}

/** 
 * Removes other special cells of the same type to ensure uniqueness
 */
function removeDuplicateSpecialCells(
	grid: Cellule[][],
	state: "start" | "end",
	exceptX: number,
	exceptY: number
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
 * Updates a single cell in the grid
 */
function updateSingleCell(
	cell: Cellule,
	grid: Cellule[][],
	getSpecialCells: () => { start: Cellule | null; end: Cellule | null }
): void {
	const { x, y } = cell;
	if (!isWithinGridBounds(x, y, grid)) return;

	const currentCell = grid[y][x];
	const { start, end } = getSpecialCells();
	const newState = determineCellState(currentCell, start, end, cell.state);

	// Ensure only one start and one end cell exist
	if (newState === "start") {
		removeDuplicateSpecialCells(grid, "start", x, y);
	} else if (newState === "end") {
		removeDuplicateSpecialCells(grid, "end", x, y);
	}

	grid[y][x].state = newState;
}

/** 
 * Handles cell updates during drag operations
 */
function handleDragUpdate(
	cellsArray: Cellule[],
	newGrid: Cellule[][],
	originalGrid: Cellule[][],
	history: Cellule[][][],
	tempCellules: Cellule[] | undefined,
	set: (partial: Partial<GridStore>) => void
): void {
	const currentTemp = tempCellules || [];

	// First cell in drag: save to history
	if (currentTemp.length === 0) {
		set({
			cellules: newGrid,
			tempCellules: [...currentTemp, ...cellsArray],
			history: [...history, createDeepGridCopy(originalGrid)],
			future: [],
		});
		return;
	}

	// Subsequent cells in drag: only update temp storage
	set({
		cellules: newGrid,
		tempCellules: [...currentTemp, ...cellsArray],
	});
}

/** 
 * Handles immediate commit of cell changes to history
 */
function handleHistoryCommit(
	newGrid: Cellule[][],
	originalGrid: Cellule[][],
	history: Cellule[][][],
	commitHistory: boolean | undefined,
	tempCellules: Cellule[] | undefined,
	set: (partial: Partial<GridStore>) => void
): void {
	set({
		cellules: newGrid,
		history: [...history, createDeepGridCopy(originalGrid)],
		future: [],
		tempCellules: commitHistory === true ? undefined : tempCellules,
	});
}

/** 
 * Maze generation class using recursive backtracking algorithm
 */
class MazeGenerator {
	private rows: number;
	private cols: number;
	private grid: Cellule[][];
	private randomState: number;
	private start?: { x: number; y: number };
	private end?: { x: number; y: number };

	constructor(rows: number, cols: number, originalGrid: Cellule[][]) {
		this.rows = rows;
		this.cols = cols;
		this.grid = createDeepGridCopy(originalGrid);
		this.randomState = Date.now();

		// Extract and preserve start/end positions
		const { start, end } = findSpecialCells(originalGrid);
		if (start) this.start = { x: start.x, y: start.y };
		if (end) this.end = { x: end.x, y: end.y };

		// Initialize all cells as walls (except start/end)
		this.initializeGrid();
	}

	/** 
	 * Initializes grid with walls and preserves special cells
	 */
	private initializeGrid(): void {
		for (const row of this.grid) {
			for (const cell of row) {
				if (cell.state !== "start" && cell.state !== "end") {
					cell.state = "wall";
				}
			}
		}
	}

	/** 
	 * Seeded random number generator for reproducible mazes
	 */
	private seededRandom(): number {
		this.randomState = (this.randomState * 9301 + 49297) % 233280;
		return this.randomState / 233280;
	}

	/** 
	 * Shuffles array using seeded random
	 */
	private shuffleArray<T>(array: T[]): T[] {
		const arr = [...array];
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(this.seededRandom() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	/** 
	 * Generates the maze using recursive backtracking
	 */
	generate(): Cellule[][] {
		const directions = [
			{ dx: 0, dy: -2 },
			{ dx: 2, dy: 0 },
			{ dx: 0, dy: 2 },
			{ dx: -2, dy: 0 },
		];

		const visited: boolean[][] = Array.from({ length: this.rows }, () =>
			Array(this.cols).fill(false)
		);

		// Start carving from a valid position
		let startX = this.start?.x ?? 1;
		let startY = this.start?.y ?? 1;

		// Ensure odd starting position for proper maze generation
		if (startX % 2 === 0) startX = Math.max(1, startX - 1);
		if (startY % 2 === 0) startY = Math.max(1, startY - 1);

		// Recursively carve passages
		this.carvePassages(startX, startY, visited, directions);

		// Ensure start and end are accessible
		this.ensureSpecialCellAccessibility();

		// Ensure connectivity between start and end
		if (this.start && this.end) {
			this.ensurePathConnectivity();
		}

		// Add random openings for less perfect mazes
		this.addRandomOpenings();

		return this.grid;
	}

	/** 
	 * Recursively carves passages through the maze
	 */
	private carvePassages(
		x: number,
		y: number,
		visited: boolean[][],
		directions: Array<{ dx: number; dy: number }>
	): void {
		visited[y][x] = true;

		// Mark current cell as passage (unless it's special)
		if (this.grid[y][x].state !== "start" && this.grid[y][x].state !== "end") {
			this.grid[y][x].state = "empty";
		}

		// Randomize direction order
		const shuffledDirs = this.shuffleArray(directions);

		for (const dir of shuffledDirs) {
			const nx = x + dir.dx;
			const ny = y + dir.dy;

			// Check if new position is valid and unvisited
			if (
				nx >= 0 && nx < this.cols &&
				ny >= 0 && ny < this.rows &&
				!visited[ny][nx]
			) {
				// Carve wall between current and next cell
				const wallX = x + dir.dx / 2;
				const wallY = y + dir.dy / 2;

				if (
					this.grid[wallY][wallX].state !== "start" &&
					this.grid[wallY][wallX].state !== "end"
				) {
					this.grid[wallY][wallX].state = "empty";
				}

				// Recursively carve from next cell
				this.carvePassages(nx, ny, visited, directions);
			}
		}
	}

	/** 
	 * Clears walls around start and end for better accessibility
	 */
	private ensureSpecialCellAccessibility(): void {
		const clearNeighbors = (x: number, y: number) => {
			const neighbors = [
				{ dx: 0, dy: -1 },
				{ dx: 1, dy: 0 },
				{ dx: 0, dy: 1 },
				{ dx: -1, dy: 0 },
			];

			for (const dir of neighbors) {
				const nx = x + dir.dx;
				const ny = y + dir.dy;

				if (
					isWithinGridBounds(nx, ny, this.grid) &&
					this.grid[ny][nx].state === "wall" &&
					this.seededRandom() > 0.5
				) {
					this.grid[ny][nx].state = "empty";
				}
			}
		};

		if (this.start) {
			this.grid[this.start.y][this.start.x].state = "start";
			clearNeighbors(this.start.x, this.start.y);
		}

		if (this.end) {
			this.grid[this.end.y][this.end.x].state = "end";
			clearNeighbors(this.end.x, this.end.y);
		}
	}

	/** 
	 * Ensures a path exists between start and end
	 */
	private ensurePathConnectivity(): void {
		if (!this.start || !this.end) return;

		const visited: boolean[][] = Array.from({ length: this.rows }, () =>
			Array(this.cols).fill(false)
		);

		// BFS to check connectivity
		const queue = [{ x: this.start.x, y: this.start.y }];
		visited[this.start.y][this.start.x] = true;
		let foundPath = false;

		while (queue.length > 0) {
			const current = queue.shift();
			if (!current) break;

			if (current.x === this.end.x && current.y === this.end.y) {
				foundPath = true;
				break;
			}

			const neighbors = [
				{ dx: 0, dy: -1 },
				{ dx: 1, dy: 0 },
				{ dx: 0, dy: 1 },
				{ dx: -1, dy: 0 },
			];

			for (const dir of neighbors) {
				const nx = current.x + dir.dx;
				const ny = current.y + dir.dy;

				if (
					isWithinGridBounds(nx, ny, this.grid) &&
					!visited[ny][nx] &&
					this.grid[ny][nx].state !== "wall"
				) {
					visited[ny][nx] = true;
					queue.push({ x: nx, y: ny });
				}
			}
		}

		// Carve direct path if needed
		if (!foundPath) {
			this.carveDirectPath();
		}
	}

	/** 
	 * Carves a direct path from start to end when no path exists
	 */
	private carveDirectPath(): void {
		if (!this.start || !this.end) return;

		let cx = this.start.x;
		let cy = this.start.y;

		while (cx !== this.end.x || cy !== this.end.y) {
			// Move towards end with random bias
			if (cx < this.end.x && this.seededRandom() > 0.3) cx++;
			else if (cx > this.end.x && this.seededRandom() > 0.3) cx--;
			else if (cy < this.end.y) cy++;
			else if (cy > this.end.y) cy--;
			else if (cx < this.end.x) cx++;
			else if (cx > this.end.x) cx--;

			// Clear the cell if it's a wall
			if (this.grid[cy][cx].state === "wall") {
				this.grid[cy][cx].state = "empty";
			}
		}
	}

	/** 
	 * Adds random openings to make maze less perfect
	 */
	private addRandomOpenings(): void {
		const openingChance = 0.1;

		for (let y = 1; y < this.rows - 1; y++) {
			for (let x = 1; x < this.cols - 1; x++) {
				if (
					this.grid[y][x].state === "wall" &&
					this.seededRandom() < openingChance
				) {
					// Check if removing this wall won't create large empty spaces
					let emptyNeighborCount = 0;

					const neighbors = [
						{ dx: 0, dy: -1 },
						{ dx: 1, dy: 0 },
						{ dx: 0, dy: 1 },
						{ dx: -1, dy: 0 },
					];

					for (const dir of neighbors) {
						const nx = x + dir.dx;
						const ny = y + dir.dy;

						if (
							isWithinGridBounds(nx, ny, this.grid) &&
							this.grid[ny][nx].state === "empty"
						) {
							emptyNeighborCount++;
						}
					}

					// Only remove wall if it has 2 or fewer empty neighbors
					if (emptyNeighborCount <= 2) {
						this.grid[y][x].state = "empty";
					}
				}
			}
		}
	}
}