/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useEffect, useRef, useState, useCallback } from "react";
import type { MainModule } from "@/wasm/bin/searchengine";

interface WebAssemblyReturns {
	/**
	 * Indicates whether the WebAssembly module has been loaded
	 */
	isLoaded: boolean;

	/**
	 * Indicates whether the WebAssembly module is currently loading
	 */
	isLoading: boolean;

	/**
	 * Any error that occurred during the loading of the WebAssembly module
	 */
	error: Error | null;

	/**
	 * The loaded WebAssembly module instance
	 */
	module: MainModule | null;

	/**
	 * Reloads the WebAssembly module
	 *
	 * @returns Promise that resolves when the module is reloaded
	 *
	 * @throws WebAssemblyLoadingError - If module loading fails
	 */
	reload: () => Promise<void>;
}

/**
 * @hook useWebAssembly
 * @brief Manages the lifecycle of a WebAssembly module
 * @description This hook handles loading, instantiating, and managing WebAssembly modules
 *              with proper state management, error handling, and cleanup.
 *
 * @param config - Configuration options for WebAssembly loading
 * @return WebAssemblyReturns - Object containing module state and control functions
 *
 * @dependencies
 *  - React: For state management and lifecycle
 *  - WebAssembly API: For loading and instantiating WASM modules
 *
 * @example
 * ```tsx
 * const { isLoaded, module, error, reload } = useWebAssembly({
 *   wasmPath: "/path/to/module.wasm",
 *   importObject: { env: { log: console.log } }
 * });
 * ```
 *
 * @throws
 *  - WebAssemblyLoadingError - When WebAssembly is not supported or module loading fails
 *
 */
export function useWebAssembly(config?: {
	wasmPath?: string;
	importObject?: WebAssembly.Imports;
}): WebAssemblyReturns {
	/** Configuration with defaults */
	const { wasmPath = "/wasm/bin/searchengine.wasm", importObject = {} } =
		config || {};

	/** State for module loading status */
	const [isLoaded, setIsLoaded] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);
	const [module, setModule] = useState<MainModule | null>(null);

	/** Component mount state for cleanup */
	const isMounted = useRef<boolean>(true);
	/** WebAssembly instance reference for cleanup */
	const wasmInstanceRef = useRef<WebAssembly.Instance | null>(null);

	/**
	 * Loads and instantiates the WebAssembly module
	 */
	const loadModule = useCallback(async (): Promise<void> => {
		// Prevent concurrent loading
		if (isLoading) return;

		setError(null);
		setIsLoading(true);

		try {
			await performWasmLoading();

			if (isMounted.current) {
				setIsLoading(false);
			}
		} catch (err) {
			handleLoadingError(err);
		}
	}, [wasmPath, importObject, isLoading]);

	/**
	 * Performs the actual WebAssembly loading and instantiation
	 */
	const performWasmLoading = async (): Promise<void> => {
		validateWebAssemblySupport();

		const wasmBuffer = await fetchWasmModule(wasmPath);
		const result = await instantiateWasmModule(wasmBuffer, importObject);

		storeWasmInstance(result.instance);
		updateModuleState(result.instance.exports as unknown as MainModule);
	};

	/**
	 * Validates WebAssembly support in the current environment
	 *
	 * @throws WebAssemblyLoadingError - If WebAssembly is not supported
	 */
	const validateWebAssemblySupport = (): void => {
		if (typeof WebAssembly === "undefined" || !WebAssembly.instantiate) {
			throw new Error("WebAssembly is not supported in this browser");
		}
	};

	/**
	 * Fetches the WebAssembly module from the specified path
	 *
	 * @param path - Path to the WASM file
	 * @returns ArrayBuffer containing the WASM module
	 *
	 * @throws WebAssemblyLoadingError - If fetching fails
	 */
	const fetchWasmModule = async (path: string): Promise<ArrayBuffer> => {
		const response = await fetch(path);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch WebAssembly module from ${path}: ` +
					`${response.status} ${response.statusText}`,
			);
		}

		return await response.arrayBuffer();
	};

	/**
	 * Instantiates the WebAssembly module
	 *
	 * @param wasmBuffer - WASM module binary data
	 * @param imports - Import object for the module
	 * @returns WebAssembly instantiation result
	 *
	 * @throws WebAssemblyLoadingError - If instantiation fails
	 */
	const instantiateWasmModule = async (
		wasmBuffer: ArrayBuffer,
		imports: WebAssembly.Imports,
	): Promise<WebAssembly.WebAssemblyInstantiatedSource> => {
		return await WebAssembly.instantiate(wasmBuffer, imports);
	};

	/**
	 * Stores the WebAssembly instance reference for cleanup
	 */
	const storeWasmInstance = (instance: WebAssembly.Instance): void => {
		wasmInstanceRef.current = instance;
	};

	/**
	 * Updates React state with the loaded module
	 */
	const updateModuleState = (loadedModule: MainModule): void => {
		if (!isMounted.current) return;

		setModule(loadedModule);
		setIsLoaded(true);
	};

	/**
	 * Handles loading errors and updates state accordingly
	 */
	const handleLoadingError = (error: unknown): void => {
		const loadingError =
			error instanceof Error ? error : new Error(String(error));

		if (isMounted.current) {
			setError(loadingError);
			setIsLoaded(false);
			setIsLoading(false);
		}

		// Re-throw for potential external handling
		throw loadingError;
	};

	/**
	 * Reloads the WebAssembly module
	 */
	const reloadModule = useCallback(async (): Promise<void> => {
		// Clear current state before reloading
		if (isMounted.current) {
			setModule(null);
			setIsLoaded(false);
		}

		await loadModule();
	}, [loadModule]);

	/**
	 * Cleans up WebAssembly resources
	 */
	const cleanupWasmResources = useCallback((): void => {
		if (!wasmInstanceRef.current) return;

		const exports = wasmInstanceRef.current.exports as any;

		// Call Emscripten cleanup function if available
		if (typeof exports._free === "function") {
			exports._free();
		}

		wasmInstanceRef.current = null;
	}, []);

	/**
	 * Handles component unmount cleanup
	 */
	const handleUnmount = (): void => {
		isMounted.current = false;
		cleanupWasmResources();
	};

	/**
	 * Initializes the hook and loads the module on mount
	 */
	useEffect(() => {
		isMounted.current = true;

		loadModule().catch(() => {
			// Errors are handled within loadModule
		});

		return handleUnmount;
	}, []); // Run only on mount/unmount

	return {
		isLoaded,
		isLoading,
		error,
		module,
		reload: reloadModule,
	};
}
