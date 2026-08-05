import { useState, useCallback, useRef } from "react"
import { Upload, FileText, Loader2, AlertCircle } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

export default function UploadPanel({ onResult }) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState("idle") // idle | uploading | error
  const [errorMsg, setErrorMsg] = useState("")
  const inputRef = useRef(null)

  const handleFile = useCallback((f) => {
    if (!f) return
    if (!f.name.toLowerCase().endsWith(".csv")) {
      setStatus("error")
      setErrorMsg("File must be a .csv with 'source' and 'log_message' columns.")
      return
    }
    setFile(f)
    setStatus("idle")
    setErrorMsg("")
  }, [])

  const submit = useCallback(async () => {
    if (!file) return
    setStatus("uploading")
    setErrorMsg("")
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch(`${API_URL}/classify/`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        let detail = `Request failed (${res.status})`
        try {
          const body = await res.json()
          if (body?.detail) detail = body.detail
        } catch {
          // response wasn't JSON; keep the generic message
        }
        throw new Error(detail)
      }

      const blob = await res.blob()
      const csvText = await blob.text()
      onResult(csvText)
      setStatus("idle")
    } catch (err) {
      setStatus("error")
      setErrorMsg(err.message || "Something went wrong reaching the classifier.")
    }
  }, [file, onResult])

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragActive(false)
          handleFile(e.dataTransfer.files?.[0])
        }}
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer rounded-lg border border-dashed p-10 text-center transition-colors"
        style={{
          borderColor: dragActive ? "var(--color-tier-embed)" : "var(--color-line)",
          backgroundColor: "var(--color-surface)",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <FileText className="h-8 w-8" style={{ color: "var(--color-tier-embed)" }} />
            <p className="font-mono text-sm text-ink">{file.name}</p>
            <p className="text-xs" style={{ color: "var(--color-ink-dim)" }}>
              {(file.size / 1024).toFixed(1)} KB — click to choose a different file
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8" style={{ color: "var(--color-ink-dim)" }} />
            <p className="text-sm text-ink">
              Drop a CSV here, or click to browse
            </p>
            <p className="text-xs" style={{ color: "var(--color-ink-dim)" }}>
              Must contain <code className="font-mono">source</code> and{" "}
              <code className="font-mono">log_message</code> columns
            </p>
          </div>
        )}
      </div>

      {status === "error" && (
        <div className="mt-3 flex items-start gap-2 rounded-md border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        onClick={submit}
        disabled={!file || status === "uploading"}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 font-medium text-void transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        style={{ backgroundColor: "var(--color-tier-embed)" }}
      >
        {status === "uploading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Classifying…
          </>
        ) : (
          "Classify logs"
        )}
      </button>
    </div>
  )
}
