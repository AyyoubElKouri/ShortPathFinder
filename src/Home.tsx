/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useState } from "react";
import { Control } from "./components/Control";
import { Grid } from "./components/Grid";

export default function Home() {
	const [position, setPosition] = useState<boolean>(false);

	return (
		<div className="relative w-full h-svh flex justify-between bg-zinc-200">
			{position && <Control position={position} setPosition={setPosition} />}
			<Grid />
			{!position && (
				<Control position={position} setPosition={setPosition} />
			)}
		</div>
	);
}
