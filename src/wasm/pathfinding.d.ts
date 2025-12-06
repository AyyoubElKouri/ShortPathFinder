// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
interface WasmModule {
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
export interface AlgorithmValue<T extends number> {
  value: T;
}
export type Algorithm = AlgorithmValue<0>|AlgorithmValue<1>|AlgorithmValue<2>|AlgorithmValue<3>|AlgorithmValue<4>|AlgorithmValue<5>|AlgorithmValue<6>|AlgorithmValue<7>;

export interface HeuristicValue<T extends number> {
  value: T;
}
export type Heuristic = HeuristicValue<0>|HeuristicValue<1>|HeuristicValue<2>|HeuristicValue<3>;

export interface VectorUint8 extends ClassHandle {
  push_back(_0: number): void;
  resize(_0: number, _1: number): void;
  size(): number;
  get(_0: number): number | undefined;
  set(_0: number, _1: number): boolean;
}

export interface VectorInt extends ClassHandle {
  push_back(_0: number): void;
  resize(_0: number, _1: number): void;
  size(): number;
  get(_0: number): number | undefined;
  set(_0: number, _1: number): boolean;
}

export interface PathfindingInput extends ClassHandle {
  grid: VectorUint8;
  algorithm: Algorithm;
  heuristic: Heuristic;
  allowDiagonal: boolean;
  bidirectional: boolean;
  dontCrossCorners: boolean;
  rows: number;
  cols: number;
  startIndex: number;
  endIndex: number;
}

export interface PathfindingResult extends ClassHandle {
  visited: VectorInt;
  path: VectorInt;
  success: boolean;
  cost: number;
}

export interface PathfindingEngine extends ClassHandle {
  run(_0: PathfindingInput): PathfindingResult;
}

interface EmbindModule {
  Algorithm: {BFS: AlgorithmValue<0>, DIJKSTRA: AlgorithmValue<1>, ASTAR: AlgorithmValue<2>, IDASTAR: AlgorithmValue<3>, DFS: AlgorithmValue<4>, JUMPPOINT: AlgorithmValue<5>, ORTHOGONALJUMPPOINT: AlgorithmValue<6>, TRACE: AlgorithmValue<7>};
  Heuristic: {MANHATTAN: HeuristicValue<0>, EUCLIDEAN: HeuristicValue<1>, OCTILE: HeuristicValue<2>, CHEBYSHEV: HeuristicValue<3>};
  VectorUint8: {
    new(): VectorUint8;
  };
  VectorInt: {
    new(): VectorInt;
  };
  PathfindingInput: {
    new(): PathfindingInput;
  };
  PathfindingResult: {
    new(): PathfindingResult;
  };
  PathfindingEngine: {
    new(): PathfindingEngine;
  };
}

export type MainModule = WasmModule & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
