// esbuild.js — builds BOTH the extension host code AND the webview React code
const esbuild = require("esbuild");
const isWatch = process.argv.includes("--watch");

const baseConfig = {
  bundle: true,
  minify: false,
  sourcemap: true,
};

async function build() {
  // 1. Build the VS Code extension (runs in Node, must mark vscode as external)
  const extCtx = await esbuild.context({
    ...baseConfig,
    entryPoints: ["src/extension.ts"],
    outfile: "dist/extension.js",
    platform: "node",
    format: "cjs",
    external: ["vscode"], // vscode is provided by the host, not bundled
  });

  // 2. Build the React webview (runs in browser inside VS Code panel)
  const webCtx = await esbuild.context({
    ...baseConfig,
    entryPoints: ["src/webview/main.tsx"],
    outfile: "dist/webview.js",
    platform: "browser",
    format: "iife", // browser-compatible, no require()
  });

  if (isWatch) {
    // Watch mode: rebuild on file changes
    await extCtx.watch();
    await webCtx.watch();
    console.log("Watching for changes...");
  } else {
    // Single build then exit
    await extCtx.rebuild();
    await webCtx.rebuild();
    await extCtx.dispose();
    await webCtx.dispose();
    console.log("Build complete.");
  }
}

build().catch(() => process.exit(1));
