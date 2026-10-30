// gitService.ts — reads Git information from the current workspace
// Uses Node's child_process to shell out to the `git` CLI.
// All functions return null/empty if git is not available or not a git repo.

import { execSync } from "child_process";

// Run a git command in the given folder. Returns output string or null on error.
function runGit(command: string, cwd: string): string | null {
  try {
    return execSync(`git ${command}`, {
      cwd,
      encoding: "utf8",
      timeout: 5000,      // 5s max — don't hang the extension
      stdio: ["ignore", "pipe", "ignore"], // suppress stderr
    }).trim();
  } catch {
    return null;
  }
}

export interface GitInfo {
  isGitRepo: boolean;
  branch: string | null;
  recentCommits: string[];       // last 5 commit messages
  modifiedFiles: string[];       // unstaged + staged changes
  untrackedFiles: string[];      // new files not yet added
  diffSummary: string | null;    // short stat of what changed
  lastCommitHash: string | null;
}

// Main export — call this to get a full snapshot of the git state
export function getGitInfo(workspacePath: string): GitInfo {
  const isGitRepo = runGit("rev-parse --is-inside-work-tree", workspacePath) === "true";

  if (!isGitRepo) {
    return {
      isGitRepo: false,
      branch: null,
      recentCommits: [],
      modifiedFiles: [],
      untrackedFiles: [],
      diffSummary: null,
      lastCommitHash: null,
    };
  }

  // Current branch name (or commit hash in detached HEAD)
  const branch = runGit("rev-parse --abbrev-ref HEAD", workspacePath);

  // Last 5 commit messages, one per line
  const commitsRaw = runGit(
    'log --oneline -5 --pretty=format:"%h %s"',
    workspacePath
  );
  const recentCommits = commitsRaw ? commitsRaw.split("\n").filter(Boolean) : [];

  // Files with changes (modified, deleted, renamed) — git status porcelain
  const statusRaw = runGit("status --porcelain", workspacePath);
  const modifiedFiles: string[] = [];
  const untrackedFiles: string[] = [];

  if (statusRaw) {
    for (const line of statusRaw.split("\n")) {
      const code = line.substring(0, 2).trim();
      const file = line.substring(3).trim();
      if (!file) { continue; }
      if (code === "??") {
        untrackedFiles.push(file);   // untracked new file
      } else {
        modifiedFiles.push(file);    // any other change
      }
    }
  }

  // Short stat: "3 files changed, 42 insertions(+), 7 deletions(-)"
  const diffSummary = runGit("diff --stat HEAD", workspacePath);

  // Latest commit hash (short)
  const lastCommitHash = runGit("rev-parse --short HEAD", workspacePath);

  return {
    isGitRepo: true,
    branch,
    recentCommits,
    modifiedFiles,
    untrackedFiles,
    diffSummary,
    lastCommitHash,
  };
}
