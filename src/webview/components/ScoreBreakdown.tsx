// ScoreBreakdown.tsx — Displays rule-by-rule breakdown of the Resume Readiness Score

import React from "react";
import { ScoreBreakdown as IScoreBreakdown } from "../../scoring/readinessScore";

interface Props {
  breakdown: IScoreBreakdown;
}

export function ScoreBreakdown({ breakdown }: Props) {
  if (!breakdown || !breakdown.items) {
    return null;
  }

  return (
    <div className="score-breakdown">
      {breakdown.items.map((item, idx) => {
        const passed = item.earned > 0;
        const percentage = Math.round((item.earned / item.points) * 100);

        return (
          <div key={idx} className={`score-row ${passed ? "passed" : ""}`}>
            <span className="score-row-icon">{passed ? "✓" : "✗"}</span>
            <span className="score-row-label" title={item.reason}>
              {item.label}
            </span>
            <div className="score-bar-wrap" title={`${item.earned}/${item.points} pts`}>
              <div
                className="score-bar-fill"
                style={{
                  width: `${percentage}%`,
                  background: passed ? "var(--green)" : "var(--red)",
                }}
              />
            </div>
            <span className="score-row-pts">
              {item.earned}/{item.points} pts
            </span>
          </div>
        );
      })}
    </div>
  );
}
