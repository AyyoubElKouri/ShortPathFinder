/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { create } from "zustand";
import { Mode } from "../lib/enums";

interface ModeStore {
	/**
	 * The current mode of the application (e.g., grid, graph, etc.)
	 */
	mode: Mode;

	/**
	 * Sets the current mode of the application
	 * @param mode - The new mode to set
	 */
	setMode: (mode: Mode) => void;
}

/**
 * Zustand store for managing the application mode
 */
export const useModeStore = create<ModeStore>((set) => ({
	mode: Mode.GRID, // Default mode
	setMode: (mode: Mode) => set({ mode }),
}));
