import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Router } from "./pages";
import "@/styles/globals.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Router />
	</StrictMode>,
);
