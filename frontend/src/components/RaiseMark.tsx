import { cn } from '@/lib/cn';

// Shared RAISE wordmark icon -- the "R" square from a stakeholder-submitted brand proposal
// (docs/project-foundation-baseline/RAISE-BRAND-STYLE-GUIDE.md Sec1), updated 2026-08-24 to
// Singer's confirmed Corporate Identity (red-to-dark gradient, singer-* token) once RAISE's
// target organization was confirmed -- see docs/01-requirements/RAISE-PRD.md Sec16 Resolved
// Question 39. Extracted from Login/index.tsx so the shell (sidebar) and Login use the exact
// same mark instead of two copies that could drift. The small upward-trending accent line (the
// proposed "growth stroke" direction) stays white for legibility against the red. No dedicated
// logo asset/SVG file exists yet -- this is still an inline approximation, not a delivered mark.
export function RaiseMark({ className }: { className?: string }) {
  return (
    <div className={cn('relative flex items-center justify-center rounded-lg bg-gradient-to-br from-singer-600 to-surface-900 font-bold text-white shadow-sm', className)}>
      R
      <svg className="absolute -right-1 -top-1 h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 17 L11 10 L15 14 L20 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 5 H20 V10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
