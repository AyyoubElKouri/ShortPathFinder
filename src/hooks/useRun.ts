/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useCallback } from "react";
import { useSound } from "@/hooks/helpers/useSound";
import { useAlgorithmStore, useModeStore, useSecondAlgorithm } from "@/stores";
import useGridStore from "@/stores/grid.store.ts";
import { Algorithm, ApplicationMode, Heuristic, type PathfindingConfig } from "@/types";
import { useWebAssembly } from "./useWebAssembly";

interface RunReturns {
	execute: () => Promise<void>;
}

export function useRun(): RunReturns {
	const { prepareGrid, setIsRunning } = useGridStore();
	const { algorithm, config, setLastResult } = useAlgorithmStore();
	const {
		algorithm: secondAlgorithm,
		config: secondConfig,
		setLastResult: setSecondLastResult,
	} = useSecondAlgorithm();
	const { mode } = useModeStore();
	const { ready, findPath } = useWebAssembly();

	const { initializeAudio, playVisitedSound, playPathSound, playSuccessChord } = useSound();

	const execute = useCallback(async () => {
		prepareGrid();
		setIsRunning(true);
		setLastResult(null);
		setSecondLastResult(null);

		await initializeAudio();

		try {
			// Prepare start/goal and grid, then call the wasm adapter's findPath.
			if (!ready) {
				console.error("WebAssembly module is not ready");
				return;
			}

			const { cellules } = useGridStore.getState();

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

			const baseGridData = new Uint8Array(
				cellules.flat().map((cell) => (cell.state === "wall" ? 1 : 0)),
			);

			// map local enums to wasm numeric values (embind expects { value: number })
			const toWasmAlgorithm = (value: Algorithm): any => {
				switch (value) {
					case Algorithm.BFS:
						return { value: 0 };
					case Algorithm.DIJKSTRA:
						return { value: 1 };
					case Algorithm.ASTAR:
						return { value: 2 };
					case Algorithm.IDASTAR:
						return { value: 3 };
					case Algorithm.DFS:
						return { value: 4 };
					case Algorithm.JUMPPOINT:
						return { value: 5 };
					case Algorithm.ORTHOGONALJUMPPOINT:
						return { value: 6 };
					case Algorithm.TRACE:
						return { value: 7 };
					default:
						return { value: 1 };
				}
			};

			const toWasmHeuristic = (value?: Heuristic): any => {
				switch (value) {
					case Heuristic.MANHATTAN:
						return { value: 0 };
					case Heuristic.EUCLIDEAN:
						return { value: 1 };
					case Heuristic.OCTILE:
						return { value: 2 };
					case Heuristic.CHEBYSHEV:
						return { value: 3 };
					default:
						return undefined;
				}
			};

			const buildParams = (grid: Uint8Array, algo: Algorithm, algoConfig: PathfindingConfig) => ({
				grid,
				width: w,
				height: h,
				startIndex: startId,
				goalIndex: goalId,
				algorithm: toWasmAlgorithm(algo),
				heuristic: toWasmHeuristic(algoConfig.heuristic),
				allowDiagonal: algoConfig.allowDiagonal,
				bidirectional: algoConfig.bidirectional,
				dontCrossCorners: algoConfig.dontCrossCorners,
			});

			const logStats = (label: string, result: ReturnType<typeof findPath>) => {
				console.log(
					`${label} success=${result.success} Cost: ${result.cost}, Time: ${result.time}ms, Visited: ${result.visited?.length || 0}, Path length: ${result.path?.length || 0}`,
				);
			};

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

			const animateBatch = async (
				nodeIds: number[],
				state: "visited" | "path",
				target: "cellules" | "secondCellules",
				withSound: boolean,
			) => {
				for (let i = 0; i < nodeIds.length; i += 5) {
					const batch = nodeIds.slice(i, i + 5);

					useGridStore.setState((gridState) => {
						const sourceGrid =
							target === "cellules" ? gridState.cellules : gridState.secondCellules;
						const newGrid = sourceGrid.map((row) => row.map((cell) => ({ ...cell })));

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

						return target === "cellules"
							? { cellules: newGrid }
							: { secondCellules: newGrid };
					});

					if (withSound) {
						if (state === "visited") {
							playVisitedSound(i);
						} else if (state === "path") {
							playPathSound(i);
						}
					}

					await new Promise((resolve) => setTimeout(resolve, 50));
				}
			};

			const animateResult = async (
				result: ReturnType<typeof findPath>,
				target: "cellules" | "secondCellules",
				withSound: boolean,
			) => {
				if (result.visited && result.visited.length > 0) {
					await animateBatch(result.visited, "visited", target, withSound);
				}

				await new Promise((resolve) => setTimeout(resolve, 200));

				if (result.path && result.path.length > 0) {
					await animateBatch(result.path, "path", target, withSound);
					if (withSound) {
						await playSuccessChord();
					}
				}
			};

			if (mode === ApplicationMode.DoubleGrid) {
				const firstGrid = baseGridData.slice();
				const secondGrid = baseGridData.slice();

				const firstResult = findPath(buildParams(firstGrid, algorithm, config));
				const secondResult = findPath(buildParams(secondGrid, secondAlgorithm, secondConfig));

				setLastResult({ cost: firstResult.cost, visited: firstResult.visited });
				setSecondLastResult({ cost: secondResult.cost, visited: secondResult.visited });

				await Promise.all([
					animateResult(firstResult, "cellules", true),
					animateResult(secondResult, "secondCellules", false),
				]);

				logStats("First grid:", firstResult);
				logStats("Second grid:", secondResult);
			} else {
				const firstGrid = baseGridData.slice();
				const result = findPath(buildParams(firstGrid, algorithm, config));

				setLastResult({ cost: result.cost, visited: result.visited });
				await animateResult(result, "cellules", true);
				logStats("Path found!", result);
			}
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setIsRunning(false);
		}
	}, [
		prepareGrid,
		setIsRunning,
		setLastResult,
		setSecondLastResult,
		initializeAudio,
		playVisitedSound,
		playPathSound,
		playSuccessChord,
		algorithm,
		config,
		secondAlgorithm,
		secondConfig,
		mode,
		ready,
		findPath,
	]);

	return { execute };
}
