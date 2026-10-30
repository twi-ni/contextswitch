# ContextSwitch AI

> **Your coding session, remembered. Your momentum, restored.**

Built at **DevF8rge — Hacktoberfest 2026 Hack Day**, Bengaluru (MLH + Newton School of Technology).

---

## The Problem

Developers lose 10–20 minutes every time they return to an interrupted coding session — hunting through Git history, open tabs, and mental notes to remember what they were doing.

## What It Does

ContextSwitch AI is a VS Code extension that:
1. **Saves a checkpoint** of your coding session in one command (branch, modified files, diff, TODOs, your notes)
2. **Scores your session** with a transparent Resume Readiness Score (0–100) so you know how easy it'll be to pick back up
3. **Restores your context** when you return — shows what you were doing, what's broken, and what to do next

---

## Demo

> Screenshot / GIF coming soon

---

## Setup & Run

### Prerequisites
- VS Code 1.85+
- Node.js 18+
- Git

### Install from source

```bash
git clone https://github.com/YOUR_USERNAME/contextswitch.git
cd contextswitch
npm install
npm run build
```

Then in VS Code:
- Press `F5` to open an Extension Development Host, OR
- Run `npx vsce package` and install the `.vsix` via **Extensions → Install from VSIX**

### AI summaries (optional)

```bash
cp .env.example .env
# Add your free Gemini API key from https://aistudio.google.com/app/apikey
```

If no key is provided, ContextSwitch works fully without AI.

---

## Usage

| Action | How |
|--------|-----|
| Save a checkpoint | `Cmd+Shift+S` or Command Palette → `ContextSwitch: Save Checkpoint` |
| Open dashboard | Command Palette → `ContextSwitch: Open Dashboard` |
| Resume a session | Click **Resume** on any session card in the dashboard |

---

## AI Tools Used

### Used to develop this project
- [Antigravity (Google DeepMind)](https://antigravity.dev) — pair programming AI agent
- Claude (Anthropic) — code review and architecture advice

### Used by the product
- [Gemini 1.5 Flash](https://aistudio.google.com) via Google AI Studio free tier — generates natural language session summaries (optional, gracefully degrades without API key)

---

## How to Contribute

1. Fork this repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push and open a PR

---

## Licence

MIT — see [LICENSE](./LICENSE)

---

## Credits & Acknowledgements

See [CREDITS.md](./CREDITS.md)
