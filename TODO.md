# TODO — ContextSwitch AI

> Last updated: 31 Oct 2026 | CODE FREEZE: 10:00 AM

## ✅ Done
- [x] Repo scaffold (LICENSE, README, .gitignore, package.json, tsconfig, esbuild)
- [x] First commit

## 🔴 MVP (must ship)
- [ ] `gitService.ts` — branch, modified files, diff, recent commits
- [ ] `workspaceService.ts` — active file, project name, TODO/FIXME scan
- [ ] `sessionStore.ts` — save/load JSON checkpoints
- [ ] `readinessScore.ts` — rule-based 0–100 score
- [ ] `saveSession.ts` command — input box + capture + store
- [ ] Webview panel scaffold (React + dark CSS)
- [ ] Dashboard: session list + SessionCard
- [ ] ReadinessScore component
- [ ] Timeline component
- [ ] `resumeSession.ts` — reopen files + show resume panel
- [ ] demo/ folder with sample data

## 🟡 Should have
- [ ] `aiService.ts` — Gemini summary (graceful fallback)
- [ ] Status bar item showing active session

## 🟢 Nice to have (only if ahead)
- [ ] Export session as Markdown
- [ ] Multi-root workspace support

## 🐛 Known bugs
- (none yet)
