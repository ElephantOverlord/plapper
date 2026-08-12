import party from "party-js";

type PartyOptions = Parameters<typeof party.confetti>[1];
type SparklesOptions = Parameters<typeof party.sparkles>[1];

export function confetti(target: HTMLElement | null, options: PartyOptions): void {
  try {
    party.confetti(target || document.body, options);
  } catch {
    // Visual effects must never interrupt scoring or game state updates.
  }
}

export function sparkles(
  target: HTMLElement | null,
  options: SparklesOptions
): void {
  try {
    party.sparkles(target || document.body, options);
  } catch {
    // Visual effects must never interrupt scoring or game state updates.
  }
}
