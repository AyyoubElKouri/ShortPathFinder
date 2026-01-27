/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include "factories/AlgorithmFactory.hh"

#include "algorithms/BFS.hh"
#include "algorithms/Dijkstra.hh"
#include "algorithms/AStar.hh"
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
    default:
      LOG_WARN("AlgorithmFactory: unknown algorithm type");
      return nullptr;
  }
}
