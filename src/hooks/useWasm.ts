import { useCallback } from "react";
import { useWasmGraphBuilder } from "./useWasmGraphBuilder";

export const useWasm = () => {
	const {
		wasmModule,
		buildGraphFromGrid, 
		findSpecialNodeIds,
		isLoading: wasmLoading,
		error: wasmError,
	} = useWasmGraphBuilder();

	const runAlgorithm = useCallback(async () => {
		if (!wasmModule) {
			throw new Error("WASM module not loaded");
		}
		
		const buildResult = buildGraphFromGrid();
		if (!buildResult) {
			throw new Error("Failed to build graph");
		}

		const { graph: wasmGraph, nodeIdToCoord } = buildResult;

		const { startId, endId } = findSpecialNodeIds(wasmGraph);

		if (startId === -1 || endId === -1) {
			throw new Error("Start or end node not found");
		}

		
		const engine = new wasmModule.SearchEngine(
			wasmModule.AlgorithmType.DIJKSTRA,
			wasmModule.HeuristicType.EUCLIDEAN,
			wasmGraph,
			startId,
			endId,
			false,
			false,
			false,
		);

		const results = engine.runSearch();

		const vectorToArray = (vector: any): number[] => {
			const arr: number[] = [];
			for (let i = 0; i < vector.size(); i++) {
				arr.push(vector.get(i));
			}
			return arr;
		};

		return {
			path: vectorToArray(results.path),
			visited: vectorToArray(results.visited),
			success: results.success,
			cost: results.cost,
			time: results.time,
			nodeIdToCoord: nodeIdToCoord,
		};
	}, [wasmModule, buildGraphFromGrid, findSpecialNodeIds]);

	return {
		runAlgorithm,
		isWasmReady: !!wasmModule && !wasmLoading && !wasmError,
		isWasmLoading: wasmLoading,
		wasmError,
	};
};
