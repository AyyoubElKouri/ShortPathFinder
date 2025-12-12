/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { create } from "zustand";
import { NON_HEURISTIC_ALGOS } from "@/lib/constants";
import { Algorithm, Heuristic } from "@/lib/types";

export interface AlgorithmConfig {
	allowDiagonal: boolean;
	bidirectional: boolean;
	dontCrossCorners: boolean;
	heuristic?: Heuristic;
}

export interface AlgorithmStore {
	algorithm: Algorithm;
	config: AlgorithmConfig;
	setAlgorithm: (algorithm: Algorithm) => void;
	setConfig: (config: Partial<AlgorithmConfig>) => void;
}

const DEFAULT_CONFIG: AlgorithmConfig = {
	allowDiagonal: true,
	bidirectional: false,
	dontCrossCorners: false,
	heuristic: Heuristic.MANHATTAN,
};

export const useAlgorithmStore = create<AlgorithmStore>((set, get) => ({
	algorithm: Algorithm.DIJKSTRA,
	config: DEFAULT_CONFIG,

	setAlgorithm: (algorithm) => {
		const isNonHeuristic = NON_HEURISTIC_ALGOS.includes(algorithm);

		const newConfig = { ...get().config };
		if (isNonHeuristic) {
			delete newConfig.heuristic;
		} else if (!newConfig.heuristic) {
			newConfig.heuristic = DEFAULT_CONFIG.heuristic;
		}

		set({ algorithm, config: newConfig });
	},

	setConfig: (config) => {
		const algorithm = get().algorithm;
		const newConfig = { ...get().config, ...config };
		if (NON_HEURISTIC_ALGOS.includes(algorithm)) {
			delete newConfig.heuristic;
		}

		set({ config: newConfig });
	},
}));
