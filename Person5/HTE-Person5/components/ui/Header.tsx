"use client";

/**
 * Slim, minimal header (always visible unless user clicks ^ to hide).
 * Product name + useful links; optional children (e.g. progress widget).
 */

import { useState } from "react";
import { ChevronDown, ChevronUp, Play, FileText, HelpCircle } from "lucide-react";

export interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export function Header({ children, className = "" }: HeaderProps) {
  const [hidden, setHidden] = useState(false);

  if (hidden) {
    return (
      <div
        className={`flex items-center justify-center border-b border-map-teal/20 bg-[#d4e8e6] py-1.5 ${className}`}
        role="banner"
      >
        <button
          type="button"
          onClick={() => setHidden(false)}
          aria-label="Show header"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded text-energy-text-on-tint hover:bg-map-teal/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal"
        >
          <ChevronDown className="h-5 w-5" strokeWidth={2} aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <header
      className={`flex items-center justify-between gap-3 border-b border-map-teal/25 bg-[#d4e8e6] px-3 py-2 ${className}`}
      role="banner"
    >
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-sm font-medium text-energy-text-on-tint">
          <Play className="h-4 w-4 shrink-0 text-map-teal-dark" aria-hidden />
          FocusFlow 3D
        </span>
        <span className="text-map-teal/40" aria-hidden>|</span>
        <nav className="flex items-center gap-2" aria-label="Quick links">
          <a
            href="#resources"
            className="flex items-center gap-1.5 rounded px-2 py-1 text-sm text-energy-text-on-tint hover:bg-map-teal/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal"
          >
            <FileText className="h-4 w-4 shrink-0 text-map-teal-dark" aria-hidden />
            Resources
          </a>
          <a
            href="#help"
            className="flex items-center gap-1.5 rounded px-2 py-1 text-sm text-energy-text-on-tint hover:bg-map-teal/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal"
          >
            <HelpCircle className="h-4 w-4 shrink-0 text-map-teal-dark" aria-hidden />
            Help
          </a>
        </nav>
      </div>
      <div className="flex items-center gap-1">
        {children}
        <button
          type="button"
          onClick={() => setHidden(true)}
          aria-label="Hide header"
          className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded text-energy-text-on-tint hover:bg-map-teal/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal"
        >
          <ChevronUp className="h-5 w-5" strokeWidth={2} aria-hidden />
        </button>
      </div>
    </header>
  );
}
