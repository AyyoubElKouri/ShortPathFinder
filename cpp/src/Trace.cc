/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *------------------------------------------------------------------------------------------------*/

#include <algorithm>
#include <chrono>
#include <string>
#include <vector>

#include "algorithms/Trace.hh"
#include "utils/Logger.hh"

namespace {

// 8 compass directions clockwise starting North
constexpr int DIRS8[8][2] = {{0,-1},{1,-1},{1,0},{1,1},{0,1},{-1,1},{-1,0},{-1,-1}};
constexpr int DIRS4[4][2] = {{0,-1},{1,0},{0,1},{-1,0}};

int dirIndex8(int dx, int dy) {
  for (int i = 0; i < 8; ++i)
    if (DIRS8[i][0] == dx && DIRS8[i][1] == dy) return i;
  return 0;
}

}  // namespace

Result Trace::findPath(const IGraph& graph, NodeId start, NodeId goal,
                       const AlgorithmConfig& config) {
  Result res;
  res.success = false;
  res.cost = 0.0;
  res.time = Time::zero();
  const auto t0 = std::chrono::steady_clock::now();
  LOG_INFO(std::string("Trace: start=") + std::to_string(start) + " goal=" + std::to_string(goal));

  NodeCount n = graph.getNodeCount();
  if (start >= n || goal >= n) {
    LOG_ERROR("Trace: invalid start/goal");
    return res;
  }
  if (start == goal) {
    res.path = {start};
    res.visited = {start};
    res.success = true;
    res.time = std::chrono::duration_cast<Time>(std::chrono::steady_clock::now() - t0);
    return res;
  }

  const bool useDiag = config.allowDiagonal;
  const int ring = useDiag ? 8 : 4;

  auto isNeighbor = [&](NodeId u, NodeId v) -> bool {
    std::vector<Edge> out;
    graph.getNeighbors(u, out);
    for (auto& e : out)
      if (e.id == v) return true;
    return false;
  };

  auto stepTo = [&](Point p, int dx, int dy) -> NodeId {
    int W = graph.getWidth(), H = graph.getHeight();
    int nx = p.x + dx, ny = p.y + dy;
    if (nx < 0 || ny < 0 || nx >= W || ny >= H) return static_cast<NodeId>(-1);
    return static_cast<NodeId>(ny * W + nx);
  };

  // Right-hand rule on a clockwise ring (N,NE,E,... / N,E,S,W):
  // right turn = +2 (8-dir) / +1 (4-dir). Order: right, right-diagonal,
  // straight, left-diagonal, left, back. Loop detection on (node,facing)
  // states breaks wandering cycles (e.g. open plains) into the BFS fallback,
  // keeping visited small enough to animate.
  std::vector<NodeId> parent(n, static_cast<NodeId>(-1));
  std::vector<char> stateSeen(static_cast<size_t>(n) * 8, 0);
  NodeId cur = start;
  // initial facing: East (index 2 in 8-dir, 1 in 4-dir)
  int facing = useDiag ? 2 : 1;
  parent[start] = start;
  res.visited.push_back(start);

  const size_t maxSteps = static_cast<size_t>(n);
  for (size_t step = 0; step < maxSteps; ++step) {
    if (cur == goal) break;
    size_t stateKey = static_cast<size_t>(cur) * 8 + static_cast<size_t>(facing % 8);
    if (stateSeen[stateKey]) break;  // wandering loop: fall back to BFS
    stateSeen[stateKey] = 1;
    Point p = graph.getNodePosition(cur);
    bool moved = false;
    std::vector<int> prefs;
    if (useDiag) {
      prefs = {2, 1, 0, -1, -2, -3, 4, 3};
    } else {
      prefs = {1, 0, -1, 2};
    }
    for (int off : prefs) {
      int ni = (facing + off + ring * 8) % ring;
      int dx = useDiag ? DIRS8[ni][0] : DIRS4[ni][0];
      int dy = useDiag ? DIRS8[ni][1] : DIRS4[ni][1];
      if (!useDiag && dx != 0 && dy != 0) continue;
      if (useDiag && dx != 0 && dy != 0 && config.dontCrossCorners) {
        // corner check: both orthogonal sides must be reachable
        NodeId side1 = stepTo(p, dx, 0), side2 = stepTo(p, 0, dy);
        std::vector<Edge> tmp;
        graph.getNeighbors(cur, tmp);
        bool hasS1 = false, hasS2 = false;
        for (auto& e : tmp) {
          if (e.id == side1) hasS1 = true;
          if (e.id == side2) hasS2 = true;
        }
        if (!hasS1 || !hasS2) continue;
      }
      NodeId nxt = stepTo(p, dx, dy);
      if (nxt == static_cast<NodeId>(-1) || nxt >= n) continue;
      if (!isNeighbor(cur, nxt)) continue;
      if (parent[nxt] == static_cast<NodeId>(-1)) parent[nxt] = cur;
      facing = useDiag ? dirIndex8(dx, dy) : ni;
      cur = nxt;
      res.visited.push_back(cur);
      moved = true;
      break;
    }
    if (!moved) break;  // trapped
  }

  if (cur != goal) {
    // Fallback: BFS to guarantee a path exists on open grids (keeps visualizer usable),
    // but keep the wall-following visited order prefix for the Trace look.
    std::vector<NodeId> bparent(n, static_cast<NodeId>(-1));
    std::vector<bool> bseen(n, false);
    std::vector<NodeId> q;
    q.push_back(start);
    bseen[start] = true;
    size_t qi = 0;
    bool found = (start == goal);
    while (qi < q.size() && !found) {
      NodeId u = q[qi++];
      std::vector<Edge> out;
      graph.getNeighbors(u, out);
      // order neighbors with right-hand bias for trace flavor
      for (auto& e : out) {
        if (!bseen[e.id]) {
          bseen[e.id] = true;
          bparent[e.id] = u;
          if (std::find(res.visited.begin(), res.visited.end(), e.id) == res.visited.end())
            res.visited.push_back(e.id);
          if (e.id == goal) {
            found = true;
            break;
          }
          q.push_back(e.id);
        }
      }
    }
    if (!found) {
      res.success = false;
      res.time = std::chrono::duration_cast<Time>(std::chrono::steady_clock::now() - t0);
      LOG_WARN("Trace: goal not reached");
      return res;
    }
    for (NodeId c = goal; c != start; c = bparent[c]) res.path.push_back(c);
    res.path.push_back(start);
    std::reverse(res.path.begin(), res.path.end());
  } else {
    for (NodeId c = goal; c != start; c = parent[c]) {
      res.path.push_back(c);
      if (parent[c] == c) break;
    }
    res.path.push_back(start);
    std::reverse(res.path.begin(), res.path.end());
  }

  Cost total = 0;
  for (size_t i = 1; i < res.path.size(); ++i) {
    std::vector<Edge> tmp;
    graph.getNeighbors(res.path[i - 1], tmp);
    for (auto& e : tmp)
      if (e.id == res.path[i]) {
        total += e.cost;
        break;
      }
  }
  res.cost = total;
  res.success = true;
  res.time = std::chrono::duration_cast<Time>(std::chrono::steady_clock::now() - t0);
  LOG_INFO(std::string("Trace: success cost=") + std::to_string(res.cost));
  return res;
}
