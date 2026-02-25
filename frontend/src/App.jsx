import { useState } from 'react'
import './App.css'
import SubjectSelect from './SubjectSelect'
import CheatSheetEditor from './CheatSheetEditor'

function App() {
  const [page, setPage] = useState('home')
  const [subject, setSubject] = useState(null)

  const handleSubjectSelect = (selected) => {
    setSubject(selected)
    setPage('editor')
  }

  const handleBack = () => {
    setPage('home')
    setSubject(null)
  }

  return (
    <div className="App">
      {page === 'home' && <SubjectSelect onSelect={handleSubjectSelect} />}
      {page === 'editor' && <CheatSheetEditor subject={subject} onBack={handleBack} />}
    </div>
  )
}

export default App
