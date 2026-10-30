#!/usr/bin/env bash
# run-demo.sh — One-command demo rehearsal script for Hackathon judges

set -e

echo "=========================================================="
echo "   ⚡ ContextSwitch AI — Live Hackathon Demo Launcher     "
echo "=========================================================="

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR/.."

echo ""
echo "Step 1: Building extension & webview bundle..."
npm run build

echo ""
echo "Step 2: Seeding realistic sample sessions..."
node demo/seed-demo.js

echo ""
echo "=========================================================="
echo "🎯 DEMO WALKTHROUGH SCRIPT FOR JUDGES (2-3 Minutes):"
echo "=========================================================="
echo "1. Press F5 in VS Code to launch the Extension Development Host."
echo "2. In the new window, press Cmd+Shift+P (or Ctrl+Shift+P)."
echo "3. Type and select: 'ContextSwitch: Open Dashboard'."
echo "4. SHOW JUDGES:"
echo "   - Interactive dark-mode dashboard with active sessions"
echo "   - Resume Readiness Score (e.g. 95/100) with rule breakdown"
echo "   - AI-powered session summary & modified file tracking"
echo "   - Session timeline showing exactly when context was saved"
echo "5. CLICK 'Resume Session':"
echo "   - Watch it restore the active files and outline next steps"
echo "6. DEMO LIVE CAPTURE:"
echo "   - Press Cmd+Shift+S (or Ctrl+Shift+S)"
echo "   - Enter a quick task description, work done, and next step"
echo "   - Watch the new checkpoint appear instantly with an explainable score!"
echo "=========================================================="
