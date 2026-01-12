/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#pragma once

#include <stdexcept>
#include <vector>

/**
 * @class Edge
 * @brief Represents a directed connection between two nodes in the graph.
 *
 * This class encapsulates a single edge containing a target node identifier
 * and a traversal cost (weight). Used as the fundamental building block
 * for graph adjacency representations.
 */
class Edge {
public:
  int targetId; ///< Destination node identifier (zero-based index)
  int weight;   ///< Non-negative traversal cost to reach target node

  /**
   * @brief Constructs an Edge with specified target and weight.
   *
   * @param target Destination node identifier
   * @param w Traversal cost (must be non-negative for most pathfinding
   * algorithms)
   */
  Edge(int target, int w) : targetId(target), weight(w) {}
};

/**
 * @class PathNode
 * @brief Represents a vertex in the graph with spatial coordinates and outgoing
 * edges.
 *
 * Each node contains a unique identifier, optional spatial coordinates for
 * heuristic calculations, and a list of edges to adjacent nodes.
 * This enables both grid-based and arbitrary graph representations.
 */
class PathNode {
public:
  int id;                  ///< Unique node identifier (typically matches vector index)
  double x, y;             ///< Spatial coordinates for Euclidean heuristic calculations
  std::vector<Edge> edges; ///< Outgoing edges to adjacent nodes

  /**
   * @brief Constructs a PathNode with identifier and optional coordinates.
   *
   * @param id Unique node identifier
   * @param x X-coordinate (default: 0.0)
   * @param y Y-coordinate (default: 0.0)
   */
  PathNode(int id, double x = 0.0, double y = 0.0) : id(id), x(x), y(y) {}

  /**
   * @brief Adds an outgoing edge from this node to a specified target.
   *
   * @param targetId Destination node identifier
   * @param weight Traversal cost of this edge
   * @note Does not check for duplicate edges. Caller must ensure edge
   * uniqueness.
   */
  void addEdge(int targetId, int weight);
};

/**
 * @class SearchGraph
 * @brief Directed/undirected weighted graph implementation optimized for
 * pathfinding algorithms.
 *
 * This class provides a adjacency-list representation suitable for BFS,
 * Dijkstra, and A* algorithms. Supports both directed and undirected graphs
 * with weighted edges. Nodes are stored contiguously for O(1) access, while
 * edges allow efficient neighbor iteration.
 *
 * @invariant Node IDs correspond to their index in the internal vector (0..n-1)
 * @invariant For undirected graphs, edges are automatically bidirectional with
 * equal weights
 */
class SearchGraph {
private:
  std::vector<PathNode> nodes; ///< Contiguous storage of all graph vertices
  bool isDirected;             ///< Graph directionality flag (true = directed, false =
                               ///< undirected)

public:
  /**
   * @brief Constructs an empty graph with specified directionality.
   *
   * @param directed True for directed graph, false for undirected (default:
   * false)
   */
  explicit SearchGraph(bool directed = false) : isDirected(directed) {}

  /**
   * @brief Constructs a graph from existing node data.
   *
   * @param nodeData Pre-initialized vector of PathNode objects
   * @param directed Graph directionality (default: false)
   * @warning Node IDs in nodeData must be sequential and match their indices
   */
  explicit SearchGraph(std::vector<PathNode> &nodeData, bool directed = false)
      : nodes(nodeData), isDirected(directed) {}

  /**
   * @brief Adds a new node at the origin (0,0).
   *
   * The node receives an auto-generated ID equal to current graph size.
   * Complexity: O(1) amortized
   */
  void addNode();

  /**
   * @brief Adds a new node with specified spatial coordinates.
   *
   * @param x X-coordinate for heuristic calculations (default: 0.0)
   * @param y Y-coordinate for heuristic calculations (default: 0.0)
   * @return Implicitly returns the auto-generated node ID
   * @note Node ID equals the index before insertion (nodes.size() - 1)
   */
  void addNode(double x = 0.0, double y = 0.0);

  /**
   * @brief Adds a weighted edge between two existing nodes.
   *
   * For undirected graphs, automatically creates the reverse edge with
   * identical weight.
   *
   * @param from Source node identifier (must exist)
   * @param to Target node identifier (must exist)
   * @param weight Non-negative traversal cost
   * @throws std::out_of_range if either node ID is invalid
   * @note Does not prevent duplicate edges or self-loops (except in undirected
   * case)
   */
  void addEdge(int from, int to, int weight);

  /**
   * @brief Retrieves all outgoing edges from a specified node.
   *
   * @param nodeId Source node identifier
   * @return Const reference to vector of edges from the node
   * @note Returned reference remains valid until graph modification
   */
  const std::vector<Edge> &getNeighbors(int nodeId) const;

  /**
   * @brief Returns the total number of nodes in the graph.
   *
   * @return Node count (0 for empty graph)
   */
  size_t getNodeCount() const;

  /**
   * @brief Checks if a node with given ID exists in the graph.
   *
   * @param id Node identifier to check
   * @return True if 0 ≤ id < nodeCount, false otherwise
   */
  bool nodeExists(int id) const;

  /**
   * @brief Provides read-only access to a node's complete data.
   *
   * @param id Node identifier
   * @return Const reference to the PathNode object
   * @throws std::out_of_range if node doesn't exist
   */
  const PathNode &getNode(int id) const;
};
