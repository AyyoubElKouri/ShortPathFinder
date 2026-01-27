/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include "factories/HeuristicFactory.hh"

#include "heuristics/Manhattan.hh"
#include "heuristics/Euclidean.hh"
#include "heuristics/Octile.hh"
#include "heuristics/Chebyshev.hh"
#include "utils/Logger.hh"

std::unique_ptr<IHeuristic> HeuristicFactory::createHeuristic(HeuristicType type, std::shared_ptr<const IGraph> graph) {
  switch (type) {
    case HeuristicType::MANHATTAN:
      LOG_INFO("HeuristicFactory: creating Manhattan");
      return std::make_unique<Manhattan>(graph);
    case HeuristicType::EUCLIDEAN:
      LOG_INFO("HeuristicFactory: creating Euclidean");
      return std::make_unique<Euclidean>(graph);
    case HeuristicType::OCTILE:
      LOG_INFO("HeuristicFactory: creating Octile");
      return std::make_unique<Octile>(graph);
    case HeuristicType::CHEBYSHEV:
      LOG_INFO("HeuristicFactory: creating Chebyshev");
      return std::make_unique<Chebyshev>(graph);
    default:
      LOG_WARN("HeuristicFactory: unknown heuristic type");
      return nullptr;
  }
}
