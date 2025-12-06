/*--------------------------------------------------------------------------------------------------
*                       Copyright (c) Ayyoub EL Kouri. All rights reserved
*     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
*-------------------------------------------------------------------------------------------------*/

#include "PathfindingEngine.hh"
#include <emscripten/bind.h>

using namespace emscripten;

PathfindingResult PathfindingEngine::run(const PathfindingInput& input) {
   auto algo = AlgorithmFactory::create(input.algorithm);
   return algo->execute(input);
}

//  ------------------------------------ Exposing to Emscripten ------------------------------------

EMSCRIPTEN_BINDINGS(pathfinding_module) {

    // Enums
    enum_<AlgorithmType>("Algorithm")
        .value("BFS", AlgorithmType::BFS)
        .value("DIJKSTRA", AlgorithmType::DIJKSTRA)
        .value("ASTAR", AlgorithmType::ASTAR)
        .value("IDASTAR", AlgorithmType::IDASTAR)
        .value("DFS", AlgorithmType::DFS)
        .value("JUMPPOINT", AlgorithmType::JUMPPOINT)
        .value("ORTHOGONALJUMPPOINT", AlgorithmType::ORTHOGONALJUMPPOINT)
        .value("TRACE", AlgorithmType::TRACE);

    enum_<Heuristic>("Heuristic")
        .value("MANHATTAN", Heuristic::MANHATTAN)
        .value("EUCLIDEAN", Heuristic::EUCLIDEAN)
        .value("OCTILE", Heuristic::OCTILE)
        .value("CHEBYSHEV", Heuristic::CHEBYSHEV);

    // Vectors
    register_vector<uint8_t>("VectorUint8");
    register_vector<int>("VectorInt");

    // PathfindingInput
    class_<PathfindingInput>("PathfindingInput")
        .constructor<>()
        .property("grid", &PathfindingInput::grid)
        .property("rows", &PathfindingInput::rows)
        .property("cols", &PathfindingInput::cols)
        .property("startIndex", &PathfindingInput::startIndex)
        .property("endIndex", &PathfindingInput::endIndex)
        .property("algorithm", &PathfindingInput::algorithm)
        .property("allowDiagonal", &PathfindingInput::allowDiagonal)
        .property("bidirectional", &PathfindingInput::bidirectional)
        .property("dontCrossCorners", &PathfindingInput::dontCrossCorners)
        .property("heuristic", &PathfindingInput::heuristic);

    // PathfindingResult
    class_<PathfindingResult>("PathfindingResult")
        .constructor<>()
        .property("visited", &PathfindingResult::visited)
        .property("path", &PathfindingResult::path)
        .property("success", &PathfindingResult::success)
        .property("cost", &PathfindingResult::cost);

    // PathfindingEngine
    class_<PathfindingEngine>("PathfindingEngine")
        .constructor<>()
        .function("run", &PathfindingEngine::run);
}
