import api from './axios.config';

export const createJob = async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
};

export const getMyJobs = async () => {
    const response = await api.get('/jobs/my/jobs');
    return response.data;
};

export const getAllJobs = async (filters = {}) => {
    // Convert filters object to query string params
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/jobs?${params}`);
    return response.data;
};

export const getJobById = async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
};

export const applyForJob = async (id, message) => {
    const response = await api.post(`/jobs/${id}/apply`, { message });
    return response.data;
};

export const getJobApplications = async (jobId) => {
    const response = await api.get(`/jobs/${jobId}/applications`);
    return response.data;
};
export const updateApplicationStatus = async (applicationId, status) => {
    const response = await api.patch(`/jobs/applications/${applicationId}/status`, { status });
    return response.data;
};
