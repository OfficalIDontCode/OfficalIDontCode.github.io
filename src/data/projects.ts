export interface Project {
	slug: string;
	title: string;
	tag: string;
	year: string;
	role: string;
	blurb: string;
	stack: string[];
	link?: { label: string; href: string };
	accent?: "amber" | "blood" | "moss" | "cyan";
	hero?: string;
	gallery?: string[];
	video?: string;
}

export const projects: Project[] = [
	{
		slug: "primal-islands",
		title: "Primal Islands",
		tag: "Roblox · Survival Sandbox",
		year: "2026",
		role: "Solo developer & systems lead",
		blurb:
			"A primitive-survival sandbox where players gather, craft, and outlast on procedural islands. Built on a custom-engineered TypeScript stack with session-locked saves, a React-driven HUD, and a fully custom inventory and gathering system.",
		stack: ["roblox-ts", "Flamework", "@rbxts/react", "ProfileService", "Rojo"],
		link: { label: "Play (beta)", href: "https://www.roblox.com/games/106754741049599" },
		accent: "amber",
		hero: "/images/primal-islands-hud.png",
		video: "/videos/preview-short.mp4",
		gallery: ["/images/primal-islands-stats.png", "/images/primal-islands-3.png"],
	},
	{
		slug: "grand-theft-city",
		title: "Grand Theft City",
		tag: "Roblox · Open-world city RP",
		year: "2026",
		role: "Solo developer",
		blurb:
			"An open-world Roblox game with full inventory and hotbar persistence (items survive death and rejoin), the RothBank banking system with deposits/withdrawals, a DataStore-backed economy, and custom UI &mdash; main menu, inventory grid, and ATM interface, all hand-built.",
		stack: ["Roblox", "Custom inventory framework", "RothBank ATM system", "DataStore economy", "Custom UI"],
		accent: "cyan",
		hero: "/images/gtc-city.png",
		gallery: ["/images/gtc-inventory.png", "/images/gtc-rothbank.png"],
	},
	{
		slug: "codedefender",
		title: "CodeDefender",
		tag: "Software protection platform",
		year: "Active",
		role: "Co-founder · Back Engineering Labs",
		blurb:
			"Next-generation software protection &mdash; binary rewriting, novel obfuscation, anti-tamper, and program hardening that actually supports modern Windows security features (CET, CFG, ACG). Built from the ground up with stability first; the only protector that can rewrite ntoskrnl and Chromium without breaking them.",
		stack: ["C++", "x64 binary rewriting", "PE tooling", "Anti-tamper", "LLVM / B.L.A.R.E."],
		link: { label: "codedefender.io", href: "https://codedefender.io" },
		accent: "cyan",
		hero: "/images/codedefender-card.webp",
		gallery: ["/images/codedefender-icon.png"],
	},
	{
		slug: "oink-industries",
		title: "oink.industries",
		tag: "GMod tooling platform",
		year: "Active",
		role: "Owner / engineer",
		blurb:
			"A Lua injector and cheat platform for Garry's Mod &mdash; auth, licensing, anti-tamper, and a custom HTTP API that's processed millions of sessions across live communities. Production GLua, MySQL, Redis, and Stripe powering the full stack.",
		stack: ["Garry's Mod (GLua)", "Lua injection", "MySQL", "Redis", "Stripe", "HTTP API"],
		link: { label: "oink.industries", href: "https://oink.industries" },
		accent: "blood",
		hero: "/images/oink-hero.png",
	},
	{
		slug: "ww2rp",
		title: "Paradox Networks · WW2RP",
		tag: "Garry's Mod · Political RP",
		year: "2025–2026",
		role: "Lead developer",
		blurb:
			"Berlin, 1940 &mdash; a structured political roleplay community with branched faction unlocks gated by in-character progression. Civilians-only on creation; Reich-aligned roles open through narrative milestones. Custom faction system, IC dossier tooling, and a heavily moderated economy.",
		stack: ["GLua", "Custom faction framework", "Discord-bridge admin tools"],
		accent: "blood",
		hero: "/images/ww2rp-1.png",
		gallery: ["/images/ww2rp-2.png", "/images/ww2rp-3.png", "/images/ww2rp-4.png", "/images/ww2rp-5.png"],
	},
	{
		slug: "security-research",
		title: "Security research & reverse engineering",
		tag: "Independent",
		year: "Ongoing",
		role: "Researcher",
		blurb:
			"Reverse engineering, low-level binary analysis, anti-cheat work, and applied offensive security on game-tooling targets. Most output stays private but informs everything I build &mdash; especially the anti-cheat and integrity layers across the live servers.",
		stack: ["C", "C++", "x64 ASM", "IDA / Ghidra", "x86-64 / ARM64", "API hooking", "Frida"],
		hero: "/images/re-1.png",
		gallery: ["/images/re-2.png", "/images/re-3.png", "/images/re-4.png"],
	},
];
