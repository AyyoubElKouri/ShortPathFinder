/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { create } from "zustand";

import { DEFAULT_CONFIG } from "@/constants";
import { Algorithm, type PathfindingConfig } from "@/types";
import { isHeuristic } from "@/utils";

export interface AlgorithmStore {
	/**
	 * The currently selected pathfinding algorithm.
	 */
	algorithm: Algorithm;

	/**
	 * The configuration settings for the selected pathfinding algorithm.
	 */
	config: PathfindingConfig;

	/**
	 * Sets the current pathfinding algorithm.
	 * @param algorithm - The algorithm to set.
	 */
	setAlgorithm: (algorithm: Algorithm) => void;

	/**
	 * Updates the configuration settings for the pathfinding algorithm.
	 * @param config - Partial configuration to update.
	 */
	setConfig: (config: Partial<PathfindingConfig>) => void;
}

/**
 * @function useAlgorithmStore
 * Zustand store for managing the state of the pathfinding algorithm and its configuration.
 */
export const useAlgorithmStore = create<AlgorithmStore>((set, get) => ({
	algorithm: Algorithm.DIJKSTRA,
	config: DEFAULT_CONFIG,

	setAlgorithm: (algorithm) => {
		const newConfig = { ...get().config };
		if (!isHeuristic(algorithm)) {
			delete newConfig.heuristic;
		} else if (!newConfig.heuristic) {
			newConfig.heuristic = DEFAULT_CONFIG.heuristic;
		}

		set({ algorithm, config: newConfig });
	},

	setConfig: (config) => {
		const algorithm = get().algorithm;
		const newConfig = { ...get().config, ...config };
		if (!isHeuristic(algorithm)) {
			delete newConfig.heuristic;
		}

		set({ config: newConfig });
	},
}));
