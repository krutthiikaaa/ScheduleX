const API_URL = import.meta.env.DEV ? '/api' : `${import.meta.env.VITE_API_URL}/api`;
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('schedulex_token') || ''}`
});

export const fetchDashboard = async () => {
  const res = await fetch(`${API_URL}/dashboard`, { headers: getAuthHeaders() });
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

export const fetchAuthMe = async () => {
  const res = await fetch(`${API_URL}/auth/me`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
};

export const logoutUser = async () => {
  return fetch(`${API_URL}/auth/logout`, { method: 'POST', headers: getAuthHeaders() }).catch(() => {});
};


export const fetchCourses = () => fetch(`${API_URL}/courses`, { headers: getAuthHeaders() }).then(res => res.json());
export const createCourse = (data) => fetch(`${API_URL}/courses`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(res => res.json());
export const updateCourse = (id, data) => fetch(`${API_URL}/courses/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(res => res.json());
export const deleteCourse = (id) => fetch(`${API_URL}/courses/${id}`, { method: 'DELETE', headers: getAuthHeaders() }).then(res => res.json());

export const fetchAssignments = () => fetch(`${API_URL}/assignments`, { headers: getAuthHeaders() }).then(res => res.json()).then(res => res.data || res || []);
export const createAssignment = (data) => fetch(`${API_URL}/assignments`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(res => res.json()).then(res => res.data || res);
export const updateAssignment = (id, data) => fetch(`${API_URL}/assignments/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(res => res.json()).then(res => res.data || res);
export const deleteAssignment = (id) => fetch(`${API_URL}/assignments/${id}`, { method: 'DELETE', headers: getAuthHeaders() }).then(res => res.json()).then(res => res.data || res);

export const fetchResources = () => fetch(`${API_URL}/resources`, { headers: getAuthHeaders() }).then(res => res.json());
export const createResource = (data) => fetch(`${API_URL}/resources`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(res => res.json());
export const updateResource = (id, data) => fetch(`${API_URL}/resources/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(res => res.json());
export const deleteResource = (id) => fetch(`${API_URL}/resources/${id}`, { method: 'DELETE', headers: getAuthHeaders() }).then(res => res.json());

export const fetchTasks = () => fetch(`${API_URL}/tasks`, { headers: getAuthHeaders() }).then(res => res.json()).then(res => res.data || res || []);
export const createTask = (data) => fetch(`${API_URL}/tasks`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(res => res.json()).then(res => res.data || res);
export const updateTask = (id, data) => fetch(`${API_URL}/tasks/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(res => res.json()).then(res => res.data || res);
export const deleteTask = (id) => fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE', headers: getAuthHeaders() }).then(res => res.json()).then(res => res.data || res);

export const fetchFocusSessions = () => fetch(`${API_URL}/focus-sessions`, { headers: getAuthHeaders() }).then(res => res.json()).then(res => res.data || res || []);
export const createFocusSession = (data) => fetch(`${API_URL}/focus-sessions`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(res => res.json()).then(res => res.data || res);

export const fetchStudySessions = () => fetch(`${API_URL}/study-sessions`, { headers: getAuthHeaders() }).then(res => res.json()).then(res => res.data || res || []);
export const createStudySession = (data) => fetch(`${API_URL}/study-sessions`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(res => res.json()).then(res => res.data || res);
export const updateStudySession = (id, data) => fetch(`${API_URL}/study-sessions/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(res => res.json()).then(res => res.data || res);
export const deleteStudySession = (id) => fetch(`${API_URL}/study-sessions/${id}`, { method: 'DELETE', headers: getAuthHeaders() }).then(res => res.json()).then(res => res.data || res);

export const fetchTimetableEvents = () => fetch(`${API_URL}/timetable`, { headers: getAuthHeaders() }).then(res => res.json()).then(res => res.data || res || []);
export const createTimetableEvent = (data) => fetch(`${API_URL}/timetable`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(res => res.json());
export const updateTimetableEvent = (id, data) => fetch(`${API_URL}/timetable/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(res => res.json());
export const deleteTimetableEvent = (id) => fetch(`${API_URL}/timetable/${id}`, { method: 'DELETE', headers: getAuthHeaders() }).then(res => res.json());

export const fetchHabits = () => fetch(`${API_URL}/habits`, { headers: getAuthHeaders() }).then(res => res.json()).then(res => res.data || res || []);
export const createHabit = (data) => fetch(`${API_URL}/habits`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(res => res.json()).then(res => res.data || res);
export const updateHabitApi = (id, data) => fetch(`${API_URL}/habits/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(res => res.json()).then(res => res.data || res);
export const deleteHabitApi = (id) => fetch(`${API_URL}/habits/${id}`, { method: 'DELETE', headers: getAuthHeaders() }).then(res => res.json());

export const fetchGoals = () => fetch(`${API_URL}/goals`, { headers: getAuthHeaders() }).then(res => res.json()).then(res => res.data || res || []);
export const createGoal = (data) => fetch(`${API_URL}/goals`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(res => res.json()).then(res => res.data || res);
export const updateGoalApi = (id, data) => fetch(`${API_URL}/goals/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(res => res.json()).then(res => res.data || res);
export const deleteGoalApi = (id) => fetch(`${API_URL}/goals/${id}`, { method: 'DELETE', headers: getAuthHeaders() }).then(res => res.json());

export const fetchProfile = async () => {
  const res = await fetch(`${API_URL}/profile`, { headers: getAuthHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to fetch profile');
  return json.data;
};

export const updateProfileApi = async (data) => {
  const res = await fetch(`${API_URL}/profile`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update profile');
  return json.data;
};

export const changePasswordApi = async (data) => {
  const res = await fetch(`${API_URL}/profile/password`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to change password');
  return json;
};

export const resetPasswordApi = async () => {
  const res = await fetch(`${API_URL}/profile/reset-password`, { method: 'POST', headers: getAuthHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to reset password');
  return json;
};

export const exportUserDataApi = async () => {
  const res = await fetch(`${API_URL}/profile/export`, { headers: getAuthHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to export data');
  return json.data;
};
