/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#pragma once

#include "enums/AlgorithmType.hh"
#include "enums/HeuristicType.hh"

#include "algorithms/Algorithm.hh"
#include "algorithms/DijkstraAlgorithm.hh"

#include "SearchGraph.hh"
#include "SearchResults.hh"

/**
 * @class SearchEngine
 * @brief Main entry point for running pathfinding algorithms.
 *
 * This class configures and runs pathfinding algorithms on a given graph.
 * It allows specifying all search parameters and delegates execution to
 * the appropriate algorithm implementation.
 *
 * @note Currently only DijkstraAlgorithm is implemented. More algorithms
 *       will be added based on the `algorithm` parameter.
 */
class SearchEngine {
  AlgorithmType algorithm; ///< Type of algorithm to use for the search
  HeuristicType heuristic; ///< Heuristic for informed algorithms (A*, IDA*, etc.)

  int startNodeId;  ///< Starting node ID
  int targetNodeId; ///< Target node ID

  SearchGraph &graph; ///< Reference to the graph to search

  bool allowDiagonal = true;     ///< Allow diagonal movement in grid-like graphs
  bool bidirectional = false;    ///< Enable bidirectional search
  bool dontCrossCorners = false; ///< Prevent diagonal movement through blocked corners

public:
  /**
   * @brief Constructor for algorithms that need a heuristic.
   *
   * @param algorithm Algorithm to use (A*, IDA*, etc.)
   * @param heuristic Distance estimation heuristic
   * @param graph Graph to search
   * @param startNodeId Starting node ID
   * @param targetNodeId Target node ID
   * @param allowDiagonal Allow diagonal movement
   * @param bidirectional Enable bidirectional search
   * @param dontCrossCorners Prevent corner cutting
   */
  SearchEngine(AlgorithmType algorithm, HeuristicType heuristic, SearchGraph &graph,
               int startNodeId, int targetNodeId, bool allowDiagonal, bool bidirectional,
               bool dontCrossCorners)
      : algorithm(algorithm), heuristic(heuristic), graph(graph), startNodeId(startNodeId),
        targetNodeId(targetNodeId), allowDiagonal(allowDiagonal), bidirectional(bidirectional),
        dontCrossCorners(dontCrossCorners) {}

  /**
   * @brief Constructor for algorithms that don't need a heuristic.
   *
   * @param algorithm Algorithm to use (BFS, Dijkstra, DFS, etc.)
   * @param graph Graph to search
   * @param startNodeId Starting node ID
   * @param targetNodeId Target node ID
   * @param allowDiagonal Allow diagonal movement
   * @param bidirectional Enable bidirectional search
   * @param dontCrossCorners Prevent corner cutting
   */
  SearchEngine(AlgorithmType algorithm, SearchGraph &graph, int startNodeId, int targetNodeId,
               bool allowDiagonal, bool bidirectional, bool dontCrossCorners)
      : algorithm(algorithm), graph(graph), startNodeId(startNodeId), targetNodeId(targetNodeId),
        allowDiagonal(allowDiagonal), bidirectional(bidirectional),
        dontCrossCorners(dontCrossCorners) {}

  /**
   * @brief Run the configured pathfinding algorithm.
   *
   * This method creates the algorithm object and executes it with the
   * configured parameters. Currently creates DijkstraAlgorithm regardless
   * of the `algorithm` parameter.
   *
   * @return SearchResults containing path, visited nodes, cost and time
   */
  SearchResults runSearch();
};