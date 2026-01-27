/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#pragma once

#include <vector>

#include "graph/IGraph.hh"
#include "types/Structs.hh"

/**
 * @brief Class representing a grid-based graph.
 * 
 * Inherits from the IGraph interface and provides implementations for grid-specific graph operations.
 */
class GridGraph : public IGraph {

  private:
    std::vector<Node> nodes_;
    int width_;
    int height_;

  public:
    /**
     * @brief Constructor for the GridGraph class.
     * 
     * @param width The width of the grid.
     * @param height The height of the grid.
     * @param nodes A vector of Node structures representing the nodes in the grid.
     */
    GridGraph(int width, int height, const std::vector<Node>& nodes);

    /**
     * @brief Get the total number of nodes in the grid graph.
     * @return The number of nodes.
     */
    NodeCount getNodeCount() const override;

    /**
     * @brief Get the neighbors of a given node in the grid graph.
     * 
     * @param nodeId The NodeId of the node whose neighbors are to be retrieved.
     * @param out A vector to be filled with Edge structures representing the neighboring nodes and their costs.
     * 
     * @note If the nodeId is invalid, the out vector will remain empty, and an error will be logged.
     */
    void getNeighbors(NodeId id, std::vector<Edge>& out) const override;

    /**
     * @brief Get the position of a given node in the grid graph.
     * 
     * @param nodeId The NodeId of the node whose position is to be retrieved.
     * @return A Point structure representing the coordinates of the node.
     * 
     * @note If the nodeId is invalid, the method will return a default Point (e.g., {0, 0}), and an error will be logged.
     */
    Point getNodePosition(NodeId nodeId) const override;
};
