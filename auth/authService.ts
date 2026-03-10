import { User, UserRole } from '../types';
import { apiService } from '../services/apiService';

const USER_SESSION_KEY = 'edu_disaster_user';
const USERS_DB_KEY = 'edu_disaster_users_db';

// --- User Database (CRUD) Simulation with localStorage and API seeding ---

const initializeUsers = async (): Promise<(User & { password?: string })[]> => {
    const usersJson = localStorage.getItem(USERS_DB_KEY);
    if (usersJson) {
        try {
            return JSON.parse(usersJson);
        } catch (e) {
            console.error("Failed to parse users from local storage", e);
        }
    }
    
    // If local storage is empty or corrupt, seed it from the API
    const initialUsers = await apiService.getUsers();
    if (initialUsers) {
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(initialUsers));
        return initialUsers;
    }
    
    return [];
};


const getUsers = async (): Promise<(User & { password?: string })[]> => {
    const users = localStorage.getItem(USERS_DB_KEY);
    if (!users) {
      return await initializeUsers();
    }
    return JSON.parse(users);
};

const saveUsers = (users: (User & { password?: string })[]): void => {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
};

// Initialize on load
initializeUsers();

// --- Authentication Functions ---

export const login = async (role: UserRole, username: string, password: string): Promise<User | null> => {
  const users = await getUsers();
  const user = users.find(u => u.role === role && u.username.toLowerCase() === username.toLowerCase() && u.password === password);
  
  if (user) {
    const { password, ...userToStore } = user;
    sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(userToStore));
    return userToStore as User;
  }
  
  return null;
};

interface RegisterData {
    username: string;
    role: UserRole;
    password?: string;
}

export const register = async (data: RegisterData): Promise<{ success: boolean, message: string }> => {
    const users = await getUsers();
    
    if (users.some(u => u.username.toLowerCase() === data.username.toLowerCase())) {
        return { success: false, message: 'Username already exists. Please choose another one.' };
    }

    const newUser = {
        id: String(Date.now()),
        username: data.username,
        role: data.role,
        password: data.password,
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);

    return { success: true, message: 'Account created successfully! You can now log in.' };
};


export const logout = (): void => {
  sessionStorage.removeItem(USER_SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
  const userJson = sessionStorage.getItem(USER_SESSION_KEY);
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch (e) {
      console.error("Failed to parse user from session storage", e);
      return null;
    }
  }
  return null;
};