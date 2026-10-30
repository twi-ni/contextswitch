// workspaceService.ts — reads VS Code workspace info
// Uses the official VS Code API (no shelling out needed here).

import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export interface WorkspaceInfo {
  projectName: string | null;
  workspacePath: string | null;
  activeFile: string | null;       // relative path of currently open file
  todoComments: TodoComment[];     // all TODO/FIXME comments found in workspace
}

export interface TodoComment {
  file: string;
  line: number;
  text: string;
  type: "TODO" | "FIXME" | "HACK" | "NOTE";
}

// Returns basic workspace metadata
export function getWorkspaceInfo(): WorkspaceInfo {
  const folders = vscode.workspace.workspaceFolders;
  const workspacePath = folders?.[0]?.uri.fsPath ?? null;
  const projectName = workspacePath ? path.basename(workspacePath) : null;

  // Active editor file (relative to workspace root)
  const activeEditor = vscode.window.activeTextEditor;
  let activeFile: string | null = null;
  if (activeEditor && workspacePath) {
    const absPath = activeEditor.document.uri.fsPath;
    activeFile = path.relative(workspacePath, absPath);
  }

  // Scan for TODO/FIXME/HACK/NOTE comments in common source files
  const todoComments = workspacePath
    ? scanForTodos(workspacePath)
    : [];

  return { projectName, workspacePath, activeFile, todoComments };
}

// File extensions to scan for TODO comments
const SCAN_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".py", ".go",
  ".java", ".c", ".cpp", ".rs", ".rb", ".cs",
]);

// Folders to skip (too large or not source code)
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next", "venv", "__pycache__"]);

// Pattern to find TODO-style comments
const TODO_PATTERN = /\/\/\s*(TODO|FIXME|HACK|NOTE)[:\s](.+)/i;

function scanForTodos(rootPath: string, maxFiles = 200): TodoComment[] {
  const results: TodoComment[] = [];
  let scanned = 0;

  function walk(dir: string) {
    if (scanned >= maxFiles) { return; }

    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return; // skip unreadable dirs
    }

    for (const entry of entries) {
      if (SKIP_DIRS.has(entry.name)) { continue; }

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && SCAN_EXTENSIONS.has(path.extname(entry.name))) {
        scanned++;
        try {
          const lines = fs.readFileSync(fullPath, "utf8").split("\n");
          lines.forEach((line, i) => {
            const match = line.match(TODO_PATTERN);
            if (match) {
              results.push({
                file: path.relative(rootPath, fullPath),
                line: i + 1,
                text: match[2].trim(),
                type: match[1].toUpperCase() as TodoComment["type"],
              });
            }
          });
        } catch {
          // skip unreadable files
        }
      }
    }
  }

  walk(rootPath);
  return results.slice(0, 20); // cap at 20 to keep checkpoint size reasonable
}
