/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#ifndef PATHFINDING_INPUT_HH
#define PATHFINDING_INPUT_HH

#include <vector>
#include <cstdint>

#include "Enums/Enums.hh"

class PathfindingInput {
public:
   std::vector<uint8_t> grid;
   int rows;
   int cols;
   int startIndex;
   int endIndex;
   AlgorithmType algorithm;
   bool allowDiagonal;
   bool bidirectional;
   bool dontCrossCorners;
   Heuristic heuristic;
};

#endif // PATHFINDING_INPUT_HH