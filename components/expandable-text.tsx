"use client";

import { useState } from "react";

const LINE_CLAMP: Record<number, string> = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
};

interface ExpandableTextProps {
  text: string;
  maxLines?: number;
  className?: string;
}

export function ExpandableText({ text, maxLines = 2, className = "" }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const needsExpansion = text.length > 120;
  const clampClass = LINE_CLAMP[maxLines] || "line-clamp-2";

  return (
    <div className={className}>
      <p className={`text-sm text-zinc-500 ${expanded ? "" : clampClass}`}>
        {text}
      </p>
      {needsExpansion && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
