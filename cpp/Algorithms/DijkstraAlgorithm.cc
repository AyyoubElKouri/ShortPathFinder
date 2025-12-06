/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include "DijkstraAlgorithm.hh"
#include <queue>
#include <limits>
#include <set>

struct Node {
   int index;
   int cost;
   bool operator>(const Node& other) const {
      return cost > other.cost;
   }
};

PathfindingResult DijkstraAlgorithm::execute(const PathfindingInput& input) {
    PathfindingResult r;
    int rows = input.rows;
    int cols = input.cols;
    int n = rows * cols;
    int start = input.startIndex;
    int end = input.endIndex;

    // Directions autorisées
    std::vector<std::pair<int,int>> directions = {{-1,0},{1,0},{0,-1},{0,1}};
    if (input.allowDiagonal) {
        directions.insert(directions.end(), {{-1,-1},{-1,1},{1,-1},{1,1}});
    }

    std::vector<int> visited;
    
    if (input.bidirectional) {
        // ---------------- Bidirectional ----------------
        std::vector<int> distStart(n, std::numeric_limits<int>::max());
        std::vector<int> distEnd(n, std::numeric_limits<int>::max());
        std::vector<int> prevStart(n, -1);
        std::vector<int> prevEnd(n, -1);
        std::vector<bool> visitedStart(n,false);
        std::vector<bool> visitedEnd(n,false);

        distStart[start] = 0;
        distEnd[end] = 0;

        std::priority_queue<Node, std::vector<Node>, std::greater<Node>> pqStart;
        std::priority_queue<Node, std::vector<Node>, std::greater<Node>> pqEnd;

        pqStart.push({start,0});
        pqEnd.push({end,0});

        int meetingPoint = -1;

        while (!pqStart.empty() || !pqEnd.empty()) {
            // Front départ
            if (!pqStart.empty()) {
                Node current = pqStart.top(); pqStart.pop();
                if (!visitedStart[current.index]) {
                    visitedStart[current.index] = true;
                    visited.push_back(current.index);
                    if (visitedEnd[current.index]) { meetingPoint = current.index; break; }

                    int x = current.index % cols;
                    int y = current.index / cols;
                    for (auto [dx, dy] : directions) {
                        int nx = x + dx;
                        int ny = y + dy;
                        if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
                        int nIndex = ny*cols + nx;
                        if (input.grid[nIndex] != 0) continue;

                        if (dx != 0 && dy != 0 && input.dontCrossCorners) {
                            int idx1 = y*cols + (x+dx);
                            int idx2 = (y+dy)*cols + x;
                            if (input.grid[idx1]!=0 || input.grid[idx2]!=0) continue;
                        }

                        int cost = distStart[current.index]+1;
                        if (cost < distStart[nIndex]) {
                            distStart[nIndex] = cost;
                            prevStart[nIndex] = current.index;
                            pqStart.push({nIndex, cost});
                        }
                    }
                }
            }

            // Front arrivée
            if (!pqEnd.empty()) {
                Node current = pqEnd.top(); pqEnd.pop();
                if (!visitedEnd[current.index]) {
                    visitedEnd[current.index] = true;
                    visited.push_back(current.index);
                    if (visitedStart[current.index]) { meetingPoint = current.index; break; }

                    int x = current.index % cols;
                    int y = current.index / cols;
                    for (auto [dx, dy] : directions) {
                        int nx = x + dx;
                        int ny = y + dy;
                        if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
                        int nIndex = ny*cols + nx;
                        if (input.grid[nIndex] != 0) continue;

                        if (dx != 0 && dy != 0 && input.dontCrossCorners) {
                            int idx1 = y*cols + (x+dx);
                            int idx2 = (y+dy)*cols + x;
                            if (input.grid[idx1]!=0 || input.grid[idx2]!=0) continue;
                        }

                        int cost = distEnd[current.index]+1;
                        if (cost < distEnd[nIndex]) {
                            distEnd[nIndex] = cost;
                            prevEnd[nIndex] = current.index;
                            pqEnd.push({nIndex, cost});
                        }
                    }
                }
            }
        }

        // Reconstruction du chemin
        if (meetingPoint!=-1) {
            std::vector<int> path;
            for (int idx = meetingPoint; idx!=-1; idx=prevStart[idx]) path.push_back(idx);
            std::reverse(path.begin(), path.end());
            for (int idx = prevEnd[meetingPoint]; idx!=-1; idx=prevEnd[idx]) path.push_back(idx);
            r.path = path;
            r.success = true;
            r.cost = distStart[meetingPoint] + distEnd[meetingPoint];
        } else {
            r.success = false;
            r.cost = 0;
            r.path.clear();
        }

    } else {
        // ---------------- Simple Dijkstra ----------------
        std::vector<int> dist(n,std::numeric_limits<int>::max());
        std::vector<int> prev(n,-1);
        std::vector<bool> visitedNode(n,false);
        dist[start]=0;

        std::priority_queue<Node, std::vector<Node>, std::greater<Node>> pq;
        pq.push({start,0});

        while(!pq.empty()) {
            Node current = pq.top(); pq.pop();
            if(visitedNode[current.index]) continue;
            visitedNode[current.index]=true;
            visited.push_back(current.index);

            if(current.index==end) break;

            int x=current.index%cols;
            int y=current.index/cols;
            for(auto [dx,dy]:directions){
                int nx=x+dx;
                int ny=y+dy;
                if(nx<0||nx>=cols||ny<0||ny>=rows) continue;
                int nIndex=ny*cols+nx;
                if(input.grid[nIndex]!=0) continue;
                if(dx!=0 && dy!=0 && input.dontCrossCorners){
                    int idx1=y*cols+(x+dx);
                    int idx2=(y+dy)*cols+x;
                    if(input.grid[idx1]!=0 || input.grid[idx2]!=0) continue;
                }
                int cost = dist[current.index]+1;
                if(cost<dist[nIndex]){
                    dist[nIndex]=cost;
                    prev[nIndex]=current.index;
                    pq.push({nIndex,cost});
                }
            }
        }

        // Reconstruction
        if(dist[end]!=std::numeric_limits<int>::max()){
            int idx=end;
            std::vector<int> path;
            while(idx!=-1){ path.push_back(idx); idx=prev[idx]; }
            std::reverse(path.begin(),path.end());
            r.path=path;
            r.success=true;
            r.cost=dist[end];
        }else{
            r.success=false;
            r.cost=0;
            r.path.clear();
        }
    }

    r.visited=visited;
    return r;
}



bool DijkstraAlgorithm::registered_ =
   (AlgorithmFactory::registerAlgorithm(
      AlgorithmType::DIJKSTRA,
      [](){ return std::make_unique<DijkstraAlgorithm>(); }
   ), true);
