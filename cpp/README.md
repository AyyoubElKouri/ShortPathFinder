# Pathfinding Library — WebAssembly & Native Usage

This repository contains a simple, extensible pathfinding library written in modern C++ (interfaces, A*, Dijkstra, BFS, heuristics) and a small Emscripten binding layer so you can call it from JavaScript.

This README explains:
- How to build the native test binary
- How to build a WebAssembly module (Emscripten / embind)
- The JavaScript usage pattern for the embind API
- The expected grid / ID conventions and the `Result` shape

Contents
- `includes/` — public headers and API types
- `src/` — implementation
- `bin/` — build artifacts (object files and binaries)

Quick start

1) Native build (Linux/macOS):

```bash
# Build native test program (objects and binary placed under bin/)
make

# Run the test app
./bin/test_app
```

2) WebAssembly build (Emscripten):

Requirements: emsdk/emcc on PATH (Emscripten SDK). Then:

```bash
# Build a WASM + JS wrapper into bin/
make wasm

# The output will be bin/pathfinding.js and bin/pathfinding.wasm
```

If you prefer a release/minified wasm build, run `make wasm-release`.

Makefile targets
- `make` / `make all` — build native binary `bin/test_app` (default)
- `make native` — same as `make`
- `make wasm` — build Emscripten embind bundle `bin/pathfinding.js` + `bin/pathfinding.wasm` (needs emcc)
- `make wasm-release` — optimized release wasm (smaller)
- `make clean` — remove object files and generated binaries in `bin/`
- `make distclean` — alias to `make clean` (reserved for future extra artifacts)
- `make run` — runs `./bin/test_app`
- `make format` — runs `clang-format` (if available) over `src/` and `includes/` (optional)

API contract (important for JS)

- Grid layout: row-major, index = y * width + x. The binding expects an array with length == width*height.
- Grid cell values (current convention used by the binding):
  - `0` = walkable
  - `1` = blocked/obstacle
  If you need weighted cells, we can change the binding to accept `Float64Array` of cell costs (useful for terrain cost maps).
- NodeId: `uint32_t` — node index computed as described above.

Result (returned to JS)

The embind wrapper returns a plain JS object with these fields:

- `path` — Array of node indices (NodeId). Empty if no path found.
- `visited` — Array of visited node indices (in order discovered).
- `cost` — Total cost as a number (double).
- `success` — boolean, true when a path was found.
- `time_us` — integer microseconds the algorithm took (measured on the native side).

Example JavaScript usage (browser or Node with embind-modularized output)

If you used `make wasm`, the build produces a modularized JS file `bin/pathfinding.js`. Example usage:

```html
<script src="pathfinding.js"></script>
<script>
  // For MODULARIZE=1 output, create the module then use it
  PathfindingModule().then(Module => {
    // Prepare a sample 5x5 grid (0 = walkable, 1 = blocked)
    const width = 5, height = 5;
    const grid = new Uint8Array(width * height).fill(0);
    const start = 0;
    const goal = 24;

    const cfg = new Module.PathfindingConfig();
    cfg.algorithm = Module.AlgorithmType.ASTAR;
    cfg.heuristic = Module.HeuristicType.MANHATTAN;
    cfg.allowDiagonal = true;

    const res = Module.PathfindingAPI.findPath(grid, width, height, start, goal, cfg);
    console.log('Result', res);
  });
</script>
```

Node.js example (when built for Node):

```js
const PathfindingModule = require('./bin/pathfinding.js');
PathfindingModule().then(Module => {
  const width = 5, height = 5;
  const grid = new Uint8Array(width * height).fill(0);
  const cfg = new Module.PathfindingConfig();
  cfg.algorithm = Module.AlgorithmType.ASTAR;
  cfg.heuristic = Module.HeuristicType.MANHATTAN;

  const res = Module.PathfindingAPI.findPath(grid, width, height, 0, 24, cfg);
  console.log(res);
});
```

Notes & troubleshooting
- If your JS `grid` is a regular `Array`, embind will convert numbers; for performance pass a `Uint8Array` or typed array.
- If `time_us` shows 0 or negative values, make sure the binary was compiled in release mode (the test app uses chrono; the wasm timer resolution differs).
- To change logging behavior: the native logger auto-detects interactive terminals; in JS/WASM builds, logging goes to the console via Emscripten's stdout/stderr.

Next steps (optional)
- Add a small `pf_free_result` C-API if you want to avoid embind and reduce binary size. I can add a compact C ABI wrapper that returns plain pointers/lengths for maximum portability.
- Add progress callbacks for long-running searches (use embind function callbacks or a step API to integrate with the browser event loop).

If you want, I can also add a short `docs/` page with examples and a small Node test harness.

---
Generated on 2026-01-21
