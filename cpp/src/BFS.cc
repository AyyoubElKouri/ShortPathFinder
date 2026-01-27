/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include <chrono>
#include <queue>
#include <vector>
#include <algorithm>
#include <cstdlib>

#include "algorithms/BFS.hh"
#include <string>
#include "utils/Logger.hh"

Result BFS::findPath(const IGraph& graph, NodeId start, NodeId goal, const AlgorithmConfig& /*config*/) {
  Result res;
  res.success = false;
  res.cost = 0.0;
  res.time = Time::zero();
  const auto t0 = std::chrono::steady_clock::now();
  LOG_INFO(std::string("BFS: start from=") + std::to_string(start) + " to=" + std::to_string(goal));

  NodeCount n = graph.getNodeCount();
  if (start >= n || goal >= n) {
    res.time = Time::zero();
    return res;
  }

  std::vector<bool> seen(n, false);
  std::vector<NodeId> parent(n, static_cast<NodeId>(-1));
  std::queue<NodeId> q;

  q.push(start);
  seen[start] = true;

  std::vector<Edge> neighbors;

  while (!q.empty()) {
    NodeId u = q.front(); q.pop();
    res.visited.push_back(u);
    if (u == goal) break;
    graph.getNeighbors(u, neighbors);
    for (const Edge& e : neighbors) {
      NodeId v = e.id;
      if (!seen[v]) {
        seen[v] = true;
        parent[v] = u;
        q.push(v);
      }
    }
  }

  if (!seen[goal]) {
    res.success = false;
    res.time = std::chrono::duration_cast<Time>(std::chrono::steady_clock::now() - t0);
    LOG_WARN("BFS: goal not reached");
    return res;
  }

  // Reconstruct path
  for (NodeId cur = goal; cur != static_cast<NodeId>(-1); cur = parent[cur]) {
    res.path.push_back(cur);
    if (cur == start) break;
  }
  std::reverse(res.path.begin(), res.path.end());

  // compute cost as sum of node costs along path (except start)
  Cost total = 0.0;
  for (std::size_t i = 1; i < res.path.size(); ++i) {
    std::vector<Edge> tmp;
    graph.getNeighbors(res.path[i-1], tmp);
    for (const Edge& e: tmp) if (e.id == res.path[i]) { total += e.cost; break; }
  }

  res.cost = total;
  res.success = true;
  res.time = std::chrono::duration_cast<Time>(std::chrono::steady_clock::now() - t0);
  LOG_INFO(std::string("BFS: success cost=") + std::to_string(res.cost));
  return res;
}
