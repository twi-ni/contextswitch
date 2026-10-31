# ContextSwitch AI — Hackathon Presentation Pitch Deck
**DevF8rge 2026 — Hacktoberfest Hack Day (MLH + NST)**  
*Theme: Developer Productivity*  
*Team Size: 2–4 | Code Freeze: 31 Oct 10:00 AM*

---

## Slide 1: Title Slide
**Visual Layout:** Dark clean theme, minimalist logo, high-contrast typography.
- **Headline:** ContextSwitch AI
- **Tagline:** Your coding session, remembered. Your momentum, restored.
- **Sub-info:** DevF8rge Hack Day 2026 — Developer Productivity Track
- **Team:** [Your Names / GitHub handles: @twi-ni]
- **Speaker Note (15 sec):**
  > "Hi everyone, we are the team behind ContextSwitch AI. Every developer here knows the pain of being in the zone, getting interrupted by a meeting or an urgent bug, and coming back 2 hours later with zero idea of what you were doing. We built a tool to fix that."

---

## Slide 2: The Problem — The High Cost of Interruption
**Visual Layout:** 3 stark pain-point callouts with realistic stats.
- **Headline:** Interruption is a Developer's Silent Tax
- **The Reality:**
  - **23 minutes:** The average time it takes a software engineer to regain deep focus after a context switch *(UC Irvine Study)*.
  - **Fragmented Context:** What was I debugging? Which 4 files did I touch? What was the failing hypothesis?
  - **The Current Alternatives Fail:**
    - `git stash` only stores file diffs — zero thoughts, zero context, zero next steps.
    - Notes apps require manual formatting right when you have no time to write.
- **Speaker Note (25 sec):**
  > "Studies show it takes over 20 minutes to recover focus after an interruption. Current developer tools are terrible at this: `git stash` saves code diffs, but it doesn't remember your train of thought, your failing error message, or what line you were about to edit. Notes apps require manual typing when you're already in a rush. Context is lost."

---

## Slide 3: The Solution — ContextSwitch AI
**Visual Layout:** Side-by-side: 1 keystroke on the left -> structured checkpoint on the right.
- **Headline:** Instant Session Memory in One Keystroke
- **Core Value Proposition:**
  - **Zero-Friction Capture (`Cmd+Shift+S`):** Takes 10 seconds. Prompts 4 quick inputs while automatically gathering git branch, modified files, diff stats, active tabs, and recent commits.
  - **Rule-Based Resume Readiness Score (0–100):** Objective, transparent grading of how easily this session can be picked back up.
  - **1-Click Workspace Restoration:** Automatically reopens your active files and displays your exact next task right in your editor.
- **Speaker Note (25 sec):**
  > "ContextSwitch AI is a zero-backend VS Code extension that snapshots your deep working state in under 10 seconds. You press Command+Shift+S, answer 4 brief questions, and it pairs your thoughts with live git diffs, modified files, and active editor tabs. When you return, one click reopens your workspace and tells you the exact next step."

---

## Slide 4: Live Architecture & Zero-Backend Privacy
**Visual Layout:** Clean architecture flowchart showing local sandboxed execution.
- **Headline:** Built for Speed, Privacy, and Zero Infrastructure
- **Architecture Highlights:**
  - **Client-Side VS Code Extension Host:** Runs entirely inside Node.js on the developer's machine. Zero server costs, zero latency.
  - **Local Persistence:** Checkpoints are stored in VS Code's encrypted `globalStoragePath` JSON database.
  - **Privacy First:** Never touches `.env`, secret keys, or credentials.
  - **Hybrid AI Engine:** Gemini 1.5 Flash generates optional 3-sentence executive summaries. If offline or no key is provided, the core product operates 100% locally without degradation.
- **Speaker Note (25 sec):**
  > "From an engineering perspective, we chose a zero-backend architecture. Everything runs locally inside the VS Code Extension Host. Your code, diffs, and notes never leave your laptop, which is crucial for enterprise privacy. For AI summaries, we use Gemini Flash via client REST calls, but the entire tool works 100% offline if you're on an airplane or disconnected."

---

## Slide 5: The "Resume Readiness Score" (Our Core Innovation)
**Visual Layout:** Visual scorecard table showing the 6 transparent rules and point allocations.
- **Headline:** No AI Hallucinations — 100% Explainable Scoring
- **Scoring Rules Breakdown (Total: 100 pts):**
  - **Task Description (+25 pts):** Clear problem statement (>10 chars).
  - **Modified Files Recorded (+20 pts):** Git status captured file changes.
  - **Last Known Problem (+20 pts):** Documented blocker or error.
  - **Next Step Defined (+20 pts):** Concrete action for resumption.
  - **Test / Validation Status (+10 pts):** Knowing if the build passes.
  - **Feature Branch (+5 pts):** Dedicated branch vs. committing on main.
- **Why It Matters:** Developers get immediate feedback on whether their checkpoint is actually resumable tomorrow morning.
- **Speaker Note (25 sec):**
  > "A lot of AI tools invent arbitrary confidence scores out of thin air. We rejected that. Our Resume Readiness Score is 100% rule-based and explainable. You get points for documenting your blocker, having a clear next step, and capturing modified files. It coaches developers to leave clean checkpoints without forcing heavy documentation."

---

## Slide 6: Live Demo Walkthrough
**Visual Layout:** Big screenshot of the React Dashboard showing the dark mode UI, cards, and animated SVG score rings.
- **Headline:** Live Workflow: Pause → Switch → Restore
- **Demo Beats (Show on screen):**
  1. **The Dashboard:** Dark-mode UI with active sessions, search filters, and average readiness score.
  2. **The Session Card:** Expandable card showing the next action in purple, git diffs, and chronological timeline.
  3. **The Resume Action:** Clicking `▶ Resume Session` triggers instant file reopening and workspace focus.
  4. **The Live Capture:** Pressing `Cmd+Shift+S` and saving a brand new checkpoint live in 10 seconds.
- **Speaker Note (30 sec):**
  > "[SWITCH TO VS CODE SCREEN]. Here is the extension live. You see our dark-mode dashboard with active sessions. If I expand this card, you see the exact problem encountered, the 4 files modified, and the timeline. When I click Resume, VS Code instantly reopens the files and highlights the next task. Now watch me save a live checkpoint in 5 seconds..."

---

## Slide 7: Impact, Open Source Quality & Future Roadmap
**Visual Layout:** 3 pillars: Impact, Open Source, Next Steps.
- **Headline:** Ready for Developers Today, Built Open Source
- **Real-World Impact:**
  - Saves an estimated **15–30 minutes per developer per day**.
  - Eliminates "context re-learning" fatigue after standups and lunch breaks.
- **Open Source Standards:**
  - OSI MIT License from Commit #1.
  - Zero proprietary dependencies; clean, modular TypeScript + React architecture.
  - Includes offline sample data and a one-command demo launcher (`./demo/run-demo.sh`).
- **Future Roadmap:**
  - Team Checkpoint Sharing (Slack/GitHub PR context exports).
  - Terminal history and shell command auto-capture.
  - JetBrains & Neovim plugin ports.
- **Speaker Note (20 sec):**
  > "ContextSwitch AI solves a universal pain point that every developer in this room faces daily. It's fully open-source under MIT, packaged as a one-click .vsix extension, and ready to use right now. Thank you, and we're ready for questions!"
