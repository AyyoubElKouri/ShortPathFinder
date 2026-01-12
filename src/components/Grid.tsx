/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useGrid } from "@/hooks/useGrid";
import { getCellColor } from "@/lib/utils";

export function Grid() {
	const { cellules, cellSize, handlers } = useGrid();

	return (
		<button
			type="button"
			className="relative"
			style={{ userSelect: "none", display: "inline-block" }}
			onMouseLeave={handlers.mouseUp}
		>
			{/* Grid Container */}
			<button
				type="button"
				style={{
					display: "grid",
					gridTemplateRows: `repeat(${cellules.length}, ${cellSize}px)`,
					gridTemplateColumns: `repeat(${cellules[0].length}, ${cellSize}px)`,
				}}
				onMouseUp={handlers.mouseUp}
			>
				{cellules.flat().map((cell) => {
					const rows = cellules.length;
					const cols = cellules[0].length;

					const isLastRow = cell.y === rows - 1;
					const isLastCol = cell.x === cols - 1;

					const baseColor = ["empty", "visited", "path"].includes(
						cell.state,
					)
						? "#2C252C"
						: getCellColor(cell.state);

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
								backgroundColor: getCellColor(cell.state),
								boxSizing: "border-box",
								transition: "background-color 0.2s ease",
								...borderStyles,
							}}
							onMouseDown={() => handlers.mouseDown(cell)}
							onMouseEnter={() => handlers.mouseEnter(cell)}
						/>
					);
				})}
			</button>
		</button>
	);
}
