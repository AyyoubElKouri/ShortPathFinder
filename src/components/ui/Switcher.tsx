/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useState } from "react";

interface SwitcherProps {
	initial?: boolean;
	onChange: (checked: boolean) => void;
}

export function Switcher({ initial = false, onChange }: SwitcherProps) {
	const [isChecked, setIsChecked] = useState(initial);

	return (
		<label className="flex items-center cursor-pointer">
			<input
				type="checkbox"
				checked={isChecked}
				onChange={() => {
					setIsChecked(!isChecked);
					onChange(!isChecked);
				}}
				className="sr-only"
			/>
			<div
				className={`w-12 h-6 rounded-sm ${
					isChecked ? "bg-gray-800" : "bg-gray-400"
				} transition-colors duration-200`}
			>
				<div
					className={`h-6 w-6 bg-gray-100 rounded-sm transform transition-transform duration-200 ${
						isChecked ? "translate-x-6" : "translate-x-0"
					}`}
				></div>
			</div>
		</label>
	);
}
