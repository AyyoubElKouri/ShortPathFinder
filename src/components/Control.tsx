/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { Move } from "lucide-react";
import { ALGORITHMS } from "@/lib/constants";
import {
	type AlgorithmConfig,
	useAlgorithmStore,
} from "@/store/useAlgorithmStore";

export function Control({
	position,
	setPosition,
}: {
	position?: boolean;
	setPosition?: (position: boolean) => void;
}) {
	const { algorithm, config, setAlgorithm, setConfig } = useAlgorithmStore();

	return (
		<div
			className="relative w-full h-full bg-zinc-900 overflow-y-auto"
			style={{ direction: position ? "rtl" : "ltr" }}
		>
			<div style={{ direction: "ltr" }}>
				{/* Button to change the panel position */}
				<button
					type="button"
					className="absolute top-2 right-2 p-2 bg-zinc-700 text-white rounded"
					onClick={() => {
						if (setPosition) {
							setPosition(!position);
						}
					}}
				>
					<Move size={18} />
				</button>

				<h1
					className="flex items-center pl-3 text-zinc-100 text-xl font-normal h-13 border-b
								 border-zinc-700"
				>
					Short Path Finder
				</h1>

				{/* Select Algorithm */}
				<div className="w-full p-4">
					<h3 className="text-zinc-200 mb-3">Select Algorithm</h3>

					<div className="flex flex-wrap gap-2">
						{ALGORITHMS.map((algo) => (
							<button
								key={algo}
								type="button"
								className={`p-2 bg-zinc-800 text-white rounded hover:bg-zinc-700
                              active:scale-95 ${algorithm === algo && " ring-2 ring-zinc-500"}`}
								onClick={() => setAlgorithm(algo)}
							>
								{algo}
							</button>
						))}
					</div>
				</div>

				{/* Select Configuration */}
				<div className="w-full p-4">
					<h3 className="text-zinc-200 mb-3">Configuration</h3>

					<div className="flex flex-col gap-3">
						{/* Allow Diagonal */}
						<label className="flex items-center justify-between bg-zinc-800 p-2 rounded">
							<span className="text-zinc-200">
								Allow Diagonal Movement
							</span>
							<input
								type="checkbox"
								checked={config.allowDiagonal}
								onChange={(e) =>
									setConfig({ allowDiagonal: e.target.checked })
								}
								className="w-11 h-6 bg-zinc-700 rounded-full appearance-none
										  checked:bg-indigo-500 relative before:absolute before:content-['']
											 before:w-5 before:h-5 before:bg-white before:rounded-full
											 before:top-0.5 before:left-0.5 before:transition-all
											 checked:before:translate-x-5"
							/>
						</label>

						{/* Bidirectional */}
						<label className="flex items-center justify-between bg-zinc-800 p-2 rounded">
							<span className="text-zinc-200">Bidirectional Search</span>
							<input
								type="checkbox"
								checked={config.bidirectional}
								onChange={(e) =>
									setConfig({ bidirectional: e.target.checked })
								}
								className="w-11 h-6 bg-zinc-700 rounded-full appearance-none
										   checked:bg-indigo-500 relative before:absolute before:content-['']
											 before:w-5 before:h-5 before:bg-white before:rounded-full
											 before:top-0.5 before:left-0.5 before:transition-all
											 checked:before:translate-x-5"
							/>
						</label>

						{/* Don't Cross Corners */}
						<label className="flex items-center justify-between bg-zinc-800 p-2 rounded">
							<span className="text-zinc-200">Don't Cross Corners</span>
							<input
								type="checkbox"
								checked={config.dontCrossCorners}
								onChange={(e) =>
									setConfig({ dontCrossCorners: e.target.checked })
								}
								className="w-11 h-6 bg-zinc-700 rounded-full appearance-none
								 			*:checked:bg-indigo-500 relative before:absolute
											 before:content-[''] before:w-5 before:h-5 before:bg-white
											 before:rounded-full before:top-0.5 before:left-0.5
											 before:transition-all checked:before:translate-x-5"
							/>
						</label>

						{/* Heuristic Selector */}
						{![
							"Dijkstra",
							"Breadth-First Search",
							"Depth-First Search",
							"Trace",
						].includes(algorithm) && (
							<div className="flex flex-col gap-2 pt-2">
								<span className="text-zinc-200 mb-1">Heuristic</span>
								<select
									value={config.heuristic}
									onChange={(e) =>
										setConfig({
											heuristic: e.target
												.value as AlgorithmConfig["heuristic"],
										})
									}
									className="bg-zinc-800 text-white p-2 rounded w-full"
								>
									{(
										[
											"manhattan",
											"euclidean",
											"octile",
											"chebyshev",
										] as const
									).map((h) => (
										<option key={h} value={h}>
											{h.charAt(0).toUpperCase() + h.slice(1)}
										</option>
									))}
								</select>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
