const TIERS = [
  { key: "regex", label: "Regex", color: "var(--color-tier-regex)" },
  { key: "embedding", label: "BERT + LogReg", color: "var(--color-tier-embed)" },
  { key: "llm", label: "LLM fallback", color: "var(--color-tier-llm)" },
]

// Renders a 3-segment trail showing which tier of the cascade handled a
// given row. `matchedTier` should be one of "regex" | "embedding" | "llm",
// or undefined if the backend hasn't exposed which tier fired (in which
// case we render a neutral, unlit trail rather than guessing).
export default function TierTrail({ matchedTier }) {
  return (
    <div className="flex items-center gap-1" title={matchedTier ? `Classified by: ${TIERS.find(t => t.key === matchedTier)?.label}` : "Tier not reported"}>
      {TIERS.map((tier) => {
        const active = tier.key === matchedTier
        return (
          <span
            key={tier.key}
            className="h-1.5 w-4 rounded-full transition-colors"
            style={{
              backgroundColor: active ? tier.color : "var(--color-line)",
            }}
          />
        )
      })}
    </div>
  )
}
