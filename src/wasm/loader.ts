import type { MainModule } from './pathfinding.d.ts';

type WasmFactory = (options?: unknown) => Promise<MainModule>;
type GlobalObject = typeof globalThis & Record<string, unknown>;

let wasmModulePromise: Promise<MainModule> | null = null;

/**
 * Get the appropriate global object for the current environment
 */
function getGlobalObject(): GlobalObject {
  if (typeof globalThis !== 'undefined') {
    return globalThis as GlobalObject;
  }
  if (typeof window !== 'undefined') {
    return window as unknown as GlobalObject;
  }
  if (typeof global !== 'undefined') {
    return global as GlobalObject;
  }
  throw new Error('Unable to locate global object');
}

/**
 * Find the WebAssembly factory function in the global scope
 */
function findWasmFactory(globalObj: GlobalObject): WasmFactory | null {
  const possibleNames = [
    'PathfindingModule',
    'pathfindingModule',
    'Module',
    'WasmModule',
    'wasmModule'
  ];

  for (const name of possibleNames) {
    const candidate = globalObj[name];
    if (typeof candidate === 'function') {
      return candidate as WasmFactory;
    }
  }

  return null;
}

/**
 * Validate that the loaded module has the expected structure
 */
function validateWasmModule(module: unknown): asserts module is MainModule {
  if (!module || typeof module !== 'object') {
    throw new Error('Invalid WASM module: not an object');
  }

  const requiredExports = ['_main', 'AlgorithmType', 'HeuristicType', 'PathfindingAPI'];
  const moduleObj = module as Record<string, unknown>;

  for (const exportName of requiredExports) {
    if (!(exportName in moduleObj)) {
      throw new Error(`Invalid WASM module: missing export "${exportName}"`);
    }
  }

  // Additional type validation for embind exports
  if (!moduleObj.PathfindingAPI || typeof (moduleObj.PathfindingAPI as any).findPath !== 'function') {
    throw new Error('Invalid WASM module: PathfindingAPI is not properly initialized');
  }
}

/**
 * Load the WebAssembly module using dynamic import
 * This is the preferred method for modern bundlers
 */
async function loadViaImport(): Promise<MainModule> {
  const globalObj = getGlobalObject();
  
  // Import the module as a side-effect
  await import('./pathfinding.js');
  
  // Wait briefly for the module to initialize
  await new Promise(resolve => setTimeout(resolve, 0));
  
  const factory = findWasmFactory(globalObj);
  if (!factory) {
    throw new Error(
      'WebAssembly factory function not found. ' +
      'Ensure the pathfinding.js file exports a global PathfindingModule variable.'
    );
  }

  const wasmModule = await factory();
  validateWasmModule(wasmModule);
  
  return wasmModule;
}

/**
 * Load the WebAssembly module using script tag injection
 * Fallback method when dynamic imports are problematic
 */
async function loadViaScriptTag(): Promise<MainModule> {
  return new Promise((resolve, reject) => {
    // Check if we're in a browser environment
    if (typeof document === 'undefined') {
      reject(new Error('Script tag loading requires a browser environment'));
      return;
    }

    const script = document.createElement('script');
    script.src = './pathfinding.js';
    script.type = 'text/javascript';
    script.async = true;

    const cleanup = () => {
      script.remove();
      clearTimeout(timeoutId);
    };

    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error('WASM module loading timed out'));
    }, 30000); // 30 second timeout

    script.onload = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100)); // Brief wait for initialization
        
        const factory = findWasmFactory(window as unknown as GlobalObject);
        if (!factory) {
          throw new Error('Factory function not found after script load');
        }

        const wasmModule = await factory();
        validateWasmModule(wasmModule);
        
        cleanup();
        resolve(wasmModule);
      } catch (error) {
        cleanup();
        reject(error);
      }
    };

    script.onerror = (error) => {
      cleanup();
      reject(new Error(`Failed to load WASM script: ${error}`));
    };

    document.head.appendChild(script);
  });
}

/**
 * Main function to load and initialize the WebAssembly module
 * Uses caching to avoid multiple initializations
 * 
 * @param options Optional initialization options for the WASM module
 * @returns Promise<MainModule> The initialized WebAssembly module
 */
export async function loadWasm(options?: unknown): Promise<MainModule> {
  if (wasmModulePromise && !options) {
    return wasmModulePromise;
  }

  // Create a new promise for this specific configuration
  const loadPromise = (async () => {
    try {
      let wasmModule: MainModule;

      // Try dynamic import first (preferred method)
      try {
        wasmModule = await loadViaImport();
      } catch (importError) {
        console.warn('Dynamic import failed, falling back to script tag:', importError);
        
        // Fallback to script tag injection
        wasmModule = await loadViaScriptTag();
      }

      // Apply options if provided
      if (options && typeof wasmModule === 'object' && 'applyOptions' in wasmModule) {
        const applyOptions = (wasmModule as any).applyOptions;
        if (typeof applyOptions === 'function') {
          applyOptions(options);
        }
      }

      return wasmModule;
    } catch (error) {
      // Reset cache only on initial load errors
      if (!wasmModulePromise) {
        wasmModulePromise = null;
      }
      throw error;
    }
  })();

  // Cache the promise only if no options were provided
  if (!options) {
    wasmModulePromise = loadPromise;
  }

  return loadPromise;
}

/**
 * Clear the cached module instance
 * Useful for testing or when you need to reload the module
 */
export function clearWasmCache(): void {
  wasmModulePromise = null;
}

/**
 * Check if a WebAssembly module is currently loaded and cached
 */
export function isWasmLoaded(): boolean {
  return wasmModulePromise !== null;
}

/**
 * Get the current cached module promise if it exists
 * Returns null if no module is loaded
 */
export function getCachedWasm(): Promise<MainModule> | null {
  return wasmModulePromise;
}

/**
 * Force reload the WebAssembly module
 * Useful for recovering from errors or loading updated modules
 */
export async function reloadWasm(): Promise<MainModule> {
  clearWasmCache();
  return loadWasm();
}