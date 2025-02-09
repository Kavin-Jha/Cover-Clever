import { User } from '../types/User';

const API_URL = "http://localhost:8000"; // Backend API base URL

interface AuthenticatedUser extends User {
  id: string;
  token: string;
}

// Login user
export const loginUser = async (email: string, password: string): Promise<AuthenticatedUser> => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || "Login failed.");
    }
    
    // Get token from Authorization header
    const token = response.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      throw new Error('No token received');
    }

    const data = await response.json();
    
    // Construct authenticated user with data from response
    const user: AuthenticatedUser = {
      id: data.user.id,
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      email: data.user.email,
      token: token,
      medicalConditions: data.user.medicalConditions || {},
      insurancePreferenceExplanation: data.user.insurancePreferenceExplanation || '',
      incomeLevel: data.user.incomeLevel || 0,
      desiredBenefits: data.user.desiredBenefits || []
    };

    // Store token in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    

    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get user profile
export const getProfile = async (token: string): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch profile.");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Get profile error:", error.message);
    throw new Error("Unable to fetch profile. Please ensure you are logged in.");
  }
};

// Update user profile
export const updateProfile = async (token: string, profileData: Partial<User>): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update profile.");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Update profile error:", error.message);
    throw new Error("Unable to update profile. Please try again.");
  }
};

// Logout user
export const logoutUser = (): void => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch (error: any) {
    console.error("Logout error:", error.message);
    throw new Error("Unable to log out. Please try again.");
  }
};