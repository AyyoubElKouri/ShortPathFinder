/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { create } from "zustand";
import { ApplicationMode } from "@/types";

interface ModeStore {
	/**
	 * The current application mode.
	 */
	mode: ApplicationMode;

	/**
	 * Sets the application mode.
	 * @param mode - The new application mode.
	 */
	setMode: (mode: ApplicationMode) => void;
}

/**
 * @function useModeStore
 * Zustand store for managing the application mode state.
 */
export const useModeStore = create<ModeStore>((set) => ({
	mode: ApplicationMode.SingleGrid,
	setMode: (mode) => set({ mode }),
}));
