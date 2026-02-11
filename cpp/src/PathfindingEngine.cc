#include "api/PathfindingEngine.hh"

#include <memory>
#include "graph/GridGraph.hh"
#include "factories/HeuristicFactory.hh"
#include "factories/AlgorithmFactory.hh"

Result PathfindingEngine::findPath(
    const std::vector<int>& grid,
    int width,
    int height,
    int startIndex,
    int goalIndex,
    AlgorithmType algorithm,
    HeuristicType heuristic,
    bool allowDiagonal,
    bool dontCrossCorners,
    bool bidirectional) {
  // Build nodes from the grid (0 = walkable, non-zero = blocked)
  std::vector<Node> nodes;
  nodes.reserve(width * height);
  for (int y = 0; y < height; ++y) {
    for (int x = 0; x < width; ++x) {
      int idx = y * width + x;
      Node n;
      n.id = static_cast<NodeId>(idx);
      n.position = Point{x, y};
      n.walkable = (idx < (int)grid.size()) ? (grid[idx] == 0) : false;
      n.cost = 1.0;
      nodes.push_back(n);
    }
  }

  auto graph = std::make_shared<GridGraph>(width, height, nodes);

  // Configure heuristic and algorithm
  std::shared_ptr<const IHeuristic> heur = nullptr;
  if (algorithm == AlgorithmType::ASTAR) {
    heur = HeuristicFactory::createHeuristic(heuristic, graph);
  }

  AlgorithmConfig cfg;
  cfg.heuristic = heur;
  cfg.allowDiagonal = allowDiagonal;
  cfg.dontCrossCorners = dontCrossCorners;
  cfg.bidirectional = bidirectional;

  auto alg = AlgorithmFactory::createAlgorithm(algorithm);
  return alg->findPath(*graph, static_cast<NodeId>(startIndex), static_cast<NodeId>(goalIndex), cfg);
}
