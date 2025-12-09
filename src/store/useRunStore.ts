/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface RunStore {
	isRunning: boolean;
	setIsRunning: (running: boolean) => void;
	toggleRunning: () => void;
}

export const useRunStore = create<RunStore>()(
	devtools(
		(set) => ({
			isRunning: false,

			setIsRunning: (running: boolean) => {
				set({ isRunning: running });
			},

			toggleRunning: () => {
				set((state) => ({ isRunning: !state.isRunning }));
			},
		}),
		{
			name: "run-store",
		},
	),
);

export default useRunStore;
