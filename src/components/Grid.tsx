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
					const rows = cellules.length;
					const cols = cellules[0].length;

					const isLastRow = cell.y === rows - 1;
					const isLastCol = cell.x === cols - 1;

					const baseColor = ["empty", "visited", "path"].includes(
						cell.type,
					)
						? "#2C252C"
						: getCellColor(cell);

					const borderStyles: React.CSSProperties = {
						borderTop: `0.5px solid ${baseColor}`,
						borderLeft: `0.5px solid ${baseColor}`,
					};

					if (isLastCol) {
						borderStyles.borderRight = `0.5px solid ${baseColor}`;
					}
					if (isLastRow) {
						borderStyles.borderBottom = `0.5px solid ${baseColor}`;
					}

					return (
						<button
							type="button"
							key={`${cell.x}-${cell.y}`}
							style={{
								width: cellSize,
								height: cellSize,
								backgroundColor: getCellColor(cell),
								boxSizing: "border-box",
								transition: "background-color 0.2s ease",
								...borderStyles,
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
