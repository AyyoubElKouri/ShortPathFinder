/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#pragma once

#include <vector>

/**
 * @brief The results structure for pathfinding searches that will be returned
 * to the frontend
 */
class SearchResults {
public:
  /**
   * @brief The nodes visited during the search in order
   */
  std::vector<int> visited;

  /**
   * @brief The final path from start to end if found
   */
  std::vector<int> path;

  /**
   * @brief Whether the search was successful in finding a path
   */
  bool success;

  /**
   * @brief The total cost of the found path (number of steps or cumulative
   * weight)
   */
  int cost;

  /**
   * @brief The total time taken to perform the search (in milliseconds)
   */
  int time;
};
