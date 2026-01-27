/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#pragma once

#include <memory>
#include <cstdint>

#include "types/Structs.hh"
#include "graph/IGraph.hh"
#include "heuristics/IHeuristic.hh"

/**
 * @brief Configuration structure for pathfinding algorithms.
 * 
 * This structure holds various configuration options that can be
 * passed to pathfinding algorithms to customize their behavior.
 * 
 * @param heuristic A shared pointer to a heuristic (for informed search algorithms).
 * @param allowDiagonal A boolean indicating whether diagonal movement is allowed.
 * @param diagonalCost The cost associated with diagonal movement.
 */
struct AlgorithmConfig {
  std::shared_ptr<const IHeuristic> heuristic = nullptr;
  bool allowDiagonal = false;
  Cost diagonalCost = 1.41421356237;
};

/**
 * @brief Interface for pathfinding algorithms.
 * 
 * This interface defines the contract for all pathfinding algorithms.
 * Implementing classes must provide a method to find the shortest path
 * between two nodes in a graph.
 */
class IAlgorithm {

  public:
    /**
     * @brief Find the shortest path from start to goal using the specified algorithm.
     * 
     * @param graph The graph on which to perform the search.
     * @param start The starting node's NodeId.
     * @param goal The goal node's NodeId.
     * @param config Configuration options for the algorithm.
     * 
     * @return A Result structure containing the path, visited nodes, total cost, time taken,
     * and success status.
     * 
     * @note If any information required but not provided or not valid, the method will return a
     * Result with success, and log an error message.
     */
    virtual Result findPath(const IGraph& graph, NodeId start, NodeId goal, const AlgorithmConfig& config) = 0;

    /**
     * @brief Find the shortest path from start to goal using default algorithm configuration.
     * 
     * @param graph The graph on which to perform the search.
     * @param start The starting node's NodeId.
     * @param goal The goal node's NodeId.
     * 
     * @return A Result structure containing the path, visited nodes, total cost, time taken,
     * and success status.
     * 
     * @note If any information required but not provided or not valid, the method will return a
     * Result with success = false, and log an error message.
     */
    Result findPath(const IGraph& graph, NodeId start, NodeId goal) {
      AlgorithmConfig cfg;
      return findPath(graph, start, goal, cfg);
    }

    /**
     * @brief Virtual destructor for proper cleanup of derived classes.
     */
    virtual ~IAlgorithm() = default;
};