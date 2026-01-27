/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include <cstdlib>
#include "heuristics/Chebyshev.hh"
#include "utils/Logger.hh"

Cost Chebyshev::compute(NodeId from, NodeId to) const {
  Point a = graph_->getNodePosition(from);
  Point b = graph_->getNodePosition(to);
  Cost v = static_cast<Cost>(std::max(std::abs(a.x - b.x), std::abs(a.y - b.y)));
  LOG_DEBUG(std::string("Chebyshev::compute from=") + std::to_string(from) + " to=" + std::to_string(to) + " => " + std::to_string(v));
  return v;
}
