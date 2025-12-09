/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { create } from "zustand";
import { ALGORITHMS, HeuristicType } from "@/lib/constants";
import type { Algorithm } from "@/lib/types";

export interface AlgorithmConfig {
	allowDiagonal: boolean;
	bidirectional: boolean;
	dontCrossCorners: boolean;
	heuristic?: (typeof HeuristicType)[keyof typeof HeuristicType];
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
	heuristic: HeuristicType.MANHATTAN,
};

const NON_HEURISTIC_ALGOS: Algorithm[] = [ALGORITHMS[0]];

export const useAlgorithmStore = create<AlgorithmStore>((set, get) => ({
	algorithm: ALGORITHMS[0],
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
