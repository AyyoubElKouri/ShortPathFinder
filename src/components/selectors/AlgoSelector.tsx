/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { Cpu } from "lucide-react";
import { useState } from "react";

import { ALGORITHMS } from "@/lib/constants";
import type { Algorithm } from "@/lib/types";

import { useAlgorithmStore } from "@/store/useAlgorithmStore";
import { Button } from "../ui/Button";

export function AlgoSelector() {
	const [open, setOpen] = useState(false);
	const { algorithm, setAlgorithm } = useAlgorithmStore();

	function selectAlgo(a: string) {
		setAlgorithm(a as Algorithm);
		setOpen(false);
	}

	return (
		<div className="relative flex flex-col items-center">
			<div className="relative flex flex-col items-center">
				<Button
					icon={<Cpu />}
					shortcut="A"
					label={algorithm}
					callback={() => setOpen((v) => !v)}
				/>
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
