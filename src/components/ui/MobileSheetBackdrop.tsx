import React from 'react';

/** Keep every mobile bottom sheet's scrim at Quick Actions' contrast. */
export const MOBILE_SHEET_SCRIM = 'bg-slate-950/70 backdrop-blur-sm';

interface MobileSheetBackdropProps {
  onClose: () => void;
  label: string;
  /** Quick Actions is mobile up to 767px; other header sheets stop at 639px. */
  breakpoint?: 'sm' | 'md';
  className?: string;
}

/**
 * Render within the sheet trigger's existing stacking context.
 * The bottom panel is a sibling with a higher z-index, keeping the scrim
 * below the dialog without creating a portal above the whole header.
 */
export function MobileSheetBackdrop({
  onClose,
  label,
  breakpoint = 'sm',
  className = '',
}: MobileSheetBackdropProps) {
  return (
    <button
      type="button"
      data-testid="mobile-sheet-backdrop"
      aria-label={label}
      onClick={onClose}
      className={`fixed inset-0 z-[90] cursor-default ${MOBILE_SHEET_SCRIM} ${breakpoint === 'sm' ? 'sm:hidden' : 'md:hidden'} ${className}`}
    />
  );
}
