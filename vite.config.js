import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Detect repo name when building on GitHub Actions (for Pages base path)
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isCI = !!process.env.GITHUB_ACTIONS;

// If building on Actions, set base to /<repo>/, otherwise use root when developing locally.
const base = isCI ? `/${repo}/` : "/";

export default defineConfig({
  plugins: [react()],
  base,
});
