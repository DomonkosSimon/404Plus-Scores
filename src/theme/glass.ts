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
