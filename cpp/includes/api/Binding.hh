/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#pragma once

#include <emscripten/val.h>
#include "types/Enums.hh"

namespace api {

struct PathfindingConfig {
  AlgorithmType algorithm = AlgorithmType::ASTAR;
  HeuristicType heuristic = HeuristicType::MANHATTAN;
  bool allowDiagonal = true;
  bool dontCrossCorners = false;
  bool bidirectional = false;
};

class PathfindingAPI {
public:
  static emscripten::val findPath(
      const emscripten::val& gridArray,
      int width,
      int height,
      int startIndex,
      int goalIndex,
      const PathfindingConfig& config
  );
};

} // namespace api