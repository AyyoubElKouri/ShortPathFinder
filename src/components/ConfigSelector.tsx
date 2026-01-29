/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { Settings2 } from "lucide-react";

import { Switcher } from "@/components/ui/Switcher";
import { PopupContainer } from "@/components/ui/PopupContainer";
import { useAlgorithmStore } from "@/stores";

export function ConfigSelector() {
	const { config, setConfig } = useAlgorithmStore();
	const configRows = [
		{
			label: "Don't Cross Corners",
			value: config.dontCrossCorners,
			onChange: (checked: boolean) => setConfig({ ...config, dontCrossCorners: checked }),
		},
		{
			label: "Allow Diagonal",
			value: config.allowDiagonal,
			onChange: (checked: boolean) => setConfig({ ...config, allowDiagonal: checked }),
		},
		{
			label: "Bidirectional",
			value: config.bidirectional,
			onChange: (checked: boolean) => setConfig({ ...config, bidirectional: checked }),
		},
	];

	return (
		<PopupContainer
			buttonProps={{ icon: <Settings2 />, shortcut: "C", label: "Config", callback: () => {} }}
		>
			<div className="flex h-full flex-col gap-4">
				<div className="flex flex-col gap-1">
					<p className="text-white text-lg font-medium">Configuration</p>
					<p className="text-white/60 text-sm">Tune how the algorithm navigates the grid.</p>
				</div>

				<div className="flex-1">
					<ul className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
						{configRows.map((row, index) => (
							<li key={row.label}>
								<div
									className={`flex items-center justify-between px-4 py-3 text-white
										${index === configRows.length - 1 ? "" : " border-b border-white/10"}`}
								>
									<span className="text-base font-medium">{row.label}</span>
									<Switcher initial={row.value} onChange={row.onChange} />
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</PopupContainer>
	);
}
