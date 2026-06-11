import { useState } from 'react';
import { login } from '../services/api';

export default function AuthView() {
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    setLoading(true);
    try {
      await login(name, role);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ maxWidth: '400px', margin: '4rem auto', padding: '3rem 2rem' }}>
      <div className="text-center" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
        <p className="text-secondary">Sign in to coordinate your campus ride.</p>
      </div>

      <div className="nav-tabs" style={{ marginBottom: '2rem', display: 'flex', width: '100%' }}>
        <button 
          type="button"
          className={`nav-tab ${role === 'student' ? 'active' : ''}`}
          style={{ flex: 1, borderRadius: '8px 0 0 8px', margin: 0, borderRight: 0 }}
          onClick={() => { setRole('student'); setError(''); }}
        >
          Student
        </button>
        <button 
          type="button"
          className={`nav-tab ${role === 'driver' ? 'active' : ''}`}
          style={{ flex: 1, borderRadius: '0 8px 8px 0', margin: 0 }}
          onClick={() => { setRole('driver'); setError(''); }}
        >
          Driver
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(239,68,68,0.3)' }}>
            {error}
          </div>
        )}
        <div className="form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            placeholder={role === 'student' ? "e.g. Alice Smith" : "e.g. Driver Bob"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {role === 'student' && (
            <p className="text-secondary" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
              Note: You must be registered by a driver first. Try "Alice Smith" or "Bob Johnson".
            </p>
          )}
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
