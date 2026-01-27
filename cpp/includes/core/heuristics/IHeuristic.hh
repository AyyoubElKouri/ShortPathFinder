/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#pragma once

#include "types/Usings.hh"

/**
 * @brief Interface for heuristic functions used in pathfinding algorithms.
 * 
 * Provides a method to compute the estimated cost between two nodes.
 */
class IHeuristic {
public:
  /**
   * @brief Compute the estimated cost from one node to another.
   * 
   * @param from The NodeId of the starting node.
   * @param to The NodeId of the target node.
   * 
   * @return The estimated cost as a Cost type.
   * 
   * @note If node IDs are invalid, the method will return 0 and log an error.
   */
  virtual Cost compute( NodeId from, NodeId to ) const = 0;

  /**
   * @brief Virtual destructor for proper cleanup of derived classes.
   */
  virtual ~IHeuristic() = default;
};
