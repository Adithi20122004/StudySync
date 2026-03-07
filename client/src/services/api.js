const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getToken   = () => localStorage.getItem('token');
export const setToken   = (t) => localStorage.setItem('token', t);
export const removeToken = () => localStorage.removeItem('token');

async function request(endpoint, options = {}) {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };
  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  if (response.status === 401) { console.warn("Unauthorized"); return; }
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export const authAPI = {
  register: (userData)    => request('/auth/register', { method:'POST', body:JSON.stringify(userData) }),
  login:    (credentials) => request('/auth/login',    { method:'POST', body:JSON.stringify(credentials) }),
  logout:   ()            => request('/auth/logout',   { method:'POST' }),
  getMe:    ()            => request('/auth/me'),
};

export const tasksAPI = {
  getAll:       (params='') => request(`/tasks${params}`),
  getOne:       (id)        => request(`/tasks/${id}`),
  create:       (data)      => request('/tasks',              { method:'POST',   body:JSON.stringify(data) }),
  update:       (id, data)  => request(`/tasks/${id}`,        { method:'PUT',    body:JSON.stringify(data) }),
  delete:       (id)        => request(`/tasks/${id}`,        { method:'DELETE' }),
  updateStatus: (id, status)=> request(`/tasks/${id}/status`, { method:'PATCH',  body:JSON.stringify({ status }) }),
};

export const dashboardAPI = {
  getStats:    () => request('/dashboard/stats'),
  getTimeline: () => request('/dashboard/timeline'),
  getWorkload: () => request('/dashboard/workload'),
};

export const groupsAPI = {
  getAll:     ()                 => request('/groups'),
  getOne:     (id)               => request(`/groups/${id}`),
  create:     (data)             => request('/groups',                       { method:'POST',   body:JSON.stringify(data) }),
  delete:     (id)               => request(`/groups/${id}`,                 { method:'DELETE' }),
  addMember:  (id, email)        => request(`/groups/${id}/members`,         { method:'POST',   body:JSON.stringify({ email }) }),
  addTask:    (id, data)         => request(`/groups/${id}/tasks`,           { method:'POST',   body:JSON.stringify(data) }),
  updateTask: (id, taskId, data) => request(`/groups/${id}/tasks/${taskId}`, { method:'PATCH',  body:JSON.stringify(data) }),
};

export const resourcesAPI = {
  getAll:  ()     => request('/resources'),
  create:  (data) => request('/resources',       { method:'POST',   body:JSON.stringify(data) }),
  delete:  (id)   => request(`/resources/${id}`, { method:'DELETE' }),
};

export default { authAPI, tasksAPI, dashboardAPI, groupsAPI, resourcesAPI };