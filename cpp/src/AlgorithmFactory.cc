/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include "factories/AlgorithmFactory.hh"

#include "algorithms/BFS.hh"
#include "algorithms/Dijkstra.hh"
#include "algorithms/AStar.hh"
#include "algorithms/DFS.hh"
#include "algorithms/IDAStar.hh"
#include "utils/Logger.hh"

std::unique_ptr<IAlgorithm> AlgorithmFactory::createAlgorithm(AlgorithmType type) {
  switch (type) {
    case AlgorithmType::BFS:
      LOG_INFO("AlgorithmFactory: creating BFS");
      return std::make_unique<BFS>();
    case AlgorithmType::DIJKSTRA:
      LOG_INFO("AlgorithmFactory: creating Dijkstra");
      return std::make_unique<Dijkstra>();
    case AlgorithmType::ASTAR:
      LOG_INFO("AlgorithmFactory: creating AStar");
      return std::make_unique<AStar>();
    case AlgorithmType::IDASTAR:
      LOG_INFO("AlgorithmFactory: creating IDA*");
      return std::make_unique<IDAStar>();
    case AlgorithmType::DFS:
      LOG_INFO("AlgorithmFactory: creating DFS");
      return std::make_unique<DFS>();
    case AlgorithmType::JUMPPOINT:
      // For now, reuse A* implementation for Jump Point Search visualization.
      LOG_INFO("AlgorithmFactory: creating JumpPoint (A* fallback)");
      return std::make_unique<AStar>();
    case AlgorithmType::ORTHOGONALJUMPPOINT:
      // Orthogonal Jump Point variant also reuses A*; direction constraints are handled via config.
      LOG_INFO("AlgorithmFactory: creating OrthogonalJumpPoint (A* fallback)");
      return std::make_unique<AStar>();
    case AlgorithmType::TRACE:
      // Trace behaves like BFS for now, emphasizing exploration order.
      LOG_INFO("AlgorithmFactory: creating Trace (BFS fallback)");
      return std::make_unique<BFS>();
    default:
      LOG_WARN("AlgorithmFactory: unknown algorithm type");
      return nullptr;
  }
}
