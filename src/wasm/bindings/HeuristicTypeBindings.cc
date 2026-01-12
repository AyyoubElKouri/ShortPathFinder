/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include "../include/enums/HeuristicType.hh"
#include <emscripten/bind.h>

using namespace emscripten;

EMSCRIPTEN_BINDINGS(heuristic_types) {
  enum_<HeuristicType>("HeuristicType")
      .value("MANHATTAN", HeuristicType::MANHATTAN)
      .value("EUCLIDEAN", HeuristicType::EUCLIDEAN)
      .value("OCTILE", HeuristicType::OCTILE)
      .value("CHEBYSHEV", HeuristicType::CHEBYSHEV);
}