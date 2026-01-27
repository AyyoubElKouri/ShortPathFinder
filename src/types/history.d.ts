/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

/**
 * @type CellDelta
 * Represents a minimal snapshot of a cell's state for memory efficiency
 * We only store what changed, not the entire cell object
 */
export type CellDelta = {
	x: number;
	y: number;
	previousState: CellState;
	newState: CellState;
};

/**
 * @type CommandType
 * Command types that can be executed and undone
 */
export type CommandType =
	| "UPDATE_CELLS"
	| "CLEAR_WALLS"
	| "CLEAR_PATH"
	| "RESET_GRID"
	| "GENERATE_MAZE";

/**
 * @type Command
 * A command stores only the cells that changed (deltas), not the entire grid
 * This dramatically reduces memory usage compared to storing full grid snapshots
 */
export type Command = {
	type: CommandType;
	deltas: CellDelta[];
};

/**
 * @type HistoryState
 * History state managed purely functionally
 */
export type HistoryState = {
	undoStack: Command[];
	redoStack: Command[];
};
