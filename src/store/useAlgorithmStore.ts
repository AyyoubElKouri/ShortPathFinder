/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { create } from "zustand";
import type { Algorithm } from "@/lib/types";

export interface AlgorithmConfig {
	allowDiagonal: boolean;
	bidirectional: boolean;
	dontCrossCorners: boolean;
	heuristic?: "manhattan" | "euclidean" | "octile" | "chebyshev";
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
	heuristic: "manhattan",
};

const NON_HEURISTIC_ALGOS: Algorithm[] = [
	"Dijkstra",
	"Breadth-First Search",
	"Depth-First Search",
	"Trace",
];

export const useAlgorithmStore = create<AlgorithmStore>((set, get) => ({
	algorithm: "A*",
	config: DEFAULT_CONFIG,

	setAlgorithm: (algorithm) => {
		const isNonHeuristic = NON_HEURISTIC_ALGOS.includes(algorithm);

		set(() => ({
			algorithm,
			config: {
				...get().config,
				heuristic: isNonHeuristic
					? undefined
					: (get().config.heuristic ?? "manhattan"),
			},
		}));
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
