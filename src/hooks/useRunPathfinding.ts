/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useCallback } from "react";
import useGridStore from "@/store/useGridStore";
import { usePathfindingAdapter } from "@/hooks/usePathfindingAdapter";
import { BATCH_SIZE, DELAY_MS } from "@/lib/constants";

export function useRunPathfinding() {
	const { runPathfinding } = usePathfindingAdapter();
	const updateCell = useGridStore((state) => state.updateCell);

	// Helper function for delaying execution (simple sleep)
	const delay = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));

	// biome-ignore lint/correctness/useExhaustiveDependencies: <Handeled>
	const execute = useCallback(async () => {
		const result = await runPathfinding();
		if (!result) return;

		const { visited, path } = result;
		const cols = useGridStore.getState().cols;

		// Animate visited cells
		for (let i = 0; i < visited.length; i += BATCH_SIZE) {
			const batch = visited.slice(i, i + BATCH_SIZE);
			batch.forEach((index) => {
				const x = index % cols;
				const y = Math.floor(index / cols);
				const currentType = useGridStore.getState().cellules[y][x].type;
				if (currentType !== "start" && currentType !== "end") {
					updateCell({ x, y, type: "visited" });
				}
			});
			await delay(DELAY_MS);
		}
		// Animate path cells
		for (let i = 0; i < path.length; i++) {
			const index = path[i];
			const x = index % cols;
			const y = Math.floor(index / cols);
			const currentType = useGridStore.getState().cellules[y][x].type;

			if (currentType !== "start" && currentType !== "end") {
				updateCell({ x, y, type: "path" });
			}

			await delay(DELAY_MS);
		}
	}, [runPathfinding, updateCell]);

	return { execute };
}
