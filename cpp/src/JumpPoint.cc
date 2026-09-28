/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *------------------------------------------------------------------------------------------------*/

#include <algorithm>
#include <chrono>
#include <cmath>
#include <limits>
#include <queue>
#include <string>
#include <vector>

#include "algorithms/JumpPoint.hh"
#include "algorithms/BFS.hh"
#include "utils/Logger.hh"

namespace {

struct JPNode {
  Cost f, g;
  NodeId id;
  bool operator>(const JPNode& o) const { return f > o.f; }
};

inline int sgn(int v) { return (v > 0) - (v < 0); }

struct GridAccess {
  const IGraph& g;
  int W, H;
  GridAccess(const IGraph& graph) : g(graph), W(graph.getWidth()), H(graph.getHeight()) {}
  bool inBounds(int x, int y) const { return x >= 0 && y >= 0 && x < W && y < H; }
  NodeId id(int x, int y) const { return static_cast<NodeId>(y * W + x); }
  bool walk(int x, int y) const {
    if (!inBounds(x, y)) return false;
    return g.isWalkable(id(x, y));
  }
};

bool cornerBlocked(const GridAccess& ga, int x, int y, int nx, int ny) {
  int dx = nx - x, dy = ny - y;
  if (std::abs(dx) != 1 || std::abs(dy) != 1) return false;
  // crossing corner if either orthogonal side blocked
  return !ga.walk(nx, y) || !ga.walk(x, ny);
}

// Forced neighbor test at (x,y) arrived from direction (dx,dy)
bool hasForced(const GridAccess& ga, int x, int y, int dx, int dy, bool allowDiagonal,
               bool dontCrossCorners) {
  if (dx != 0 && dy != 0) {
    // diagonal: forced if horizontal/vertical side blocked but diagonal beyond open
    if (!ga.walk(x - dx, y) && ga.walk(x - dx, y + dy)) return true;
    if (!ga.walk(x, y - dy) && ga.walk(x + dx, y - dy)) return true;
    if (dontCrossCorners && allowDiagonal) {
      // corner rule already filters, forced still applies
    }
    return false;
  }
  if (dx != 0) {
    // horizontal: forced above/below
    if (!ga.walk(x, y + 1) && ga.walk(x + dx, y + 1)) return true;
    if (!ga.walk(x, y - 1) && ga.walk(x + dx, y - 1)) return true;
    return false;
  }
  // vertical
  if (!ga.walk(x + 1, y) && ga.walk(x + 1, y + dy)) return true;
  if (!ga.walk(x - 1, y) && ga.walk(x - 1, y + dy)) return true;
  return false;
}

// Recursive jump: returns jump-point id or -1. Records traversed nodes into trail.
NodeId jump(const GridAccess& ga, int x, int y, int dx, int dy, int gx, int gy,
            bool allowDiagonal, bool dontCrossCorners, std::vector<NodeId>& trail) {
  int nx = x + dx, ny = y + dy;
  if (!ga.walk(nx, ny)) return -1;
  if (allowDiagonal && dx != 0 && dy != 0 && dontCrossCorners && cornerBlocked(ga, x, y, nx, ny))
    return -1;
  trail.push_back(ga.id(nx, ny));
  if (nx == gx && ny == gy) return ga.id(nx, ny);
  if (hasForced(ga, nx, ny, dx, dy, allowDiagonal, dontCrossCorners)) return ga.id(nx, ny);
  if (dx != 0 && dy != 0) {
    // diagonal: check straight jumps
    std::vector<NodeId> t1, t2;
    if (jump(ga, nx, ny, dx, 0, gx, gy, allowDiagonal, dontCrossCorners, t1) != -1 ||
        jump(ga, nx, ny, 0, dy, gx, gy, allowDiagonal, dontCrossCorners, t2) != -1) {
      trail.insert(trail.end(), t1.begin(), t1.end());
      trail.insert(trail.end(), t2.begin(), t2.end());
      return ga.id(nx, ny);
    }
  }
  return jump(ga, nx, ny, dx, dy, gx, gy, allowDiagonal, dontCrossCorners, trail);
}

Cost stepCost(int dx, int dy) {
  if (dx != 0 && dy != 0) return static_cast<Cost>(std::sqrt(2.0));
  return 1.0;
}

}  // namespace

