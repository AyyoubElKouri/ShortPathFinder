/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Grid, DoubleGridConfigPanel, DoubleGridRunPanel } from "@/components";
import { RunStatsCard } from "@/components/ui/RunStatsCard";

import { useAlgorithmStore, useGridStore, useSecondAlgorithm } from "@/stores";

export function DoubleGrid() {
	const { isRunning } = useGridStore();
	const { lastResult, setLastResult } = useAlgorithmStore();
	const { lastResult: secondLastResult, setLastResult: setSecondLastResult } =
		useSecondAlgorithm();
	const stats =
		!isRunning && lastResult && secondLastResult
			? { first: lastResult, second: secondLastResult }
			: null;
	const [showStats, setShowStats] = useState(false);

	useEffect(() => {
		if (!isRunning && stats) {
			setShowStats(true);
		}
	}, [isRunning, stats]);

	const handleCloseStats = () => {
		setShowStats(false);
		setLastResult(null);
		setSecondLastResult(null);
	};

	return (
		<div className="relative w-full h-svh flex justify-center bg-[#141114]">
			<div className="flex justify-center items-start mt-6 gap-6">
				<Grid />
				<Grid useSecondState />
			</div>

			<motion.div
				className={isRunning ? "opacity-0 pointer-events-none" : ""}
				animate={{ opacity: isRunning ? 0 : 1 }}
				transition={{ duration: 0.3 }}
			>
				<DoubleGridConfigPanel />

				<DoubleGridRunPanel />
			</motion.div>

			{showStats && stats && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<button
						type="button"
						aria-label="Close results"
						className="absolute inset-0 bg-black/40 backdrop-blur-sm"
						onClick={handleCloseStats}
					/>
					<div
						className="relative z-10 flex flex-col items-center gap-4 rounded-xl border border-[#404141]
							bg-[#2C2D2D] p-6 shadow-[0_10px_32px_rgba(0,0,0,0.4)]"
					>
						<p className="text-white text-lg font-medium">Run results</p>
						<div className="flex flex-wrap items-center justify-center gap-4">
							<RunStatsCard title="First grid" result={stats.first} />
							<RunStatsCard title="Second grid" result={stats.second} />
						</div>
						<button
							type="button"
							onClick={handleCloseStats}
							className="mt-2 inline-flex items-center justify-center rounded-md border border-white/20
								bg-white/10 px-6 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
						>
							OK
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
