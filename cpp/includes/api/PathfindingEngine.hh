/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#pragma once

#include <vector>

#include "types/Structs.hh"
#include "types/Enums.hh"

/**
 * @brief Pathfinding engine providing a unified interface for various algorithms.
 * 
 * This class offers a static method to find paths on a grid using different
 * pathfinding algorithms and heuristics.
 * 
 * @public Is the publicAPI for WebAssembly bindings.
 */
class PathfindingEngine {

  public:
    static Result findPath(const std::vector<int>& grid, int width, int height, int startIndex, int goalIndex, AlgorithmType algorithm, HeuristicType heuristic = HeuristicType::MANHATTAN, bool allowDiagonal = true, bool dontCrossCorners = false, bool bidirectional = false);
};