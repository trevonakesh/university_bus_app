import { useState, useEffect } from 'react';
import StudentView from './components/StudentView';
import DriverView from './components/DriverView';
import AuthView from './components/AuthView';
import { getCurrentUser, logout } from './services/api';

function App() {
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    const handleAuthChange = () => setUser(getCurrentUser());
    window.addEventListener('authStateChanged', handleAuthChange);
    return () => window.removeEventListener('authStateChanged', handleAuthChange);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return (
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '3rem', margin: 0 }}>Campus Bus Co.</h1>
          <p className="text-secondary" style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>Your daily ride coordinator</p>
        </div>
        <AuthView />
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="glass-header" style={{ marginBottom: '2rem', borderRadius: '16px' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Campus Bus</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '99px', border: '1px solid var(--glass-border)' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-color), #c084fc)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
              {user.name.charAt(0)}
            </div>
            <span style={{ fontWeight: 500 }}>{user.name}</span>
          </div>
          <button className="btn btn-outline" onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
            Logout
          </button>
        </div>
      </header>

      <main className="animate-fade-in">
        {user.role === 'student' ? <StudentView currentUser={user} /> : <DriverView currentUser={user} />}
      </main>
    </div>
  )
}

export default App
