/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import type { ReactNode } from "react";

export type SelectorItem = {
	id: string | number;
	label: ReactNode;
	onClick?: () => void;
	selected?: boolean;
	right?: ReactNode;
};

interface SelectorProps {
	title: string;
	description?: string;
	items: SelectorItem[];
}

const selectedBadge = (
	<span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-xs font-semibold text-emerald-200">
		Selected
	</span>
);

export function Selector({ title, description, items }: SelectorProps) {
	return (
		<div className="flex h-full flex-col gap-4">
			<div className="flex flex-col gap-1">
				<p className="text-white text-lg font-medium">{title}</p>
				{description && <p className="text-white/60 text-sm">{description}</p>}
			</div>

			<div className="flex-1">
				<ul className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
					{items.map((item, index) => {
						const isLast = index === items.length - 1;
						const rowClasses = [
							"flex w-full items-center justify-between px-4 py-3 text-left text-white",
							item.onClick ? "transition" : "",
							item.selected ? "bg-white/15" : item.onClick ? "hover:bg-white/10" : "",
							isLast ? "" : " border-b border-white/10",
						]
							.filter(Boolean)
							.join(" ");
						const right = item.right ?? (item.selected ? selectedBadge : null);

						return (
							<li key={item.id}>
								{item.onClick ? (
									<button type="button" onClick={item.onClick} className={rowClasses}>
										<span className="text-base font-medium">{item.label}</span>
										{right}
									</button>
								) : (
									<div className={rowClasses}>
										<span className="text-base font-medium">{item.label}</span>
										{right}
									</div>
								)}
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
