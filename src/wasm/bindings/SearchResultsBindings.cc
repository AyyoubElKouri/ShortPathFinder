/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include "../include/SearchResults.hh"
#include <emscripten/bind.h>

using namespace emscripten;

EMSCRIPTEN_BINDINGS(searchresults) {
  class_<SearchResults>("SearchResults")
      .constructor<>()
      .property("path", &SearchResults::path)
      .property("visited", &SearchResults::visited)
      .property("success", &SearchResults::success)
      .property("cost", &SearchResults::cost)
      .property("time", &SearchResults::time);
}