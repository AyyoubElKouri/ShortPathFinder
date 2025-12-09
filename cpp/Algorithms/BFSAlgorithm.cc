/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include "BFSAlgorithm.hh"

PathfindingResult BFSAlgorithm::execute(const PathfindingInput& input) {
   PathfindingResult r;
   int rows = input.rows;
   int cols = input.cols;
   int start = input.startIndex;
   int end = input.endIndex;

   std::vector<std::pair<int,int>> directions = {{-1,0},{1,0},{0,-1},{0,1}};
   if (input.allowDiagonal) {
      directions.insert(directions.end(), {{-1,-1},{-1,1},{1,-1},{1,1}});
   }

   std::vector<int> visited;
   std::vector<int> prev(rows * cols, -1);
   std::vector<bool> visitedNode(rows * cols, false);
   
   std::queue<int> q;
   q.push(start);
   visitedNode[start] = true;
   visited.push_back(start);

   bool found = false;

   while(!q.empty() && !found) {
      int current = q.front(); 
      q.pop();

      if(current == end) {
         found = true;
         break;
      }

      int x = current % cols;
      int y = current / cols;
      
      for(auto [dx, dy] : directions) {
         int nx = x + dx;
         int ny = y + dy;
         if(nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
         
         int nIndex = ny * cols + nx;
         if(input.grid[nIndex] != 0) continue;
         if(visitedNode[nIndex]) continue;
         
         if(dx != 0 && dy != 0 && input.dontCrossCorners) {
               int idx1 = y * cols + (x + dx);
               int idx2 = (y + dy) * cols + x;
               if(input.grid[idx1] != 0 || input.grid[idx2] != 0) continue;
         }
         
         visitedNode[nIndex] = true;
         prev[nIndex] = current;
         visited.push_back(nIndex);
         q.push(nIndex);
      }
   }

   if(found) {
      std::vector<int> path;
      int idx = end;
      while(idx != -1) {
         path.push_back(idx);
         idx = prev[idx];
      }
      std::reverse(path.begin(), path.end());
      r.path = path;
      r.success = true;
      r.cost = path.size() - 1;
   } else {
      r.success = false;
      r.cost = 0;
      r.path.clear();
   }

   r.visited = visited;
   return r;
}

bool BFSAlgorithm::registered_ =
   (AlgorithmFactory::registerAlgorithm(
      AlgorithmType::BFS,
      [](){ return std::make_unique<BFSAlgorithm>(); }
   ), true);

