# TODO — ContextSwitch AI

> Last updated: 31 Oct 2026 | CODE FREEZE: 10:00 AM

## ✅ Done
- [x] Repo scaffold (LICENSE, README, .gitignore, package.json, tsconfig, esbuild)
- [x] Initial commits & push to public repo
- [x] `gitService.ts` — branch, modified files, diff stat, recent commits
- [x] `workspaceService.ts` — active file, project name, TODO/FIXME scanner
- [x] `sessionStore.ts` — JSON checkpoint persistence in VS Code globalStorage
- [x] `readinessScore.ts` — Rule-based transparent 0–100 score with explanations
- [x] `aiService.ts` — Gemini 1.5 Flash natural language session summarizer (with graceful offline fallback)
- [x] `saveSession.ts` command (`Cmd+Shift+S`) — multi-step capture workflow
- [x] Dashboard Webview panel in React + custom dark theme CSS
- [x] Interactive components: `SessionCard`, `ReadinessRing`, `ScoreBreakdown`, `Timeline`
- [x] Search, filter by status, and stats metrics bar
- [x] One-click resume action (reopens modified files & restores context)
- [x] `demo/` folder with realistic sample data & `run-demo.sh` one-command launcher
- [x] VS Code `.vscode/launch.json` for one-touch `F5` testing

## 🟡 Up Next (Polish & Testing)
- [ ] Status bar indicator showing current active session status
- [ ] Packaging into a local `.vsix` file so judges can install directly
- [ ] Update README with final architecture diagram and demo guide

## 🟢 Nice to have (only if ahead)
- [ ] Export session as Markdown file (`session.md`)

## 🐛 Known bugs
- None! All TypeScript compilation passes clean.
