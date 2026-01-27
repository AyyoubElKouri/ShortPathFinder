# Professional Makefile for building native and Emscripten/WASM targets
# - Places all object files and final artifacts inside the `bin/` directory
# - Targets: all (default), native, wasm, wasm-release, clean, distclean, run, format

SHELL := /bin/bash

###############################################################################
# Toolchain
CXX ?= g++
CXXFLAGS ?= -std=c++17 -O2 -Wall -Wextra -Wshadow -Wformat=2 -Wconversion -fno-omit-frame-pointer
DEBUG_FLAGS ?= -g -O0
INCLUDES := -Iincludes -Iincludes/core

# Emscripten (optional)
EMCC ?= emcc
EMCC_FLAGS := --bind -s MODULARIZE=1 -s EXPORT_NAME=PathfindingModule -O2
EMCC_FLAGS_DEBUG := --bind -s MODULARIZE=1 -s EXPORT_NAME=PathfindingModule -O0 -g4

###############################################################################
# Directories and sources
SRCDIR := src
BINDIR := bin
OBJ_DIR := $(BINDIR)/objects
SRCS := $(wildcard $(SRCDIR)/*.cc)
# native object files (for fast native builds)
OBJS := $(patsubst $(SRCDIR)/%.cc,$(OBJ_DIR)/%.o,$(SRCS))

# WASM object files (one .wasm.o per source) to allow incremental rebuilds
WASM_OBJECTS := $(patsubst $(SRCDIR)/%.cc,$(OBJ_DIR)/%.wasm.o,$(SRCS))

PROGRAM := $(BINDIR)/test_app
WASM_JS := $(BINDIR)/pathfinding.js
WASM_WASM := $(BINDIR)/pathfinding.wasm

###############################################################################
.PHONY: all native wasm wasm-release clean distclean run format help

all: native

help:
	@echo "Makefile targets:"
	@echo "  make          (default -> native)"
	@echo "  make native   Build native binary: $(PROGRAM)"
	@echo "  make wasm     Build Emscripten embind bundle: $(WASM_JS) + $(WASM_WASM) (requires emcc)"
	@echo "  make wasm-release   Optimized wasm build"
	@echo "  make clean    Remove object files and binaries in $(BINDIR)/"
	@echo "  make run      Run $(PROGRAM)"
	@echo "  make format   Run clang-format over source & headers (if available)"

###############################################################################
# Ensure bin and objects dirs exist
$(BINDIR):
	@mkdir -p $(BINDIR)

$(OBJ_DIR): | $(BINDIR)
	@mkdir -p $(OBJ_DIR)

###############################################################################
# Pattern rule: compile .cc -> bin/%.o
$(OBJ_DIR)/%.o: $(SRCDIR)/%.cc | $(OBJ_DIR)
	@echo "[CXX] $< -> $@"
	$(CXX) $(CXXFLAGS) $(INCLUDES) -c $< -o $@

###############################################################################
# Native link

$(PROGRAM): $(OBJS) | $(BINDIR)
	@echo "[LINK] $@"
	$(CXX) $(CXXFLAGS) $(OBJS) -o $@

native: $(PROGRAM)

run: native
	@echo "Running $(PROGRAM)"
	@$(PROGRAM)

###############################################################################
# Emscripten / WASM builds
ifdef EMCC_AVAILABLE
EMCC := $(EMCC_AVAILABLE)
endif


$(OBJ_DIR)/%.wasm.o: $(SRCDIR)/%.cc | $(OBJ_DIR)
	@echo "[EMCC] Compiling WASM object $< -> $@"
	$(EMCC) $(EMCC_FLAGS_DEBUG) $(INCLUDES) -c $< -o $@

wasm: $(WASM_OBJECTS) | $(BINDIR)
	@command -v $(EMCC) >/dev/null 2>&1 || { echo >&2 "Emscripten (emcc) not found in PATH. Install Emscripten or set EMCC variable."; exit 1; }
	@echo "[EMCC] Linking WASM (debug) -> $(WASM_JS)"
	$(EMCC) $(EMCC_FLAGS_DEBUG) $(WASM_OBJECTS) --emit-tsd pathfinding.d.ts -o $(WASM_JS)
	@# move generated d.ts into $(BINDIR) (emcc may write relative to build dir)
	@if [ -f pathfinding.d.ts ]; then mv pathfinding.d.ts $(BINDIR)/pathfinding.d.ts; fi


wasm-release: $(patsubst $(BINDIR)/%.wasm.o,$(BINDIR)/%.wasm.o,$(WASM_OBJECTS)) | $(BINDIR)
	@command -v $(EMCC) >/dev/null 2>&1 || { echo >&2 "Emscripten (emcc) not found in PATH. Install Emscripten or set EMCC variable."; exit 1; }
	@echo "[EMCC] Linking WASM (release) -> $(WASM_JS) + $(WASM_WASM)"
	$(EMCC) $(EMCC_FLAGS) $(WASM_OBJECTS) --emit-tsd pathfinding.d.ts -o $(WASM_JS)
	@if [ -f pathfinding.d.ts ]; then mv pathfinding.d.ts $(BINDIR)/pathfinding.d.ts; fi

###############################################################################
# Utility targets
clean:
	@echo "Cleaning $(BINDIR) objects and binaries..."
	@rm -rf $(OBJ_DIR) $(PROGRAM) $(WASM_JS) $(WASM_WASM) $(BINDIR)/pathfinding.d.ts

distclean: clean

format:
	@command -v clang-format >/dev/null 2>&1 || { echo >&2 "clang-format not found in PATH; skipping."; exit 0; }
	@echo "Formatting source and headers with clang-format"
	@clang-format -i $(SRCDIR)/*.cc includes/**/*.hh || true

###############################################################################
# Show variables useful for debugging
dump-vars:
	@echo "CXX=$(CXX)"
	@echo "CXXFLAGS=$(CXXFLAGS)"
	@echo "INCLUDES=$(INCLUDES)"
	@echo "SRCS=$(SRCS)"
	@echo "OBJS=$(OBJS)"
