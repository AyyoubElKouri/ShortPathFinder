/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

export function Instructions({
	setShowInstructions,
}: {
	setShowInstructions: (show: boolean) => void;
}) {
	return (
		<div
			className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900
                    border border-zinc-400 flex flex-col justify-center items-center gap-4 p-4
                    rounded-md text-zinc-200"
		>
			<h2 className="text-2xl font-bold">Instructions</h2>
			<ul className="list-disc list-inside text-left">
				<li>First click to set the start point (blue cell)</li>
				<li>Second click to set the end point (red cell)</li>
				<li>Click and drag to draw walls (black cells)</li>
				<li>
					<code className="bg-zinc-950 rounded-sm text-zinc-100 p-0.5">
						ctrl + z
					</code>{" "}
					to Undo
				</li>

				<li>
					<code className="bg-zinc-950 rounded-sm text-zinc-100 p-0.5">
						ctrl + y
					</code>{" "}
					to Redo
				</li>
			</ul>
			<p className="italic">Chose algorithm and click Run Algorithm</p>

			<button
				type="button"
				className="w-20 px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white rounded
                       active:scale-95 transition-all"
				onClick={() => setShowInstructions(false)}
			>
				OK!
			</button>
		</div>
	);
}
