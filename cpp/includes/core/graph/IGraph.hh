/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#pragma once

#include <vector>

#include "types/Usings.hh"
#include "types/Structs.hh"

/**
 * @brief Interface for graph structures.
 * 
 * Provides methods to retrieve node count and neighbors of a given node.
 */
class IGraph {
public:
  /**
   * @brief Get the total number of nodes in the graph.
   */
  virtual NodeCount getNodeCount() const = 0;

  /**
   * @brief Get the neighbors of a given node.
   * 
   * @param nodeId The NodeId of the node whose neighbors are to be retrieved.
   * @param out A vector to be filled with Edge structures representing the neighboring nodes and their costs.
   * 
   * @note If the nodeId is invalid, the out vector will remain empty, and an error will be logged.
   */
  virtual void getNeighbors(NodeId id, std::vector<Edge>& out) const = 0;

  /**
   * @brief Get the position of a given node.
   * 
   * @param nodeId The NodeId of the node whose position is to be retrieved.
   * @return A Point structure representing the coordinates of the node.
   * 
   * @note If the nodeId is invalid, the method will return a default Point (e.g., {0, 0}), and an error will be logged.
   */
  virtual Point getNodePosition(NodeId nodeId) const = 0;

  /**
   * @brief Virtual destructor for proper cleanup of derived classes.
   */
  virtual ~IGraph() = default;
};