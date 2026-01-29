/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { Sigma } from "lucide-react";

import { PopupContainer } from "@/components/ui/PopupContainer";
import { useAlgorithmStore } from "@/stores";
import { Heuristic } from "@/types";

export function HeuristicSelector() {
	const { config, setConfig } = useAlgorithmStore();
	const heuristics = Object.values(Heuristic);
	const selectedHeuristic = config.heuristic ?? Heuristic.EUCLIDEAN;

	return (
		<PopupContainer
			buttonProps={{ icon: <Sigma />, shortcut: "H", label: "Heuristic", callback: () => {} }}
		>
			<div className="flex h-full flex-col gap-4">
				<div className="flex flex-col gap-1">
					<p className="text-white text-lg font-medium">Choose Heuristic</p>
					<p className="text-white/60 text-sm">Select how distances are estimated.</p>
				</div>

				<div className="flex-1">
					<ul className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
						{heuristics.map((heuristic, index) => {
							const isSelected = heuristic === selectedHeuristic;

							return (
								<li key={heuristic}>
									<button
										type="button"
										onClick={() => setConfig({ heuristic })}
										className={`w-full px-4 py-3 text-left transition
											${isSelected ? "bg-white/15" : "hover:bg-white/10"}
											${index === heuristics.length - 1 ? "" : " border-b border-white/10"}`}
									>
										<div className="flex items-center justify-between">
											<span className="text-white text-base font-medium">{heuristic}</span>
											{isSelected && (
												<span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-xs font-semibold text-emerald-200">
													Selected
												</span>
											)}
										</div>
									</button>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</PopupContainer>
	);
}
