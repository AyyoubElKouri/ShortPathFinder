/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { ChevronsLeftRight } from "lucide-react";
import { useState } from "react";

import { ALGORITHMS, FULL_TO_SHORT } from "@/lib/constants";
import type { Algorithm } from "@/lib/types";

import { useAlgorithmStore } from "@/store/useAlgorithmStore";

export function AlgoSelector() {
	const [open, setOpen] = useState(false);
	const { algorithm, setAlgorithm } = useAlgorithmStore();

	function selectAlgo(a: string) {
		setAlgorithm(a as Algorithm);
		setOpen(false);
	}

	const shortName = FULL_TO_SHORT[algorithm] ?? algorithm;

	return (
		<div className="relative flex flex-col items-center">
			<div className="relative flex flex-col items-center">
				<button
					type="button"
					onClick={() => setOpen((v) => !v)}
					className="w-[100px] h-8.5 border border-white/10 flex justify-center items-center
                          rounded-[5px] bg-[#3E3524] text-white active:scale-95
                          hover:brightness-130 gap-1"
				>
					{shortName} <ChevronsLeftRight />
				</button>
			</div>

			{open && (
				<div className="absolute bottom-11 w-[200px] bg-[#383939] border border-white/10 rounded-md overflow-hidden z-20">
					{ALGORITHMS.map((algo) => (
						<button
							type="button"
							key={algo}
							onClick={() => selectAlgo(algo)}
							className="w-full px-2 py-1 text-white text-md hover:bg-white/10 cursor-pointer
                                whitespace-nowrap flex justify-start"
						>
							{algo}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
