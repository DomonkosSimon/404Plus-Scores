/**
 * Reserved width for the sticky competitor-name column (drag handle + name)
 * in the score grid. Shared by the header spacer and each row so they stay
 * pixel-aligned, with a few px of buffer over the icon+name content's
 * natural width so the sticky background fully masks the first score cell
 * while horizontally scrolling — without it, the score cell's rounded
 * corner peeks out past the sticky column by a couple of pixels.
 */
export const STICKY_NAME_COLUMN_WIDTH = 200;
