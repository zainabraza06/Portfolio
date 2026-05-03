import api from './axiosInstance';

// ── Auth ──────────────────────────────────────────────────────────
export const loginAdmin = (email: string, password: string) =>
  api.post('/auth/login', { email, password }).then(r => r.data);

export const changePassword = (currentPassword: string, newPassword: string) =>
  api.post('/auth/change-password', { currentPassword, newPassword }).then(r => r.data);

// ── Projects ──────────────────────────────────────────────────────
export const fetchProjects = () => api.get('/projects').then(r => r.data);
export const createProject = (data: FormData | object) => api.post('/projects', data).then(r => r.data);
export const updateProject = (id: string, data: FormData | object) => api.put(`/projects/${id}`, data).then(r => r.data);
export const deleteProject = (id: string) => api.delete(`/projects/${id}`).then(r => r.data);
export const syncProjects = () => api.post('/projects/sync').then(r => r.data);

// ── Experience ────────────────────────────────────────────────────
export const fetchExperience = () => api.get('/experience').then(r => r.data);
export const createExperience = (data: object) => api.post('/experience', data).then(r => r.data);
export const updateExperience = (id: string, data: object) => api.put(`/experience/${id}`, data).then(r => r.data);
export const deleteExperience = (id: string) => api.delete(`/experience/${id}`).then(r => r.data);

// ── Testimonials ──────────────────────────────────────────────────
export const fetchTestimonials = () => api.get('/testimonials').then(r => r.data);
export const fetchAllTestimonials = () => api.get('/testimonials/all').then(r => r.data);
export const createTestimonial = (data: object) => api.post('/testimonials', data).then(r => r.data);
export const updateTestimonial = (id: string, data: object) => api.put(`/testimonials/${id}`, data).then(r => r.data);
export const approveTestimonial = (id: string) => api.patch(`/testimonials/${id}/approve`).then(r => r.data);
export const deleteTestimonial = (id: string) => api.delete(`/testimonials/${id}`).then(r => r.data);

// ── Contact ───────────────────────────────────────────────────────
export const submitContact = (data: object) => api.post('/contact', data).then(r => r.data);
export const fetchMessages = () => api.get('/contact').then(r => r.data);
export const markMessageRead = (id: string) => api.patch(`/contact/${id}/read`).then(r => r.data);
export const deleteMessage = (id: string) => api.delete(`/contact/${id}`).then(r => r.data);

// ── Certificates ──────────────────────────────────────────────────
export const fetchCertificates = () => api.get('/certificates').then(r => r.data);
export const createCertificate = (data: FormData | object) => api.post('/certificates', data).then(r => r.data);
export const updateCertificate = (id: string, data: FormData | object) => api.put(`/certificates/${id}`, data).then(r => r.data);
export const deleteCertificate = (id: string) => api.delete(`/certificates/${id}`).then(r => r.data);

// ── Hackathons ────────────────────────────────────────────────────
export const fetchHackathons = () => api.get('/hackathons').then(r => r.data);
export const createHackathon = (data: FormData | object) => api.post('/hackathons', data).then(r => r.data);
export const updateHackathon = (id: string, data: FormData | object) => api.put(`/hackathons/${id}`, data).then(r => r.data);
export const deleteHackathon = (id: string) => api.delete(`/hackathons/${id}`).then(r => r.data);

// ── Kaggle ────────────────────────────────────────────────────────
export const fetchKaggle = () => api.get('/kaggle').then(r => r.data);
export const createKaggle = (data: FormData | object) => api.post('/kaggle', data).then(r => r.data);
export const updateKaggle = (id: string, data: FormData | object) => api.put(`/kaggle/${id}`, data).then(r => r.data);
export const deleteKaggle = (id: string) => api.delete(`/kaggle/${id}`).then(r => r.data);
