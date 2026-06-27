const API_URL = 'http://localhost:5000/api';

export const fetchDashboard = async () => {
  const res = await fetch(`${API_URL}/dashboard`);
  const json = await res.json();
  return json.data;
};

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

export const fetchCourses = () => fetch(`${API_URL}/courses`).then(res => res.json());
export const createCourse = (data) => fetch(`${API_URL}/courses`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(res => res.json());
export const updateCourse = (id, data) => fetch(`${API_URL}/courses/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(res => res.json());
export const deleteCourse = (id) => fetch(`${API_URL}/courses/${id}`, { method: 'DELETE' }).then(res => res.json());

export const fetchAssignments = () => fetch(`${API_URL}/assignments`).then(res => res.json()).then(res => res.data || res || []);
export const createAssignment = (data) => fetch(`${API_URL}/assignments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(res => res.json()).then(res => res.data || res);
export const updateAssignment = (id, data) => fetch(`${API_URL}/assignments/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(res => res.json()).then(res => res.data || res);
export const deleteAssignment = (id) => fetch(`${API_URL}/assignments/${id}`, { method: 'DELETE' }).then(res => res.json()).then(res => res.data || res);

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

export const fetchTimetableEvents = () => fetch(`${API_URL}/timetable`).then(res => res.json()).then(res => res.data || res || []);
export const createTimetableEvent = (data) => fetch(`${API_URL}/timetable`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(res => res.json());
export const updateTimetableEvent = (id, data) => fetch(`${API_URL}/timetable/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(res => res.json());
export const deleteTimetableEvent = (id) => fetch(`${API_URL}/timetable/${id}`, { method: 'DELETE' }).then(res => res.json());
