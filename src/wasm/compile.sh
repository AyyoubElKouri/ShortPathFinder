#!/bin/bash

emcc src/SearchGraph.cc \
     bindings/SearchGraphBindings.cc \
     bindings/SearchResultsBindings.cc \
     bindings/AlgorithmTypeBindings.cc \
     bindings/HeuristicTypeBindings.cc \
     bindings/SearchEngineBindings.cc\
     src/SearchEngine.cc \
     src/DijkstraAlgorithm.cc \
     -O3 \
     -Iinclude \
     -lembind \
     -o bin/searchengine.js \
     -s MODULARIZE=1 \
     -s EXPORT_ES6=1 \
     --emit-tsd searchengine.d.ts \
     --bind

echo "✅ Done!"