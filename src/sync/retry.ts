const BACKOFF_STEPS_MS = [5000, 15000, 30000, 60000];

/**
 * Capped exponential backoff for a small number of automatic retries.
 * After the steps are exhausted, callers should stop and wait for a manual
 * retry or the browser's `online` event rather than continuing to poll.
 */
export function backoffDelayFor(attempt: number): number | null {
  if (attempt < 0 || attempt >= BACKOFF_STEPS_MS.length) return null;
  return BACKOFF_STEPS_MS[attempt];
}
