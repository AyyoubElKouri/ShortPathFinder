/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include <cmath>
#include "heuristics/Octile.hh"
#include "utils/Logger.hh"

Cost Octile::compute(NodeId from, NodeId to) const {
  Point a = graph_->getNodePosition(from);
  Point b = graph_->getNodePosition(to);
  double dx = std::abs(a.x - b.x);
  double dy = std::abs(a.y - b.y);
  double F = std::sqrt(2.0) - 1.0;
  Cost v = static_cast<Cost>((dx < dy) ? (dx * F + dy) : (dy * F + dx));
  return v;
}
