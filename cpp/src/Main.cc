/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include <iostream>
#include <memory>
#include <vector>

#include "graph/GridGraph.hh"
#include "factories/HeuristicFactory.hh"
#include "factories/AlgorithmFactory.hh"
#include <string>
#include "utils/Logger.hh"
#include <cstdlib>

int main() {
  // Create a 5x5 grid with all walkable nodes
  /**
   * Visual representation of the grid: (0 = walkable)
   * 0 0 0 0 0
   * 0 0 0 0 0
   * 0 0 0 0 0
   * 0 0 0 0 0
   * 0 0 0 0 0
   */
  const int W = 5, H = 5;
  std::vector<Node> nodes;
  nodes.reserve(W * H);
  for (int y = 0; y < H; ++y) {
    for (int x = 0; x < W; ++x) {
      Node n;
      n.id = y * W + x;
      n.position = Point{x, y};
      n.walkable = true;
      n.cost = 1.0;
      nodes.push_back(n);
    }
  }

  auto graph = std::make_shared<GridGraph>(W, H, nodes);

  // Create heuristic and algorithm
  auto heur = HeuristicFactory::createHeuristic(HeuristicType::MANHATTAN, graph);
  AlgorithmConfig cfg;
  cfg.heuristic = std::move(heur);
  cfg.allowDiagonal = true;

  auto alg = AlgorithmFactory::createAlgorithm(AlgorithmType::ASTAR);

  NodeId start = 0;
  NodeId goal = static_cast<NodeId>(W * H - 1);

  Result r = alg->findPath(*graph, start, goal, cfg);

  LOG_INFO(std::string("Main: Success=") + (r.success ? "true" : "false") + " cost=" + std::to_string(r.cost) + " time(us)=" + std::to_string(r.time.count()));
  LOG_INFO("Main: Path:");
  for (auto id : r.path) LOG_INFO(std::string("  ") + std::to_string(id));
  LOG_INFO("Main: Visited:");
  for (auto v : r.visited) LOG_INFO(std::string("  ") + std::to_string(v));
  
  return 0;
}

