/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#pragma once

#include "../enums/AlgorithmType.hh"
#include "../enums/HeuristicType.hh"

#include "../SearchResults.hh"
#include "SearchGraph.hh"

/**
 * @class Algorithm
 * @brief Abstract base class for all pathfinding algorithm implementations.
 *
 * This interface defines the common execute() method that all concrete
 * algorithm classes must implement. It provides a uniform API for
 * different pathfinding strategies.
 */
class Algorithm {
protected:
  HeuristicType heuristicType; ///< Heuristic type used by the algorithm
  SearchGraph &graph;          ///< Reference to the graph to search
  int startNodeId;             ///< Starting node identifier
  int targetNodeId;            ///< Target node identifier
  bool allowDiagonal;          ///< Allow diagonal movement in grid-like graphs
  bool bidirectional;          ///< Enable bidirectional search optimization
  bool dontCrossCorners;       ///< Prevent diagonal movement through blocked corners

public:
  Algorithm(HeuristicType heuristic, SearchGraph &graph, int startNodeId, int targetNodeId,
            bool allowDiagonal, bool bidirectional, bool dontCrossCorners)
      : heuristicType(heuristic), graph(graph), startNodeId(startNodeId),
        targetNodeId(targetNodeId), allowDiagonal(allowDiagonal), bidirectional(bidirectional),
        dontCrossCorners(dontCrossCorners) {};

  virtual ~Algorithm() = default;

  /**
   * @brief Execute the pathfinding algorithm.
   *
   * @note Concrete implementations may ignore parameters that are not relevant
   *       to their specific algorithm.
   */
  virtual SearchResults execute() = 0;
};
