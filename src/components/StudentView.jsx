import { useState, useEffect } from 'react';
import { fetchStudents, fetchPollState, updateStudentStatus } from '../services/api';

export default function StudentView({ currentUser }) {
  const [students, setStudents] = useState([]);
  const [poll, setPoll] = useState({ isOpen: false });
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
    await updateStudentStatus(currentUser.id, status);
    loadData(false);
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  // We need the live data of the current student to reflect instant status changes
  const liveStudentData = students.find(s => s.id === currentUser.id) || currentUser;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      
      {/* Uber-Style Profile Header */}
      <div className="glass-panel animate-fade-in" style={{ marginBottom: '2rem', textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-color), #c084fc)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold', margin: '0 auto 1.5rem', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)' }}>
          {liveStudentData.name.charAt(0)}
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{liveStudentData.name}</h2>
        <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 1rem', borderRadius: '99px', margin: '0.5rem 0' }}>
          <span style={{ marginRight: '0.5rem' }}>📍</span>
          <span style={{ color: 'var(--text-secondary)' }}>Pickup Point:</span>
          <strong style={{ marginLeft: '0.5rem', color: 'var(--text-primary)' }}>{liveStudentData.pickupPoint}</strong>
        </div>
        
        <div className="mt-4">
          <span className="text-secondary" style={{ marginRight: '0.5rem' }}>Today's Status:</span>
          <span className={`badge ${liveStudentData.status === 'coming' ? 'badge-success' : liveStudentData.status === 'not_coming' ? 'badge-danger' : 'badge-neutral'}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
            {liveStudentData.status === 'pending' ? 'Not Voted' : liveStudentData.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Voting Widget */}
      <div className="glass-panel animate-fade-in">
        <h3 style={{ marginBottom: '1rem' }}>Daily Ride Coordination</h3>
        
        {poll.isOpen ? (
          <div>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Your driver is preparing the route. Will you be taking the bus today?</p>
            <div className="flex-center gap-4">
              <button 
                className="btn btn-success" 
                style={{ flex: 1, height: '60px', fontSize: '1.2rem' }}
                onClick={() => handleVote('coming')}
              >
                Yes, I'm Coming
              </button>
              <button 
                className="btn btn-danger" 
                style={{ flex: 1, height: '60px', fontSize: '1.2rem' }}
                onClick={() => handleVote('not_coming')}
              >
                No, Skip Me
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center" style={{ padding: '2rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛑</div>
            <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Route Locked</h4>
            <p className="text-secondary">
              The driver has closed the poll for today and finalized the route. You cannot change your status.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
