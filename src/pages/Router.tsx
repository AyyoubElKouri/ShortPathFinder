/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useModeStore } from "@/stores";
import { ApplicationMode } from "@/types";

import { DoubleGrid } from "./DoubleGrid";
import { SingleGrid } from "./SingleGrid";
import { SplashScreen } from "@/components";

const modeComponents = {
	[ApplicationMode.SingleGrid]: () => <SingleGrid />,
	[ApplicationMode.DoubleGrid]: () => <DoubleGrid />,
} as const;

export function Router() {
	const { mode } = useModeStore();
	const ModeComponent = modeComponents[mode];

	return (
		<>
			<SplashScreen />
      <ModeComponent />
		</>
	);
}
