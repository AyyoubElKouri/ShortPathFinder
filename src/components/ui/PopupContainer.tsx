/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useState } from "react";
import { createPortal } from "react-dom";
import type { ComponentProps, ReactNode } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

type PopupButtonProps = {
	buttonProps: ComponentProps<typeof Button>;
	children: ReactNode;
};

export function PopupContainer({ buttonProps, children }: PopupButtonProps) {
	const [open, setOpen] = useState(false);
	const isBrowser = typeof document !== "undefined";

	const handleOpen = () => {
		if (buttonProps?.callback) {
			buttonProps.callback();
		}
		setOpen(true);
	};

	const handleClose = () => setOpen(false);

	const overlay =
		open &&
		isBrowser &&
		createPortal(
			<motion.div
				className="fixed inset-0 z-9999 flex items-center justify-center"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.2, ease: "easeOut" }}
			>
				<motion.button
					type="button"
					aria-label="Close popup"
					className="absolute inset-0 bg-black/20 backdrop-blur-lg"
					onClick={handleClose}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.25, ease: "easeOut" }}
				/>

				<motion.div
					className="relative flex w-[700px] max-w-[92vw] flex-col
						bg-[#2C2D2D] border border-[#404141] rounded-xl
						shadow-[0_10px_32px_rgba(0,0,0,0.4)]"
					initial={{ opacity: 0, scale: 0.98, y: 8 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					transition={{ duration: 0.25, ease: "easeOut" }}
				>
					<button
						type="button"
						aria-label="Close popup"
						onClick={handleClose}
						className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center
							rounded-full border border-white/20 bg-white/10 text-white/70 transition
							hover:bg-white/20 hover:text-white focus-visible:outline-none"
					>
						<X size={16} />
					</button>

					<div className="flex-1 w-full overflow-auto p-10">{children}</div>
				</motion.div>
			</motion.div>,
			document.body,
		);

	return (
		<div className="relative flex flex-col items-center">
			<div className="relative flex flex-col items-center">
				<Button {...buttonProps} callback={handleOpen} />
			</div>

			{overlay}
		</div>
	);
}
