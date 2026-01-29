/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

/**
 * TODO: This file to be refactored.
 */

import { useCallback } from "react";
import { useSound } from "@/hooks/helpers/useSound";
import { useAlgorithmStore } from "@/stores";
import useGridStore from "@/stores/grid.store.ts";
import { Algorithm, Heuristic } from "@/types";
import { useWebAssembly } from "./useWebAssembly";

interface RunReturns {
	execute: () => Promise<void>;
}

export function useRun(): RunReturns {
	const { prepareGrid, setIsRunning, cellules } = useGridStore();
	const { algorithm, config } = useAlgorithmStore();
	const { ready, findPath } = useWebAssembly();

	const { initializeAudio, playVisitedSound, playPathSound, playSuccessChord } = useSound();

	const execute = useCallback(async () => {
		prepareGrid();
		setIsRunning(true);

		await initializeAudio();

		try {
			// Prepare start/goal and grid, then call the wasm adapter's findPath.
			if (!ready) {
				console.error("WebAssembly module is not ready");
				return;
			}

			// locate start and goal
			let startId = -1;
			let goalId = -1;

			const w = cellules[0].length;
			const h = cellules.length;

			for (let y = 0; y < h; y++) {
				for (let x = 0; x < w; x++) {
					const cell = cellules[y][x];
					if (cell.state === "start") startId = y * w + x;
					if (cell.state === "end") goalId = y * w + x;
				}
			}
			if (startId === -1 || goalId === -1) {
				console.error("Start or end node not found");
				return;
			}

			const gridData = new Uint8Array(
				cellules.flat().map((cell) => (cell.state === "wall" ? 1 : 0)),
			);

			// map local enums to wasm numeric values (embind expects { value: number })
			const wasmAlgorithm = ((): any => {
				switch (algorithm) {
					case Algorithm.DIJKSTRA:
						return { value: 1 };
					case Algorithm.ASTAR:
						return { value: 2 };
					default:
						return { value: 1 };
				}
			})();

			const wasmHeuristic = ((): any => {
				switch (config.heuristic) {
					case Heuristic.MANHATTAN:
						return { value: 0 };
					case Heuristic.EUCLIDEAN:
						return { value: 1 };
					case Heuristic.OCTILE:
						return { value: 2 };
					case Heuristic.CHEBYSHEV:
						return { value: 3 };
				}
			})();

			const result = findPath({
				grid: gridData,
				width: w,
				height: h,
				startIndex: startId,
				goalIndex: goalId,
				algorithm: wasmAlgorithm,
				heuristic: wasmHeuristic,
				allowDiagonal: config.allowDiagonal,
				bidirectional: config.bidirectional,
				dontCrossCorners: config.dontCrossCorners,
			});

			const { visited, path, success, cost, time } = result;

			// Créer une Map pour convertir nodeId -> coordonnées (x, y)
			const createNodeIdToCoordMap = (): Map<number, { x: number; y: number }> => {
				const map = new Map<number, { x: number; y: number }>();
				const width = cellules[0].length;
				const height = cellules.length;

				for (let y = 0; y < height; y++) {
					for (let x = 0; x < width; x++) {
						const nodeId = y * width + x;
						map.set(nodeId, { x, y });
					}
				}

				return map;
			};

			const nodeIdToCoord = createNodeIdToCoordMap();

			const animateBatch = async (nodeIds: number[], state: "visited" | "path") => {
				for (let i = 0; i < nodeIds.length; i += 5) {
					const batch = nodeIds.slice(i, i + 5);

					useGridStore.setState((gridState) => {
						const newGrid = gridState.cellules.map((row) => row.map((cell) => ({ ...cell })));

						batch.forEach((nodeId) => {
							const coord = nodeIdToCoord.get(nodeId);
							if (coord) {
								const { x, y } = coord;

								// Check bounds
								if (y < newGrid.length && x < newGrid[0].length) {
									const currentState = newGrid[y][x].state;
									if (currentState !== "start" && currentState !== "end") {
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

			// Afficher les statistiques
			console.log(
				`Path found! success=${success} Cost: ${cost}, Time: ${time}ms, Visited: ${visited?.length || 0}, Path length: ${path?.length || 0}`,
			);
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setIsRunning(false);
		}
	}, [
		prepareGrid,
		setIsRunning,
		initializeAudio,
		playVisitedSound,
		playPathSound,
		playSuccessChord,
		cellules,
		algorithm,
		config,
		ready,
		findPath,
	]);

	return { execute };
}
