/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#ifndef PATHFINDING_RESULT_HH
#define PATHFINDING_RESULT_HH

#include <vector>

class PathfindingResult {
public:
   std::vector<int> visited;
   std::vector<int> path;
   bool success;
   int cost;
};

#endif // PATHFINDING_RESULT_HH