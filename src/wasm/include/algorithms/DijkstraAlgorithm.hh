/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#pragma once

#include "Algorithm.hh"

/**
 * @class DijkstraAlgorithm
 * @brief Concrete implementation of Dijkstra's shortest path algorithm.
 *
 * Finds the shortest path between nodes in a weighted graph. Guarantees
 * optimal paths for graphs with non-negative edge weights.
 *
 * @note Ignores heuristic parameter as Dijkstra is not heuristic-based.
 *       Currently the only implemented algorithm in the system.
 */
class DijkstraAlgorithm : public Algorithm {
public:
  DijkstraAlgorithm(HeuristicType heuristic, SearchGraph &graph, int startNodeId, int targetNodeId,
                    bool allowDiagonal, bool bidirectional, bool dontCrossCorners)
      : Algorithm(heuristic, graph, startNodeId, targetNodeId, allowDiagonal, bidirectional,
                  dontCrossCorners) {}

  /**
   * @brief Execute Dijkstra's algorithm on the given graph.
   *
   * @return SearchResults containing the shortest path if found, along with
   *         visited nodes and execution statistics
   */
  SearchResults execute() override;
};