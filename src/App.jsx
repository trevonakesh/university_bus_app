import { useState } from 'react'
import StudentView from './components/StudentView'
import DriverView from './components/DriverView'

function App() {
  const [currentView, setCurrentView] = useState('student')

  return (
    <div className="app-container">
      <header className="glass-header" style={{ marginBottom: '2rem', borderRadius: '16px' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Campus Bus App</h1>
        <div className="nav-tabs" style={{ marginBottom: 0 }}>
          <button 
            className={`nav-tab ${currentView === 'student' ? 'active' : ''}`}
            onClick={() => setCurrentView('student')}
          >
            Student
          </button>
          <button 
            className={`nav-tab ${currentView === 'driver' ? 'active' : ''}`}
            onClick={() => setCurrentView('driver')}
          >
            Driver
          </button>
        </div>
      </header>

      <main className="animate-fade-in">
        {currentView === 'student' ? <StudentView /> : <DriverView />}
      </main>
    </div>
  )
}

export default App
