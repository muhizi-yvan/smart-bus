import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({ baseURL: BASE_URL })

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authService = {
  register: (data) => api.post('/api/users/register', data),
  login:    (data) => api.post('/api/users/login', data),
  getProfile: ()   => api.get('/api/users/profile'),
}

export const busService = {
  getAll:      (params) => api.get('/api/buses', { params }),
  getById:     (id)     => api.get(`/api/buses/${id}`),
  create:      (data)   => api.post('/api/buses', data),
  update:      (id, data) => api.put(`/api/buses/${id}`, data),
  delete:      (id)     => api.delete(`/api/buses/${id}`),
  updateStatus:(id, status) => api.put(`/api/buses/${id}`, { status }),
}

export const ticketService = {
  book:       (data)   => api.post('/api/tickets', data),
  getAll:     ()       => api.get('/api/tickets'),
  getUserTickets: (userId) => api.get(`/api/tickets/user/${userId}`),
}

export default api
