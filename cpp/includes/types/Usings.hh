/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#pragma once

#include <cstddef>
#include <chrono>

/** 
 * @brief Type definition for NodeId representing unique node identifiers.
 */
using NodeId = uint32_t;

/**
 * @brief Type definition for NodeCount representing the number of nodes.
 */
using NodeCount = uint32_t;

/**
 * @brief Type definition for cost of traversing edges between nodes.
 */
using Cost = double;

/**
 * @brief Type definition for Time representing durations taken by algorithms in microseconds.
 */
using Time = std::chrono::microseconds;