/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { CELL_SIZE } from "@/constants";
import { useGrid } from "@/hooks/useGrid";
import { getCellColor } from "@/utils";

export function Grid() {
	const { cellules, handlers } = useGrid();

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
					gridTemplateRows: `repeat(${cellules.length}, ${CELL_SIZE}px)`,
					gridTemplateColumns: `repeat(${cellules[0].length}, ${CELL_SIZE}px)`,
				}}
				onMouseUp={handlers.mouseUp}
			>
				{cellules.flat().map((cell) => {
					const rows = cellules.length;
					const cols = cellules[0].length;

					const isLastRow = cell.y === rows - 1;
					const isLastCol = cell.x === cols - 1;

					const baseColor = ["empty", "visited", "path"].includes(cell.state)
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
								width: CELL_SIZE,
								height: CELL_SIZE,
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
