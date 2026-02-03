/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { Grid } from "lucide-react";

import { PopupContainer } from "@/components/ui/PopupContainer";
import { Selector } from "@/components/ui/Selector";
import { useModeStore } from "@/stores";
import { ApplicationMode } from "@/types";

export function ModeSelector() {
	const { mode, setMode } = useModeStore();

	const modes = Object.values(ApplicationMode);
	const items = modes.map((m) => ({
		id: m,
		label: m,
		selected: m === mode,
		onClick: () => setMode(m),
	}));

	return (
		<PopupContainer
			buttonProps={{ icon: <Grid />, shortcut: "G", label: mode, callback: () => {} }}
		>
			<Selector
				title="Mode"
				description="Choose single or double grid mode."
				items={items}
			/>
		</PopupContainer>
	);
}
