# ShortPathFinder WASM - Complete Architecture Guide

## 🎯 What This Project Does

This is a **C++ pathfinding library compiled to WebAssembly** so you can use high-performance pathfinding algorithms in your JavaScript/web applications. Think of it as a bridge: write fast algorithms in C++, use them in the browser.

---

## 📦 The Big Picture

```
JavaScript (Browser) 
    ↕️ [Emscripten Bindings]
C++ Code (WASM)
    ↕️
Pathfinding Algorithms
```

**Flow**: Your JS creates a graph → passes it to C++ → C++ runs pathfinding → returns results to JS.

---

## 🏗️ Project Structure Explained

```
wasm/
├── bin/                          # OUTPUT: Compiled WASM + JS glue code
│   ├── searchengine.wasm        # The actual compiled C++ code
│   ├── searchengine.js          # Emscripten's JS wrapper
│   └── searchengine.d.ts        # TypeScript definitions
│
├── bindings/                     # BRIDGE: C++ ↔ JavaScript
│   ├── AlgorithmTypeBindings.cc # Exposes algorithm enum to JS
│   ├── HeuristicTypeBindings.cc # Exposes heuristic enum to JS
│   ├── SearchEngineBindings.cc  # Exposes SearchEngine class to JS
│   ├── SearchGraphBindings.cc   # Exposes graph creation to JS
│   └── SearchResultsBindings.cc # Exposes results struct to JS
│
├── include/                      # HEADERS: C++ declarations
│   ├── algorithms/
│   │   ├── Algorithm.hh         # Base class (interface) for all algorithms
│   │   └── DijkstraAlgorithm.hh # Dijkstra implementation header
│   ├── enums/
│   │   ├── AlgorithmType.hh     # Enum: BFS, Dijkstra, A*, etc.
│   │   └── HeuristicType.hh     # Enum: Manhattan, Euclidean, etc.
│   ├── SearchEngine.hh          # Main API: configure & run search
│   ├── SearchGraph.hh           # Graph data structure
│   └── SearchResults.hh         # Results container
│
├── src/                          # IMPLEMENTATION: C++ code
│   ├── DijkstraAlgorithm.cc     # Dijkstra's algorithm implementation
│   ├── SearchEngine.cc          # SearchEngine implementation
│   └── SearchGraph.cc           # Graph operations implementation
│
├── compile.sh                    # Build script
└── README.md
```

---

## 🧩 Core Components Deep Dive

### 1️⃣ **SearchGraph** - The Graph Data Structure

**What it is**: Stores your graph as nodes and weighted edges.

**Key Classes**:
- **`Edge`**: A connection from one node to another with a weight (cost).
  ```cpp
  Edge(targetId, weight)  // Example: Edge(5, 10) = edge to node 5, cost 10
  ```

- **`PathNode`**: A single node in the graph.
  - Has an ID (auto-assigned, sequential starting from 0)
  - Has coordinates (x, y) for heuristic calculations
  - Has a list of outgoing edges
  
- **`SearchGraph`**: The main graph container.
  - Can be **directed** or **undirected**
  - Stores nodes in a vector (fast O(1) access by ID)
  - Nodes IDs = their index in the vector (node 0 is at index 0, etc.)

**How to build a graph**:
```cpp
SearchGraph graph(false);  // false = undirected graph
graph.addNode(0, 0);       // Node 0 at position (0,0)
graph.addNode(10, 0);      // Node 1 at position (10,0)
graph.addNode(10, 10);     // Node 2 at position (10,10)
graph.addEdge(0, 1, 5);    // Edge from node 0 to 1, cost 5
graph.addEdge(1, 2, 3);    // Edge from node 1 to 2, cost 3
// For undirected, addEdge automatically creates reverse edges
```

**Important**: Node IDs are auto-generated sequentially. First node added = ID 0, second = ID 1, etc.

---

### 2️⃣ **Algorithm** - The Strategy Pattern

**What it is**: An abstract base class that defines how all pathfinding algorithms should work.

**Key Concept**: All algorithms must implement one method: `execute()` which returns `SearchResults`.

**Parameters every algorithm receives**:
- `HeuristicType`: How to estimate distance (Manhattan, Euclidean, etc.)
- `SearchGraph`: The graph to search
- `startNodeId`: Where to start
- `targetNodeId`: Where to end
- `allowDiagonal`: Can you move diagonally in a grid?
- `bidirectional`: Search from both ends?
- `dontCrossCorners`: Block diagonal moves through corners?

**Current Implementation**: Only `DijkstraAlgorithm` is implemented right now.

---

### 3️⃣ **DijkstraAlgorithm** - The Only Working Algorithm

**What it does**: Finds the shortest path in a weighted graph using Dijkstra's algorithm.

