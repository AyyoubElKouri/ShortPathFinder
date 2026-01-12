/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include "../include/enums/AlgorithmType.hh"
#include <emscripten/bind.h>

using namespace emscripten;

EMSCRIPTEN_BINDINGS(algorithm_types) {
  enum_<AlgorithmType>("AlgorithmType")
      .value("BFS", AlgorithmType::BFS)
      .value("DIJKSTRA", AlgorithmType::DIJKSTRA)
      .value("ASTAR", AlgorithmType::ASTAR)
      .value("IDASTAR", AlgorithmType::IDASTAR)
      .value("DFS", AlgorithmType::DFS)
      .value("JUMPPOINT", AlgorithmType::JUMPPOINT)
      .value("ORTHOGONALJUMPPOINT", AlgorithmType::ORTHOGONALJUMPPOINT)
      .value("TRACE", AlgorithmType::TRACE);
}
