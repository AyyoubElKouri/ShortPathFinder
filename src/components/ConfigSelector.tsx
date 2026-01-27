/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { Settings2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Seperator } from "@/components/ui/Seperator";
import { Switcher } from "@/components/ui/Switcher";
import { useAlgorithmStore } from "@/stores";

export function ConfigSelector() {
	const [open, setOpen] = useState(false);

	const { config, setConfig } = useAlgorithmStore();

	return (
		<div className="relative flex flex-col items-center">
			<div className="relative flex flex-col items-center">
				<Button
					icon={<Settings2 />}
					shortcut="C"
					label="Config"
					callback={() => setOpen((v) => !v)}
				/>
			</div>

			{open && (
				<div
					className="absolute bottom-11 w-60 px-2 bg-[#383939] border border-white/10
								  rounded-md overflow-hidden z-20"
				>
					<div className="w-full h-8 flex justify-between items-center text-white">
						Don't Cross Corners
						<Switcher
							initial={config.dontCrossCorners}
							onChange={(checked) => setConfig({ ...config, dontCrossCorners: checked })}
						/>
					</div>

					<Seperator orientation="horizontal" />

					<div className="w-full h-8 flex justify-between items-center text-white">
						Allow Diagonal
						<Switcher
							initial={config.allowDiagonal}
							onChange={(checked) => setConfig({ ...config, allowDiagonal: checked })}
						/>
					</div>

					<Seperator orientation="horizontal" />

					<div className="w-full h-8 flex justify-between items-center text-white">
						Bidirectional
						<Switcher
							initial={config.bidirectional}
							onChange={(checked) => setConfig({ ...config, bidirectional: checked })}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
