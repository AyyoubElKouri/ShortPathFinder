/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include <algorithm>
#include <cmath>
#include <stdexcept>

#include "graph/GridGraph.hh"
#include "utils/Logger.hh"

GridGraph::GridGraph(int width, int height, const std::vector<Node>& nodes)
    : nodes_(nodes), width_(width), height_(height) {
  LOG_INFO("GridGraph ctor: width=" + std::to_string(width) + " height=" + std::to_string(height) + " nodes=" + std::to_string(nodes_.size()));
  // Validate size; if mismatch, attempt to resize or throw
  const std::size_t expected = static_cast<std::size_t>(width_) * static_cast<std::size_t>(height_);
  if (nodes_.size() != expected) {
    // If nodes vector is empty, create a default grid
    if (nodes_.empty()) {
      nodes_.resize(expected);
      for (std::size_t i = 0; i < expected; ++i) {
        nodes_[i].id = static_cast<int>(i);
        nodes_[i].position = Point{static_cast<int>(i % width_), static_cast<int>(i / width_)};
        nodes_[i].walkable = true;
        nodes_[i].cost = 1.0;
      }
    } else {
      LOG_ERROR("GridGraph ctor: nodes.size() does not match width*height");
      throw std::invalid_argument("nodes.size() does not match width*height");
    }
  }
}

NodeCount GridGraph::getNodeCount() const { return static_cast<NodeCount>(nodes_.size()); }

void GridGraph::getNeighbors(NodeId id, std::vector<Edge>& out) const {
  out.clear();
  const auto total = nodes_.size();
  if (id >= total) {
    LOG_WARN("getNeighbors: invalid node id=" + std::to_string(id));
    return;
  }

  const Point p = nodes_[id].position;
  const int x = p.x;
  const int y = p.y;

  // 8-direction offsets
  static constexpr int offs[8][2] = {{1,0},{-1,0},{0,1},{0,-1},{1,1},{1,-1},{-1,1},{-1,-1}};

  for (int i = 0; i < 8; ++i) {
    int nx = x + offs[i][0];
    int ny = y + offs[i][1];
    if (nx < 0 || ny < 0) continue;
    if (nx >= width_ || ny >= height_) continue;
    NodeId nid = static_cast<NodeId>(ny * width_ + nx);
    const Node& n = nodes_[nid];
    if (!n.walkable) continue;
    Cost c = n.cost;
    // diagonal adjustment
    if (std::abs(offs[i][0]) + std::abs(offs[i][1]) == 2) {
      c *= static_cast<Cost>(std::sqrt(2.0)); // diagonal cost
    }
    out.push_back(Edge{nid, c});
  }
}

Point GridGraph::getNodePosition(NodeId nodeId) const {
  if (nodeId >= nodes_.size()) {
    LOG_WARN("getNodePosition: invalid nodeId=" + std::to_string(nodeId));
    return Point{0,0};
  }
  return nodes_[nodeId].position;
}
