/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include <algorithm>
#include <chrono>
#include <limits>
#include <vector>
#include <cstdlib>
#include <string>

#include "algorithms/IDAStar.hh"
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

  return !(hasP1 && hasP2);
}

struct SearchState {
  const IGraph& graph;
  const IHeuristic& heuristic;
  const AlgorithmConfig& config;
  NodeId goal;
  std::vector<bool> inPath;
  std::vector<NodeId> currentPath;
  std::vector<NodeId> bestPath;
  std::vector<NodeId> visitedOrder;
};

Cost dfs(SearchState& state, NodeId node, Cost g, Cost threshold, Cost& bestOverrun) {
  const IGraph& graph = state.graph;
  const IHeuristic& h = state.heuristic;
  const AlgorithmConfig& config = state.config;

  Cost f = g + h.compute(node, state.goal);
  if (f > threshold) {
    if (f < bestOverrun) bestOverrun = f;
    return f;
  }

  if (node == state.goal) {
    state.bestPath = state.currentPath;
    return f;
  }

  std::vector<Edge> neighbors;
  graph.getNeighbors(node, neighbors);

  for (const Edge& e : neighbors) {
    NodeId v = e.id;

    if (!config.allowDiagonal && isDiagonalMove(graph, node, v)) {
      continue;
    }
    if (config.allowDiagonal && config.dontCrossCorners && isDiagonalMove(graph, node, v) &&
        violatesCornerRule(graph, node, v, neighbors)) {
      continue;
    }

    if (state.inPath[v]) continue; // avoid cycles on current path

    state.inPath[v] = true;
    state.currentPath.push_back(v);
    state.visitedOrder.push_back(v);

    Cost t = dfs(state, v, g + e.cost, threshold, bestOverrun);
    if (!state.bestPath.empty() && state.bestPath.back() == state.goal) {
      return t; // goal found, unwind
    }

    state.currentPath.pop_back();
    state.inPath[v] = false;
  }

  return bestOverrun;
}

} // namespace

Result IDAStar::findPath(const IGraph& graph, NodeId start, NodeId goal, const AlgorithmConfig& config) {
  Result res;
  res.success = false;
  res.cost = 0.0;
  res.time = Time::zero();

  const auto t0 = std::chrono::steady_clock::now();

  LOG_INFO(std::string("IDA*: start from=") + std::to_string(start) + " to=" + std::to_string(goal));

  if (!config.heuristic) {
    LOG_ERROR("IDA*: no heuristic provided in config");
    res.time = Time::zero();
    return res;
  }
  const IHeuristic& h = *config.heuristic;

  NodeCount n = graph.getNodeCount();
  if (start >= n || goal >= n) {
    LOG_ERROR("IDA*: invalid start/goal");
    res.time = Time::zero();
    return res;
  }

  SearchState state{
      graph,
      h,
      config,
      goal,
      std::vector<bool>(n, false),
      {},
      {},
      {}
  };

  state.inPath[start] = true;
  state.currentPath.push_back(start);
  state.visitedOrder.push_back(start);

  Cost threshold = h.compute(start, goal);
  const Cost INF = std::numeric_limits<Cost>::infinity();

  while (true) {
    Cost bestOverrun = INF;
    Cost t = dfs(state, start, 0.0, threshold, bestOverrun);

    if (!state.bestPath.empty() && state.bestPath.back() == goal) {
      // reconstruct result
      res.path = state.bestPath;

      // cost: sum edge costs
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
      res.visited = state.visitedOrder;
      res.success = true;
      res.time = std::chrono::duration_cast<Time>(std::chrono::steady_clock::now() - t0);
      LOG_INFO(std::string("IDA*: success cost=") + std::to_string(res.cost));
      return res;
    }

    if (bestOverrun == INF || bestOverrun <= threshold) {
      // No solution within any higher threshold
      res.success = false;
      res.visited = state.visitedOrder;
      res.time = std::chrono::duration_cast<Time>(std::chrono::steady_clock::now() - t0);
      LOG_WARN("IDA*: no path found");
      return res;
    }

    threshold = bestOverrun;
  }
}

