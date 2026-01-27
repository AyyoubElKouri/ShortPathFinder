/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#pragma once

#include <memory>

#include "heuristics/IHeuristic.hh"
#include "graph/IGraph.hh"

/**
 * @brief Manhattan distance heuristic implementation.
 * 
 * This class computes the Manhattan distance between two nodes in a graph.
 */
class Manhattan : public IHeuristic {

  private:
    /**
     * @brief Reference to the graph on which the heuristic operates.
     */
    std::shared_ptr<const IGraph> graph_;

  public:
    /**
     * @brief Constructor for the Manhattan heuristic.
     * 
     * @param graph Reference to the graph on which the heuristic will operate.
     */
    explicit Manhattan( std::shared_ptr<const IGraph> graph ) : graph_(graph) {}

    /**
     * @brief Compute the Manhattan distance between two nodes.
     * 
     * @param from The NodeId of the starting node.
     * @param to The NodeId of the target node.
     * 
     * @return The Manhattan distance as a Cost type.
     * 
     * @note If node IDs are invalid, the method will return 0 and log an error.
     */
    Cost compute( NodeId from, NodeId to ) const override;
};
