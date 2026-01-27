/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import type { MainModule } from "./pathfinding";

declare global {
	var PathfindingModule: any;
}

export async function loadWasm(): Promise<MainModule> {
	// If already loaded globally, use it
	if (typeof globalThis.PathfindingModule === "function") {
		const module = await globalThis.PathfindingModule();
		return module as MainModule;
	}

	// Otherwise, load the script dynamically
	return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = "/src/wasm/pathfinding.js";
		script.onload = async () => {
			try {
				const PathfindingModuleFactory = globalThis.PathfindingModule;
				if (typeof PathfindingModuleFactory !== "function") {
					throw new Error("PathfindingModule is not a function after loading script");
				}
				const module = await PathfindingModuleFactory();
				resolve(module as MainModule);
			} catch (error) {
				reject(error);
			}
		};
		script.onerror = () => {
			reject(new Error("Failed to load pathfinding.js"));
		};
		document.head.appendChild(script);
	});
}
