/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#pragma once

/**
 * @enum AlgorithmType
 * @brief Defines all supported pathfinding algorithm types.
 *
 * This enumeration lists all algorithms that can be selected for pathfinding
 * operations.
 */
enum class AlgorithmType {
  BFS,
  DIJKSTRA,
  ASTAR,
  IDASTAR,
  DFS,
  JUMPPOINT,
  ORTHOGONALJUMPPOINT,
  TRACE
};

/**
 * @enum HeuristicType
 * @brief Distance estimation heuristics for informed search algorithms.
 *
 * These heuristics are used by algorithms like A* to estimate the distance
 * from a node to the goal. Different heuristics are suitable for different
 * movement patterns and grid types.
 */
enum class HeuristicType {
  MANHATTAN,
  EUCLIDEAN,
  OCTILE,
  CHEBYSHEV
};