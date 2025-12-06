/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

 #include "AStartAlgorithm.hh"

PathfindingResult AStarAlgorithm::execute(const PathfindingInput& input) {
      PathfindingResult r;

   int rows = input.rows;
   int cols = input.cols;

   int startX = input.startIndex % cols;
   int startY = input.startIndex / cols;
   int endX = input.endIndex % cols;
   int endY = input.endIndex / cols;

   std::vector<int> path;
   int x = startX, y = startY;
   while (x != endX) {
      path.push_back(y * cols + x);
      x += (endX > x ? 1 : -1);
   }
   while (y != endY) {
      path.push_back(y * cols + x);
      y += (endY > y ? 1 : -1);
   }
   path.push_back(endY * cols + endX);
   r.path = path;

   std::vector<int> visited;
   visited.reserve(rows * cols / 2);

   for (int i = 0; i < path.size(); ++i) {
      int index = path[i];
      visited.push_back(index);

      int y0 = index / cols;
      int x0 = index % cols;

      for (int dx = -1; dx <= 1; ++dx) {
         for (int dy = -1; dy <= 1; ++dy) {
               if ((dx == 0 && dy == 0) || rand() % 2 == 0) continue;
               int nx = x0 + dx;
               int ny = y0 + dy;
               if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
                  int nIndex = ny * cols + nx;
                  if (std::find(visited.begin(), visited.end(), nIndex) == visited.end()) {
                     visited.push_back(nIndex);
                  }
               }
         }
      }
   }

   r.visited = visited;
   r.success = true;
   r.cost = static_cast<int>(path.size());

   return r;
}

bool AStarAlgorithm::registered_ =
(AlgorithmFactory::registerAlgorithm(
   AlgorithmType::ASTAR,
   [](){ return std::make_unique<AStarAlgorithm>(); }
), true);