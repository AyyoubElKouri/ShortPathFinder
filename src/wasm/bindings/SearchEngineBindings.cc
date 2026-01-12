/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include "../include/SearchEngine.hh"
#include <emscripten/bind.h>

using namespace emscripten;

EMSCRIPTEN_BINDINGS(searchengine) {
  class_<SearchEngine>("SearchEngine")
      .constructor<AlgorithmType, HeuristicType, SearchGraph &, int, int, bool, bool, bool>()
      .constructor<AlgorithmType, SearchGraph &, int, int, bool, bool, bool>()
      .function("runSearch", &SearchEngine::runSearch);
}
