// esbuild.js — builds extension host, webview bundle, and static web simulator for Vercel
const esbuild = require("esbuild");
const fs = require("fs");
const isWatch = process.argv.includes("--watch");

const baseConfig = {
  bundle: true,
  minify: false,
  sourcemap: true,
};

function generateWebArtifacts() {
  const sampleSessions = fs.existsSync("demo/sample-sessions.json")
    ? fs.readFileSync("demo/sample-sessions.json", "utf8")
    : "[]";

  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ContextSwitch AI — Live Web Simulator</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="webview.css">
  <style>
    .web-banner {
      background: #0d0f17;
      border-bottom: 1px solid #232738;
      padding: 10px 24px;
      font-size: 13px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .web-banner strong { color: #f8fafc; }
    .web-banner-links { display: flex; gap: 16px; align-items: center; }
    .web-banner-links a {
      color: #f97316;
      text-decoration: none;
      font-weight: 600;
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    .web-banner-links a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="web-banner">
    <div>
      ⚡ <strong>ContextSwitch AI Live Web Simulator</strong> — Interactive preview of our VS Code Extension.
    </div>
    <div class="web-banner-links">
      <a href="pitch-deck.pdf" target="_blank">📄 View Pitch Deck (PDF)</a>
      <a href="https://github.com/twi-ni/contextswitch" target="_blank">🐙 GitHub Repo</a>
    </div>
  </div>
  <div id="root"></div>
  <script>
    window.__SESSIONS__ = ${sampleSessions};

    // Browser mock for acquireVsCodeApi when running standalone on web / Vercel
    if (!window.acquireVsCodeApi) {
      window.acquireVsCodeApi = function() {
        return {
          postMessage: function(msg) {
            if (msg.command === "resumeSession") {
              const session = (window.__SESSIONS__ || []).find(function(s) { return s.id === msg.sessionId; });
              const title = session ? session.title : "Selected session";
              const files = session && session.modifiedFiles ? session.modifiedFiles.join(", ") : "modified files";
              alert("▶ [Web Simulator] Resumed: " + title + "\\n\\nIn VS Code, this automatically reopens your files in editor tabs: " + files + "\\n\\nNext step: " + (session ? session.nextStep : "Continue coding"));
            }
            if (msg.command === "saveNew") {
              const task = prompt("What were you working on?");
              if (!task) return;
              const problem = prompt("What was the blocker/problem?");
              const next = prompt("What is the next action?");
              const newSession = {
                id: "session_" + Date.now(),
                title: task.slice(0, 50),
                projectName: "web-simulator",
                branch: "feat/interactive-demo",
                taskDescription: task,
                workCompleted: "Progress recorded in Web Simulator",
                lastKnownProblem: problem || "None",
                nextStep: next || "Proceed with implementation",
                validationStatus: "Passing",
                modifiedFiles: ["src/app.ts", "src/auth.ts"],
                untrackedFiles: [],
                recentCommits: ["a1b2c3d feat: live demo commit"],
                diffSummary: "2 files changed",
                activeFile: "src/app.ts",
                aiSummary: "Session captured in web simulator: " + task + ". Next action: " + (next || "Continue"),
                readinessScore: { total: 90, items: [] },
                timeline: [{ timestamp: new Date().toISOString(), event: "Checkpoint saved in Web Simulator", type: "save" }],
                createdAt: new Date().toISOString(),
                status: "active"
              };
              window.__SESSIONS__.unshift(newSession);
              window.dispatchEvent(new Event("sessions-updated"));
            }
          }
        };
      };
    }
  </script>
  <script src="webview.js"></script>
</body>
</html>`;

  fs.writeFileSync("dist/index.html", indexHtml, "utf8");

  if (fs.existsSync("presentation/ContextSwitch_AI_PitchDeck.pdf")) {
    fs.copyFileSync("presentation/ContextSwitch_AI_PitchDeck.pdf", "dist/pitch-deck.pdf");
  }
}

async function build() {
  // 1. Build the VS Code extension (runs in Node)
  const extCtx = await esbuild.context({
    ...baseConfig,
    entryPoints: ["src/extension.ts"],
    outfile: "dist/extension.js",
    platform: "node",
    format: "cjs",
    external: ["vscode"],
  });

  // 2. Build the React webview (runs in browser)
  const webCtx = await esbuild.context({
    ...baseConfig,
    entryPoints: ["src/webview/main.tsx"],
    outfile: "dist/webview.js",
    platform: "browser",
    format: "iife",
  });

  if (isWatch) {
    await extCtx.watch();
    await webCtx.watch();
    generateWebArtifacts();
    console.log("Watching for changes...");
  } else {
    await extCtx.rebuild();
    await webCtx.rebuild();
    await extCtx.dispose();
    await webCtx.dispose();
    generateWebArtifacts();
    console.log("Build complete: VS Code extension + Web Simulator ready in dist/");
  }
}

build().catch(() => process.exit(1));
