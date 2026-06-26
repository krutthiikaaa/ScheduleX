const API_URL = 'http://localhost:5000/api';

export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Registration failed');
  }
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Login failed');
  }
  return res.json();
};

export const fetchAssignments = () => fetch(`${API_URL}/assignments`).then(res => res.json());
export const createAssignment = (data) => fetch(`${API_URL}/assignments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(res => res.json());
export const updateAssignment = (id, data) => fetch(`${API_URL}/assignments/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(res => res.json());
export const deleteAssignment = (id) => fetch(`${API_URL}/assignments/${id}`, { method: 'DELETE' }).then(res => res.json());

export const fetchResources = () => fetch(`${API_URL}/resources`).then(res => res.json());
export const createResource = (data) => fetch(`${API_URL}/resources`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(res => res.json());
export const updateResource = (id, data) => fetch(`${API_URL}/resources/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(res => res.json());
export const deleteResource = (id) => fetch(`${API_URL}/resources/${id}`, { method: 'DELETE' }).then(res => res.json());

export const fetchTasks = () => fetch(`${API_URL}/tasks`).then(res => res.json());
export const createTask = (data) => fetch(`${API_URL}/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(res => res.json());
export const updateTask = (id, data) => fetch(`${API_URL}/tasks/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(res => res.json());
export const deleteTask = (id) => fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' }).then(res => res.json());

export const fetchFocusSessions = () => fetch(`${API_URL}/focus-sessions`).then(res => res.json());
export const createFocusSession = (data) => fetch(`${API_URL}/focus-sessions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(res => res.json());

export const fetchStudySessions = () => fetch(`${API_URL}/study-sessions`).then(res => res.json());
export const createStudySession = (data) => fetch(`${API_URL}/study-sessions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(res => res.json());
export const updateStudySession = (id, data) => fetch(`${API_URL}/study-sessions/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(res => res.json());
export const deleteStudySession = (id) => fetch(`${API_URL}/study-sessions/${id}`, { method: 'DELETE' }).then(res => res.json());

export const fetchTimetableEvents = () => fetch(`${API_URL}/timetable`).then(res => res.json());
export const createTimetableEvent = (data) => fetch(`${API_URL}/timetable`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(res => res.json());
export const deleteTimetableEvent = (id) => fetch(`${API_URL}/timetable/${id}`, { method: 'DELETE' }).then(res => res.json());
