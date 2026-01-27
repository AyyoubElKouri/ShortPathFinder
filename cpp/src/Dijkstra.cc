/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include <limits>
#include <algorithm>
#include <cstdlib>
#include <chrono>
#include <queue>
#include <vector>
#include <string>

#include "algorithms/Dijkstra.hh"
#include "utils/Logger.hh"

Result Dijkstra::findPath(const IGraph& graph, NodeId start, NodeId goal, const AlgorithmConfig& config) {
  Result res; res.success = false; res.cost = 0.0; res.time = Time::zero();
  const auto t0 = std::chrono::steady_clock::now();

  LOG_INFO(std::string("Dijkstra: start from=") + std::to_string(start) + " to=" + std::to_string(goal));

  NodeCount n = graph.getNodeCount();
  if (start >= n || goal >= n) {
    LOG_ERROR("Dijkstra: invalid start/goal");
    res.time = Time::zero();
    return res;
  }

  const Cost INF = std::numeric_limits<Cost>::infinity();
  std::vector<Cost> dist(n, INF);
  std::vector<NodeId> parent(n, static_cast<NodeId>(-1));
  using Pair = std::pair<Cost, NodeId>;
  std::priority_queue<Pair, std::vector<Pair>, std::greater<Pair>> pq;

  dist[start] = 0.0;
  pq.push({0.0, start});

  std::vector<Edge> neighbors;

  while (!pq.empty()) {
    auto [d,u] = pq.top(); pq.pop();
    if (d != dist[u]) continue;
    res.visited.push_back(u);
    if (u == goal) break;
    graph.getNeighbors(u, neighbors);
    for (const Edge& e : neighbors) {
      // If diagonals are disabled in config, skip diagonal neighbors.
      if (!config.allowDiagonal) {
        Point pu = graph.getNodePosition(u);
        Point pv = graph.getNodePosition(e.id);
        int dx = std::abs(pu.x - pv.x);
        int dy = std::abs(pu.y - pv.y);
        if (dx == 1 && dy == 1) continue; // skip diagonal
      }

      NodeId v = e.id;
      Cost nd = dist[u] + e.cost;
      if (nd < dist[v]) {
        dist[v] = nd;
        parent[v] = u;
        pq.push({nd, v});
      }
    }
  }

  if (dist[goal] == INF) {
    res.success = false;
    res.time = std::chrono::duration_cast<Time>(std::chrono::steady_clock::now() - t0);
    LOG_WARN("Dijkstra: no path found");
    return res;
  }

  // reconstruct path
  for (NodeId cur = goal; cur != static_cast<NodeId>(-1); cur = parent[cur]) {
    res.path.push_back(cur);
    if (cur == start) break;
  }
  std::reverse(res.path.begin(), res.path.end());

  res.cost = dist[goal];
  res.success = true;
  res.time = std::chrono::duration_cast<Time>(std::chrono::steady_clock::now() - t0);
  LOG_INFO(std::string("Dijkstra: success cost=") + std::to_string(res.cost));
  return res;
}
