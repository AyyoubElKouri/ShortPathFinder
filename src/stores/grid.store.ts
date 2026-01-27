/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { create } from "zustand";
import { devtools } from "zustand/middleware";

import {
	clearPath,
	clearWalls,
	generateMaze,
	historyManager,
	prepareGrid,
	resetGrid,
	updateCell,
} from "@/services";
import type { Cellule, HistoryState } from "@/types";
import { createInitialGrid, deepCopyGrid, findSpecialCells } from "@/utils";

export interface GridStore {
	/**
	 * Number of rows in the grid.
	 */
	rows: number;

	/**
	 * Number of columns in the grid.
	 */
	cols: number;

	/**
	 * 2D array representing the grid of cells.
	 */
	cellules: Cellule[][];

	/**
	 * History state for undo/redo functionality.
	 */
	history: HistoryState;

	/**
	 * Temporary grid state used during drag operations.
	 */
	tempCellules?: Cellule[];

	/**
	 * Original grid state before drag operations began.
	 */
	originalGridForDrag?: Cellule[][];

	/**
	 * Indicates if an algorithm is currently running.
	 */
	isRunning: boolean;

	/**
	 * Sets the number of rows in the grid.
	 */
	setRows: (rows: number) => void;

	/**
	 * Sets the number of columns in the grid.
	 */
	setCols: (cols: number) => void;

	/**
	 * Updates one or more cells in the grid.
	 */
	updateCell: (cells: Cellule | Cellule[], commitHistory?: boolean) => void;

	/**
	 * Clears all walls in the grid.
	 */
	clearWalls: () => void;

	/**
	 * Clears the path in the grid.
	 */
	clearPath: () => void;

	/**
	 * Resets the grid to its initial state.
	 */
	resetGrid: () => void;

	/**
	 * Prepares the grid for a new operation.
	 */
	prepareGrid: () => void;

	/**
	 * Generates a maze within the grid.
	 */
	generateMaze: () => void;

	/**
	 * Sets the running state of an algorithm.
	 */
	setIsRunning: (running: boolean) => void;

	/**
	 * Undoes the last action.
	 */
	undo: () => void;

	/**
	 * Redoes the last undone action.
	 */
	redo: () => void;

	/**
	 * Checks if an undo operation is possible.
	 */
	canUndo: () => boolean;

	/**
	 * Checks if a redo operation is possible.
	 */
	canRedo: () => boolean;
}

/**
 * @function useGridStore
 * Zustand store for managing the grid state, including cell updates,
 * grid resizing, maze generation, and undo/redo functionality.
 */
export const useGridStore = create<GridStore>()(
	devtools(
		(set, get) => ({
			// Initial state
			rows: 30,
			cols: 50,
			cellules: createInitialGrid(30, 50),
			history: historyManager.createEmptyHistory(),
			isRunning: false,

			setRows: (rows: number) => {
				const { cols } = get();
				set({
					rows,
					cellules: createInitialGrid(rows, cols),
					history: historyManager.clearHistory(),
				});
			},

			setCols: (cols: number) => {
				const { rows } = get();
				set({
					cols,
					cellules: createInitialGrid(rows, cols),
					history: historyManager.clearHistory(),
				});
			},

			setIsRunning: (running: boolean) => {
				set({ isRunning: running });
			},

			updateCell: (cells: Cellule | Cellule[], commitHistory?: boolean) => {
				const { cellules, history, tempCellules, originalGridForDrag } = get();

				// Handle drag finalization
				if (shouldFinalizeDrag(cells, commitHistory)) {
					handleDragFinalization(cellules, originalGridForDrag, history, set);
					return;
				}

				const cellsArray = Array.isArray(cells) ? cells : [cells];

				if (cellsArray.length === 0) {
					return;
				}

				// Process cell updates
				const newGrid = deepCopyGrid(cellules);
				const { grid } = updateCell(newGrid, cellsArray);

				// Handle different commit modes
				if (commitHistory === false) {
					if (isFirstDragCell(tempCellules)) {
						handleFirstDragCell(cellsArray, grid, cellules, history, tempCellules, set);
					} else {
						handleSubsequentDragCell(cellsArray, grid, tempCellules, set);
					}
					return;
				}

				// Immediate commit or default behavior
				handleImmediateCommit(grid, cellules, history, commitHistory, tempCellules, set);
			},

			clearWalls: () => {
				const { cellules, history } = get();

				const newGrid = deepCopyGrid(cellules);
				const { grid, modified } = clearWalls(newGrid);

				if (!modified) return;

				const command = historyManager.createCommand("CLEAR_WALLS", cellules, grid);
				const newHistory = historyManager.executeCommand(history, command);

				set({
					cellules: grid,
					history: newHistory,
				});
			},

			clearPath: () => {
				const { cellules, history } = get();

				const newGrid = deepCopyGrid(cellules);
				const { grid, modified } = clearPath(newGrid);

				if (!modified) return;

				const command = historyManager.createCommand("CLEAR_PATH", cellules, grid);
				const newHistory = historyManager.executeCommand(history, command);

				set({
					cellules: grid,
					history: newHistory,
				});
			},

			generateMaze: () => {
				const { cellules, history, rows, cols } = get();

				const newGrid = deepCopyGrid(cellules);
				const { start, end } = findSpecialCells(newGrid);

				const generatedGrid = generateMaze({
					grid: newGrid,
					rows,
					cols,
					start,
					end,
				});

				const command = historyManager.createCommand("GENERATE_MAZE", cellules, generatedGrid);
				const newHistory = historyManager.executeCommand(history, command);

				set({
					cellules: generatedGrid,
					history: newHistory,
				});
			},

			prepareGrid: () => {
				const { cellules } = get();

				const { grid, modified } = prepareGrid(cellules);

				// Only update if something was actually cleared
				// Note: prepareGrid doesn't affect history (it's a preparation step)
				if (modified) {
					set({
						cellules: grid,
					});
				}
			},

			resetGrid: () => {
				const { cellules, history } = get();

				const newGrid = deepCopyGrid(cellules);
				const grid = resetGrid(newGrid);

				const command = historyManager.createCommand("RESET_GRID", cellules, grid);
				const newHistory = historyManager.executeCommand(history, command);

				set({
					cellules: grid,
					history: newHistory,
				});
			},

			undo: () => {
				const { history, cellules } = get();

				const { newHistory, deltas } = historyManager.undo(history);

				if (deltas === null) return;

				// Apply deltas in reverse to restore previous state
				historyManager.applyDeltasReverse(cellules, deltas);

				set({
					cellules: [...cellules], // Trigger re-render
					history: newHistory,
				});
			},

			redo: () => {
				const { history, cellules } = get();

				const { newHistory, deltas } = historyManager.redo(history);

				if (deltas === null) return;

				// Apply deltas forward to restore next state
				historyManager.applyDeltasForward(cellules, deltas);

				set({
					cellules: [...cellules], // Trigger re-render
					history: newHistory,
				});
			},

			canUndo: () => {
				const { history } = get();
				return historyManager.canUndo(history);
			},

			canRedo: () => {
				const { history } = get();
				return historyManager.canRedo(history);
			},
		}),
		{
			name: "grid-store",
		},
	),
);

