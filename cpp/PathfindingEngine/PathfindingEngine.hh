/*--------------------------------------------------------------------------------------------------
*                       Copyright (c) Ayyoub EL Kouri. All rights reserved
*     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
*-------------------------------------------------------------------------------------------------*/

#ifndef PATHFINDING_ENGINE_HH
#define PATHFINDING_ENGINE_HH

#include "InputResult/InputResult.hh"
#include "AlgorithmFactory/AlgorithmFactory.hh"

class PathfindingEngine {
public:
   PathfindingResult run(const PathfindingInput& input);
};

#endif // PATHFINDING_ENGINE_HH
