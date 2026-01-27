#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Source and destination directories
const srcDir = path.join(__dirname, "src", "wasm");
const destDir = path.join(__dirname, "public", "wasm");

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
	fs.mkdirSync(destDir, { recursive: true });
}

// Copy files
const filesToCopy = ["pathfinding.js", "pathfinding.wasm", "pathfinding.d.ts"];

filesToCopy.forEach((file) => {
	const srcPath = path.join(srcDir, file);
	const destPath = path.join(destDir, file);

	if (fs.existsSync(srcPath)) {
		fs.copyFileSync(srcPath, destPath);
		console.log(`✓ Copied ${file}`);
	} else {
		console.warn(`✗ File not found: ${file}`);
	}
});

console.log("WASM files copied to public/wasm/");
