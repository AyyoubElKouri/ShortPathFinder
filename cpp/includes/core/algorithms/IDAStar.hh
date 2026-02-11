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
 * @brief Iterative Deepening A* (IDA*) algorithm implementation.
 *
 * IDA* performs a series of depth-first searches with increasing f-cost
 * thresholds. It combines the space efficiency of DFS with heuristic
 * pruning from A*.
 */
class IDAStar : public IAlgorithm {

  public:
    Result findPath(const IGraph& graph, NodeId start, NodeId goal, const AlgorithmConfig& config) override;
};

