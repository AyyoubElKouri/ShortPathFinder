/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { Sigma } from "lucide-react";

import { PopupContainer } from "@/components/ui/PopupContainer";
import { Selector } from "@/components/ui/Selector";
import { useAlgorithmStore, useSecondAlgorithm } from "@/stores";
import { Heuristic } from "@/types";

interface HeuristicSelectorProps {
	useSecondState?: boolean;
}

export function HeuristicSelector({ useSecondState = false }: HeuristicSelectorProps) {
	const store = useSecondState ? useSecondAlgorithm : useAlgorithmStore;
	const { config, setConfig } = store();

	const selectedHeuristic = config.heuristic ?? Heuristic.EUCLIDEAN;
  
	const heuristics = Object.values(Heuristic);
	const items = heuristics.map((heuristic) => ({
		id: heuristic,
		label: heuristic,
		selected: heuristic === selectedHeuristic,
		onClick: () => setConfig({ heuristic }),
	}));

	return (
		<PopupContainer
			buttonProps={{ icon: <Sigma />, shortcut: "H", label: "Heuristic", callback: () => {} }}
		>
			<Selector
				title="Choose Heuristic"
				description="Select how distances are estimated."
				items={items}
			/>
		</PopupContainer>
	);
}