**How it works** (simplified):
1. Start at the start node with distance 0
2. Keep a priority queue of nodes to visit (sorted by distance)
3. Visit the closest unvisited node
4. Update distances to its neighbors if we found a shorter path
5. Repeat until we reach the target or run out of nodes
6. Reconstruct the path by following the "previous node" chain backwards

**What it returns**:
- `path`: List of node IDs from start to end
- `visited`: All nodes explored during search (in order)
- `success`: Did we find a path?
- `cost`: Total cost of the path
- `time`: How long it took (milliseconds)

**Key Implementation Details**:
- Uses a min-heap (priority queue) for efficiency
- Tracks visited nodes to avoid cycles
- Records the "previous" node for each node to reconstruct the path
- Stops early when target is reached (optimization)

---

### 4️⃣ **SearchEngine** - The Main API

**What it is**: The entry point. You configure it, call `runSearch()`, get results.

**Two constructors**:
1. **With heuristic** (for A*, IDA*):
   ```cpp
   SearchEngine(algorithm, heuristic, graph, start, end, diagonal, bidirectional, corners)
   ```

2. **Without heuristic** (for Dijkstra, BFS, DFS):
   ```cpp
   SearchEngine(algorithm, graph, start, end, diagonal, bidirectional, corners)
   ```

**What it does**:
- Stores your configuration
- When you call `runSearch()`, it creates the appropriate algorithm object
- Right now it ALWAYS creates `DijkstraAlgorithm` (other algorithms not implemented yet)
- Calls `execute()` on the algorithm
- Returns the results

**Current Limitation**: The `algorithm` parameter is ignored. Always runs Dijkstra.

---

### 5️⃣ **SearchResults** - The Output

**What it is**: A simple data container returned to JavaScript.

**Fields**:
- `visited`: `vector<int>` - All nodes explored (IDs in order)
- `path`: `vector<int>` - The final path (IDs from start to end)
- `success`: `bool` - Did we find a path?
- `cost`: `int` - Total path cost (sum of edge weights)
- `time`: `int` - Execution time in milliseconds

---

### 6️⃣ **Bindings** - The JavaScript Bridge

**What they are**: These files expose C++ classes to JavaScript using Emscripten.

**How Emscripten works**:
- You write `EMSCRIPTEN_BINDINGS` blocks that tell Emscripten what to expose
- Emscripten generates JavaScript code that can call your C++
- JavaScript sees your C++ classes as if they were normal JS objects

**Example - SearchGraphBindings.cc**:
```cpp
class_<SearchGraph>("SearchGraph")
    .constructor<bool>()                    // new Module.SearchGraph(false)
    .function("addNode", ...)               // graph.addNode()
    .function("addEdge", &SearchGraph::addEdge)  // graph.addEdge(0,1,5)
```

**What each binding file does**:
- **AlgorithmTypeBindings**: Exposes the algorithm enum (BFS, DIJKSTRA, ASTAR, etc.)
- **HeuristicTypeBindings**: Exposes the heuristic enum (MANHATTAN, EUCLIDEAN, etc.)
- **SearchGraphBindings**: Exposes graph creation methods (addNode, addEdge, getNeighbors, etc.)
- **SearchEngineBindings**: Exposes the SearchEngine class and runSearch method
- **SearchResultsBindings**: Exposes the results fields (path, visited, success, cost, time)

---

## 🔄 Complete Data Flow

Let's trace a complete example from JavaScript to results:

### Step 1: Create Graph (JS)
```javascript
const graph = new Module.SearchGraph(false);  // undirected
graph.addNode(0, 0);    // ID 0
graph.addNode(5, 0);    // ID 1
graph.addNode(5, 5);    // ID 2
graph.addEdge(0, 1, 1); // connects 0→1, cost 1
graph.addEdge(1, 2, 1); // connects 1→2, cost 1
```

**What happens in C++**:
- `SearchGraphBindings.cc` receives the call
- Creates `SearchGraph` object in WASM memory
- Each `addNode` creates a `PathNode` with sequential ID
- Each `addEdge` adds `Edge` objects to node's edge list
- For undirected, also adds reverse edges automatically

### Step 2: Create Engine (JS)
```javascript
const engine = new Module.SearchEngine(
  Module.AlgorithmType.DIJKSTRA,  // algorithm
  graph,                          // graph reference
  0,                              // start at node 0
  2,                              // end at node 2
  true,                           // allow diagonal
  false,                          // not bidirectional
  false                           // allow corner crossing
);
```

**What happens in C++**:
- `SearchEngineBindings.cc` receives the call
- Creates `SearchEngine` object in WASM memory
- Stores all parameters as member variables
- Graph is passed by reference (not copied)

### Step 3: Run Search (JS)
```javascript
const results = engine.runSearch();
console.log(results.path);      // [0, 1, 2]
console.log(results.cost);      // 2
console.log(results.visited);   // [0, 1, 2]
```

