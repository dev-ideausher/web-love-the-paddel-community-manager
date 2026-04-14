/**
 * Allowed match skill levels — must stay in sync with backend validation
 * (Joi: E, D, D+, C-, C+, B-, B, B+, A — plain "C" is not allowed).
 */
export const MATCH_SKILL_LEVELS = [
  "E",
  "D",
  "D+",
  "C-",
  "C+",
  "B-",
  "B",
  "B+",
  "A",
  "C"
];

const ALLOWED = new Set(MATCH_SKILL_LEVELS);

/** Legacy values stored in DB / old UI → closest allowed token */
const LEGACY_TO_ALLOWED = {
  C: "C-",
  "C strong": "C+",
};

/**
 * Returns only valid API skill strings, maps known legacy labels, dedupes.
 */
export function coerceMatchSkills(skills) {
  if (!Array.isArray(skills)) return [];
  const out = [];
  const seen = new Set();
  for (const raw of skills) {
    if (typeof raw !== "string") continue;
    const s = raw.trim();
    const mapped = LEGACY_TO_ALLOWED[s] ?? s;
    if (!ALLOWED.has(mapped)) continue;
    if (seen.has(mapped)) continue;
    seen.add(mapped);
    out.push(mapped);
  }
  return out;
}
