/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { Cpu } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { useAlgorithm } from "@/hooks/useAlgorithm";
import {
	getAlgorithmDisplayName,
	getAlgorithmDisplayNames,
	getAlgorithmFromDisplayName,
} from "@/lib/utils";

export function AlgoSelector() {
	const [open, setOpen] = useState(false);
	const { algorithm, setAlgorithm } = useAlgorithm();

	const algorithms = getAlgorithmDisplayNames();

	return (
		<div className="relative flex flex-col items-center">
			<div className="relative flex flex-col items-center">
				<Button
					icon={<Cpu />}
					shortcut="A"
					label={getAlgorithmDisplayName(algorithm)}
					callback={() => setOpen((v) => !v)}
				/>
			</div>

			{open && (
				<div
					className="absolute bottom-11 w-[200px] bg-[#383939] border border-white/10
								  rounded-md overflow-hidden z-20"
				>
					{algorithms.map((algo) => (
						<button
							type="button"
							key={algo}
							onClick={() => {
								setAlgorithm(getAlgorithmFromDisplayName(algo));
								setOpen(false);
							}}
							className="w-full px-2 py-1 text-white text-md hover:bg-white/10
										  cursor-pointer whitespace-nowrap flex justify-start"
						>
							{algo}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
