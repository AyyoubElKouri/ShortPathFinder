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
#include "algorithms/JumpPoint.hh"
#include "algorithms/OrthogonalJumpPoint.hh"
#include "algorithms/Trace.hh"
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
      LOG_INFO("AlgorithmFactory: creating JumpPoint");
      return std::make_unique<JumpPoint>();
    case AlgorithmType::ORTHOGONALJUMPPOINT:
      LOG_INFO("AlgorithmFactory: creating OrthogonalJumpPoint");
      return std::make_unique<OrthogonalJumpPoint>();
    case AlgorithmType::TRACE:
      LOG_INFO("AlgorithmFactory: creating Trace");
      return std::make_unique<Trace>();
    default:
      LOG_WARN("AlgorithmFactory: unknown algorithm type");
      return nullptr;
  }
}
