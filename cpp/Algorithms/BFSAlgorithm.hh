/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#ifndef BFS_ALGORITHM_HH
#define BFS_ALGORITHM_HH

#include <algorithm>
#include <cstdlib>
#include <queue>

#include "Algorithm.hh"
#include "InputResult/InputResult.hh"
#include "AlgorithmFactory/AlgorithmFactory.hh"

class BFSAlgorithm : public Algorithm {
public:
   PathfindingResult execute(const PathfindingInput& input) override;

private:
   static bool registered_;
};

#endif // BFS_ALGORITHM_HH