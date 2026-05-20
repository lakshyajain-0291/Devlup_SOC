import axios from 'axios';

// Create an Axios instance pointing to the FastAPI backend
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach JWT token to admin requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor to detect expired tokens (401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes('/auth/google') &&
      !error.config?.url?.includes('/login')
    ) {
      // Dispatch a custom event so the UI can show a popup and auto-logout
      window.dispatchEvent(new CustomEvent('session-expired'));
    }
    return Promise.reject(error);
  }
);

export interface ApplicationPayload {
  mentee_name: string;
  mentee_roll_number: string;
  mentee_github_id: string;
  mentee_email_id: string;
  mentee_proposal_url: string;
  project_name_1: string;
  project_name_2?: string;
  [key: string]: any;
}

// Function to log in and get JWT token
export const adminLogin = async (username: string, password: string) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await apiClient.post('/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Function to log in with Google ID token
export const googleLogin = async (token: string) => {
  try {
    const response = await apiClient.post('/auth/google', { token });
    return response.data;
  } catch (error) {
    console.error("Error logging in with Google:", error);
    throw error;
  }
};

// Function to fetch the current user's profile
export const fetchCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

// Function to submit an application to the FastAPI backend
export const submitApplication = async (data: ApplicationPayload) => {
  try {
    const response = await apiClient.post('/applications', data);
    return response.data;
  } catch (error) {
    console.error("Error submitting application:", error);
    throw error;
  }
};

// Function to fetch the current user's own application
export const fetchMyApplication = async () => {
  try {
    const response = await apiClient.get('/applications/me');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null; // No application found
    }
    console.error("Error fetching my application:", error);
    throw error;
  }
};

// Function to update the current user's own application
export const updateMyApplication = async (data: Partial<ApplicationPayload>) => {
  try {
    const response = await apiClient.put('/applications/me', data);
    return response.data;
  } catch (error) {
    console.error("Error updating my application:", error);
    throw error;
  }
};

// Function to fetch the application deadline info
export const fetchDeadlineInfo = async () => {
  try {
    const response = await apiClient.get('/applications/deadline/info');
    return response.data;
  } catch (error) {
    console.error("Error fetching deadline info:", error);
    throw error;
  }
};

// ===========================
// ADMIN: Projects CRUD
// ===========================
export const fetchProjects = async (params?: { year?: number; status?: string; type?: string; approval_status?: string }) => {
  const response = await apiClient.get('/projects', { params });
  return response.data;
};

export const submitProject = async (data: any) => {
  const response = await apiClient.post('/projects/submit', data);
  return response.data;
};

export const createProject = async (data: any) => {
  const response = await apiClient.post('/projects', data);
  return response.data;
};

export const updateProject = async (id: string, data: any) => {
  const response = await apiClient.put(`/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: string) => {
  const response = await apiClient.delete(`/projects/${id}`);
  return response.data;
};

// ===========================
// ADMIN: Applications CRUD
// ===========================
export const fetchApplications = async () => {
  const response = await apiClient.get('/applications');
  return response.data;
};

export const updateApplication = async (id: string, data: any) => {
  const response = await apiClient.put(`/applications/${id}`, data);
  return response.data;
};

export const deleteApplication = async (id: string) => {
  const response = await apiClient.delete(`/applications/${id}`);
  return response.data;
};

// ===========================
// ADMIN: Mentors CRUD
// ===========================
export const fetchMentors = async () => {
  const response = await apiClient.get('/mentors');
  return response.data;
};

export const createMentor = async (data: any) => {
  const response = await apiClient.post('/mentors', data);
  return response.data;
};

export const updateMentor = async (id: string, data: any) => {
  const response = await apiClient.put(`/mentors/${id}`, data);
  return response.data;
};

export const deleteMentor = async (id: string) => {
  const response = await apiClient.delete(`/mentors/${id}`);
  return response.data;
};

// ===========================
// ADMIN: Timeline CRUD
// ===========================
export const fetchTimelines = async () => {
  const response = await apiClient.get('/timeline');
  return response.data;
};

export const createTimeline = async (data: any) => {
  const response = await apiClient.post('/timeline', data);
  return response.data;
};

export const updateTimeline = async (id: string, data: any) => {
  const response = await apiClient.put(`/timeline/${id}`, data);
  return response.data;
};

export const deleteTimeline = async (id: string) => {
  const response = await apiClient.delete(`/timeline/${id}`);
  return response.data;
};

// ===========================
// ADMIN: Form Fields CRUD
// ===========================
export const fetchFormFields = async () => {
  const response = await apiClient.get('/form-fields');
  return response.data;
};

export const createFormField = async (data: any) => {
  const response = await apiClient.post('/form-fields', data);
  return response.data;
};

export const updateFormField = async (id: string, data: any) => {
  const response = await apiClient.put(`/form-fields/${id}`, data);
  return response.data;
};

export const deleteFormField = async (id: string) => {
  const response = await apiClient.delete(`/form-fields/${id}`);
  return response.data;
};

// ===========================
// MENTOR PANEL APIs
// ===========================
export const fetchMentorProjects = async () => {
  const response = await apiClient.get('/mentor/projects');
  return response.data;
};

export const fetchMentorApplications = async () => {
  const response = await apiClient.get('/mentor/applications');
  return response.data;
};

export const updateMentorApplicationStatus = async (id: string, data: any) => {
  const response = await apiClient.put(`/mentor/applications/${id}`, data);
  return response.data;
};

export const fetchResultsSetting = async () => {
  const response = await apiClient.get('/settings/show_results');
  return response.data;
};

export const updateResultsSetting = async (value: boolean) => {
  const response = await apiClient.post('/settings/show_results', { value });
  return response.data;
};

export const fetchResults = async () => {
  const response = await apiClient.get('/results');
  return response.data;
};

export default apiClient;
