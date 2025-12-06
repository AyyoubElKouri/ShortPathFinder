/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#ifndef DIJKSTRA_ALGORITHM_HH
#define DIJKSTRA_ALGORITHM_HH

#include <algorithm>
#include <cstdlib>

#include "Algorithm.hh"
#include "InputResult/InputResult.hh"
#include "AlgorithmFactory/AlgorithmFactory.hh"

class DijkstraAlgorithm : public Algorithm {
public:
   PathfindingResult execute(const PathfindingInput& input) override;

private:
   static bool registered_;
};


#endif // DIJKSTRA_ALGORITHM_HH