/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useGrid } from "@/hooks/useGrid";

export function Grid() {
	const {
		cellules,
		cellSize,
		handleMouseDown,
		handleMouseEnter,
		handleMouseUp,
		getCellColor,
	} = useGrid();

	return (
		<button
			type="button"
			className="relative"
			style={{ userSelect: "none", display: "inline-block" }}
			onMouseLeave={handleMouseUp}
		>
			{/* Grid Container */}
			<button
				type="button"
				style={{
					display: "grid",
					gridTemplateRows: `repeat(${cellules.length}, ${cellSize}px)`,
					gridTemplateColumns: `repeat(${cellules[0].length}, ${cellSize}px)`,
				}}
				onMouseUp={handleMouseUp}
			>
				{cellules.flat().map((cell) => {
					return (
						<button
							type="button"
							key={`${cell.x}-${cell.y}`}
							style={{
								width: cellSize,
								height: cellSize,
								backgroundColor: getCellColor(cell),
								border: `0.5px solid ${
									cell.type === "empty"
										? "#F2F2F2"
										: getCellColor(cell)
								}`,
								boxSizing: "border-box",
							}}
							onMouseDown={() => handleMouseDown(cell)}
							onMouseEnter={() => handleMouseEnter(cell)}
						/>
					);
				})}
			</button>
		</button>
	);
}
