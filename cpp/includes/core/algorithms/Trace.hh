/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *------------------------------------------------------------------------------------------------*/

#pragma once

#include "types/Structs.hh"
#include "graph/IGraph.hh"
#include "algorithms/IAlgorithm.hh"

/**
 * @brief Trace — right-hand wall follower. Non-optimal, emphasizes exploration order.
 * Walks keeping a wall on the right; records visited order; returns first route to goal.
 */
class Trace : public IAlgorithm {
  public:
    Result findPath(const IGraph& graph, NodeId start, NodeId goal, const AlgorithmConfig& config) override;
};
