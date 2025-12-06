/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#ifndef ASTAR_ALGORITHM_HH
#define ASTAR_ALGORITHM_HH

#include <algorithm>
#include <cstdlib>

#include "Algorithm.hh"
#include "InputResult/InputResult.hh"
#include "AlgorithmFactory/AlgorithmFactory.hh"

class AStarAlgorithm : public Algorithm {
public:
   PathfindingResult execute(const PathfindingInput& input) override;

private:
   static bool registered_;
};

#endif // ASTAR_ALGORITHM_HH