**What happens in C++**:
1. `SearchEngine::runSearch()` in `SearchEngine.cc` is called
2. Creates `DijkstraAlgorithm` object with stored parameters
3. Calls `algo->execute()` in `DijkstraAlgorithm.cc`
4. **Dijkstra's algorithm runs**:
   - Initializes distance array (all infinity except start=0)
   - Initializes priority queue with start node
   - Loop:
     - Pop closest node from queue (node 0, distance 0)
     - Mark as visited
     - Check neighbors (node 1)
     - Update distance to node 1 (0+1=1)
     - Push node 1 to queue
     - Pop node 1, distance 1
     - Check neighbors (node 2)
     - Update distance to node 2 (1+1=2)
     - Push node 2 to queue
     - Pop node 2, distance 2
     - Target reached! Break.
   - Reconstruct path by following "previous" pointers: 2←1←0, reverse to [0,1,2]
5. Returns `SearchResults` with path=[0,1,2], cost=2, visited=[0,1,2]
6. `SearchResultsBindings.cc` converts C++ vector to JS array
7. JavaScript receives a regular JS object

---

## 🔧 How to Add a New Algorithm

Let's say you want to add **A* algorithm**:

### 1. Create Header File
**File**: `include/algorithms/AStarAlgorithm.hh`
```cpp
#pragma once
#include "Algorithm.hh"

class AStarAlgorithm : public Algorithm {
public:
  AStarAlgorithm(HeuristicType heuristic, SearchGraph &graph, 
                 int startNodeId, int targetNodeId,
                 bool allowDiagonal, bool bidirectional, 
                 bool dontCrossCorners)
      : Algorithm(heuristic, graph, startNodeId, targetNodeId,
                  allowDiagonal, bidirectional, dontCrossCorners) {}

  SearchResults execute() override;
};
```

### 2. Create Implementation File
**File**: `src/AStarAlgorithm.cc`
```cpp
#include "../include/algorithms/AStarAlgorithm.hh"
#include <queue>
#include <cmath>

SearchResults AStarAlgorithm::execute() {
  SearchResults results;
  
  // Your A* implementation here
  // Use this->heuristicType to calculate h(n)
  // Use this->graph to access nodes
  // Use this->startNodeId and this->targetNodeId
  
  return results;
}
```

### 3. Update SearchEngine
**File**: `src/SearchEngine.cc`
```cpp
#include "../include/SearchEngine.hh"
#include "../include/algorithms/AStarAlgorithm.hh"  // ADD THIS

SearchResults SearchEngine::runSearch() {
  Algorithm *algo = nullptr;
  
  // ADD THIS SWITCH
  switch(algorithm) {
    case AlgorithmType::DIJKSTRA:
      algo = new DijkstraAlgorithm(heuristic, graph, startNodeId, 
                                   targetNodeId, allowDiagonal, 
                                   bidirectional, dontCrossCorners);
      break;
    case AlgorithmType::ASTAR:
      algo = new AStarAlgorithm(heuristic, graph, startNodeId, 
                                targetNodeId, allowDiagonal, 
                                bidirectional, dontCrossCorners);
      break;
    // Add other cases...
    default:
      algo = new DijkstraAlgorithm(heuristic, graph, startNodeId, 
                                   targetNodeId, allowDiagonal, 
                                   bidirectional, dontCrossCorners);
  }
  
  SearchResults results = algo->execute();
  delete algo;  // Don't forget to free memory!
  return results;
}
```

### 4. Recompile
```bash
./compile.sh
```

**No binding changes needed!** The algorithm is hidden behind the `Algorithm` interface.

---

## 🌟 Key Design Patterns Used

### Strategy Pattern (Algorithm)
- `Algorithm` is the interface
- `DijkstraAlgorithm`, `AStarAlgorithm`, etc. are strategies
- `SearchEngine` is the context that uses them
- **Benefit**: Easy to add new algorithms without changing existing code

### Template Method Pattern (execute)
- `Algorithm::execute()` defines the interface
- Each concrete algorithm implements its own version
- **Benefit**: Uniform API for all algorithms

### Dependency Injection (SearchGraph)
- Graph is passed to `SearchEngine` and then to algorithms
- No algorithm creates its own graph
- **Benefit**: Same graph can be used by multiple searches

---

## 💡 Important Concepts

### Node IDs are Sequential
When you call `addNode()`, the node gets ID = current size of nodes vector.
```cpp
graph.addNode();  // ID 0
graph.addNode();  // ID 1
graph.addNode();  // ID 2
```
**You can't choose IDs manually.** They're auto-assigned.

### Undirected Graphs Auto-Create Reverse Edges
```cpp
SearchGraph graph(false);  // undirected
graph.addEdge(0, 1, 5);    // Creates: 0→1 (cost 5) AND 1→0 (cost 5)
```

