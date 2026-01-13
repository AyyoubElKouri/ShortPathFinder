import { useCallback } from "react";
import { useWasmGraphBuilder } from "./useWasmGraphBuilder";
import { useAlgorithm } from "./useAlgorithm";
import { Algorithm, Heuristic } from "@/lib/types";

export const useWasm = () => {
	const {
		wasmModule,
		buildGraphFromGrid,
		findSpecialNodeIds,
		isLoading: wasmLoading,
		error: wasmError,
	} = useWasmGraphBuilder();

	const { algorithm, config } = useAlgorithm();

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

		function getAlgorithm() {
      // if (!wasmModule) return;

      switch (algorithm) {
        case Algorithm.ASTAR:
          return wasmModule!.AlgorithmType.ASTAR;
        case Algorithm.DIJKSTRA:
          return wasmModule!.AlgorithmType.DIJKSTRA;
        // case Algorithm.BFS:
        //   return wasmModule!.AlgorithmType.BFS;
        default:
          return wasmModule!.AlgorithmType.DIJKSTRA;
      }
    }

		function getHeuristic() {

      switch (config.heuristic) {
        case Heuristic.MANHATTAN:
          return wasmModule!.HeuristicType.MANHATTAN;
        case Heuristic.EUCLIDEAN:
          return wasmModule!.HeuristicType.EUCLIDEAN;
        case Heuristic.OCTILE:
          return wasmModule!.HeuristicType.OCTILE;
        case Heuristic.CHEBYSHEV:
          return wasmModule!.HeuristicType.CHEBYSHEV;
        default:
          return wasmModule!.HeuristicType.MANHATTAN;
      }
    }

		const engine = new wasmModule.SearchEngine(
			getAlgorithm(),
			getHeuristic(),
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
	}, [wasmModule, buildGraphFromGrid, findSpecialNodeIds, algorithm, config.heuristic]);

	return {
		runAlgorithm,
		isWasmReady: !!wasmModule && !wasmLoading && !wasmError,
		isWasmLoading: wasmLoading,
		wasmError,
	};
};

// -----------------------------------------------------------
// GraphBuilder - hook
export interface GraphBuilderReturns {
	dummy: boolean;
}

export function useGraphBuilder() {}

// WebAssembly - hook
export interface WebAssemblyReturns {
	dummy: boolean;
}
export function useWebAssembly() {}

// useGridStore - store
export interface GridStore {
	dummy: boolean;
}
export function useGridStore() {}

// useSound - hook
export interface SoundReturns {
	dummy: boolean;
}
export function useSound() {}

// useScreen - hook
export interface ScreenReturns {
	dummy: boolean;
}
export function useScreen() {}

// useGrid - hook
export interface GridReturns {
	dummy: boolean;
}
export function useGrid() {}

// useRun - hook
export interface RunReturns {
	dummy: boolean;
}
export function useRun() {}

// Maze generator
export interface MazeGeneratorReturns {
	dummy: boolean;
}
export function useMazeGenerator() {}

// algorithm hook
export interface AlgorithmReturns {
	dummy: boolean;
}
// export function useAlgorithm() {}
