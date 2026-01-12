/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include "../include/SearchGraph.hh"

void PathNode::addEdge(int targetId, int weight) { edges.emplace_back(targetId, weight); }

void SearchGraph::addNode() { nodes.emplace_back(static_cast<int>(nodes.size())); }

void SearchGraph::addNode(double x, double y) {
  nodes.emplace_back(static_cast<int>(nodes.size()), x, y);
}

void SearchGraph::addEdge(int from, int to, int weight) {
  // Validate node indices before any modification
  if (from < 0 || static_cast<size_t>(from) >= nodes.size() || to < 0 ||
      static_cast<size_t>(to) >= nodes.size()) {
    throw std::out_of_range("Node index out of range: " + std::to_string(from) + "->" +
                            std::to_string(to));
  }

  // Add forward edge
  nodes[from].addEdge(to, weight);

  // For undirected graphs, add symmetric reverse edge
  if (!isDirected && from != to) {
    nodes[to].addEdge(from, weight);
  }
}

const std::vector<Edge> &SearchGraph::getNeighbors(int nodeId) const { return nodes[nodeId].edges; }

size_t SearchGraph::getNodeCount() const { return nodes.size(); }

bool SearchGraph::nodeExists(int id) const {
  return id >= 0 && static_cast<size_t>(id) < nodes.size();
}

const PathNode &SearchGraph::getNode(int id) const {
  if (!nodeExists(id)) {
    throw std::out_of_range("Node " + std::to_string(id) + " doesn't exist");
  }
  return nodes[id];
}
