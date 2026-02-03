/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import type { PathfindingResponse } from "@/types";
import { Seperator } from "@/components/ui/Seperator";

type RunStats = Pick<PathfindingResponse, "cost" | "visited">;

interface RunStatsCardProps {
	title: string;
	result: RunStats;
}

export function RunStatsCard({ title, result }: RunStatsCardProps) {
	return (
		<div
			className="flex min-w-[220px] flex-col gap-2 rounded-lg border border-[#404141] bg-[#2C2D2D]
				px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.6),0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.3)]"
		>
			<p className="text-white/70 text-sm font-medium">{title}</p>
			<div className="flex items-center gap-4">
				<div className="flex flex-col">
					<span className="text-white/50 text-xs uppercase tracking-wide">Cost</span>
					<span className="text-white text-lg font-semibold">{result.cost}</span>
				</div>
				<Seperator />
				<div className="flex flex-col">
					<span className="text-white/50 text-xs uppercase tracking-wide">Cells visited</span>
					<span className="text-white text-lg font-semibold">
						{result.visited.length}
					</span>
				</div>
			</div>
		</div>
	);
}
