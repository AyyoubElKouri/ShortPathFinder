import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "./Home";
import "./globals.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Home />
	</StrictMode>,
);

// SmartLib – Intelligent library system for book tracking, user management, and borrowing
