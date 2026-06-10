import { useState, useEffect } from 'react';
import { fetchStudents, fetchPollState, updatePollState, addStudent, removeStudent } from '../services/api';

export default function DriverView() {
  const [students, setStudents] = useState([]);
  const [poll, setPoll] = useState({ isOpen: false });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('manifest'); // manifest or manage

  const [newName, setNewName] = useState('');
  const [newPickup, setNewPickup] = useState('');

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

  const handleTogglePoll = async () => {
    await updatePollState(!poll.isOpen);
    loadData(false);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newPickup.trim()) return;
    await addStudent({ name: newName, pickupPoint: newPickup });
    setNewName('');
    setNewPickup('');
    loadData(false);
  };

  const handleRemoveStudent = async (id) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      await removeStudent(id);
      loadData(false);
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  const comingStudents = students.filter(s => s.status === 'coming');
  
  // Group coming students by pickup point
  const groupedStudents = comingStudents.reduce((acc, student) => {
    if (!acc[student.pickupPoint]) acc[student.pickupPoint] = [];
    acc[student.pickupPoint].push(student);
    return acc;
  }, {});

  return (
    <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2>Driver Dashboard</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: '12px' }}>
          <span style={{ fontWeight: 600 }}>Poll Status:</span>
          {poll.isOpen ? (
            <span className="badge badge-success">Open</span>
          ) : (
            <span className="badge badge-danger">Closed</span>
          )}
          <button 
            className={`btn ${poll.isOpen ? 'btn-danger' : 'btn-success'}`}
            onClick={handleTogglePoll}
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
          >
            {poll.isOpen ? 'Close Poll' : 'Open Poll'}
          </button>
        </div>
      </div>

      <div className="nav-tabs" style={{ justifyContent: 'flex-start' }}>
        <button 
          className={`nav-tab ${activeTab === 'manifest' ? 'active' : ''}`}
          onClick={() => setActiveTab('manifest')}
        >
          Daily Manifest ({comingStudents.length})
        </button>
        <button 
          className={`nav-tab ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          Manage Students ({students.length})
        </button>
      </div>

      {activeTab === 'manifest' && (
        <div className="animate-fade-in">
          <h3 style={{ marginBottom: '1rem' }}>Route Plan: {comingStudents.length} Students</h3>
          {comingStudents.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
              <p className="text-secondary">No students have confirmed they are coming yet.</p>
              {!poll.isOpen && <p className="text-secondary mt-4">The poll is currently closed.</p>}
            </div>
          ) : (
            <div className="list-container" style={{ gap: '1.5rem' }}>
              {Object.entries(groupedStudents).map(([pickupPoint, group]) => (
                <div key={pickupPoint} style={{ background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                  <div style={{ padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--glass-border)' }}>
                    <h4 style={{ margin: 0, color: 'var(--accent-color)' }}>
                      📍 {pickupPoint} 
                      <span className="badge badge-neutral" style={{ marginLeft: '1rem' }}>
                        {group.length} {group.length === 1 ? 'Student' : 'Students'}
                      </span>
                    </h4>
                  </div>
                  <div style={{ padding: '0.5rem 0' }}>
                    {group.map(s => (
                      <div key={s.id} style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <strong>{s.name}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="animate-fade-in">
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Register New Student</h3>
            <form onSubmit={handleAddStudent} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ marginBottom: 0, flex: '1 1 200px' }}>
                <label>Student Name</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={e => setNewName(e.target.value)} 
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0, flex: '1 1 200px' }}>
                <label>Pickup Point</label>
                <input 
                  type="text" 
                  value={newPickup} 
                  onChange={e => setNewPickup(e.target.value)} 
                  placeholder="e.g. Main Gate"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ height: '48px', padding: '0 2rem' }}>
                Add
              </button>
            </form>
          </div>

          <h3 style={{ marginBottom: '1rem' }}>All Registered Students</h3>
          <div className="list-container">
            {students.length === 0 ? (
              <p className="text-secondary text-center">No students registered.</p>
            ) : (
              students.map(s => (
                <div key={s.id} className="list-item">
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{s.name}</strong>
                    <span className="text-secondary" style={{ fontSize: '0.9rem' }}>
                      📍 {s.pickupPoint}
                    </span>
                  </div>
                  <button 
                    className="btn btn-outline" 
                    style={{ color: 'var(--danger-color)', padding: '0.5rem 1rem', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                    onClick={() => handleRemoveStudent(s.id)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
