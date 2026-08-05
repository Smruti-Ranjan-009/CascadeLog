import { useMemo, useState } from "react"
import Papa from "papaparse"
import { Download } from "lucide-react"
import TierTrail from "./TierTrail"

const LABEL_COLORS = {
  "Security Alert": "var(--color-tier-llm)",
  "Critical Error": "var(--color-tier-llm)",
  Error: "var(--color-tier-embed)",
  "Workflow Error": "var(--color-tier-llm)",
  "Deprecation Warning": "var(--color-tier-llm)",
  "System Notification": "var(--color-tier-regex)",
  "User Action": "var(--color-tier-regex)",
  "HTTP Status": "var(--color-tier-embed)",
  Unclassified: "var(--color-ink-dim)",
}

export default function ResultsTable({ csvText }) {
  const [filter, setFilter] = useState("all")

  const { rows, labels } = useMemo(() => {
    const parsed = Papa.parse(csvText.trim(), { header: true, skipEmptyLines: true })
    const rows = parsed.data
    const labels = [...new Set(rows.map((r) => r.target_label).filter(Boolean))].sort()
    return { rows, labels }
  }, [csvText])

  const filtered = filter === "all" ? rows : rows.filter((r) => r.target_label === filter)

  const downloadCsv = () => {
    const blob = new Blob([csvText], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "classified_logs.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
            style={{
              borderColor: filter === "all" ? "var(--color-tier-embed)" : "var(--color-line)",
              color: filter === "all" ? "var(--color-tier-embed)" : "var(--color-ink-dim)",
            }}
          >
            All ({rows.length})
          </button>
          {labels.map((label) => (
            <button
              key={label}
              onClick={() => setFilter(label)}
              className="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
              style={{
                borderColor: filter === label ? (LABEL_COLORS[label] || "var(--color-ink-dim)") : "var(--color-line)",
                color: filter === label ? (LABEL_COLORS[label] || "var(--color-ink)") : "var(--color-ink-dim)",
              }}
            >
              {label} ({rows.filter((r) => r.target_label === label).length})
            </button>
          ))}
        </div>
        <button
          onClick={downloadCsv}
          className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors"
          style={{ borderColor: "var(--color-line)", color: "var(--color-ink)" }}
        >
          <Download className="h-3.5 w-3.5" />
          Download CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--color-line)" }}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr style={{ backgroundColor: "var(--color-surface-raised)" }}>
              <th className="px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-ink-dim)" }}>
                Source
              </th>
              <th className="px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-ink-dim)" }}>
                Log message
              </th>
              {rows[0]?.matched_tier && (
                <th className="px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-ink-dim)" }}>
                  Tier
                </th>
              )}
              <th className="px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-ink-dim)" }}>
                Label
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr
                key={i}
                className="border-t"
                style={{ borderColor: "var(--color-line)" }}
              >
                <td className="px-4 py-2.5 font-mono text-xs" style={{ color: "var(--color-ink-dim)" }}>
                  {row.source}
                </td>
                <td className="max-w-md px-4 py-2.5 font-mono text-xs text-ink">
                  {row.log_message}
                </td>
                {rows[0]?.matched_tier && (
                  <td className="px-4 py-2.5">
                    <TierTrail matchedTier={row.matched_tier} />
                  </td>
                )}
                <td className="px-4 py-2.5">
                  <span
                    className="inline-flex items-center gap-1.5 font-mono text-xs"
                    style={{ color: LABEL_COLORS[row.target_label] || "var(--color-ink)" }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: LABEL_COLORS[row.target_label] || "var(--color-ink-dim)" }}
                    />
                    {row.target_label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
