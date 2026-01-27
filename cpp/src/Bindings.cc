/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include <emscripten/bind.h>

#include "api/PathfindingEngine.hh"
#include "api/Binding.hh"

using namespace emscripten;

emscripten::val api::PathfindingAPI::findPath(
    const emscripten::val& gridArray,
    int width,
    int height,
    int startIndex,
    int goalIndex,
    const api::PathfindingConfig& config
) {
    // Convert JS array (Uint8Array or Array) -> std::vector<int>
    std::vector<int> grid = emscripten::convertJSArrayToNumberVector<int>(gridArray);

    // Call the engine
    Result result = PathfindingEngine::findPath(
        grid,
        width,
        height,
        static_cast<NodeId>(startIndex),
        static_cast<NodeId>(goalIndex),
        config.algorithm,
        config.heuristic,
        config.allowDiagonal,
        config.dontCrossCorners,
        config.bidirectional
    );

    // Build JS result object
    emscripten::val jsResult = emscripten::val::object();

    emscripten::val jspath = emscripten::val::array();
    for (NodeId id : result.path) jspath.call<void>("push", emscripten::val(id));

    emscripten::val jsvisited = emscripten::val::array();
    for (NodeId v : result.visited) jsvisited.call<void>("push", emscripten::val(v));

    jsResult.set("path", jspath);
    jsResult.set("visited", jsvisited);
    jsResult.set("cost", result.cost);
    jsResult.set("success", result.success);
    // Return time as a JS Number (double) to avoid BigInt serialization issues
    jsResult.set("time_us", static_cast<double>(result.time.count()));

    return jsResult;
}

EMSCRIPTEN_BINDINGS(pathfinding_api) {
    using namespace emscripten;

    enum_<AlgorithmType>("AlgorithmType")
        .value("ASTAR", AlgorithmType::ASTAR)
        .value("DIJKSTRA", AlgorithmType::DIJKSTRA)
        ;

    enum_<HeuristicType>("HeuristicType")
        .value("MANHATTAN", HeuristicType::MANHATTAN)
        .value("EUCLIDEAN", HeuristicType::EUCLIDEAN)
        ;

    value_object<api::PathfindingConfig>("PathfindingConfig")
        .field("algorithm", &api::PathfindingConfig::algorithm)
        .field("heuristic", &api::PathfindingConfig::heuristic)
        .field("allowDiagonal", &api::PathfindingConfig::allowDiagonal)
        .field("dontCrossCorners", &api::PathfindingConfig::dontCrossCorners)
        .field("bidirectional", &api::PathfindingConfig::bidirectional)
        ;

    class_<api::PathfindingAPI>("PathfindingAPI")
        .class_function("findPath", &api::PathfindingAPI::findPath)
        ;
}