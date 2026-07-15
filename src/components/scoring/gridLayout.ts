/**
 * Reserved width for the sticky competitor-name column (drag handle + name)
 * in the score grid. Shared by the header spacer and each row so they stay
 * pixel-aligned, with a few px of buffer over the icon+name content's
 * natural width so the sticky background fully masks the first score cell
 * while horizontally scrolling — without it, the score cell's rounded
 * corner peeks out past the sticky column by a couple of pixels.
 *
 * Includes the column's own 8px left inset (see STICKY_LEFT_INSET) so the
 * sticky element's background reaches all the way to the scroll
 * container's true left edge — otherwise that 8px strip is left
 * uncovered, revealing whatever scrolled-under content sits behind it.
 */
export const STICKY_NAME_COLUMN_WIDTH = 208;

/** Left padding baked into the sticky column so it still reads as inset
 * from the row's true left edge, without leaving a gap for scrolled
 * content to show through (see STICKY_NAME_COLUMN_WIDTH). */
export const STICKY_LEFT_INSET = 1;
