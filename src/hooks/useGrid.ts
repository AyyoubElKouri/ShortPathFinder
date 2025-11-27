/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useEffect, useState } from "react";
import type { Cellule } from "@/store/useGridStore";
import { useGridStore } from "@/store/useGridStore";
import { useScreen } from "./useScreen";

export function useGrid() {
	const [isMouseDown, setIsMouseDown] = useState(false);
	const [showInstructions, setShowInstructions] = useState(true);

	const {
		cellules,
		cellSize,
		setRows,
		setCols,
		updateCell,
		clearWalls,
		clearPath,
		resetGrid,
	} = useGridStore();

	const { width, height } = useScreen();

	useEffect(() => {
		const rows = Math.floor(height / cellSize);
		const cols = Math.floor((width * 0.75) / cellSize);

		setRows(rows);
		setCols(cols);
	}, [width, height, cellSize, setRows, setCols]);

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

	const handleMouseDown = (cell: Cellule) => {
		setIsMouseDown(true);
		updateCell(cell, false);
	};

	const handleMouseEnter = (cell: Cellule) => {
		if (isMouseDown) {
			updateCell(cell, false);
		}
	};

	const handleMouseUp = () => {
		if (isMouseDown) {
			updateCell([], true);
			setIsMouseDown(false);
		}
	};

	function getCellColor(cell: Cellule): string {
		switch (cell.type) {
			case "empty":
				return "#F7F7F7";
			case "wall":
				return "#222";
			case "start":
				return "#08f";
			case "end":
				return "#f00";
			case "path":
				return "#0f0";
			case "visited":
				return "#ff0";
			default:
				return "#ccc";
		}
	}

	return {
		cellules,
		cellSize,
		handleMouseDown,
		handleMouseEnter,
		handleMouseUp,
		getCellColor,
		clearWalls,
		clearPath,
		resetGrid,
		showInstructions,
		setShowInstructions,
	};
}
