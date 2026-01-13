/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { create } from "zustand";
import { Algorithm, Heuristic } from "../lib/enums";

/**
 * Interface for the configuration store
 * Defines the state and actions for pathfinding algorithm settings
 */
interface ConfigStore {
	/**
	 * The selected pathfinding algorithm
	 */
	algorithm: Algorithm;

	/**
	 * The heuristic function to be used (if applicable)
	 */
	heuristic: Heuristic;

	/**
	 * Whether diagonal movement is allowed
	 */
	allowDiagonal: boolean;

	/**
	 * Whether the search is bidirectional
	 */
	bidirectional: boolean;

	/**
	 * Whether the pathfinder should avoid crossing corners
	 */
	dontCrossCorners: boolean;

	/**
	 * Set the algorithm to be used
	 * @param algorithm - The algorithm to set
	 */
	setAlgorithm: (algorithm: Algorithm) => void;

	/**
	 * Set the heuristic function to be used
	 * @param heuristic - The heuristic to set
	 */
	setHeuristic: (heuristic: Heuristic) => void;

	/**
	 * Set multiple configuration options at once
	 * @param config - Partial configuration object to update
	 */
	setConfig: (
		config: Partial<
			Omit<ConfigStore, "setAlgorithm" | "setHeuristic" | "setConfig">
		>,
	) => void;
}

/**
 * Custom hook that creates and manages the configuration store
 * Uses Zustand for state management with TypeScript support
 */
export const useConfigStore = create<ConfigStore>((set) => ({
	// Default values as specified
	algorithm: Algorithm.DIJKSTRA,
	heuristic: Heuristic.MANHATTAN,
	allowDiagonal: true,
	bidirectional: false,
	dontCrossCorners: false,

	/**
	 * Updates the algorithm in the store
	 * @param algorithm - The new algorithm to set
	 */
	setAlgorithm: (algorithm: Algorithm) =>
		set(() => ({
			algorithm,
		})),

	/**
	 * Updates the heuristic in the store
	 * @param heuristic - The new heuristic to set
	 */
	setHeuristic: (heuristic: Heuristic) =>
		set(() => ({
			heuristic,
		})),

	/**
	 * Updates multiple configuration options at once
	 * Merges the provided config with the existing state
	 * @param config - Partial configuration object containing updates
	 */
	setConfig: (config) =>
		set((state) => ({
			// Spread existing state, then override with new config values
			...state,
			...config,
		})),
}));