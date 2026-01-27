/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include <cmath>
#include "heuristics/Euclidean.hh"
#include "utils/Logger.hh"

Cost Euclidean::compute(NodeId from, NodeId to) const {
  Point a = graph_->getNodePosition(from);
  Point b = graph_->getNodePosition(to);
  double dx = static_cast<double>(a.x - b.x);
  double dy = static_cast<double>(a.y - b.y);
  Cost v = static_cast<Cost>(std::sqrt(dx*dx + dy*dy));
  LOG_DEBUG(std::string("Euclidean::compute from=") + std::to_string(from) + " to=" + std::to_string(to) + " => " + std::to_string(v));
  return v;
}
