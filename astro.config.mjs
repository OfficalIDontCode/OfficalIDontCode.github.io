// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// User site (repo named <username>.github.io) — base is root.
export default defineConfig({
	site: "https://lynxcc121-cmyk.github.io",
	vite: {
		plugins: [tailwindcss()],
	},
});
