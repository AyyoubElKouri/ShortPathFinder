/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useGrid } from "@/hooks/useGrid";
import { LINK } from "@/lib/constants";

export function ActionButtons() {
	const { clearWalls, clearPath, resetGrid } = useGrid();

	return (
		<div
			className="w-full absolute bottom-0 left-1/2 flex flex-wrap justify-between items-center
						  gap-2 p-3 bg-zinc-800 text-zinc-200 shadow-inner"
			style={{ transform: "translateX(-50%)" }}
		>
			<div className="flex gap-2">
				<Button onClick={() => {}}>Run Algorithm</Button>
				<Button onClick={clearWalls}>Clear Walls</Button>
				<Button onClick={clearPath}>Clear Path</Button>
				<Button onClick={resetGrid}>Reset Grid</Button>
			</div>

			<div className="text-zinc-400">
				Made By{" "}
				<a
					href={LINK}
					target="_blank"
					className="underline hover:text-indigo-500"
				>
					Ayyoub EL KOURI
				</a>
			</div>
		</div>
	);
}

function Button({
	onClick,
	children,
}: {
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white rounded active:scale-95
						  transition-all"
			onClick={onClick}
		>
			{children}
		</button>
	);
}
