#!/bin/bash

emcc \
  AlgorithmFactory/AlgorithmFactory.cc \
  Algorithms/DijkstraAlgorithm.cc \
  Algorithms/AStartAlgorithm.cc \
  PathfindingEngine/PathfindingEngine.cc \
  -I. \
  -lembind \
  -o pathfinding.js \
  -s MODULARIZE=1 \
  -s EXPORT_ES6=1 \
  -s ENVIRONMENT=web \
  -s SINGLE_FILE=1 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s NO_EXIT_RUNTIME=1 \
  -s NO_DISABLE_EXCEPTION_CATCHING \
  --emit-tsd pathfinding.d.ts \
  -O3

echo "Compilation Done ✔"
