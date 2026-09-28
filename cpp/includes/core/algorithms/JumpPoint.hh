/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *------------------------------------------------------------------------------------------------*/

#pragma once

#include "types/Structs.hh"
#include "graph/IGraph.hh"
#include "heuristics/IHeuristic.hh"
#include "algorithms/IAlgorithm.hh"

/**
 * @brief Jump Point Search — A* over jump points with pruning + forced neighbors.
 * Expands only jump points; interpolates straight segments into full step-by-step path.
 */
class JumpPoint : public IAlgorithm {
  public:
    Result findPath(const IGraph& graph, NodeId start, NodeId goal, const AlgorithmConfig& config) override;
};
