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
		generateMaze,
	} = useGridStore();

	const { width, height } = useScreen();

	useEffect(() => {
		const rows = Math.floor(height / cellSize);
		const cols = Math.floor(width / cellSize);

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
				return "#141114";
			case "wall":
				return "#3C393C";
			case "start":
				return "#92FA13";
			case "end":
				return "#FC2930";
			case "path":
				return "#FAFA03";
			case "visited":
				return "#1474FF";
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
		generateMaze,
		showInstructions,
		setShowInstructions,
	};
}
