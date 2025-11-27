/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import type { Cellule } from "./useGridStore";
import { useGridStore } from "./useGridStore";

describe("GridStore", () => {
	// Reset the store before each test
	beforeEach(() => {
		useGridStore.setState({
			cellSize: 20,
			rows: 15,
			cols: 15,
			cellules: Array.from({ length: 15 }, (_, y) =>
				Array.from({ length: 15 }, (_, x) => ({
					x,
					y,
					type: "empty" as const,
				})),
			),
			history: [],
			future: [],
			tempCellules: undefined,
		});
	});

	describe("Initial state", () => {
		it("should have correct default dimensions", () => {
			const { rows, cols, cellSize } = useGridStore.getState();
			expect(rows).toBe(15);
			expect(cols).toBe(15);
			expect(cellSize).toBe(20);
		});

		it("should have an empty grid with correct dimensions", () => {
			const { cellules } = useGridStore.getState();
			expect(cellules.length).toBe(15);
			expect(cellules[0].length).toBe(15);
			expect(cellules[0][0].type).toBe("empty");
		});

		it("should have empty history and future", () => {
			const { history, future } = useGridStore.getState();
			expect(history).toEqual([]);
			expect(future).toEqual([]);
		});

		it("should have undefined tempCellules", () => {
			const { tempCellules } = useGridStore.getState();
			expect(tempCellules).toBeUndefined();
		});
	});

	describe("setCellSize", () => {
		it("should update cell size to 30", () => {
			const { setCellSize } = useGridStore.getState();
			setCellSize(30);

			const { cellSize } = useGridStore.getState();
			expect(cellSize).toBe(30);
		});

		it("should update cell size to 10", () => {
			const { setCellSize } = useGridStore.getState();
			setCellSize(10);

			const { cellSize } = useGridStore.getState();
			expect(cellSize).toBe(10);
		});
	});

	describe("setRows", () => {
		it("should update rows and reset grid", () => {
			const { setRows } = useGridStore.getState();
			setRows(20);

			const state = useGridStore.getState();
			expect(state.rows).toBe(20);
			expect(state.cellules.length).toBe(20);
			expect(state.history).toEqual([]);
			expect(state.future).toEqual([]);
		});

		it("should preserve cols when updating rows", () => {
			const { setRows } = useGridStore.getState();
			setRows(10);

			const { cols, cellules } = useGridStore.getState();
			expect(cols).toBe(15);
			expect(cellules[0].length).toBe(15);
		});
	});

	describe("setCols", () => {
		it("should update cols and reset grid", () => {
			const { setCols } = useGridStore.getState();
			setCols(20);

			const state = useGridStore.getState();
			expect(state.cols).toBe(20);
			expect(state.cellules[0].length).toBe(20);
			expect(state.history).toEqual([]);
			expect(state.future).toEqual([]);
		});

		it("should preserve rows when updating cols", () => {
			const { setCols } = useGridStore.getState();
			setCols(10);

			const { rows, cellules } = useGridStore.getState();
			expect(rows).toBe(15);
			expect(cellules.length).toBe(15);
		});
	});

	describe("updateCell - Basic functionality", () => {
		it("should place start on first click on empty cell", () => {
			const { updateCell } = useGridStore.getState();
			const cell: Cellule = { x: 0, y: 0, type: "empty" };

			updateCell(cell);

			const updatedState = useGridStore.getState();
			expect(updatedState.cellules[0][0].type).toBe("start");
		});

		it("should place end on second click when start exists", () => {
			const { updateCell } = useGridStore.getState();
			const startCell: Cellule = { x: 0, y: 0, type: "empty" };
			const endCell: Cellule = { x: 1, y: 1, type: "empty" };

			updateCell(startCell);
			updateCell(endCell);

			const { cellules } = useGridStore.getState();
			expect(cellules[0][0].type).toBe("start");
			expect(cellules[1][1].type).toBe("end");
		});

		it("should toggle wall when start and end exist", () => {
			const { updateCell } = useGridStore.getState();
			const startCell: Cellule = { x: 0, y: 0, type: "empty" };
			const endCell: Cellule = { x: 1, y: 1, type: "empty" };
			const wallCell: Cellule = { x: 2, y: 2, type: "empty" };

			updateCell(startCell);
			updateCell(endCell);
			updateCell(wallCell);

			const { cellules } = useGridStore.getState();
			expect(cellules[2][2].type).toBe("wall");
		});

		it("should remove start when clicking on it", () => {
			const { updateCell } = useGridStore.getState();
			const startCell: Cellule = { x: 0, y: 0, type: "empty" };

			updateCell(startCell);
			expect(useGridStore.getState().cellules[0][0].type).toBe("start");

			updateCell({ x: 0, y: 0, type: "start" });
			expect(useGridStore.getState().cellules[0][0].type).toBe("empty");
		});

		it("should remove end when clicking on it", () => {
			const { updateCell } = useGridStore.getState();
			const startCell: Cellule = { x: 0, y: 0, type: "empty" };
			const endCell: Cellule = { x: 1, y: 1, type: "empty" };

			updateCell(startCell);
			updateCell(endCell);
			expect(useGridStore.getState().cellules[1][1].type).toBe("end");

			updateCell({ x: 1, y: 1, type: "end" });
			expect(useGridStore.getState().cellules[1][1].type).toBe("empty");
		});

		it("should toggle wall back to empty", () => {
			const { updateCell } = useGridStore.getState();
			const startCell: Cellule = { x: 0, y: 0, type: "empty" };
			const endCell: Cellule = { x: 1, y: 1, type: "empty" };
			const wallCell: Cellule = { x: 2, y: 2, type: "empty" };

			updateCell(startCell);
			updateCell(endCell);
			updateCell(wallCell);
			expect(useGridStore.getState().cellules[2][2].type).toBe("wall");

			updateCell({ x: 2, y: 2, type: "wall" });
			expect(useGridStore.getState().cellules[2][2].type).toBe("empty");
		});
	});

	describe("updateCell - Batch updates", () => {
		it("should update multiple cells at once", () => {
			const { updateCell } = useGridStore.getState();
			const cells: Cellule[] = [
				{ x: 0, y: 0, type: "empty" },
				{ x: 1, y: 1, type: "empty" },
			];

			updateCell(cells);

			const { cellules } = useGridStore.getState();
			expect(cellules[0][0].type).toBe("start");
			expect(cellules[1][1].type).toBe("end");
		});

		it("should handle empty array without error", () => {
			const { updateCell, cellules } = useGridStore.getState();
			const beforeState = cellules;

			updateCell([]);

			const afterState = useGridStore.getState().cellules;
			expect(afterState).toEqual(beforeState);
		});
	});

	describe("updateCell - History management", () => {
		it("should add to history on default update", () => {
			const { updateCell } = useGridStore.getState();
			const cell: Cellule = { x: 0, y: 0, type: "empty" };

			updateCell(cell);

			const { history } = useGridStore.getState();
			expect(history.length).toBe(1);
		});

		it("should clear future on new update", () => {
			const { updateCell, undo } = useGridStore.getState();

			updateCell({ x: 0, y: 0, type: "empty" });
			updateCell({ x: 1, y: 1, type: "empty" });
			undo();

			expect(useGridStore.getState().future.length).toBe(1);

			updateCell({ x: 2, y: 2, type: "empty" });
			expect(useGridStore.getState().future).toEqual([]);
		});
	});

	describe("updateCell - Drag mode (commitHistory = false)", () => {
		it("should not commit to history on first drag cell", () => {
			const { updateCell } = useGridStore.getState();
			const cell: Cellule = { x: 0, y: 0, type: "empty" };

			updateCell(cell, false);

			const state = useGridStore.getState();
			expect(state.tempCellules).toEqual([cell]);
			expect(state.history.length).toBe(1); // Saved state before drag
		});

		it("should accumulate cells in tempCellules during drag", () => {
			const { updateCell } = useGridStore.getState();

			updateCell({ x: 0, y: 0, type: "empty" }, false);
			updateCell({ x: 1, y: 1, type: "empty" }, false);
			updateCell({ x: 2, y: 2, type: "empty" }, false);

			const { tempCellules } = useGridStore.getState();
			expect(tempCellules?.length).toBe(3);
		});

		it("should finalize drag and clear tempCellules on commit", () => {
			const { updateCell } = useGridStore.getState();

			updateCell({ x: 0, y: 0, type: "empty" }, false);
			updateCell({ x: 1, y: 1, type: "empty" }, false);
			updateCell([], true);

			const { tempCellules } = useGridStore.getState();
			expect(tempCellules).toBeUndefined();
		});

		it("should only create one history entry for entire drag", () => {
			const { updateCell } = useGridStore.getState();

			const initialHistory = useGridStore.getState().history.length;

			updateCell({ x: 0, y: 0, type: "empty" }, false);
			updateCell({ x: 1, y: 1, type: "empty" }, false);
			updateCell({ x: 2, y: 2, type: "empty" }, false);
			updateCell([], true);

			const finalHistory = useGridStore.getState().history.length;
			expect(finalHistory).toBe(initialHistory + 1);
		});
	});

	describe("updateCell - Immediate commit (commitHistory = true)", () => {
		it("should commit immediately with commitHistory = true", () => {
			const { updateCell } = useGridStore.getState();
			const cell: Cellule = { x: 0, y: 0, type: "empty" };

			updateCell(cell, true);

			const { history, tempCellules } = useGridStore.getState();
			expect(history.length).toBe(1);
			expect(tempCellules).toBeUndefined();
		});
	});

	describe("undo", () => {
		it("should undo the last cell update", () => {
			const { updateCell, undo } = useGridStore.getState();
			const cell: Cellule = { x: 0, y: 0, type: "empty" };

			updateCell(cell);
			expect(useGridStore.getState().cellules[0][0].type).toBe("start");

			undo();
			expect(useGridStore.getState().cellules[0][0].type).toBe("empty");
		});

		it("should do nothing when history is empty", () => {
			const { undo, cellules } = useGridStore.getState();
			const beforeState = cellules;

			undo();

			const afterState = useGridStore.getState().cellules;
			expect(afterState).toEqual(beforeState);
		});

		it("should add to future on undo", () => {
			const { updateCell, undo } = useGridStore.getState();

			updateCell({ x: 0, y: 0, type: "empty" });
			undo();

			const { future } = useGridStore.getState();
			expect(future.length).toBe(1);
		});

		it("should handle multiple undos", () => {
			const { updateCell, undo } = useGridStore.getState();

			updateCell({ x: 0, y: 0, type: "empty" });
			updateCell({ x: 1, y: 1, type: "empty" });
			updateCell({ x: 2, y: 2, type: "empty" });

			undo();
			undo();

			const { cellules, future } = useGridStore.getState();
			expect(cellules[0][0].type).toBe("start");
			expect(cellules[1][1].type).toBe("empty");
			expect(future.length).toBe(2);
		});
	});

	describe("redo", () => {
		it("should redo the last undone action", () => {
			const { updateCell, undo, redo } = useGridStore.getState();

			updateCell({ x: 0, y: 0, type: "empty" });
			undo();
			expect(useGridStore.getState().cellules[0][0].type).toBe("empty");

			redo();
			expect(useGridStore.getState().cellules[0][0].type).toBe("start");
		});

		it("should do nothing when future is empty", () => {
			const { redo, cellules } = useGridStore.getState();
			const beforeState = cellules;

			redo();

			const afterState = useGridStore.getState().cellules;
			expect(afterState).toEqual(beforeState);
		});

		it("should handle multiple redos", () => {
			const { updateCell, undo, redo } = useGridStore.getState();

			updateCell({ x: 0, y: 0, type: "empty" });
			updateCell({ x: 1, y: 1, type: "empty" });

			undo();
			undo();

			redo();
			expect(useGridStore.getState().cellules[0][0].type).toBe("start");

			redo();
			expect(useGridStore.getState().cellules[1][1].type).toBe("end");
		});
	});

	describe("Complex scenarios", () => {
		it("should handle full workflow: updates, undo, redo", () => {
			const { updateCell, undo, redo } = useGridStore.getState();

			updateCell({ x: 0, y: 0, type: "empty" });
			updateCell({ x: 1, y: 1, type: "empty" });
			updateCell({ x: 2, y: 2, type: "empty" });

			undo();
			undo();
			redo();

			const { cellules } = useGridStore.getState();
			expect(cellules[0][0].type).toBe("start");
			expect(cellules[1][1].type).toBe("end");
			expect(cellules[2][2].type).toBe("empty");
		});

		it("should handle drag workflow with undo", () => {
			const { updateCell, undo } = useGridStore.getState();

			updateCell({ x: 0, y: 0, type: "empty" }, false);
			updateCell({ x: 1, y: 1, type: "empty" }, false);
			updateCell({ x: 2, y: 2, type: "empty" }, false);
			updateCell([], true);

			expect(useGridStore.getState().cellules[0][0].type).toBe("start");
			expect(useGridStore.getState().cellules[1][1].type).toBe("end");

			undo();

			expect(useGridStore.getState().cellules[0][0].type).toBe("empty");
			expect(useGridStore.getState().cellules[1][1].type).toBe("empty");
		});

		it("should prevent duplicate start cells", () => {
			const { updateCell } = useGridStore.getState();

			updateCell({ x: 0, y: 0, type: "empty" });
			updateCell({ x: 1, y: 1, type: "empty" });

			// Remove end to trigger start placement logic
			updateCell({ x: 1, y: 1, type: "end" });
			updateCell({ x: 2, y: 2, type: "empty" });

			const { cellules } = useGridStore.getState();
			let startCount = 0;

			for (const row of cellules) {
				for (const cell of row) {
					if (cell.type === "start") startCount++;
				}
			}

			expect(startCount).toBe(1);
		});

		it("should prevent duplicate end cells", () => {
			const { updateCell } = useGridStore.getState();

			updateCell({ x: 0, y: 0, type: "empty" });
			updateCell({ x: 1, y: 1, type: "empty" });
			updateCell({ x: 2, y: 2, type: "empty" });

			// Remove end and place it elsewhere
			updateCell({ x: 1, y: 1, type: "end" });
			updateCell({ x: 3, y: 3, type: "empty" });

			const { cellules } = useGridStore.getState();
			let endCount = 0;

			for (const row of cellules) {
				for (const cell of row) {
					if (cell.type === "end") endCount++;
				}
			}

			expect(endCount).toBe(1);
		});
	});

	describe("Boundary conditions", () => {
		it("should ignore updates outside grid bounds", () => {
			const { updateCell, cellules } = useGridStore.getState();
			const beforeState = cellules;

			updateCell({ x: -1, y: 0, type: "empty" });
			updateCell({ x: 0, y: -1, type: "empty" });
			updateCell({ x: 100, y: 0, type: "empty" });
			updateCell({ x: 0, y: 100, type: "empty" });

			const afterState = useGridStore.getState().cellules;
			expect(afterState).toEqual(beforeState);
		});

		it("should handle updates at grid edges", () => {
			const { updateCell } = useGridStore.getState();
			const { rows, cols } = useGridStore.getState();

			updateCell({ x: 0, y: 0, type: "empty" });
			updateCell({ x: cols - 1, y: rows - 1, type: "empty" });

			const { cellules } = useGridStore.getState();
			expect(cellules[0][0].type).toBe("start");
			expect(cellules[rows - 1][cols - 1].type).toBe("end");
		});
	});

	describe("Stress tests", () => {
		it("should prevent duplicate start cells during drag mode", () => {
			const { updateCell } = useGridStore.getState();

			updateCell({ x: 0, y: 0, type: "empty" }, false);
			updateCell({ x: 1, y: 1, type: "empty" }, false);
			updateCell([], true);

			// Remove end, then drag to place start elsewhere
			updateCell({ x: 1, y: 1, type: "end" });
			updateCell({ x: 2, y: 2, type: "empty" }, false);
			updateCell([], true);

			const { cellules } = useGridStore.getState();
			let startCount = 0;
			for (const row of cellules) {
				for (const cell of row) {
					if (cell.type === "start") startCount++;
				}
			}

			expect(startCount).toBe(1);
			expect(cellules[0][0].type).toBe("start");
		});

		it("should handle undo/redo with incomplete drag (no finalization)", () => {
			const { updateCell, undo, redo } = useGridStore.getState();

			updateCell({ x: 0, y: 0, type: "empty" }, false);
			updateCell({ x: 1, y: 1, type: "empty" }, false);
			// Note: No finalization call

			const { tempCellules } = useGridStore.getState();
			expect(tempCellules).toBeDefined();

			undo();
			expect(useGridStore.getState().cellules[0][0].type).toBe("empty");

			redo();
			expect(useGridStore.getState().cellules[0][0].type).toBe("start");
		});

		it("should handle drag finalization with no tempCellules", () => {
			const { updateCell } = useGridStore.getState();

			// Finalize without any drag cells
			updateCell([], true);

			const { tempCellules, cellules } = useGridStore.getState();
			expect(tempCellules).toBeUndefined();
			expect(cellules[0][0].type).toBe("empty");
		});

		it("should preserve grid state when changing cell size", () => {
			const { updateCell, setCellSize } = useGridStore.getState();

			updateCell({ x: 0, y: 0, type: "empty" });
			setCellSize(30);

			const { cellules, cellSize } = useGridStore.getState();
			expect(cellSize).toBe(30);
			expect(cellules[0][0].type).toBe("start"); // State should be preserved
		});

		it("should maintain correct order of cells in tempCellules", () => {
			const { updateCell } = useGridStore.getState();

			const cells = [
				{ x: 0, y: 0, type: "empty" as const },
				{ x: 1, y: 1, type: "empty" as const },
				{ x: 2, y: 2, type: "empty" as const },
			];

			cells.forEach((cell) => {
				updateCell(cell, false);
			});

			const { tempCellules } = useGridStore.getState();
			expect(tempCellules).toHaveLength(3);
			expect(tempCellules?.[0]).toEqual(cells[0]);
			expect(tempCellules?.[2]).toEqual(cells[2]);
		});
	});

	describe("Grid modification helpers", () => {
		it("should clear all walls with clearWalls", () => {
			const { updateCell, clearWalls } = useGridStore.getState();

			// Place some walls
			updateCell({ x: 0, y: 0, type: "empty" });
			updateCell({ x: 1, y: 1, type: "empty" });
			updateCell({ x: 2, y: 2, type: "empty" }); // becomes wall

			clearWalls();

			const { cellules: updated } = useGridStore.getState();
			expect(updated[0][0].type).not.toBe("wall");
			expect(updated[1][1].type).not.toBe("wall");
			expect(updated[2][2].type).not.toBe("wall");
		});

		it("should clear all path and visited cells with clearPath", () => {
			const { updateCell, clearPath } = useGridStore.getState();

			// Manually set some path/visited cells
			updateCell({ x: 0, y: 0, type: "start" }, false);
			updateCell({ x: 1, y: 1, type: "end" }, false);
			updateCell({ x: 2, y: 2, type: "path" }, false);
			updateCell({ x: 3, y: 3, type: "visited" }, true);

			clearPath();

			const { cellules: updated } = useGridStore.getState();
			expect(updated[2][2].type).toBe("empty");
			expect(updated[3][3].type).toBe("empty");
		});

		it("should reset the entire grid with resetGrid", () => {
			const { updateCell, resetGrid } = useGridStore.getState();

			// Set some special and wall cells
			updateCell({ x: 0, y: 0, type: "empty" }); // start
			updateCell({ x: 1, y: 1, type: "empty" }); // end
			updateCell({ x: 2, y: 2, type: "empty" }); // wall

			resetGrid();

			const { cellules: updated } = useGridStore.getState();
			for (const row of updated) {
				for (const cell of row) {
					expect(cell.type).toBe("empty");
				}
			}
		});
	});
});
