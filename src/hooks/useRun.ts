/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useCallback } from "react";

import { useWasm } from "@/hooks/useWasm";
import { useSound } from "@/hooks/useSound";
import { BATCH_SIZE } from "@/lib/constants";
import useGridStore from "@/store/useGridStore";

export function useRun() {
	const { readyToRun, setIsRunning } = useGridStore();
	const { runPathfinding } = useWasm();
	const {
		initializeAudio,
		playVisitedSound,
		playPathSound,
		playSuccessChord,
	} = useSound();

	const execute = useCallback(async () => {
		readyToRun();
		setIsRunning(true);

		await initializeAudio();

		const result = await runPathfinding();
		if (!result) {
			setIsRunning(false);
			return;
		}

		const { visited, path } = result;
		const cols = useGridStore.getState().cols;

		const animateBatch = async (
			cells: number[],
			state: "visited" | "path",
		) => {
			for (let i = 0; i < cells.length; i += BATCH_SIZE) {
				const batch = cells.slice(i, i + BATCH_SIZE);

				useGridStore.setState((gridState) => {
					const newGrid = gridState.cellules.map((row) =>
						row.map((cell) => ({ ...cell })),
					);

					batch.forEach((index) => {
						const x = index % cols;
						const y = Math.floor(index / cols);
						const currentState = newGrid[y][x].state;
						if (currentState !== "start" && currentState !== "end") {
							newGrid[y][x].state = state;
						}
					});

					return { cellules: newGrid };
				});

				if (state === "visited") {
					playVisitedSound(i);
				} else if (state === "path") {
					playPathSound(i);
				}

				await new Promise((resolve) => setTimeout(resolve, 50));
			}
		};

		await animateBatch(visited, "visited");

		await new Promise((resolve) => setTimeout(resolve, 200));

		await animateBatch(path, "path");

		if (path.length > 0) {
			await playSuccessChord();
		}

		setIsRunning(false);
	}, [
		runPathfinding,
		readyToRun,
		setIsRunning,
		initializeAudio,
		playVisitedSound,
		playPathSound,
		playSuccessChord,
	]);

	return { execute };
}
