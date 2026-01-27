/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#pragma once

#include "types/Structs.hh"
#include "graph/IGraph.hh"
#include "heuristics/IHeuristic.hh"
#include "algorithms/IAlgorithm.hh"

/**
 * @brief A* algorithm implementation for finding the shortest path in a graph.
 * 
 * This class provides a static method to execute the A* algorithm on a given graph,
 * starting from a specified node and aiming to reach a goal node, using a provided heuristic.
 */
class AStar: public IAlgorithm {

  public:
    /**
     * @brief Find the shortest path from start to goal using the A* algorithm.
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
     * Result with success = false, and log an error message.
     */
    Result findPath(const IGraph& graph, NodeId start, NodeId goal, const AlgorithmConfig& config) override;
};
