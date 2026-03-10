// A service to fetch data from the backend REST API
const API_BASE_URL = 'http://localhost:5000/api';

const fetchFromApi = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    });
    
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${endpoint}: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
};

export const apiService = {
    // Authentication
    login: (username: string, password: string) => 
        fetchFromApi<{ token: string; user: any }>('/users/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        }),
    
    register: (userData: any) => 
        fetchFromApi<{ token: string; user: any }>('/users/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        }),

    // Users
    getUsers: () => fetchFromApi<any[]>('/users'),
    
    // Education
    getEducationData: (language = 'en', disasterType?: string) => 
        fetchFromApi<any[]>(`/education?language=${language}${disasterType ? `&disasterType=${disasterType}` : ''}`),
    
    getEducationByDisaster: (disasterType: string, language = 'en') => 
        fetchFromApi<any>(`/education/${disasterType}?language=${language}`),
    
    // Hazards
    getHazardsData: () => fetchFromApi<any[]>('/hazards'),
    getHazardsByState: (state: string) => fetchFromApi<any>(`/hazards/${state}`),
    
    // Dashboard
    getDashboardData: () => fetchFromApi<any>('/dashboard'),
    updateDashboardData: (data: any) => 
        fetchFromApi<any>('/dashboard', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    
    // Emergency Contacts
    getEmergencyContacts: () => fetchFromApi<any[]>('/contacts'),
    
    // Videos
    getVideos: (category?: string) => 
        fetchFromApi<any[]>(`/videos${category ? `?category=${category}` : ''}`),
};