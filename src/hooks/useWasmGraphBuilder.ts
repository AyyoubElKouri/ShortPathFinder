/*--------------------------------------------------------------------------------------------------
*                       Copyright (c) Ayyoub EL Kouri. All rights reserved
*     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
*------------------------------------------------------------------------------------------------*/

import { useState, useEffect, useCallback } from 'react';
import { useGridStore } from '@/store/useGridStore';
import type { MainModule, SearchGraph } from '@/wasm/bin/searchengine';

/**
 * Hook that converts React grid state to WebAssembly SearchGraph
 */
export const useWasmGraphBuilder = () => {
  const [wasmModule, setWasmModule] = useState<MainModule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cellules, rows, cols } = useGridStore();

  // Load WASM module ONCE on mount
  useEffect(() => {
    const loadWasm = async () => {
        try {
          console.log('Loading WASM module...');
          setIsLoading(true);
          const module = await import('@/wasm/bin/searchengine');
          const wasm = await module.default();
          setWasmModule(wasm);
          console.log('WASM loaded successfully');
        } catch (err) {
          console.error('Failed to load WASM:', err);
          setError('Failed to load pathfinding engine');
        } finally {
          setIsLoading(false);
        }
    };

    loadWasm();
  }, []);

  // Convert grid to graph
  const buildGraphFromGrid = useCallback(() => {
    if (!wasmModule) return null;

    try {
        const graph = new wasmModule.SearchGraph(false);
        const nodeMap = new Map<string, number>();
        const nodeIdToCoord = new Map<number, {x: number, y: number}>();

        let nodeId = 0;

        // Add nodes for non-wall cells
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
              if (cellules[y][x].state !== 'wall') {
                graph.addNodeXY(x, y);
                nodeMap.set(`${x},${y}`, nodeId);
                nodeIdToCoord.set(nodeId, {x, y});
                nodeId++;
              }
          }
        }

        // Add edges
        const directions = [
          { dx: -1, dy: 0 },
          { dx: 1, dy: 0 },
          { dx: 0, dy: -1 },
          { dx: 0, dy: 1 },
        ];

        for (const [pos, fromId] of nodeMap.entries()) {
          const [xStr, yStr] = pos.split(',');
          const x = parseInt(xStr, 10);
          const y = parseInt(yStr, 10);

          for (const dir of directions) {
              const nx = x + dir.dx;
              const ny = y + dir.dy;
              const toKey = `${nx},${ny}`;
              const toId = nodeMap.get(toKey);

              if (toId !== undefined) {
                graph.addEdge(fromId, toId, 1);
              }
          }
        }

        console.log(`Built graph with ${nodeId} nodes`);
        return { graph, nodeIdToCoord };
    } catch (err) {
        console.error('Error building graph:', err);
        return null;
    }
  }, [wasmModule, cellules, rows, cols]);

  // Find start and end node IDs
  const findSpecialNodeIds = useCallback((graph: SearchGraph | null) => {
    if (!graph) return { startId: -1, endId: -1 };

    let startId = -1;
    let endId = -1;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (cellules[y][x].state === 'start') {
              for (let i = 0; i < graph.getNodeCount(); i++) {
                if (Math.abs(graph.getNodeX(i) - x) < 0.01 && 
                    Math.abs(graph.getNodeY(i) - y) < 0.01) {
                    startId = i;
                    break;
                }
              }
          } else if (cellules[y][x].state === 'end') {
              for (let i = 0; i < graph.getNodeCount(); i++) {
                if (Math.abs(graph.getNodeX(i) - x) < 0.01 && 
                    Math.abs(graph.getNodeY(i) - y) < 0.01) {
                    endId = i;
                    break;
                }
              }
          }
        }
    }

    return { startId, endId };
  }, [cellules, rows, cols]);

  return {
    wasmModule,
    buildGraphFromGrid,
    findSpecialNodeIds,
    isLoading,
    error,
  };
};

