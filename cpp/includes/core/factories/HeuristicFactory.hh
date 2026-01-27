/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#pragma once

#include <memory>

#include "heuristics/IHeuristic.hh"
#include "types/Enums.hh"
#include "graph/IGraph.hh"

/**
 * @brief Factory class for creating heuristic instances.
 * 
 * This factory provides a method to create instances of different heuristics
 * based on the specified HeuristicType.
 */
class HeuristicFactory {

  public:
    /**
     * @brief Create an instance of a heuristic based on the specified type.
     * 
     * @param type The type of heuristic to create.
     * @param graph Reference to the graph on which the heuristic will operate.
     * 
     * @return A unique pointer to the created IHeuristic instance.
     * 
     * @note If the specified type is not recognized, the method will return a nullptr (with log).
     */
    static std::unique_ptr<IHeuristic> createHeuristic(HeuristicType type, std::shared_ptr<const IGraph> graph);
};