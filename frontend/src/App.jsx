import { useState } from "react"
import CascadeDiagram from "./components/CascadeDiagram"
import UploadPanel from "./components/UploadPanel"
import ResultsTable from "./components/ResultsTable"

export default function App() {
  const [csvResult, setCsvResult] = useState(null)

  return (
    <div className="min-h-screen">
      <header className="border-b" style={{ borderColor: "var(--color-line)" }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm" style={{ color: "var(--color-tier-embed)" }}>
              &gt;_
            </span>
            <span className="font-display text-base font-semibold text-ink">CascadeLog</span>
          </div>
          <a
            href="https://github.com/Smruti-Ranjan-009"
            target="_blank"
            rel="noreferrer"
            className="text-xs transition-colors"
            style={{ color: "var(--color-ink-dim)" }}
          >
            View on GitHub
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <section className="mb-14">
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            Every log finds its tier.
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base" style={{ color: "var(--color-ink-dim)" }}>
            A three-stage classification cascade: cheap and deterministic first,
            expensive and general only when necessary. Each log message escalates
            through regex, then a BERT + logistic regression classifier, then an
            LLM fallback — stopping at the first tier confident enough to decide.
          </p>
          <div className="mt-8">
            <CascadeDiagram />
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink">
            Classify a log file
          </h2>
          <UploadPanel onResult={setCsvResult} />
        </section>

        {csvResult && (
          <section>
            <h2 className="mb-4 font-display text-lg font-semibold text-ink">
              Results
            </h2>
            <ResultsTable csvText={csvResult} />
          </section>
        )}
      </main>

      <footer className="border-t px-6 py-6 text-center text-xs" style={{ borderColor: "var(--color-line)", color: "var(--color-ink-dim)" }}>
        Regex tier catches fixed patterns. The embedding tier has no
        out-of-distribution detection — log sources outside its training data
        may be misclassified with false confidence rather than falling back.
      </footer>
    </div>
  )
}
