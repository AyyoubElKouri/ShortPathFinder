/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import type { CellDelta, CellState, Cellule, Command, CommandType, HistoryState } from "@/types";

/**
 * Creates an empty history state
 */
const createEmptyHistory = (): HistoryState => ({
	undoStack: [],
	redoStack: [],
});

/**
 * Compares two cell states for equality
 */
const areCellStatesEqual = (state1: CellState, state2: CellState): boolean => {
	return state1 === state2;
};

/**
 * Extracts only the cells that changed between previous and new grid
 * This is the core optimization: we only store deltas, not full grids
 */
const extractDeltas = (previousGrid: Cellule[][], newGrid: Cellule[][]): CellDelta[] => {
	const deltas: CellDelta[] = [];

	for (let y = 0; y < newGrid.length; y++) {
		for (let x = 0; x < newGrid[y].length; x++) {
			const previousState = previousGrid[y][x].state;
			const newState = newGrid[y][x].state;

			if (!areCellStatesEqual(previousState, newState)) {
				deltas.push({
					x,
					y,
					previousState,
					newState,
				});
			}
		}
	}

	return deltas;
};

/**
 * Applies deltas to a grid by restoring previous states (for undo)
 */
const applyDeltasReverse = (grid: Cellule[][], deltas: CellDelta[]): void => {
	for (const delta of deltas) {
		grid[delta.y][delta.x].state = delta.previousState;
	}
};

/**
 * Applies deltas to a grid by applying new states (for redo)
 */
const applyDeltasForward = (grid: Cellule[][], deltas: CellDelta[]): void => {
	for (const delta of deltas) {
		grid[delta.y][delta.x].state = delta.newState;
	}
};

/**
 * Creates a command from previous and new grid states
 */
const createCommand = (
	type: CommandType,
	previousGrid: Cellule[][],
	newGrid: Cellule[][],
): Command => {
	const deltas = extractDeltas(previousGrid, newGrid);
	return { type, deltas };
};

/**
 * Executes a command and adds it to the history
 * Returns the new history state
 */
const executeCommand = (history: HistoryState, command: Command): HistoryState => {
	// Add command to undo stack and clear redo stack
	return {
		undoStack: [...history.undoStack, command],
		redoStack: [],
	};
};

/**
 * Undoes the last command
 * Returns new history state and the deltas to apply (or null if nothing to undo)
 */
const undo = (history: HistoryState): { newHistory: HistoryState; deltas: CellDelta[] | null } => {
	if (history.undoStack.length === 0) {
		return { newHistory: history, deltas: null };
	}

	const command = history.undoStack[history.undoStack.length - 1];
	const newUndoStack = history.undoStack.slice(0, -1);
	const newRedoStack = [...history.redoStack, command];

	return {
		newHistory: {
			undoStack: newUndoStack,
			redoStack: newRedoStack,
		},
		deltas: command.deltas,
	};
};

/**
 * Redoes the last undone command
 * Returns new history state and the deltas to apply (or null if nothing to redo)
 */
const redo = (history: HistoryState): { newHistory: HistoryState; deltas: CellDelta[] | null } => {
	if (history.redoStack.length === 0) {
		return { newHistory: history, deltas: null };
	}

	const command = history.redoStack[history.redoStack.length - 1];
	const newRedoStack = history.redoStack.slice(0, -1);
	const newUndoStack = [...history.undoStack, command];

	return {
		newHistory: {
			undoStack: newUndoStack,
			redoStack: newRedoStack,
		},
		deltas: command.deltas,
	};
};

/**
 * Clears all history
 */
const clearHistory = (): HistoryState => {
	return createEmptyHistory();
};

/**
 * Checks if undo is available
 */
const canUndo = (history: HistoryState): boolean => {
	return history.undoStack.length > 0;
};

/**
 * Checks if redo is available
 */
const canRedo = (history: HistoryState): boolean => {
	return history.redoStack.length > 0;
};

/**
 * Gets the size of the undo stack (for debugging/stats)
 */
const getUndoStackSize = (history: HistoryState): number => {
	return history.undoStack.length;
};

/**
 * Gets the size of the redo stack (for debugging/stats)
 */
const getRedoStackSize = (history: HistoryState): number => {
	return history.redoStack.length;
};

/**
 * PUBLIC API - This is the only export that the store needs
 *
 * This object encapsulates all history management logic in a pure functional way.
 * The store only needs to maintain a HistoryState and call these functions.
 */
export const historyManager = {
	// State creators
	createEmptyHistory,

	// Command operations
	createCommand,
	executeCommand,

	// Undo/Redo operations
	undo,
	redo,
	canUndo,
	canRedo,

	// Delta application
	applyDeltasReverse,
	applyDeltasForward,

	// Utility
	clearHistory,
	getUndoStackSize,
	getRedoStackSize,
} as const;
