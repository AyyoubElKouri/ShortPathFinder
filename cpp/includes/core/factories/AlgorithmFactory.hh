/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#pragma once

#include <memory>

#include "algorithms/IAlgorithm.hh"
#include "types/Enums.hh"

/**
 * @brief Factory class for creating pathfinding algorithm instances.
 * 
 * This factory provides a method to create instances of different pathfinding
 * algorithms based on the specified AlgorithmType.
 */
class AlgorithmFactory {

  public:
    /**
     * @brief Create an instance of a pathfinding algorithm based on the specified type.
     * 
     * @param type The type of algorithm to create.
     * 
     * @return A unique pointer to the created IAlgorithm instance.
     * 
     * @note If the specified type is not recognized, the method will return a nullptr (with log).
     */
    static std::unique_ptr<IAlgorithm> createAlgorithm(AlgorithmType type);
};
