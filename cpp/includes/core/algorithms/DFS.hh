/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#pragma once

#include "types/Structs.hh"
#include "graph/IGraph.hh"
#include "algorithms/IAlgorithm.hh"

/**
 * @brief Depth-First Search (DFS) algorithm implementation for pathfinding.
 *
 * DFS is not guaranteed to find the optimal path, but it is useful for
 * visualizing search behavior and exploring all reachable nodes.
 */
class DFS : public IAlgorithm {

  public:
    Result findPath(const IGraph& graph, NodeId start, NodeId goal, const AlgorithmConfig& config) override;
};

