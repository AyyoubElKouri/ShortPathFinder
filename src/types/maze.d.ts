/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

/**
 * @interface MazeGenerationParams
 * Parameters required for maze generation.
 */
export interface MazeGenerationParams {
	grid: Cellule[][];
	rows: number;
	cols: number;
	start: Cellule | null;
	end: Cellule | null;
}
