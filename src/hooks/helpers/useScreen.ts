/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useEffect, useState } from "react";

interface ScreenReturns {
	/**
	 * The width of the screen
	 */
	width: number;

	/**
	 * The height of the screen
	 */
	height: number;
}

/**
 * @hook useScreen
 * A custom hook to get the current screen dimensions and update them on window resize
 */
export function useScreen(): ScreenReturns {
	const [dimensions, setDimensions] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		const handleResize = () => {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return dimensions;
}
