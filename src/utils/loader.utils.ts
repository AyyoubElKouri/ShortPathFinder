import type { MainModule } from 'public/wasm/pathfinding';

let wasmModulePromise: Promise<MainModule> | null = null;

export async function loadWasm(): Promise<MainModule> {
  if (wasmModulePromise) {
    return wasmModulePromise;
  }

  wasmModulePromise = (async () => {
    try {
      const wasmPath = '/wasm/pathfinding.js';
      
      // Load the WASM JS file
      await loadScript(wasmPath);
      
      // The factory should now be available globally
      const factory = (window as any).PathfindingModule;
      if (typeof factory !== 'function') {
        throw new Error('PathfindingModule factory not found');
      }
      
      // Initialize the WASM module
      const wasmModule = await factory();
      
      // Validate
      if (!wasmModule || typeof wasmModule !== 'object') {
        throw new Error('Invalid WASM module');
      }
      
      if (!wasmModule.PathfindingAPI || !wasmModule.AlgorithmType) {
        throw new Error('WASM module missing required exports');
      }
      
      return wasmModule;
      
    } catch (error) {
      wasmModulePromise = null;
      throw error;
    }
  })();

  return wasmModulePromise;
}

// Helper function to load a script
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    
    script.onload = () => {
      resolve();
    };
    
    script.onerror = () => {
      reject(new Error(`Failed to load script: ${src}`));
    };
    
    document.head.appendChild(script);
  });
}

export function clearWasmCache(): void {
  wasmModulePromise = null;
}
