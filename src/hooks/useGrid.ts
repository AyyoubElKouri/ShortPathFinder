/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

/**
 * TODO: This file to be refactored.
 */

import { useCallback, useEffect, useState } from "react";
import { CELL_SIZE } from "@/constants";
import { useScreen } from "@/hooks/helpers/useScreen";
import { useGridStore } from "@/stores";
import type { Cellule } from "@/types";

export interface GridHandlers {
	mouseDown: (cell: Cellule) => void;
	mouseEnter: (cell: Cellule) => void;
	mouseUp: () => void;
}

export interface GridActions {
	clearWalls: () => void;
	clearPath: () => void;
	resetGrid: () => void;
	generateMaze: () => void;
}

export interface GridReturns {
	cellules: Cellule[][];
	handlers: GridHandlers;
	actions: GridActions;
}

export function useGrid(): GridReturns {
	const [isMouseDown, setIsMouseDown] = useState(false);

	const { cellules, setRows, setCols, updateCell, clearWalls, clearPath, resetGrid, generateMaze } =
		useGridStore();

	const { width, height } = useScreen();

	useEffect(() => {
		const rows = Math.floor(height / CELL_SIZE);
		const cols = Math.floor(width / CELL_SIZE);

		setRows(rows);
		setCols(cols);
	}, [width, height, setRows, setCols]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const store = useGridStore.getState();
			if ((e.ctrlKey || e.metaKey) && e.key === "z") {
				e.preventDefault();
				store.undo();
			}
			if ((e.ctrlKey || e.metaKey) && e.key === "y") {
				e.preventDefault();
				store.redo();
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	const handleMouseDown = useCallback(
		(cell: Cellule) => {
			setIsMouseDown(true);
			updateCell(cell, false);
		},
		[updateCell],
	);

	const handleMouseEnter = useCallback(
		(cell: Cellule) => {
			if (isMouseDown) {
				updateCell(cell, false);
			}
		},
		[isMouseDown, updateCell],
	);

	const handleMouseUp = useCallback(() => {
		if (isMouseDown) {
			updateCell([], true);
			setIsMouseDown(false);
		}
	}, [isMouseDown, updateCell]);

	return {
		cellules,

		handlers: {
			mouseDown: handleMouseDown,
			mouseEnter: handleMouseEnter,
			mouseUp: handleMouseUp,
		},

		actions: {
			clearWalls,
			clearPath,
			resetGrid,
			generateMaze,
		},
	};
}