export default useGridStore;

// --------------------------------------- Internal Helpers ----------------------------------------

/**
 * @internal helper
 * Determines if the current update should finalize a drag operation.
 */
function shouldFinalizeDrag(cells: Cellule | Cellule[], commitHistory?: boolean): boolean {
	return commitHistory === true && Array.isArray(cells) && cells.length === 0;
}

/**
 * @internal helper
 * Determines if this is the first cell in a drag operation.
 */
function isFirstDragCell(tempCellules?: Cellule[]): boolean {
	const currentTemp = tempCellules || [];
	return currentTemp.length === 0;
}

/**
 * @internal helper
 * Handles the finalization of a drag operation by creating a final history command.
 */
function handleDragFinalization(
	currentGrid: Cellule[][],
	originalGridForDrag: Cellule[][] | undefined,
	history: HistoryState,
	set: (partial: Partial<GridStore>) => void,
): void {
	if (!originalGridForDrag) {
		set({ tempCellules: undefined });
		return;
	}

	// Remove the temporary command from history and create final one
	const newHistory = {
		undoStack: history.undoStack.slice(0, -1),
		redoStack: [],
	};

	// Create final command with all changes from drag
	const finalCommand = historyManager.createCommand(
		"UPDATE_CELLS",
		originalGridForDrag,
		currentGrid,
	);
	const finalHistory = historyManager.executeCommand(newHistory, finalCommand);

	set({
		tempCellules: undefined,
		originalGridForDrag: undefined,
		history: finalHistory,
	});
}

/**
 * @internal helper
 * Handles the first cell in a drag operation by creating a temporary history command.
 */
function handleFirstDragCell(
	cellsArray: Cellule[],
	newGrid: Cellule[][],
	cellules: Cellule[][],
	history: HistoryState,
	tempCellules: Cellule[] | undefined,
	set: (partial: Partial<GridStore>) => void,
): void {
	const currentTemp = tempCellules || [];

	// Store original grid for final command creation on drag end
	const originalGrid = deepCopyGrid(cellules);

	// Create temporary command (will be replaced on drag finalization)
	const command = historyManager.createCommand("UPDATE_CELLS", cellules, newGrid);
	const newHistory = historyManager.executeCommand(history, command);

	set({
		cellules: newGrid,
		tempCellules: [...currentTemp, ...cellsArray],
		originalGridForDrag: originalGrid,
		history: newHistory,
	});
}

/**
 * @internal helper
 * Handles subsequent cells in a drag operation by updating tempCellules.
 */
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

/**
 * @internal helper
 * Handles immediate commit of cell updates with history.
 */
function handleImmediateCommit(
	newGrid: Cellule[][],
	cellules: Cellule[][],
	history: HistoryState,
	commitHistory: boolean | undefined,
	tempCellules: Cellule[] | undefined,
	set: (partial: Partial<GridStore>) => void,
): void {
	const command = historyManager.createCommand("UPDATE_CELLS", cellules, newGrid);
	const newHistory = historyManager.executeCommand(history, command);

	set({
		cellules: newGrid,
		history: newHistory,
		tempCellules: commitHistory === true ? undefined : tempCellules,
	});
}
