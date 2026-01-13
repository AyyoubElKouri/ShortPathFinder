/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include "../include/SearchEngine.hh"

SearchResults SearchEngine::runSearch() {

  Algorithm *algo = nullptr;

  switch (algorithm) {
  case AlgorithmType::DIJKSTRA:
    algo = new DijkstraAlgorithm(heuristic, graph, startNodeId, targetNodeId, allowDiagonal,
                                 bidirectional, dontCrossCorners);
    break;
 }

  SearchResults results = algo->execute();
  delete algo;

  return results;
}
