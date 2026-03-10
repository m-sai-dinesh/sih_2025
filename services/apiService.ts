// A service to simulate fetching data from a backend API.
const fetchFromApi = async <T>(endpoint: string): Promise<T> => {
    // In a real app, this would be a full URL to your backend server.
    // For this demo, we're fetching from a local JSON file.
    const response = await fetch(`./api${endpoint}`);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${endpoint}: ${response.statusText}`);
    }

    // Add a small artificial delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 300));

    return response.json() as Promise<T>;
};

export const apiService = {
    getUsers: () => fetchFromApi<any[]>('/users.json'),
    getVideos: () => fetchFromApi<any[]>('/videos.json'),
    getEducationData: () => fetchFromApi<any>('/education.json'),
    getHazardsData: () => fetchFromApi<any>('/hazards.json'),
    getEmergencyContacts: () => fetchFromApi<any[]>('/contacts.json'),
    getDashboardData: () => fetchFromApi<any>('/dashboard.json'),
};