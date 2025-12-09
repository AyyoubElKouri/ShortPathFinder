/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useCallback, useEffect, useRef } from "react";
import { Frequency, Synth, start } from "tone";

import { useWasm } from "@/hooks/useWasm";
import { BATCH_SIZE } from "@/lib/constants";
import useGridStore from "@/store/useGridStore";

export function useRun() {
	const { readyToRun, setIsRunning } = useGridStore();
	const { runPathfinding } = useWasm();

	const synthRef = useRef<Synth | null>(null);
	const bassRef = useRef<Synth | null>(null);

	useEffect(() => {
		synthRef.current = new Synth({
			oscillator: { type: "sine" },
			envelope: {
				attack: 0.001,
				decay: 0.1,
				sustain: 0,
				release: 0.1,
			},
		}).toDestination();

		bassRef.current = new Synth({
			envelope: {
				attack: 0.01,
				decay: 0.2,
				sustain: 0,
				release: 0.2,
			},
		}).toDestination();

		synthRef.current.volume.value = -15;
		bassRef.current.volume.value = -10;

		return () => {
			synthRef.current?.dispose();
			bassRef.current?.dispose();
		};
	}, []);

	const execute = useCallback(async () => {
		readyToRun();
		setIsRunning(true);

		await start();

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
					const note = Frequency(400 + i * 2, "hz").toNote();
					synthRef.current?.triggerAttackRelease(note, "32n");
				} else if (state === "path") {
					const note = Frequency(200 + i * 1, "hz").toNote();
					bassRef.current?.triggerAttackRelease(note, "16n");
				}

				await new Promise((resolve) => setTimeout(resolve, 50));
			}
		};

		await animateBatch(visited, "visited");

		await new Promise((resolve) => setTimeout(resolve, 200));

		await animateBatch(path, "path");

		if (path.length > 0) {
			bassRef.current?.triggerAttackRelease("C3", "4n");
			await new Promise((resolve) => setTimeout(resolve, 100));
			bassRef.current?.triggerAttackRelease("E3", "4n");
			await new Promise((resolve) => setTimeout(resolve, 100));
			bassRef.current?.triggerAttackRelease("G3", "2n");
		}

		setIsRunning(false);
	}, [runPathfinding, readyToRun, setIsRunning]);

	return { execute };
}
