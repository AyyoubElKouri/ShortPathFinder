/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *------------------------------------------------------------------------------------------------*/

#include <algorithm>
#include <chrono>
#include <limits>
#include <queue>
#include <string>
#include <vector>

#include "algorithms/OrthogonalJumpPoint.hh"
#include "algorithms/BFS.hh"
#include "utils/Logger.hh"

namespace {

struct OJPNode {
  Cost f, g;
  NodeId id;
  bool operator>(const OJPNode& o) const { return f > o.f; }
};

struct GA {
  const IGraph& g;
  int W, H;
  GA(const IGraph& graph) : g(graph), W(graph.getWidth()), H(graph.getHeight()) {}
  bool walk(int x, int y) const {
    if (x < 0 || y < 0 || x >= W || y >= H) return false;
    return g.isWalkable(static_cast<NodeId>(y * W + x));
  }
  NodeId id(int x, int y) const { return static_cast<NodeId>(y * W + x); }
};

// Straight jump along (dx,dy) — orthogonal only. Returns jump point or -1.
// Returns the last reachable node before a wall so the search can turn (degrades to A* in open areas).
NodeId jumpStraight(const GA& ga, int x, int y, int dx, int dy, int gx, int gy,
                    std::vector<NodeId>& trail) {
  int nx = x + dx, ny = y + dy;
  if (!ga.walk(nx, ny)) return trail.empty() ? static_cast<NodeId>(-1) : ga.id(x, y);
  trail.push_back(ga.id(nx, ny));
  if (nx == gx && ny == gy) return ga.id(nx, ny);
  // forced neighbors: perpendicular side blocked at current, open beyond next
  if (dx != 0) {
    if (!ga.walk(x, y + 1) && ga.walk(nx, ny + 1)) return ga.id(nx, ny);
    if (!ga.walk(x, y - 1) && ga.walk(nx, ny - 1)) return ga.id(nx, ny);
  } else {
    if (!ga.walk(x + 1, y) && ga.walk(nx + 1, ny)) return ga.id(nx, ny);
    if (!ga.walk(x - 1, y) && ga.walk(nx - 1, ny)) return ga.id(nx, ny);
  }
  return jumpStraight(ga, nx, ny, dx, dy, gx, gy, trail);
}

}  // namespace

Result OrthogonalJumpPoint::findPath(const IGraph& graph, NodeId start, NodeId goal,
                                     const AlgorithmConfig& config) {
  Result res;
  res.success = false;
  res.cost = 0.0;
  res.time = Time::zero();
  const auto t0 = std::chrono::steady_clock::now();
  LOG_INFO(std::string("OrthogonalJumpPoint: start=") + std::to_string(start));

  if (!config.heuristic) {
    LOG_ERROR("OrthogonalJumpPoint: no heuristic provided");
    return res;
  }
  const IHeuristic& h = *config.heuristic;
  NodeCount n = graph.getNodeCount();
  if (start >= n || goal >= n) {
    LOG_ERROR("OrthogonalJumpPoint: invalid start/goal");
    return res;
  }

  GA ga(graph);
  Point pg = graph.getNodePosition(goal);
  const Cost INF = std::numeric_limits<Cost>::infinity();
  std::vector<Cost> gScore(n, INF);
  std::vector<NodeId> parent(n, static_cast<NodeId>(-1));
  std::vector<bool> closed(n, false);

  using PQ = std::priority_queue<OJPNode, std::vector<OJPNode>, std::greater<OJPNode>>;
  PQ open;
  gScore[start] = 0;
  open.push({h.compute(start, goal), 0, start});

  static constexpr int DIRS[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};

  while (!open.empty()) {
    OJPNode cur = open.top();
    open.pop();
    NodeId u = cur.id;
    if (closed[u]) continue;
    if (cur.g != gScore[u]) continue;
    closed[u] = true;
    res.visited.push_back(u);
    if (u == goal) break;

    Point pu = graph.getNodePosition(u);
    for (auto& d : DIRS) {
      int dx = d[0], dy = d[1];
      if (!ga.walk(pu.x + dx, pu.y + dy)) continue;
      std::vector<NodeId> trail;
      NodeId jp = jumpStraight(ga, pu.x, pu.y, dx, dy, pg.x, pg.y, trail);
      for (NodeId t : trail) {
        if (!closed[t]) res.visited.push_back(t);
      }
      if (jp == -1) continue;
      Point pj = graph.getNodePosition(jp);
      Cost c = static_cast<Cost>(std::abs(pj.x - pu.x) + std::abs(pj.y - pu.y));
      Cost ng = gScore[u] + c;
      if (ng < gScore[jp]) {
        gScore[jp] = ng;
        parent[jp] = u;
        open.push({ng + h.compute(jp, goal), ng, jp});
      }
    }
  }

  if (gScore[goal] == INF) {
    // No jump points led to the goal (e.g. open plains): fall back to
    // orthogonal BFS, optimal on uniform-cost grids.
    AlgorithmConfig cfg2 = config;
    cfg2.allowDiagonal = false;
    BFS bfs;
    Result bres = bfs.findPath(graph, start, goal, cfg2);
    for (NodeId v : bres.visited) {
      if (v < n && !closed[v]) {
        closed[v] = true;
        res.visited.push_back(v);
      }
    }
    res.path = bres.path;
    res.cost = bres.cost;
    res.success = bres.success;
    res.time = std::chrono::duration_cast<Time>(std::chrono::steady_clock::now() - t0);
    if (!res.success) LOG_WARN("OrthogonalJumpPoint: no path found");
    return res;
  }
  // reconstruct + interpolate (orthogonal segments)
  std::vector<NodeId> chain;
  for (NodeId cur = goal; cur != static_cast<NodeId>(-1); cur = parent[cur]) {
    chain.push_back(cur);
    if (cur == start) break;
  }
  std::reverse(chain.begin(), chain.end());
  std::vector<NodeId> full;
  for (size_t i = 0; i < chain.size(); ++i) {
    if (i == 0) {
      full.push_back(chain[i]);
      continue;
    }
    Point a = graph.getNodePosition(chain[i - 1]);
    Point b = graph.getNodePosition(chain[i]);
    int dx = (b.x > a.x) ? 1 : (b.x < a.x) ? -1 : 0;
    int dy = (b.y > a.y) ? 1 : (b.y < a.y) ? -1 : 0;
    int x = a.x, y = a.y;
    while (x != b.x || y != b.y) {
      x += dx;
      y += dy;
      full.push_back(ga.id(x, y));
    }
  }
  res.path = full;
  Cost total = 0;
  for (size_t i = 1; i < full.size(); ++i) {
    std::vector<Edge> tmp;
    graph.getNeighbors(full[i - 1], tmp);
    for (auto& e : tmp)
      if (e.id == full[i]) {
        total += e.cost;
        break;
      }
  }
  res.cost = total;
  res.success = true;
  res.time = std::chrono::duration_cast<Time>(std::chrono::steady_clock::now() - t0);
  LOG_INFO(std::string("OrthogonalJumpPoint: success cost=") + std::to_string(res.cost));
  return res;
}
