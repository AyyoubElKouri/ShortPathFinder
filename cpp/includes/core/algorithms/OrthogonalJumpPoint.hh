/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *------------------------------------------------------------------------------------------------*/

#pragma once

#include "types/Structs.hh"
#include "graph/IGraph.hh"
#include "heuristics/IHeuristic.hh"
#include "algorithms/IAlgorithm.hh"

/**
 * @brief Orthogonal Jump Point Search — JPS restricted to 4-directional movement.
 * Straight jumps only (no diagonals); forced-neighbor pruning on orthogonal axis.
 */
class OrthogonalJumpPoint : public IAlgorithm {
  public:
    Result findPath(const IGraph& graph, NodeId start, NodeId goal, const AlgorithmConfig& config) override;
};
