/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useCallback, useEffect, useRef, useState } from "react";
import type { PathfindingParams, PathfindingResponse } from "@/types";
import { loadWasm as _loadWasm } from "@/wasm/loader";
import type { MainModule } from "@/wasm/pathfinding";

interface WebAssemblyReturns {
	/**
	 * Indicates if the WebAssembly module is ready to use
	 */
	ready: boolean;

	/**
	 * PublicAPI to find the shortest path in the grid using the specified algorithm and parameters
	 */
	findPath: (params: PathfindingParams) => PathfindingResponse;
}

/**
 * @hook useWebAssembly
 * A custom hook to load and interact with the WebAssembly pathfinding module
 */
export function useWebAssembly(): WebAssemblyReturns {
	const [ready, setReady] = useState(false);
	const moduleRef = useRef<MainModule | null>(null);

	useEffect(() => {
		let mounted = true;

		async function loadWasm() {
			try {
				const wasmInstance: MainModule = await _loadWasm();

				if (mounted) {
					moduleRef.current = wasmInstance;
					setReady(true);
				}
			} catch (err) {
				if (mounted) {
					console.error("Error initializing WebAssembly module:", err);
					setReady(false);
				}
			}
		}

		loadWasm();

		return () => {
			mounted = false;
		};
	}, []);

	const findPath = useCallback(
		({
			grid,
			width,
			height,
			startIndex,
			goalIndex,
			algorithm,
			heuristic,
			allowDiagonal,
			dontCrossCorners,
			bidirectional,
		}: PathfindingParams): PathfindingResponse => {
			const mod = moduleRef.current;
			if (!mod) throw new Error("WebAssembly module is not ready");

			const cfg: any = {
				algorithm,
				heuristic: heuristic ?? (mod.HeuristicType ? mod.HeuristicType.MANHATTAN : undefined),
				allowDiagonal,
				dontCrossCorners,
				bidirectional,
			};

			const raw = (mod as any).PathfindingAPI.findPath(
				grid,
				width,
				height,
				startIndex,
				goalIndex,
				cfg,
			);

			const path: number[] = Array.isArray(raw.path) ? raw.path.map((v: any) => Number(v)) : [];
			const visited: number[] = Array.isArray(raw.visited)
				? raw.visited.map((v: any) => Number(v))
				: [];
			const success: boolean = Boolean(raw.success);
			const cost: number = Number(raw.cost ?? 0);
			const time: number = Number(raw.time_us ?? raw.time ?? 0);

			return { path, visited, success, cost, time };
		},
		[],
	);

	return { ready, findPath };
}

declare global {
	interface Window {
		PathfindingModule: any;
	}
}
