// Timeline.tsx — Renders the timeline of session activity events

import React from "react";
import { TimelineEvent } from "../../services/sessionStore";

interface Props {
  events: TimelineEvent[];
}

export function Timeline({ events }: Props) {
  if (!events || events.length === 0) {
    return null;
  }

  const getDotClass = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "save":
        return "dot-save";
      case "resume":
        return "dot-resume";
      case "pause":
        return "dot-pause";
      case "switch":
        return "dot-switch";
      default:
        return "dot-info";
    }
  };

  const getIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "save":
        return "💾";
      case "resume":
        return "▶";
      case "pause":
        return "⏸";
      case "switch":
        return "⇄";
      default:
        return "•";
    }
  };

  return (
    <div className="timeline">
      {events.map((ev, idx) => {
        const timeFormatted = new Date(ev.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div key={idx} className="timeline-item">
            <div className={`timeline-dot ${getDotClass(ev.type)}`}>
              <span>{getIcon(ev.type)}</span>
            </div>
            <div className="timeline-content">
              <div className="timeline-event">{ev.event}</div>
              <div className="timeline-time">{timeFormatted}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
