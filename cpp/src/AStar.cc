/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include <chrono>
#include <queue>
#include <vector>
#include <limits>
#include <memory>
#include <algorithm>
#include <cstdlib>

#include "algorithms/AStar.hh"
#include <string>
#include "utils/Logger.hh"

struct AStarNode {
  Cost f;
  Cost g;
  NodeId id;
  bool operator>(const AStarNode& o) const { return f > o.f; }
};

Result AStar::findPath(const IGraph& graph, NodeId start, NodeId goal, const AlgorithmConfig& config) {
  Result res; res.success = false; res.cost = 0.0; res.time = Time::zero();
  const auto t0 = std::chrono::steady_clock::now();

  LOG_INFO(std::string("AStar: start from=") + std::to_string(start) + " to=" + std::to_string(goal));

  if (!config.heuristic) {
    LOG_ERROR("AStar: no heuristic provided in config");
    res.time = Time::zero();
    return res;
  }
  const IHeuristic& h = *config.heuristic;

  NodeCount n = graph.getNodeCount();
  if (start >= n || goal >= n) {
    LOG_ERROR("AStar: invalid start/goal");
    res.time = Time::zero();
    return res;
  }

  const Cost INF = std::numeric_limits<Cost>::infinity();
  std::vector<Cost> gScore(n, INF);
  std::vector<Cost> fScore(n, INF);
  std::vector<NodeId> parent(n, static_cast<NodeId>(-1));

  using PQ = std::priority_queue<AStarNode, std::vector<AStarNode>, std::greater<AStarNode>>;
  PQ open;

  gScore[start] = 0.0;
  fScore[start] = h.compute(start, goal);
  open.push({fScore[start], gScore[start], start});

  std::vector<Edge> neighbors;

  while (!open.empty()) {
    auto cur = open.top(); open.pop();
    NodeId u = cur.id;
    res.visited.push_back(u);
    if (u == goal) break;
    if (cur.g != gScore[u]) continue;
    graph.getNeighbors(u, neighbors);
    for (const Edge& e : neighbors) {
      // option to ignore diagonals if config disallows them
      if (!config.allowDiagonal) {
        Point pu = graph.getNodePosition(u);
        Point pv = graph.getNodePosition(e.id);
        int dx = std::abs(pu.x - pv.x);
        int dy = std::abs(pu.y - pv.y);
        if (dx == 1 && dy == 1) continue; // skip diagonal
      }
      Cost tentative_g = gScore[u] + e.cost;
      if (tentative_g < gScore[e.id]) {
        parent[e.id] = u;
        gScore[e.id] = tentative_g;
        fScore[e.id] = tentative_g + h.compute(e.id, goal);
        open.push({fScore[e.id], gScore[e.id], e.id});
      }
    }
  }

  if (gScore[goal] == INF) {
    res.success = false;
    res.time = std::chrono::duration_cast<Time>(std::chrono::steady_clock::now() - t0);
    LOG_WARN("AStar: no path found");
    return res;
  }

  for (NodeId cur = goal; cur != static_cast<NodeId>(-1); cur = parent[cur]) {
    res.path.push_back(cur);
    if (cur == start) break;
  }
  std::reverse(res.path.begin(), res.path.end());

  res.cost = gScore[goal];
  res.success = true;
  res.time = std::chrono::duration_cast<Time>(std::chrono::steady_clock::now() - t0);
  LOG_INFO(std::string("AStar: success cost=") + std::to_string(res.cost));
  return res;
}
