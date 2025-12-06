/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

export const ALGORITHMS = [
	"A*",
	"IDA*",
	"Dijkstra",
	"Breadth-First Search",
	"Depth-First Search",
	"Jump Point",
	"Orthogonal Jump Point",
	"Trace",
] as const;

export const FULL_TO_SHORT: Record<string, string> = {
	"A*": "A*",
	"Breadth-First Search": "BFS",
	"Depth-First Search": "DFS",
	Dijkstra: "Dijkstra",
	"IDA*": "IDA*",
	"Jump Point": "Jump Point",
	"Orthogonal Jump Point": "OJP",
	Trace: "Trace",
};

export const LINK = "https://ayyoubelkouri.vercel.app";

export const GRID_COLS = 50;
export const GRID_ROWS = 30;

export const CELL_SIZE = 25;

export const BATCH_SIZE = 5;
