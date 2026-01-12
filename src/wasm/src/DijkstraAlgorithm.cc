/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include "../include/algorithms/DijkstraAlgorithm.hh"

#include <algorithm>
#include <chrono>
#include <limits>
#include <queue>
#include <vector>

SearchResults DijkstraAlgorithm::execute() {
  SearchResults results;
  auto startTime = std::chrono::high_resolution_clock::now();

  // Verify node existence
  if (!graph.nodeExists(startNodeId) || !graph.nodeExists(targetNodeId)) {
    results.success = false;
    results.cost = 0;
    results.time = 0;
    return results;
  }

  if (startNodeId == targetNodeId) {
    results.success = true;
    results.cost = 0;
    results.path = {startNodeId};
    results.visited = {startNodeId};
    results.time = 0;
    return results;
  }

  const size_t nodeCount = graph.getNodeCount();

  // Initialization of structures
  std::vector<int> distance(nodeCount, std::numeric_limits<int>::max());
  std::vector<int> previous(nodeCount, -1);
  std::vector<bool> visitedSet(nodeCount, false);

  // Priority queue: (distance, nodeId)
  using PQElement = std::pair<int, int>; // (distance, node)
  std::priority_queue<PQElement, std::vector<PQElement>, std::greater<PQElement>> pq;

  // Initialize start
  distance[startNodeId] = 0;
  pq.push({0, startNodeId});

  std::vector<int> visitedOrder;

  // Main algorithm loop
  while (!pq.empty()) {
    auto [currentDist, currentNode] = pq.top();
    pq.pop();

    if (visitedSet[currentNode])
      continue;

    visitedSet[currentNode] = true;
    visitedOrder.push_back(currentNode);

    // Target reached?
    if (currentNode == targetNodeId) {
      break;
    }

    // Explore neighbors
    for (const Edge &edge : graph.getNeighbors(currentNode)) {
      int neighbor = edge.targetId;

      if (visitedSet[neighbor])
        continue;

      int newDist = currentDist + edge.weight;

      if (newDist < distance[neighbor]) {
        distance[neighbor] = newDist;
        previous[neighbor] = currentNode;
        pq.push({newDist, neighbor});
      }
    }
  }

  // Calculate elapsed time
  auto endTime = std::chrono::high_resolution_clock::now();
  auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime);
  results.time = static_cast<int>(duration.count());

  // Check if a path exists
  if (distance[targetNodeId] == std::numeric_limits<int>::max()) {
    results.success = false;
    results.cost = 0;
    results.visited = visitedOrder;
    return results;
  }

  // Reconstruct the path
  std::vector<int> path;
  for (int node = targetNodeId; node != -1; node = previous[node]) {
    path.push_back(node);
  }
  std::reverse(path.begin(), path.end());

  // Fill in the results
  results.success = true;
  results.cost = distance[targetNodeId];
  results.path = path;
  results.visited = visitedOrder;

  return results;
}
