const SUBJECTS = [
  { label: 'Algebra', value: 'algebra', active: true },
  { label: 'Calculus', value: 'calculus', active: false },
  { label: 'Geometry', value: 'geometry', active: false },
  { label: 'Trigonometry', value: 'trigonometry', active: false },
  { label: 'Statistics', value: 'statistics', active: false },
]

export default function SubjectSelect({ onSelect }) {
  return (
    <div className="home-page">
      <h1>Cheat Sheet Generator</h1>
      <p className="subtitle">Select a subject to get started</p>

      <div className="subject-list">
        {SUBJECTS.map((s) => (
          <button
            key={s.value}
            className={`subject-btn ${!s.active ? 'disabled' : ''}`}
            onClick={() => s.active && onSelect(s)}
            title={!s.active ? 'Coming soon!' : ''}
          >
            {s.label}
            {!s.active && <span className="coming-soon">Coming soon</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
