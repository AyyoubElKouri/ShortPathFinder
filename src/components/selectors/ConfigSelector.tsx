/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { Settings2 } from "lucide-react";

import { PopupContainer } from "@/components/ui/PopupContainer";
import { Selector } from "@/components/ui/Selector";
import { Switcher } from "@/components/ui/Switcher";
import { useAlgorithmStore, useSecondAlgorithm } from "@/stores";

interface ConfigSelectorProps {
	useSecondState?: boolean;
}

export function ConfigSelector({ useSecondState = false }: ConfigSelectorProps) {
	const store = useSecondState ? useSecondAlgorithm : useAlgorithmStore;
	const { config, setConfig } = store();
  
	const configRows = [
		{
			id: "dontCrossCorners",
			label: "Don't Cross Corners",
			right: (
				<Switcher
					initial={config.dontCrossCorners}
					onChange={(checked: boolean) => setConfig({ dontCrossCorners: checked })}
				/>
			),
		},
		{
			id: "allowDiagonal",
			label: "Allow Diagonal",
			right: (
				<Switcher
					initial={config.allowDiagonal}
					onChange={(checked: boolean) => setConfig({ allowDiagonal: checked })}
				/>
			),
		},
		{
			id: "bidirectional",
			label: "Bidirectional",
			right: (
				<Switcher
					initial={config.bidirectional}
					onChange={(checked: boolean) => setConfig({ bidirectional: checked })}
				/>
			),
		},
	];

	return (
		<PopupContainer
			buttonProps={{ icon: <Settings2 />, shortcut: "C", label: "Config", callback: () => {} }}
		>
			<Selector
				title="Configuration"
				description="Tune how the algorithm navigates the grid."
				items={configRows}
			/>
		</PopupContainer>
	);
}
