/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#pragma once

/**
 * @enum HeuristicType
 * @brief Distance estimation heuristics for informed search algorithms.
 *
 * These heuristics are used by algorithms like A* to estimate the distance
 * from a node to the goal. Different heuristics are suitable for different
 * movement patterns and grid types.
 */
enum class HeuristicType {
  MANHATTAN, ///< Sum of absolute differences in x and y (4-directional grids)
  EUCLIDEAN, ///< Straight-line distance (any direction allowed)
  OCTILE,    ///< Combines Manhattan and diagonal movement (8-directional grids)
  CHEBYSHEV  ///< Maximum of absolute differences (king's move in chess)
};