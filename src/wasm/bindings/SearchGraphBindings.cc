/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include "../include/SearchGraph.hh"
#include <emscripten/bind.h>

using namespace emscripten;

// Bindings Emscripten
EMSCRIPTEN_BINDINGS(searchgraph_module) {
  // Enregistrer les types de vecteurs
  register_vector<Edge>("VectorEdge");
  register_vector<int>("VectorInt");

  // Classe Edge
  class_<Edge>("Edge")
      .constructor<int, int>()
      .property("targetId", &Edge::targetId)
      .property("weight", &Edge::weight);

  // Classe SearchGraph
  class_<SearchGraph>("SearchGraph")
      .constructor<bool>()

      .function("addNode", select_overload<void()>(&SearchGraph::addNode))
      .function("addNodeXY", select_overload<void(double, double)>(&SearchGraph::addNode))
      .function("addEdge", &SearchGraph::addEdge)
      .function("getNodeCount", &SearchGraph::getNodeCount)
      .function("nodeExists", &SearchGraph::nodeExists)
      .function("getNeighbors", &SearchGraph::getNeighbors)
      .function("getNodeX", optional_override([](SearchGraph &self, int id) {
                  if (!self.nodeExists(id))
                    return 0.0;
                  return self.getNode(id).x;
                }))
      .function("getNodeY", optional_override([](SearchGraph &self, int id) {
                  if (!self.nodeExists(id))
                    return 0.0;
                  return self.getNode(id).y;
                }));
}