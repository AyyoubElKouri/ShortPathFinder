/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import type { AlgorithmStore } from "@/store/useAlgorithmStore";
import { useAlgorithmStore } from "@/store/useAlgorithmStore";

export interface AlgorithmReturns extends AlgorithmStore {}

export function useAlgorithm(): AlgorithmReturns {
	const { algorithm, config, setAlgorithm, setConfig } = useAlgorithmStore();

	return {
		algorithm,
		config,
		setAlgorithm,
		setConfig,
	};
}
