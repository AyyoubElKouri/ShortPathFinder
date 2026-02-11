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
export type AlgorithmType = AlgorithmTypeValue<0>|AlgorithmTypeValue<1>|AlgorithmTypeValue<2>|AlgorithmTypeValue<3>|AlgorithmTypeValue<4>|AlgorithmTypeValue<5>|AlgorithmTypeValue<6>|AlgorithmTypeValue<7>;

export interface HeuristicTypeValue<T extends number> {
  value: T;
}
export type HeuristicType = HeuristicTypeValue<0>|HeuristicTypeValue<1>|HeuristicTypeValue<2>|HeuristicTypeValue<3>;

export type PathfindingConfig = {
  algorithm: AlgorithmType,
  heuristic: HeuristicType,
  allowDiagonal: boolean,
  dontCrossCorners: boolean,
  bidirectional: boolean
};

export interface PathfindingAPI extends ClassHandle {
}

interface EmbindModule {
  AlgorithmType: {BFS: AlgorithmTypeValue<0>, DIJKSTRA: AlgorithmTypeValue<1>, ASTAR: AlgorithmTypeValue<2>, IDASTAR: AlgorithmTypeValue<3>, DFS: AlgorithmTypeValue<4>, JUMPPOINT: AlgorithmTypeValue<5>, ORTHOGONALJUMPPOINT: AlgorithmTypeValue<6>, TRACE: AlgorithmTypeValue<7>};
  HeuristicType: {MANHATTAN: HeuristicTypeValue<0>, EUCLIDEAN: HeuristicTypeValue<1>, OCTILE: HeuristicTypeValue<2>, CHEBYSHEV: HeuristicTypeValue<3>};
  PathfindingAPI: {
    findPath(_0: any, _1: number, _2: number, _3: number, _4: number, _5: PathfindingConfig): any;
  };
}

export type MainModule = WasmModule & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
