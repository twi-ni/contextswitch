// readinessScore.ts — transparent, rule-based Resume Readiness Score (0–100)
// Every point is earned by a specific rule. No AI, no guessing.

export interface ScoreBreakdown {
  total: number;           // 0–100
  items: ScoreItem[];      // each rule, its points, and whether it passed
}

export interface ScoreItem {
  label: string;           // what we're checking
  points: number;          // max points available
  earned: number;          // points actually earned
  reason: string;          // plain English explanation
}

export interface ScoreInput {
  taskDescription: string | null;
  modifiedFiles: string[];
  lastKnownProblem: string | null;
  nextStep: string | null;
  validationStatus: string | null;
  recentCommits: string[];
  branch: string | null;
  activeFile: string | null;
}

export function calculateReadinessScore(input: ScoreInput): ScoreBreakdown {
  const items: ScoreItem[] = [];

  // Rule 1 — Task description (25 pts)
  const hasTask = !!input.taskDescription && input.taskDescription.trim().length > 10;
  items.push({
    label: "Task description",
    points: 25,
    earned: hasTask ? 25 : 0,
    reason: hasTask
      ? "Task description is present and detailed."
      : "No task description — you won't remember what you were doing.",
  });

  // Rule 2 — Changed files captured (20 pts)
  const hasFiles = input.modifiedFiles.length > 0;
  items.push({
    label: "Modified files recorded",
    points: 20,
    earned: hasFiles ? 20 : 0,
    reason: hasFiles
      ? `${input.modifiedFiles.length} changed file(s) captured.`
      : "No modified files found — context may be incomplete.",
  });

  // Rule 3 — Last known problem (20 pts)
  const hasProblem = !!input.lastKnownProblem && input.lastKnownProblem.trim().length > 5;
  items.push({
    label: "Last known problem",
    points: 20,
    earned: hasProblem ? 20 : 0,
    reason: hasProblem
      ? "Problem / blocker is documented."
      : "No problem documented — you may repeat failed debugging steps.",
  });

  // Rule 4 — Next step defined (20 pts)
  const hasNextStep = !!input.nextStep && input.nextStep.trim().length > 5;
  items.push({
    label: "Next action defined",
    points: 20,
    earned: hasNextStep ? 20 : 0,
    reason: hasNextStep
      ? "Clear next action documented."
      : "No next step defined — resume will be disorienting.",
  });

  // Rule 5 — Validation / testing status (10 pts)
  const hasValidation = !!input.validationStatus && input.validationStatus.trim().length > 3;
  items.push({
    label: "Test / validation status",
    points: 10,
    earned: hasValidation ? 10 : 0,
    reason: hasValidation
      ? "Testing status is documented."
      : "No test status — you won't know if things were working when you left.",
  });

  // Rule 6 — On a named branch (5 pts — small bonus)
  const hasGoodBranch =
    !!input.branch && input.branch !== "main" && input.branch !== "master";
  items.push({
    label: "Working on a feature branch",
    points: 5,
    earned: hasGoodBranch ? 5 : 0,
    reason: hasGoodBranch
      ? `On branch "${input.branch}" — easy to identify work.`
      : "Working directly on main/master — consider using a feature branch.",
  });

  const total = items.reduce((sum, item) => sum + item.earned, 0);
  return { total, items };
}
