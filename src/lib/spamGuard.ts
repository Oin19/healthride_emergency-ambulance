/**
 * Client-side spam protection helpers for public forms:
 *  - honeypot field (bots fill hidden inputs)
 *  - minimum time-on-form (bots submit instantly)
 *  - per-form submission throttle stored in localStorage
 */

export const MIN_FORM_SECONDS = 3;

export type SpamCheckResult = { ok: true } | { ok: false; reason: string };

export const checkSpam = (opts: {
  honeypot: string;
  startedAt: number;
  throttleKey: string;
  throttleSeconds?: number;
  maxSubmissions?: number;
}): SpamCheckResult => {
  const { honeypot, startedAt, throttleKey, throttleSeconds = 60, maxSubmissions = 3 } = opts;

  if (honeypot.trim() !== "") {
    return { ok: false, reason: "Your submission was flagged as automated. Please try again." };
  }

  if ((Date.now() - startedAt) / 1000 < MIN_FORM_SECONDS) {
    return { ok: false, reason: "That was too fast — please review your details and submit again." };
  }

  const key = `healthride_throttle_${throttleKey}`;
  const now = Date.now();
  let stamps: number[] = [];
  try {
    stamps = (JSON.parse(localStorage.getItem(key) || "[]") as number[]).filter(
      (t) => now - t < throttleSeconds * 1000,
    );
  } catch {
    stamps = [];
  }

  if (stamps.length >= maxSubmissions) {
    return { ok: false, reason: "Too many attempts. Please wait a minute before trying again." };
  }

  stamps.push(now);
  localStorage.setItem(key, JSON.stringify(stamps));
  return { ok: true };
};

/** Props for a visually hidden honeypot input. */
export const honeypotProps = {
  tabIndex: -1,
  autoComplete: "off",
  "aria-hidden": true as const,
  className: "absolute left-[-9999px] w-px h-px opacity-0 pointer-events-none",
};
