import { initialStudents, initialPollState } from './mockData';

// Helper to notify other components in the same tab
const notifyUpdate = () => {
  window.dispatchEvent(new Event('appDataChanged'));
};

const getStoredStudents = () => {
  const stored = localStorage.getItem('bus_students');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('bus_students', JSON.stringify(initialStudents));
  return initialStudents;
};

const getStoredPoll = () => {
  const stored = localStorage.getItem('bus_poll');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('bus_poll', JSON.stringify(initialPollState));
  return initialPollState;
};

export const fetchStudents = async () => {
  return getStoredStudents();
};

export const fetchPollState = async () => {
  return getStoredPoll();
};

export const updatePollState = async (isOpen) => {
  const state = { isOpen };
  localStorage.setItem('bus_poll', JSON.stringify(state));
  notifyUpdate();
  return state;
};

export const addStudent = async (student) => {
  const students = getStoredStudents();
  const newStudent = { ...student, id: Date.now().toString(), status: 'pending' };
  students.push(newStudent);
  localStorage.setItem('bus_students', JSON.stringify(students));
  notifyUpdate();
  return newStudent;
};

export const removeStudent = async (id) => {
  const students = getStoredStudents();
  const updated = students.filter(s => s.id !== id);
  localStorage.setItem('bus_students', JSON.stringify(updated));
  notifyUpdate();
  return id;
};

export const updateStudentStatus = async (id, status) => {
  const students = getStoredStudents();
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    students[index].status = status;
    localStorage.setItem('bus_students', JSON.stringify(students));
    notifyUpdate();
  }
  return students[index];
};

// Listen for updates from other tabs
window.addEventListener('storage', (e) => {
  if (e.key === 'bus_students' || e.key === 'bus_poll') {
    notifyUpdate();
  }
});
