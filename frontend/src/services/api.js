import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

export const toStudent = (student) => ({
  ...student,
  id: student.studentId,
  dept: student.department,
});

export const studentApi = {
  list: async () => (await api.get('/students')).data.map(toStudent),
  create: async (data) => toStudent((await api.post('/students', data)).data),
  login: async (email, password) => toStudent((await api.post('/students/login', { email, password })).data),
  update: async (id, data) => toStudent((await api.patch(`/students/${id}`, data)).data),
};

export const paymentApi = {
  list: async () => (await api.get('/payments')).data,
  create: async (data) => (await api.post('/payments', data)).data,
};

export const feeApi = {
  list: async () => (await api.get('/fees')).data,
};

export default api;
