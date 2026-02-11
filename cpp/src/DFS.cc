/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include <algorithm>
#include <chrono>
#include <stack>
#include <vector>
#include <cstdlib>
#include <string>

#include "algorithms/DFS.hh"
#include "utils/Logger.hh"

namespace {

bool isDiagonalMove(const IGraph& graph, NodeId u, NodeId v) {
  Point pu = graph.getNodePosition(u);
  Point pv = graph.getNodePosition(v);
  int dx = std::abs(pu.x - pv.x);
  int dy = std::abs(pu.y - pv.y);
  return dx == 1 && dy == 1;
}

bool violatesCornerRule(const IGraph& graph, NodeId u, NodeId v, const std::vector<Edge>& neighbors) {
  Point pu = graph.getNodePosition(u);
  Point pv = graph.getNodePosition(v);

  // Only meaningful for diagonals
  int dx = std::abs(pu.x - pv.x);
  int dy = std::abs(pu.y - pv.y);
  if (dx != 1 || dy != 1) return false;

  Point p1{pv.x, pu.y};
  Point p2{pu.x, pv.y};

  bool hasP1 = false;
  bool hasP2 = false;

  for (const Edge& e : neighbors) {
    Point pn = graph.getNodePosition(e.id);
    if (pn.x == p1.x && pn.y == p1.y) hasP1 = true;
    if (pn.x == p2.x && pn.y == p2.y) hasP2 = true;
  }

  // If either of the orthogonal neighbors is missing, crossing the corner is not allowed.
  return !(hasP1 && hasP2);
}

} // namespace

Result DFS::findPath(const IGraph& graph, NodeId start, NodeId goal, const AlgorithmConfig& config) {
  Result res;
  res.success = false;
  res.cost = 0.0;
  res.time = Time::zero();

  const auto t0 = std::chrono::steady_clock::now();

  LOG_INFO(std::string("DFS: start from=") + std::to_string(start) + " to=" + std::to_string(goal));

  NodeCount n = graph.getNodeCount();
  if (start >= n || goal >= n) {
    LOG_ERROR("DFS: invalid start/goal");
    res.time = Time::zero();
    return res;
  }

  std::vector<bool> visited(n, false);
  std::vector<NodeId> parent(n, static_cast<NodeId>(-1));

  struct StackItem {
    NodeId id;
    std::size_t nextNeighborIndex;
  };

  std::stack<StackItem> st;
  st.push({start, 0});
  visited[start] = true;

  std::vector<Edge> neighbors;

  while (!st.empty()) {
    StackItem& top = st.top();
    NodeId u = top.id;

    // First time we see this node in DFS order
    if (top.nextNeighborIndex == 0) {
      res.visited.push_back(u);
      if (u == goal) break;
      graph.getNeighbors(u, neighbors);
    }

    bool advanced = false;
    for (; top.nextNeighborIndex < neighbors.size(); ++top.nextNeighborIndex) {
      const Edge& e = neighbors[top.nextNeighborIndex];
      NodeId v = e.id;

      // Handle diagonal rules
      if (!config.allowDiagonal && isDiagonalMove(graph, u, v)) {
        continue;
      }
      if (config.allowDiagonal && config.dontCrossCorners && isDiagonalMove(graph, u, v) &&
          violatesCornerRule(graph, u, v, neighbors)) {
        continue;
      }

      if (!visited[v]) {
        visited[v] = true;
        parent[v] = u;
        ++top.nextNeighborIndex;
        st.push({v, 0});
        advanced = true;
        break;
      }
    }

    if (!advanced) {
      st.pop();
      // When we backtrack, neighbors will be refreshed for the new top on the next loop
      if (!st.empty()) {
        graph.getNeighbors(st.top().id, neighbors);
      }
    }
  }

  if (!visited[goal]) {
    res.success = false;
    res.time = std::chrono::duration_cast<Time>(std::chrono::steady_clock::now() - t0);
    LOG_WARN("DFS: goal not reached");
    return res;
  }

  // Reconstruct path
  for (NodeId cur = goal; cur != static_cast<NodeId>(-1); cur = parent[cur]) {
    res.path.push_back(cur);
    if (cur == start) break;
  }
  std::reverse(res.path.begin(), res.path.end());

  // Compute cost by summing edge costs along the path
  Cost total = 0.0;
  for (std::size_t i = 1; i < res.path.size(); ++i) {
    std::vector<Edge> tmp;
    graph.getNeighbors(res.path[i - 1], tmp);
    for (const Edge& e : tmp) {
      if (e.id == res.path[i]) {
        total += e.cost;
        break;
      }
    }
  }

  res.cost = total;
  res.success = true;
  res.time = std::chrono::duration_cast<Time>(std::chrono::steady_clock::now() - t0);
  LOG_INFO(std::string("DFS: success cost=") + std::to_string(res.cost));
  return res;
}

