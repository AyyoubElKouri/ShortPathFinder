/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
interface WasmModule {
	_main(_0: number, _1: number): number;
}

export interface ClassHandle {
	isAliasOf(other: ClassHandle): boolean;
	delete(): void;
	deleteLater(): this;
	isDeleted(): boolean;
	// @ts-ignore - If targeting lower than ESNext, this symbol might not exist.
	[Symbol.dispose](): void;
	clone(): this;
}
export interface AlgorithmTypeValue<T extends number> {
	value: T;
}
export type AlgorithmType = AlgorithmTypeValue<2> | AlgorithmTypeValue<1>;

export interface HeuristicTypeValue<T extends number> {
	value: T;
}
export type HeuristicType = HeuristicTypeValue<0> | HeuristicTypeValue<1>;

export type PathfindingConfig = {
	algorithm: AlgorithmType;
	heuristic: HeuristicType;
	allowDiagonal: boolean;
	dontCrossCorners: boolean;
	bidirectional: boolean;
};

export interface PathfindingAPI extends ClassHandle {}

interface EmbindModule {
	AlgorithmType: { ASTAR: AlgorithmTypeValue<2>; DIJKSTRA: AlgorithmTypeValue<1> };
	HeuristicType: { MANHATTAN: HeuristicTypeValue<0>; EUCLIDEAN: HeuristicTypeValue<1> };
	PathfindingAPI: {
		findPath(_0: any, _1: number, _2: number, _3: number, _4: number, _5: PathfindingConfig): any;
	};
}

export type MainModule = WasmModule & EmbindModule;
export default function MainModuleFactory(options?: unknown): Promise<MainModule>;
