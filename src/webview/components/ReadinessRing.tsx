// ReadinessRing.tsx — animated SVG circle showing score out of 100

import React from "react";

interface Props { score: number; }

export function ReadinessRing({ score }: Props) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  // How much of the ring is filled (0 = empty, circumference = full)
  const offset = circumference - (score / 100) * circumference;

  // Color based on score
  const color =
    score >= 80 ? "#10b981" :   // green
    score >= 50 ? "#f59e0b" :   // yellow
    "#ef4444";                  // red

  return (
    <div className="score-ring">
      <svg width="52" height="52" viewBox="0 0 52 52">
        {/* Background ring */}
        <circle className="score-ring-bg" cx="26" cy="26" r={radius} />
        {/* Filled arc */}
        <circle
          className="score-ring-fill"
          cx="26" cy="26" r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {/* Number in center */}
      <div className="score-number" style={{ color }}>{score}</div>
    </div>
  );
}
