/**
 * Shared "Liquid Glass" surface values, reused wherever chrome/navigation
 * floats over content (app bar, floating tab bar, dialogs/sheets). Never
 * applied to score-entry cards or other data-dense content — glass is for
 * the control layer, not the content layer, matching Apple's own usage.
 */
export const GLASS_BLUR = 'blur(24px) saturate(180%)';

export const glassSurface = {
  backgroundColor: 'rgba(255, 255, 255, 0.72)',
  backdropFilter: GLASS_BLUR,
  WebkitBackdropFilter: GLASS_BLUR,
} as const;

export const glassBorder = '1px solid rgba(255, 255, 255, 0.5)';

/**
 * Applied directly on each Dialog's Paper slot (in addition to the theme-level
 * MuiDialog override) so the floating-card look never depends solely on
 * theme style-injection order/specificity working out correctly.
 */
export const glassDialogPaperSx = {
  ...glassSurface,
  backgroundColor: 'rgba(255, 255, 255, 0.82)',
  backgroundImage: 'none',
  border: glassBorder,
  borderRadius: 3,
  boxShadow: '0 20px 60px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.12)',
  // Never taller than 70% of the viewport — content scrolls internally
  // instead of the whole dialog growing to fill the screen.
  maxHeight: '70vh',
  margin: 2,
} as const;

/**
 * Used instead of glassDialogPaperSx wherever the score grid is shown —
 * the grid's column count varies per competition, so the dialog should
 * grow to fit it rather than being pinned to a fixed breakpoint width.
 * Paired with Dialog's maxWidth={false} so this sx fully controls sizing.
 */
export const scoringDialogPaperSx = {
  ...glassDialogPaperSx,
  width: 'fit-content',
  maxWidth: '90vw',
  minWidth: { xs: 'auto', sm: 360 },
} as const;
