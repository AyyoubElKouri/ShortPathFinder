/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useCallback } from "react";
import { useSound } from "@/hooks/useSound";
import { BATCH_SIZE } from "@/lib/constants";
import useGridStore from "@/store/useGridStore";
import { useWasm } from "./useWasm";

interface RunReturns {
	execute: () => Promise<void>;
}

export function useRun(): RunReturns {
	const { readyToRun, setIsRunning } = useGridStore();
	const { runAlgorithm } = useWasm();

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

		try {
			const result = await runAlgorithm();

			if (!result || !result.success) {
				console.warn("No path found", result);
				setIsRunning(false);
				return;
			}

			const { visited, path, nodeIdToCoord } = result;

			const animateBatch = async (
				nodeIds: number[],
				state: "visited" | "path",
			) => {
				for (let i = 0; i < nodeIds.length; i += BATCH_SIZE) {
					const batch = nodeIds.slice(i, i + BATCH_SIZE);

					useGridStore.setState((gridState) => {
						const newGrid = gridState.cellules.map((row) =>
							row.map((cell) => ({ ...cell })),
						);

						batch.forEach((nodeId) => {
							const coord = nodeIdToCoord.get(nodeId);
							if (coord) {
								const { x, y } = coord;

								// Check bounds
								if (y < newGrid.length && x < newGrid[0].length) {
									const currentState = newGrid[y][x].state;
									if (
										currentState !== "start" &&
										currentState !== "end"
									) {
										newGrid[y][x].state = state;
									}
								}
							} else {
								console.warn(`No coordinates for nodeId ${nodeId}`);
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

			if (visited && visited.length > 0) {
				await animateBatch(visited, "visited");
			}

			await new Promise((resolve) => setTimeout(resolve, 200));

			if (path && path.length > 0) {
				await animateBatch(path, "path");
				await playSuccessChord();
			}
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setIsRunning(false);
		}
	}, [
		readyToRun,
		setIsRunning,
		initializeAudio,
		playVisitedSound,
		playPathSound,
		playSuccessChord,
		runAlgorithm,
	]);

	return { execute };
}
