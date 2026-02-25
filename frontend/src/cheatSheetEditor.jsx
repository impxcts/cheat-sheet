import { useState } from 'react'

export default function CheatSheetEditor({ subject, onBack }) {
  const [input, setInput] = useState('')
  const [latex, setLatex] = useState('')

  const generate = () => {
    const lines = input.split('\n').filter(Boolean)
    const body = lines.map(line => `${line} \\\\`).join('\n')

    const doc =
`\\documentclass[9pt,landscape]{article}
\\usepackage[margin=0.5in]{geometry}
\\usepackage{multicol}
\\usepackage{amsmath}
\\pagestyle{empty}

\\begin{document}
\\begin{center}{\\large\\textbf{${subject.label} Cheat Sheet}}\\end{center}
\\hrule\\vspace{4pt}
\\begin{multicols}{3}
\\scriptsize

${body}

\\end{multicols}
\\end{document}`

    setLatex(doc)
  }

  return (
    <div className="editor-page">

      <div className="editor-topbar">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>{subject.label} Cheat Sheet</h2>
      </div>

      <div className="editor-layout">

        {/* LEFT: user input */}
        <div className="editor-panel">
          <label className="panel-label">Your Notes</label>
          <textarea
            className="editor-textarea"
            rows={20}
            placeholder={"Paste or type your formulas here...\n\na^2 + b^2 = c^2\nSlope = (y2 - y1) / (x2 - x1)\nQuadratic: x = (-b ± sqrt(b^2-4ac)) / 2a"}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>

        {/* CENTER: convert button */}
        <div className="editor-center">
          <p className="convert-label">Get your cheat sheet!</p>
          <button className="convert-btn" onClick={generate}>→</button>
        </div>

        {/* RIGHT: latex output */}
        <div className="editor-panel">
          <label className="panel-label">LaTeX Output</label>
          {latex ? (
            <>
              <pre className="latex-output">{latex}</pre>
              <p className="overleaf-hint">
                → Paste into <a href="https://overleaf.com" target="_blank" rel="noreferrer">Overleaf.com</a> to compile your PDF
              </p>
            </>
          ) : (
            <div className="output-empty">
              Your LaTeX will appear here after you click the button.
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