Result JumpPoint::findPath(const IGraph& graph, NodeId start, NodeId goal,
                           const AlgorithmConfig& config) {
  Result res;
  res.success = false;
  res.cost = 0.0;
  res.time = Time::zero();
  const auto t0 = std::chrono::steady_clock::now();
  LOG_INFO(std::string("JumpPoint: start=") + std::to_string(start) + " goal=" + std::to_string(goal));

  if (!config.heuristic) {
    LOG_ERROR("JumpPoint: no heuristic provided");
    return res;
  }
  const IHeuristic& h = *config.heuristic;
  NodeCount n = graph.getNodeCount();
  if (start >= n || goal >= n) {
    LOG_ERROR("JumpPoint: invalid start/goal");
    return res;
  }

  GridAccess ga(graph);
  Point ps = graph.getNodePosition(start), pg = graph.getNodePosition(goal);
  const Cost INF = std::numeric_limits<Cost>::infinity();
  std::vector<Cost> gScore(n, INF);
  std::vector<NodeId> parent(n, static_cast<NodeId>(-1));
  std::vector<bool> closed(n, false);

  using PQ = std::priority_queue<JPNode, std::vector<JPNode>, std::greater<JPNode>>;
  PQ open;
  gScore[start] = 0;
  open.push({h.compute(start, goal), 0, start});

  static constexpr int DIRS8[8][2] = {{1,0},{-1,0},{0,1},{0,-1},{1,1},{1,-1},{-1,1},{-1,-1}};
  static constexpr int DIRS4[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};

  while (!open.empty()) {
    JPNode cur = open.top();
    open.pop();
    NodeId u = cur.id;
    if (closed[u]) continue;
    if (cur.g != gScore[u]) continue;
    closed[u] = true;
    res.visited.push_back(u);
    if (u == goal) break;

    Point pu = graph.getNodePosition(u);
    // Determine pruned directions
    std::vector<std::pair<int,int>> dirs;
    if (parent[u] == static_cast<NodeId>(-1)) {
      // start: all natural neighbors
      if (config.allowDiagonal) {
        for (auto& d : DIRS8) dirs.emplace_back(d[0], d[1]);
      } else {
        for (auto& d : DIRS4) dirs.emplace_back(d[0], d[1]);
      }
    } else {
      Point pp = graph.getNodePosition(parent[u]);
      int dx = sgn(pu.x - pp.x), dy = sgn(pu.y - pp.y);
      if (dx != 0 && dy != 0 && config.allowDiagonal) {
        dirs.emplace_back(dx, 0);
        dirs.emplace_back(0, dy);
        dirs.emplace_back(dx, dy);
        // forced
        if (!ga.walk(pu.x - dx, pu.y) && ga.walk(pu.x - dx, pu.y + dy)) dirs.emplace_back(-dx, dy);
        if (!ga.walk(pu.x, pu.y - dy) && ga.walk(pu.x + dx, pu.y - dy)) dirs.emplace_back(dx, -dy);
      } else if (dx != 0) {
        dirs.emplace_back(dx, 0);
        if (!ga.walk(pu.x, pu.y + 1) && ga.walk(pu.x + dx, pu.y + 1)) dirs.emplace_back(dx, 1);
        if (!ga.walk(pu.x, pu.y - 1) && ga.walk(pu.x + dx, pu.y - 1)) dirs.emplace_back(dx, -1);
      } else if (dy != 0) {
        dirs.emplace_back(0, dy);
        if (!ga.walk(pu.x + 1, pu.y) && ga.walk(pu.x + 1, pu.y + dy)) dirs.emplace_back(1, dy);
        if (!ga.walk(pu.x - 1, pu.y) && ga.walk(pu.x - 1, pu.y + dy)) dirs.emplace_back(-1, dy);
      } else {
        continue;
      }
    }

    for (auto [dx, dy] : dirs) {
      if (!config.allowDiagonal && dx != 0 && dy != 0) continue;
      if (config.allowDiagonal && config.dontCrossCorners && dx != 0 && dy != 0 &&
          cornerBlocked(ga, pu.x, pu.y, pu.x + dx, pu.y + dy))
        continue;
      if (!ga.walk(pu.x + dx, pu.y + dy)) continue;
      std::vector<NodeId> trail;
      NodeId jp = jump(ga, pu.x, pu.y, dx, dy, pg.x, pg.y, config.allowDiagonal,
                       config.dontCrossCorners, trail);
      for (NodeId t : trail) {
        if (!closed[t]) res.visited.push_back(t);
      }
      if (jp == -1) continue;
      // cost = steps along (dx,dy) line
      Point pj = graph.getNodePosition(jp);
      int steps = std::max(std::abs(pj.x - pu.x), std::abs(pj.y - pu.y));
      Cost c = steps * stepCost(dx, dy);
      Cost ng = gScore[u] + c;
      if (ng < gScore[jp]) {
        gScore[jp] = ng;
        parent[jp] = u;
        open.push({ng + h.compute(jp, goal), ng, jp});
      }
    }
  }

  if (gScore[goal] == INF) {
    // Jump pruning found nothing (e.g. open plains with no forced neighbors):
    // fall back to BFS, optimal on uniform-cost grids.
    BFS bfs;
    Result bres = bfs.findPath(graph, start, goal, config);
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
    if (!res.success) LOG_WARN("JumpPoint: no path found");
    return res;
  }
  // reconstruct jump-point chain then interpolate
  std::vector<NodeId> chain;
  for (NodeId cur = goal; cur != static_cast<NodeId>(-1); cur = parent[cur]) {
    chain.push_back(cur);
    if (cur == start) break;
  }
  std::reverse(chain.begin(), chain.end());
  // interpolate straight segments
  std::vector<NodeId> full;
  for (size_t i = 0; i < chain.size(); ++i) {
    if (i == 0) {
      full.push_back(chain[i]);
      continue;
    }
    Point a = graph.getNodePosition(chain[i - 1]);
    Point b = graph.getNodePosition(chain[i]);
    int dx = sgn(b.x - a.x), dy = sgn(b.y - a.y);
    int x = a.x, y = a.y;
    while (x != b.x || y != b.y) {
      x += dx;
      y += dy;
      if (dx != 0 && dy != 0) {
        // diagonal interpolation: step both; if blocked corner, break
        if (!ga.walk(x, y)) break;
      }
      full.push_back(ga.id(x, y));
    }
  }
  res.path = full;
  // recompute true cost via graph edges
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
  LOG_INFO(std::string("JumpPoint: success cost=") + std::to_string(res.cost));
  return res;
}
