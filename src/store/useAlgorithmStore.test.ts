/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useAlgorithmStore } from "./useAlgorithmStore";

describe("AlgorithmStore", () => {
	// Reset the store before each test
	beforeEach(() => {
		useAlgorithmStore.setState({
			algorithm: "A*",
			config: {
				allowDiagonal: true,
				bidirectional: false,
				dontCrossCorners: false,
				heuristic: "manhattan",
			},
		});
	});

	describe("Initial state", () => {
		it("should have A* as the default algorithm", () => {
			const { algorithm } = useAlgorithmStore.getState();
			expect(algorithm).toBe("A*");
		});

		it("should have the correct default configuration", () => {
			const { config } = useAlgorithmStore.getState();
			expect(config).toEqual({
				allowDiagonal: true,
				bidirectional: false,
				dontCrossCorners: false,
				heuristic: "manhattan",
			});
		});
	});

	describe("setAlgorithm", () => {
		it("should change the algorithm to Dijkstra", () => {
			const { setAlgorithm } = useAlgorithmStore.getState();
			setAlgorithm("Dijkstra");

			const { algorithm } = useAlgorithmStore.getState();
			expect(algorithm).toBe("Dijkstra");
		});

		it("should remove heuristic for non-heuristic algorithms", () => {
			const { setAlgorithm } = useAlgorithmStore.getState();
			setAlgorithm("Dijkstra");

			const { config } = useAlgorithmStore.getState();
			expect(config.heuristic).toBeUndefined();
		});

		it("should keep heuristic for A*", () => {
			const { setAlgorithm } = useAlgorithmStore.getState();
			setAlgorithm("Dijkstra"); // first remove heuristic
			setAlgorithm("A*"); // then switch back to A*

			const { config } = useAlgorithmStore.getState();
			expect(config.heuristic).toBe("manhattan");
		});

		it("should switch to Breadth-First Search without heuristic", () => {
			const { setAlgorithm } = useAlgorithmStore.getState();
			setAlgorithm("Breadth-First Search");

			const state = useAlgorithmStore.getState();
			expect(state.algorithm).toBe("Breadth-First Search");
			expect(state.config.heuristic).toBeUndefined();
		});
	});

	describe("setConfig", () => {
		it("should update allowDiagonal", () => {
			const { setConfig } = useAlgorithmStore.getState();
			setConfig({ allowDiagonal: false });

			const { config } = useAlgorithmStore.getState();
			expect(config.allowDiagonal).toBe(false);
		});

		it("should update bidirectional", () => {
			const { setConfig } = useAlgorithmStore.getState();
			setConfig({ bidirectional: true });

			const { config } = useAlgorithmStore.getState();
			expect(config.bidirectional).toBe(true);
		});

		it("should update heuristic for A*", () => {
			const { setConfig } = useAlgorithmStore.getState();
			setConfig({ heuristic: "euclidean" });

			const { config } = useAlgorithmStore.getState();
			expect(config.heuristic).toBe("euclidean");
		});

		it("should not allow adding heuristic for Dijkstra", () => {
			const { setAlgorithm, setConfig } = useAlgorithmStore.getState();
			setAlgorithm("Dijkstra");
			setConfig({ heuristic: "manhattan" });

			const { config } = useAlgorithmStore.getState();
			expect(config.heuristic).toBeUndefined();
		});

		it("should update multiple configs at once", () => {
			const { setConfig } = useAlgorithmStore.getState();
			setConfig({
				allowDiagonal: false,
				bidirectional: true,
				dontCrossCorners: true,
			});

			const { config } = useAlgorithmStore.getState();
			expect(config.allowDiagonal).toBe(false);
			expect(config.bidirectional).toBe(true);
			expect(config.dontCrossCorners).toBe(true);
		});
	});

	describe("Complex scenarios", () => {
		it("should handle multiple algorithm changes", () => {
			const { setAlgorithm } = useAlgorithmStore.getState();

			setAlgorithm("Dijkstra");
			expect(useAlgorithmStore.getState().config.heuristic).toBeUndefined();

			setAlgorithm("A*");
			expect(useAlgorithmStore.getState().config.heuristic).toBe(
				"manhattan",
			);

			setAlgorithm("Trace");
			expect(useAlgorithmStore.getState().config.heuristic).toBeUndefined();
		});

		it("should preserve other configs when changing algorithm", () => {
			const { setConfig, setAlgorithm } = useAlgorithmStore.getState();

			setConfig({ allowDiagonal: false, bidirectional: true });
			setAlgorithm("Dijkstra");

			const { config } = useAlgorithmStore.getState();
			expect(config.allowDiagonal).toBe(false);
			expect(config.bidirectional).toBe(true);
		});
	});
});
