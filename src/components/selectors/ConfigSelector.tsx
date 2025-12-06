/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { ChevronsLeftRight } from "lucide-react";
import { useState } from "react";

import { useAlgorithmStore } from "@/store/useAlgorithmStore";
import { Switcher } from "../Switcher";
import { Seperator } from "../Seperator";

export function ConfigSelector() {
	const [open, setOpen] = useState(false);
	const { config, setConfig } = useAlgorithmStore();

	return (
		<div className="relative flex flex-col items-center">
			<div className="relative flex flex-col items-center">
				<button
					type="button"
					onClick={() => setOpen((v) => !v)}
					className="w-[100px] h-8.5 border border-white/10 flex justify-center items-center
                          rounded-[5px] bg-[#383939] text-white active:scale-95
                          hover:brightness-130 gap-1"
				>
					Config <ChevronsLeftRight />
				</button>
			</div>

			{open && (
				<div className="absolute bottom-11 w-60 px-2 bg-[#383939] border border-white/10 rounded-md overflow-hidden z-20">
					<div className="w-full h-8 flex justify-between items-center text-white">
						Don't Cross Corners
						<Switcher
							initial={config.dontCrossCorners}
							onChange={(checked) =>
								setConfig({ ...config, dontCrossCorners: checked })
							}
						/>
					</div>

					<Seperator orientation="horizontal" />

					<div className="w-full h-8 flex justify-between items-center text-white">
						Allow Diagonal
						<Switcher
							initial={config.allowDiagonal}
							onChange={(checked) =>
								setConfig({ ...config, allowDiagonal: checked })
							}
						/>
					</div>

					<Seperator orientation="horizontal" />

					<div className="w-full h-8 flex justify-between items-center text-white">
						Bidirectional
						<Switcher
							initial={config.bidirectional}
							onChange={(checked) =>
								setConfig({ ...config, bidirectional: checked })
							}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
