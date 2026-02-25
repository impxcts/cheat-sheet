import { useState } from "react";
import "./App.css";

const CATEGORIES = ["Formula", "Definition", "Example", "Note"];

export default function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ category: "Formula", label: "", content: "" });
  const [params, setParams] = useState({
    columns: 3,
    fontSize: "small",
    paperSize: "letter",
    margins: "narrow",
    title: "My Cheat Sheet",
    showBorders: true,
  });
  const [latex, setLatex] = useState("");
  const [activeTab, setActiveTab] = useState("input");
  const [copied, setCopied] = useState(false);

  const addItem = () => {
    if (!form.content.trim()) return;
    setItems([...items, { ...form, id: Date.now() }]);
    setForm({ category: form.category, label: "", content: "" });
  };

  const removeItem = (id) => setItems(items.filter((i) => i.id !== id));

  const generateLatex = () => {
    const fontSizeMap = { tiny: "\\tiny", small: "\\scriptsize", normal: "\\footnotesize", large: "\\small" };
    const marginMap = { narrow: "0.5in", normal: "0.75in", wide: "1in" };
    const fontSize = fontSizeMap[params.fontSize];
    const margin = marginMap[params.margins];

    const grouped = CATEGORIES.reduce((acc, cat) => {
      const catItems = items.filter((i) => i.category === cat);
      if (catItems.length) acc[cat] = catItems;
      return acc;
    }, {});

    const sections = Object.entries(grouped).map(([cat, catItems]) => {
      const rows = catItems.map((item) => {
        const label = item.label ? `\\textbf{${escapeLatex(item.label)}}: ` : "";
        return `${label}${escapeLatex(item.content)}`;
      });
      return `\\subsection*{${cat}s}\n${rows.join("\\\\\n")}`;
    });

    const border = params.showBorders
      ? "\\setlength{\\columnseprule}{0.4pt}"
      : "";

    const doc = `\\documentclass[${params.fontSize === "tiny" ? "8pt" : "9pt"},${params.paperSize}]{article}
\\usepackage[margin=${margin},landscape]{geometry}
\\usepackage{multicol}
\\usepackage{amsmath,amssymb}
\\usepackage{enumitem}
\\usepackage[compact]{titlesec}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{2pt}
${border}
\\pagestyle{empty}

\\begin{document}
${fontSize}
\\begin{center}
  {\\large\\textbf{${escapeLatex(params.title)}}}
\\end{center}
\\vspace{-4pt}
\\hrule
\\vspace{4pt}
\\begin{multicols}{${params.columns}}

${sections.join("\n\n")}

\\end{multicols}
\\end{document}`;

    setLatex(doc);
    setActiveTab("output");
  };

  const escapeLatex = (str) =>
    str
      .replace(/\\/g, "\\textbackslash{}")
      .replace(/([&%$#_{}~^])/g, "\\$1");

  const copyLatex = () => {
    navigator.clipboard.writeText(latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">∑</span>
            <div>
              <h1>CheatSheet.gen</h1>
              <p>LaTeX-formatted study sheets, instantly</p>
            </div>
          </div>
          <nav className="tabs">
            <button className={activeTab === "input" ? "tab active" : "tab"} onClick={() => setActiveTab("input")}>
              ① Add Content
            </button>
            <button className={activeTab === "settings" ? "tab active" : "tab"} onClick={() => setActiveTab("settings")}>
              ② Layout
            </button>
            <button
              className={activeTab === "output" ? "tab active" : "tab"}
              onClick={generateLatex}
            >
              ③ Generate →
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        {activeTab === "input" && (
          <div className="panel">
            <div className="panel-left">
              <h2>Add Items</h2>
              <div className="form-card">
                <div className="form-row">
                  <label>Type</label>
                  <div className="category-pills">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        className={`pill ${form.category === c ? "pill-active" : ""}`}
                        onClick={() => setForm({ ...form, category: c })}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-row">
                  <label>Label (optional)</label>
                  <input
                    placeholder="e.g. Pythagorean Theorem"
                    value={form.label}
                    onChange={(e) => setForm({ ...form, label: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <label>Content *</label>
                  <textarea
                    placeholder="e.g. a² + b² = c²  or plain text explanation..."
                    rows={4}
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    onKeyDown={(e) => { if (e.ctrlKey && e.key === "Enter") addItem(); }}
                  />
                  <span className="hint">Ctrl+Enter to add quickly</span>
                </div>
                <button className="btn-primary" onClick={addItem}>+ Add Item</button>
              </div>
            </div>

            <div className="panel-right">
              <h2>Items ({items.length})</h2>
              {items.length === 0 ? (
                <div className="empty-state">
                  <span>📄</span>
                  <p>No items yet. Add formulas, definitions, or examples on the left.</p>
                </div>
              ) : (
                <div className="items-list">
                  {CATEGORIES.map((cat) => {
                    const catItems = items.filter((i) => i.category === cat);
                    if (!catItems.length) return null;
                    return (
                      <div key={cat} className="category-group">
                        <h3 className={`category-label cat-${cat.toLowerCase()}`}>{cat}s</h3>
                        {catItems.map((item) => (
                          <div key={item.id} className="item-card">
                            <div className="item-text">
                              {item.label && <strong>{item.label}: </strong>}
                              <span>{item.content}</span>
                            </div>
                            <button className="btn-remove" onClick={() => removeItem(item.id)}>✕</button>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
              {items.length > 0 && (
                <button className="btn-next" onClick={() => setActiveTab("settings")}>
                  Next: Layout Settings →
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="settings-panel">
            <h2>Layout Parameters</h2>
            <p className="settings-subtitle">Tune these to pack as much as possible onto one printed page.</p>

            <div className="settings-grid">
              <div className="setting-block">
                <label>Sheet Title</label>
                <input value={params.title} onChange={(e) => setParams({ ...params, title: e.target.value })} />
              </div>

              <div className="setting-block">
                <label>Columns <span className="badge">{params.columns}</span></label>
                <input type="range" min={1} max={5} value={params.columns}
                  onChange={(e) => setParams({ ...params, columns: +e.target.value })} />
                <div className="range-labels"><span>1</span><span>5</span></div>
              </div>

              <div className="setting-block">
                <label>Font Size</label>
                <div className="option-group">
                  {["tiny", "small", "normal", "large"].map((s) => (
                    <button key={s} className={`option-btn ${params.fontSize === s ? "active" : ""}`}
                      onClick={() => setParams({ ...params, fontSize: s })}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="setting-block">
                <label>Paper Size</label>
                <div className="option-group">
                  {["letter", "a4"].map((s) => (
                    <button key={s} className={`option-btn ${params.paperSize === s ? "active" : ""}`}
                      onClick={() => setParams({ ...params, paperSize: s })}>
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="setting-block">
                <label>Margins</label>
                <div className="option-group">
                  {["narrow", "normal", "wide"].map((s) => (
                    <button key={s} className={`option-btn ${params.margins === s ? "active" : ""}`}
                      onClick={() => setParams({ ...params, margins: s })}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="setting-block">
                <label>Column Dividers</label>
                <button
                  className={`toggle-btn ${params.showBorders ? "on" : "off"}`}
                  onClick={() => setParams({ ...params, showBorders: !params.showBorders })}
                >
                  {params.showBorders ? "On" : "Off"}
                </button>
              </div>
            </div>

            <div className="density-preview">
              <div className="density-label">Estimated density</div>
              <div className="density-bar">
                <div
                  className="density-fill"
                  style={{ width: `${Math.min(100, (items.length * 8 * (6 - params.columns)) / params.fontSize.length / 2)}%` }}
                />
              </div>
              <div className="density-note">
                {items.length} items · {params.columns} cols · {params.fontSize} font · {params.margins} margins
              </div>
            </div>

            <button className="btn-generate" onClick={generateLatex}>
              ✦ Generate LaTeX →
            </button>
          </div>
        )}

        {activeTab === "output" && (
          <div className="output-panel">
            <div className="output-header">
              <h2>Your LaTeX Code</h2>
              <div className="output-actions">
                <button className={`btn-copy ${copied ? "copied" : ""}`} onClick={copyLatex}>
                  {copied ? "✓ Copied!" : "Copy LaTeX"}
                </button>
              </div>
            </div>
            <div className="output-tip">
              <strong>Next steps:</strong> Paste this into{" "}
              <a href="https://www.overleaf.com" target="_blank" rel="noreferrer">Overleaf.com</a>{" "}
              (free, no install needed) and click Compile → Download PDF.
            </div>
            <pre className="latex-code">{latex}</pre>
            <div className="output-footer">
              <button className="btn-secondary" onClick={() => setActiveTab("input")}>← Edit Items</button>
              <button className="btn-secondary" onClick={() => setActiveTab("settings")}>← Edit Layout</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
