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
  BFS,                 ///< Breadth-First Search (unweighted graphs)
  DIJKSTRA,            ///< Dijkstra's algorithm (weighted graphs)
  ASTAR,               ///< A* Search (heuristic-based)
  IDASTAR,             ///< Iterative Deepening A*
  DFS,                 ///< Depth-First Search
  JUMPPOINT,           ///< Jump Point Search (grid optimization)
  ORTHOGONALJUMPPOINT, ///< Orthogonal Jump Point Search
  TRACE                ///< Simple line-of-sight tracing
};