### Directed Graphs Don't
```cpp
SearchGraph graph(true);   // directed
graph.addEdge(0, 1, 5);    // Creates ONLY: 0→1 (cost 5)
```

### Heuristics are Only for A*/IDA*
Dijkstra, BFS, DFS don't use heuristics. But you still pass one to maintain a uniform API.

### Memory Management
- `SearchEngine::runSearch()` creates the algorithm with `new`
- Should delete it after use (currently missing in the code - memory leak!)
- Emscripten handles C++↔JS memory automatically

---

## 🚀 Using in JavaScript

### Load the Module
```html
<script src="bin/searchengine.js"></script>
<script>
Module.onRuntimeInitialized = () => {
  // Your code here
};
</script>
```

### Complete Example
```javascript
// 1. Create graph
const graph = new Module.SearchGraph(false);

// 2. Add nodes (forms a triangle)
graph.addNode(0, 0);    // Node 0
graph.addNode(10, 0);   // Node 1
graph.addNode(5, 8.66); // Node 2

// 3. Add edges
graph.addEdge(0, 1, 10);  // 0↔1, cost 10
graph.addEdge(1, 2, 10);  // 1↔2, cost 10
graph.addEdge(0, 2, 10);  // 0↔2, cost 10

// 4. Create search engine
const engine = new Module.SearchEngine(
  Module.AlgorithmType.DIJKSTRA,
  graph,
  0,     // start
  2,     // end
  false, // no diagonals
  false, // not bidirectional
  false  // allow corners
);

// 5. Run search
const results = engine.runSearch();

// 6. Use results
if (results.success) {
  console.log('Path found:', results.path);        // [0, 2]
  console.log('Cost:', results.cost);              // 10
  console.log('Nodes visited:', results.visited);  // [0, 2]
  console.log('Time (ms):', results.time);         // ~0
}
```

---

## 🐛 Common Issues & Solutions

### "Module is not defined"
- Make sure `searchengine.js` is loaded before your code
- Wrap code in `Module.onRuntimeInitialized`

### "Node index out of range"
- You're using a node ID that doesn't exist
- Remember: IDs start at 0 and go up sequentially
- Check with `graph.nodeExists(id)` first

### Algorithm always runs Dijkstra
- Yes, that's expected. Other algorithms aren't implemented yet.
- The framework is ready, just need to write the algorithm implementations.

### Path is empty even though success=true
- Check the graph connectivity
- Make sure edges are added correctly
- For undirected graphs, `addEdge(a,b,w)` creates both a→b and b→a

---

## 📚 File Reference Quick Guide

**To understand graphs**: Read `SearchGraph.hh` and `SearchGraph.cc`

**To understand algorithms**: Read `Algorithm.hh` then `DijkstraAlgorithm.hh` and `.cc`

**To understand the API**: Read `SearchEngine.hh` and `SearchEngine.cc`

**To understand JS interface**: Read the binding files in `bindings/`

**To see algorithm types**: Read `AlgorithmType.hh` and `HeuristicType.hh`

**To understand results**: Read `SearchResults.hh`

---

## 🎓 Learning Path for New Developers

**Day 1**: Understand the graph structure
- Read `SearchGraph.hh` carefully
- Understand `PathNode`, `Edge`, and `SearchGraph`
- Try creating graphs in JavaScript

**Day 2**: Understand how algorithms work
- Read `Algorithm.hh` (the interface)
- Read `DijkstraAlgorithm.cc` line by line
- Understand the Dijkstra algorithm implementation

**Day 3**: Understand the flow
- Read `SearchEngine.hh` and `.cc`
- Understand how it creates algorithms
- Trace a complete execution in your mind

**Day 4**: Understand bindings
- Read one binding file completely
- Understand how Emscripten exposes C++ to JS
- Try modifying a binding to add a new function

**Day 5**: Implement something new
- Try adding a simple algorithm (BFS is easiest)
- Or add a new graph method
- Or add a new feature to results

---

## 🔥 Quick Reference: What Each File Does

| File | Purpose |
|------|---------|
| `SearchGraph.hh/.cc` | Graph data structure (nodes, edges) |
| `Algorithm.hh` | Base class for all algorithms |
| `DijkstraAlgorithm.hh/.cc` | Dijkstra's algorithm implementation |
| `SearchEngine.hh/.cc` | Main API, creates & runs algorithms |
| `SearchResults.hh` | Container for results |
| `AlgorithmType.hh` | Enum of available algorithms |
| `HeuristicType.hh` | Enum of distance heuristics |
| `*Bindings.cc` | Expose C++ to JavaScript |
| `compile.sh` | Build script |
| `bin/` | Compiled output (WASM + JS) |

---

That's it! You now understand the complete architecture. Start with the graph, understand how algorithms work, then add your own. The framework is ready for expansion.