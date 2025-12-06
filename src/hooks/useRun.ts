/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useCallback } from "react";

import { usePathfindingAdapter } from "@/hooks/usePathfindingAdapter";
import { BATCH_SIZE } from "@/lib/constants";
import useGridStore from "@/store/useGridStore";

export function useRun() {
	const { runPathfinding } = usePathfindingAdapter();
	const updateCell = useGridStore((state) => state.updateCell);

	const execute = useCallback(async () => {
		const result = await runPathfinding();
		if (!result) return;

		const { visited, path } = result;
		const cols = useGridStore.getState().cols;

		const animateBatch = async (
			cells: number[],
			type: "visited" | "path",
		) => {
			for (let i = 0; i < cells.length; i += BATCH_SIZE) {
				const batch = cells.slice(i, i + BATCH_SIZE);
				batch.forEach((index) => {
					const x = index % cols;
					const y = Math.floor(index / cols);
					const currentType = useGridStore.getState().cellules[y][x].type;
					if (currentType !== "start" && currentType !== "end") {
						updateCell({ x, y, type });
					}
				});
				await new Promise(requestAnimationFrame);
			}
		};

		await animateBatch(visited, "visited");
		await animateBatch(path, "path");
	}, [runPathfinding, updateCell]);

	return { execute };
}
