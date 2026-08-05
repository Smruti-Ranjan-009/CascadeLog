const STAGES = [
  {
    key: "regex",
    label: "Regex",
    color: "var(--color-tier-regex)",
    detail: "Fixed patterns",
    example: '"Backup completed successfully."',
  },
  {
    key: "embedding",
    label: "BERT + LogReg",
    color: "var(--color-tier-embed)",
    detail: "Variable patterns, enough labels",
    example: '"Rate limit exceeded for client 8823."',
  },
  {
    key: "llm",
    label: "LLM fallback",
    color: "var(--color-tier-llm)",
    detail: "Complex, few labels",
    example: '"Case escalated: agent no longer active."',
  },
]

export default function CascadeDiagram() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {STAGES.map((stage, i) => (
        <div key={stage.key} className="relative">
          <div
            className="rounded-lg border p-4"
            style={{
              borderColor: "var(--color-line)",
              backgroundColor: "var(--color-surface)",
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: stage.color }}
              />
              <span className="font-mono text-xs uppercase tracking-wider" style={{ color: stage.color }}>
                Tier {i + 1}
              </span>
            </div>
            <h3 className="mt-2 font-display text-lg font-semibold text-ink">
              {stage.label}
            </h3>
            <p className="mt-1 text-sm" style={{ color: "var(--color-ink-dim)" }}>
              {stage.detail}
            </p>
            <p className="mt-3 truncate font-mono text-xs" style={{ color: "var(--color-ink-dim)" }}>
              {stage.example}
            </p>
          </div>
          {i < STAGES.length - 1 && (
            <div className="pointer-events-none absolute top-1/2 -right-3 z-10 hidden -translate-y-1/2 sm:block">
              <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                <path
                  d="M0 6H17M17 6L12 1M17 6L12 11"
                  stroke="var(--color-ink-dim)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
