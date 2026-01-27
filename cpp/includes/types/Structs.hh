/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#pragma once

#include <vector>

#include "types/Usings.hh"

/**
 * @brief Structure representing a weighted edge to a neighboring node.
 * 
 * @param id The NodeId of the target/destination node.
 * @param cost The edge weight/cost.
 */
struct Edge {
  NodeId id;
  Cost cost;
};

/**
 * @brief Result structure to hold the outcome of pathfinding algorithms.
 * 
 * @param path The sequence of NodeIds representing the found path (In order).
 * @param visited The sequence of NodeIds that were visited during the search (In order).
 * @param cost The total cost of the found path.
 * @param time The time taken to compute the path.
 * @param success A boolean indicating whether a path was successfully found.
 */
struct Result {
  std::vector<NodeId> path;
  std::vector<NodeId> visited;
  Cost cost;
  Time time;
  bool success;
};

/**
 * @brief Structure representing 2D coordinates.
 * 
 * @param x The x-coordinate.
 * @param y The y-coordinate.
 */
struct Point { 
  int x; 
  int y; 
};

/**
 * @brief Structure representing a node in the grid graph.
 * 
 * @param id The unique identifier of the node.
 * @param position The 2D position of the node.
 * @param walkable A boolean indicating whether the node is walkable (traversable).
 * @param cost The cost associated with traversing this node.
 */
struct Node {
  NodeId id;
  Point position;
  bool walkable;
  Cost cost;
};