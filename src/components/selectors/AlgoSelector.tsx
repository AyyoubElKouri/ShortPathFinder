/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { Cpu } from "lucide-react";

import { PopupContainer } from "@/components/ui/PopupContainer";
import { Selector } from "@/components/ui/Selector";
import { useAlgorithmStore, useSecondAlgorithm } from "@/stores";

import { Algorithm } from "@/types";

interface AlgoSelectorProps {
	useSecondState?: boolean;
}

export function AlgoSelector({ useSecondState = false }: AlgoSelectorProps) {
	const store = useSecondState ? useSecondAlgorithm : useAlgorithmStore;
	const { algorithm, setAlgorithm } = store();

	const algorithms = Object.values(Algorithm);
	const items = algorithms.map((algo) => ({
		id: algo,
		label: algo,
		selected: algo === algorithm,
		onClick: () => setAlgorithm(algo),
	}));

	return (
		<PopupContainer
			buttonProps={{ icon: <Cpu />, shortcut: "A", label: algorithm, callback: () => {} }}
		>
			<Selector
				title="Choose Algorithm"
				description="Pick the pathfinding strategy you want to visualize."
				items={items}
			/>
		</PopupContainer>
	);
}
