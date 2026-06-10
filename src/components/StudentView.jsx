import { useState, useEffect } from 'react';
import { fetchStudents, fetchPollState, updateStudentStatus } from '../services/api';

export default function StudentView() {
  const [students, setStudents] = useState([]);
  const [poll, setPoll] = useState({ isOpen: false });
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData(false);
    window.addEventListener('appDataChanged', handleUpdate);
    return () => window.removeEventListener('appDataChanged', handleUpdate);
  }, []);

  const loadData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const [studentsData, pollData] = await Promise.all([
      fetchStudents(),
      fetchPollState()
    ]);
    setStudents(studentsData);
    setPoll(pollData);
    if (showLoading) setLoading(false);
  };

  const handleVote = async (status) => {
    if (!selectedStudentId) return;
    await updateStudentStatus(selectedStudentId, status);
    loadData(false); // refresh silently
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  const currentStudent = students.find(s => s.id === selectedStudentId);

  return (
    <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Student Portal</h2>
      
      <div className="form-group">
        <label>Select Your Profile (Login simulation)</label>
        <select 
          value={selectedStudentId} 
          onChange={(e) => setSelectedStudentId(e.target.value)}
        >
          <option value="">-- Choose Name --</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {currentStudent && (
        <div className="mt-4 animate-fade-in">
          <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Welcome, {currentStudent.name}</h3>
            <p className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              Pickup Point: <strong style={{ color: 'var(--text-primary)'}}>{currentStudent.pickupPoint}</strong>
            </p>
            <div className="flex-center" style={{ justifyContent: 'flex-start', marginTop: '1rem' }}>
              <span style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}>Today's Status:</span>
              <span className={`badge ${currentStudent.status === 'coming' ? 'badge-success' : currentStudent.status === 'not_coming' ? 'badge-danger' : 'badge-neutral'}`}>
                {currentStudent.status === 'pending' ? 'Not Voted' : currentStudent.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <h3 style={{ marginBottom: '1rem' }}>Daily Bus Poll</h3>
            
            {poll.isOpen ? (
              <div>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Are you taking the bus today?</p>
                <div className="flex-center gap-4">
                  <button 
                    className="btn btn-success" 
                    style={{ flex: 1 }}
                    onClick={() => handleVote('coming')}
                  >
                    I'm Coming
                  </button>
                  <button 
                    className="btn btn-danger" 
                    style={{ flex: 1 }}
                    onClick={() => handleVote('not_coming')}
                  >
                    Not Coming
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center" style={{ padding: '1rem' }}>
                <span className="badge badge-danger" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                  Voting is Closed
                </span>
                <p className="text-secondary mt-4">
                  The driver has closed the poll for today. You cannot change your status.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
