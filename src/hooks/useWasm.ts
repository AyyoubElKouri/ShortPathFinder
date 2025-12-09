/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useCallback } from "react";
import type { PathfindingResult } from "@/lib/types";
import { useAlgorithmStore } from "@/store/useAlgorithmStore";
import { useGridStore } from "@/store/useGridStore";
import PathfindingModule from "@/wasm/pathfinding";

export function useWasm() {
	const { cellules, rows, cols } = useGridStore();
	const { algorithm, config } = useAlgorithmStore();

	const runPathfinding =
		useCallback(async (): Promise<PathfindingResult | null> => {
			const Module = await PathfindingModule();

			// Find start and end cells
			const startCell = cellules.flat().find((c) => c.state === "start");
			const endCell = cellules.flat().find((c) => c.state === "end");
			if (!startCell || !endCell) return null;

			const flatGrid = cellules
				.flat()
				.map((c) => (c.state === "wall" ? 1 : 0));
			const gridVector = new Module.VectorUint8();
			flatGrid.forEach((v) => {
				gridVector.push_back(v);
			});

			const input = new Module.PathfindingInput();
			input.grid = gridVector;
			input.rows = rows;
			input.cols = cols;
			input.startIndex = startCell.y * cols + startCell.x;
			input.endIndex = endCell.y * cols + endCell.x;
			input.algorithm = Module.Algorithm[algorithm.value];
			input.allowDiagonal = !!config.allowDiagonal;
			input.bidirectional = !!config.bidirectional;
			input.dontCrossCorners = !!config.dontCrossCorners;
			input.heuristic = config.heuristic
				? Module.Heuristic[config.heuristic]
				: Module.Heuristic.MANHATTAN;

			const engine = new Module.PathfindingEngine();
			const result = engine.run(input);

			const visited: number[] = [];
			for (let i = 0; i < result.visited.size(); i++) {
				const val = result.visited.get(i);
				if (val !== undefined) visited.push(val);
			}

			const path: number[] = [];
			for (let i = 0; i < result.path.size(); i++) {
				const val = result.path.get(i);
				if (val !== undefined) path.push(val);
			}

			return { visited, path, success: result.success, cost: result.cost };
		}, [cellules, rows, cols, algorithm, config]);

	return { runPathfinding };
}
