/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import type { Cellule, MazeGenerationParams } from "@/types";

/**
 * @function generateMaze
 * Generates a maze using the Recursive Backtracking algorithm.
 * Preserves start and end positions if they exist.
 */
export function generateMaze(params: MazeGenerationParams): Cellule[][] {
	const { grid, rows, cols, start, end } = params;

	// Initialize all cells as walls (except start/end)
	for (const row of grid) {
		for (const cell of row) {
			if (cell.state !== "start" && cell.state !== "end") {
				cell.state = "wall";
			}
		}
	}

	// Create random number generator and visited tracker
	const random = createSeededRandom(Date.now());
	const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));

	// Start carving from an odd position (required for proper maze structure)
	let startX = start ? start.x : 1;
	let startY = start ? start.y : 1;
	if (startX % 2 === 0) startX = Math.max(1, startX - 1);
	if (startY % 2 === 0) startY = Math.max(1, startY - 1);

	carveMazePassages(grid, visited, startX, startY, rows, cols, random);
	makeSpecialCellsAccessible(grid, start, end, rows, cols, random);
	ensurePathExists(grid, start, end, rows, cols, random);
	addRandomOpenings(grid, rows, cols, random);

	return grid;
}

/**
 * @helper
 * Creates a seeded random number generator.
 * Uses a simple linear congruential generator (LCG) algorithm.
 */
function createSeededRandom(seed: number): () => number {
	let state = seed;
	return () => {
		state = (state * 9301 + 49297) % 233280;
		return state / 233280;
	};
}

/**
 * @helper
 * Carves passages in the maze using Recursive Backtracking.
 */
function carveMazePassages(
	grid: Cellule[][],
	visited: boolean[][],
	x: number,
	y: number,
	rows: number,
	cols: number,
	random: () => number,
): void {
	visited[y][x] = true;

	if (grid[y][x].state !== "start" && grid[y][x].state !== "end") {
		grid[y][x].state = "empty";
	}

	// Directions: up, right, down, left (skip 2 cells for maze structure)
	const directions = [
		{ dx: 0, dy: -2 },
		{ dx: 2, dy: 0 },
		{ dx: 0, dy: 2 },
		{ dx: -2, dy: 0 },
	];

	// Shuffle directions for randomness
	for (let i = directions.length - 1; i > 0; i--) {
		const j = Math.floor(random() * (i + 1));
		[directions[i], directions[j]] = [directions[j], directions[i]];
	}

	// Try each direction
	for (const dir of directions) {
		const nx = x + dir.dx;
		const ny = y + dir.dy;

		if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && !visited[ny][nx]) {
			// Carve the wall between current and next cell
			const wallX = x + dir.dx / 2;
			const wallY = y + dir.dy / 2;

			if (grid[wallY][wallX].state !== "start" && grid[wallY][wallX].state !== "end") {
				grid[wallY][wallX].state = "empty";
			}

			carveMazePassages(grid, visited, nx, ny, rows, cols, random);
		}
	}
}

/**
 * @helper
 * Makes the start and end cells accessible by clearing some walls around them.
 */
function makeSpecialCellsAccessible(
	grid: Cellule[][],
	start: Cellule | null,
	end: Cellule | null,
	rows: number,
	cols: number,
	random: () => number,
): void {
	const directions = [
		{ dx: 0, dy: -1 },
		{ dx: 1, dy: 0 },
		{ dx: 0, dy: 1 },
		{ dx: -1, dy: 0 },
	];

	// Clear some walls around start
	if (start) {
		grid[start.y][start.x].state = "start";
		for (const dir of directions) {
			const nx = start.x + dir.dx;
			const ny = start.y + dir.dy;
			if (
				ny >= 0 &&
				ny < rows &&
				nx >= 0 &&
				nx < cols &&
				grid[ny][nx].state === "wall" &&
				random() > 0.5
			) {
				grid[ny][nx].state = "empty";
			}
		}
	}

	// Clear some walls around end
	if (end) {
		grid[end.y][end.x].state = "end";
		for (const dir of directions) {
			const nx = end.x + dir.dx;
			const ny = end.y + dir.dy;
			if (
				ny >= 0 &&
				ny < rows &&
				nx >= 0 &&
				nx < cols &&
				grid[ny][nx].state === "wall" &&
				random() > 0.5
			) {
				grid[ny][nx].state = "empty";
			}
		}
	}
}

/**
 * @helper
 * Ensures there is a path between start and end cells.
 * If no path exists, carves one directly.
 */
function ensurePathExists(
	grid: Cellule[][],
	start: Cellule | null,
	end: Cellule | null,
	rows: number,
	cols: number,
	random: () => number,
): void {
	if (!start || !end) return;

	// Use BFS to check if path exists
	const queue: { x: number; y: number }[] = [{ x: start.x, y: start.y }];
	const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
	visited[start.y][start.x] = true;

	const directions = [
		{ dx: 0, dy: -1 },
		{ dx: 1, dy: 0 },
		{ dx: 0, dy: 1 },
		{ dx: -1, dy: 0 },
	];

	let pathExists = false;

	while (queue.length > 0) {
		const current = queue.shift();
		if (!current) break;

		if (current.x === end.x && current.y === end.y) {
			pathExists = true;
			break;
		}

		for (const dir of directions) {
			const nx = current.x + dir.dx;
			const ny = current.y + dir.dy;

			if (
				ny >= 0 &&
				ny < rows &&
				nx >= 0 &&
				nx < cols &&
				!visited[ny][nx] &&
				grid[ny][nx].state !== "wall"
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
			if (cx < end.x && random() > 0.3) cx++;
			else if (cx > end.x && random() > 0.3) cx--;
			else if (cy < end.y) cy++;
			else if (cy > end.y) cy--;
			else if (cx < end.x) cx++;
			else if (cx > end.x) cx--;

			if (grid[cy][cx].state === "wall") {
				grid[cy][cx].state = "empty";
			}
		}
	}
}

/**
 * @helper
 * Adds random openings in the maze to create loops and multiple paths.
 */
function addRandomOpenings(
	grid: Cellule[][],
	rows: number,
	cols: number,
	random: () => number,
): void {
	const directions = [
		{ dx: 0, dy: -1 },
		{ dx: 1, dy: 0 },
		{ dx: 0, dy: 1 },
		{ dx: -1, dy: 0 },
	];

	for (let y = 1; y < rows - 1; y++) {
		for (let x = 1; x < cols - 1; x++) {
			if (grid[y][x].state === "wall" && random() < 0.1) {
				// Count empty neighbors to avoid creating large empty spaces
				let emptyNeighbors = 0;
				for (const dir of directions) {
					const nx = x + dir.dx;
					const ny = y + dir.dy;
					if (ny >= 0 && ny < rows && nx >= 0 && nx < cols && grid[ny][nx].state === "empty") {
						emptyNeighbors++;
					}
				}

				// Only remove wall if it has 2 or fewer empty neighbors
				if (emptyNeighbors <= 2) {
					grid[y][x].state = "empty";
				}
			}
		}
	}
}
