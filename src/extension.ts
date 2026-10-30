// extension.ts — Entry point for the ContextSwitch VS Code extension
// This file is loaded by VS Code when the extension activates.

import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("ContextSwitch AI is now active");

  // Placeholder: Save Checkpoint command (full implementation coming next)
  const saveCmd = vscode.commands.registerCommand(
    "contextswitch.saveSession",
    () => {
      vscode.window.showInformationMessage(
        "ContextSwitch: Save Checkpoint — coming soon!"
      );
    }
  );

  // Placeholder: Open Dashboard command (full implementation coming next)
  const dashCmd = vscode.commands.registerCommand(
    "contextswitch.openDashboard",
    () => {
      vscode.window.showInformationMessage(
        "ContextSwitch: Dashboard — coming soon!"
      );
    }
  );

  context.subscriptions.push(saveCmd, dashCmd);
}

export function deactivate() {}
