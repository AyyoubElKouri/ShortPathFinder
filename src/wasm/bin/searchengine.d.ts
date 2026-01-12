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
export interface VectorEdge extends ClassHandle {
  push_back(_0: Edge): void;
  resize(_0: number, _1: Edge): void;
  size(): number;
  get(_0: number): Edge | undefined;
  set(_0: number, _1: Edge): boolean;
}

export interface VectorInt extends ClassHandle {
  push_back(_0: number): void;
  resize(_0: number, _1: number): void;
  size(): number;
  get(_0: number): number | undefined;
  set(_0: number, _1: number): boolean;
}

export interface Edge extends ClassHandle {
  targetId: number;
  weight: number;
}

export interface SearchGraph extends ClassHandle {
  addNode(): void;
  addEdge(_0: number, _1: number, _2: number): void;
  nodeExists(_0: number): boolean;
  getNeighbors(_0: number): VectorEdge;
  getNodeCount(): number;
  addNodeXY(_0: number, _1: number): void;
  getNodeX(_0: number): number;
  getNodeY(_0: number): number;
}

export interface SearchResults extends ClassHandle {
  path: VectorInt;
  visited: VectorInt;
  success: boolean;
  cost: number;
  time: number;
}

export interface AlgorithmTypeValue<T extends number> {
  value: T;
}
export type AlgorithmType = AlgorithmTypeValue<0>|AlgorithmTypeValue<1>|AlgorithmTypeValue<2>|AlgorithmTypeValue<3>|AlgorithmTypeValue<4>|AlgorithmTypeValue<5>|AlgorithmTypeValue<6>|AlgorithmTypeValue<7>;

export interface HeuristicTypeValue<T extends number> {
  value: T;
}
export type HeuristicType = HeuristicTypeValue<0>|HeuristicTypeValue<1>|HeuristicTypeValue<2>|HeuristicTypeValue<3>;

export interface SearchEngine extends ClassHandle {
  runSearch(): SearchResults;
}

interface EmbindModule {
  VectorEdge: {
    new(): VectorEdge;
  };
  VectorInt: {
    new(): VectorInt;
  };
  Edge: {
    new(_0: number, _1: number): Edge;
  };
  SearchGraph: {
    new(_0: boolean): SearchGraph;
  };
  SearchResults: {
    new(): SearchResults;
  };
  AlgorithmType: {BFS: AlgorithmTypeValue<0>, DIJKSTRA: AlgorithmTypeValue<1>, ASTAR: AlgorithmTypeValue<2>, IDASTAR: AlgorithmTypeValue<3>, DFS: AlgorithmTypeValue<4>, JUMPPOINT: AlgorithmTypeValue<5>, ORTHOGONALJUMPPOINT: AlgorithmTypeValue<6>, TRACE: AlgorithmTypeValue<7>};
  HeuristicType: {MANHATTAN: HeuristicTypeValue<0>, EUCLIDEAN: HeuristicTypeValue<1>, OCTILE: HeuristicTypeValue<2>, CHEBYSHEV: HeuristicTypeValue<3>};
  SearchEngine: {
    new(_0: AlgorithmType, _1: HeuristicType, _2: SearchGraph, _3: number, _4: number, _5: boolean, _6: boolean, _7: boolean): SearchEngine;
    new(_0: AlgorithmType, _1: SearchGraph, _2: number, _3: number, _4: boolean, _5: boolean, _6: boolean): SearchEngine;
  };
}

export type MainModule = WasmModule & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
