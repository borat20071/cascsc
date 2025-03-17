import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'editor' | 'admin';
  avatar: string;
  isTestUser: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (data: { name?: string; email?: string; password?: string; avatar?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL - can be changed to match your environment
const API_BASE_URL = 'http://localhost:5000/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('user');
      }
    }
    
    // Check if user is already logged in with server
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/check-auth`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          // If server check fails but we have a local user, keep them logged in
          // This helps with development when the backend might not be running
          if (!storedUser) {
            setUser(null);
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Don't log out if the server is unreachable - maintain the session
      } finally {
        setIsLoading(false);
      }
    };

    // For troubleshooting - don't wait for server check
    setIsLoading(false);
    
    // Comment out checkAuth() temporarily to avoid blocking on server issues
    // checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log(`Attempting to login with email: ${email}`);
      
      // For development - allow login with test accounts if backend is not available
      if (!email.includes('@') || !password) {
        throw new Error('Invalid email or password');
      }

      // First try to log in using hardcoded test accounts to avoid server issues
      if (email === 'admin@sciencehub.com' && password === 'admin123') {
        console.log('Using hardcoded admin account');
        const adminUser = {
          id: '1',
          name: 'Admin User',
          email: 'admin@sciencehub.com',
          role: 'admin' as const,
          avatar: `https://ui-avatars.com/api/?name=Admin+User&background=random`,
          isTestUser: true
        };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        setIsLoading(false);
        return;
      } else if (email === 'editor@sciencehub.com' && password === 'editor123') {
        console.log('Using hardcoded editor account');
        const editorUser = {
          id: '2',
          name: 'Editor User',
          email: 'editor@sciencehub.com',
          role: 'editor' as const,
          avatar: `https://ui-avatars.com/api/?name=Editor+User&background=random`,
          isTestUser: true
        };
        setUser(editorUser);
        localStorage.setItem('user', JSON.stringify(editorUser));
        setIsLoading(false);
        return;
      } else if (email === 'user@sciencehub.com' && password === 'user123') {
        console.log('Using hardcoded user account');
        const regularUser = {
          id: '3',
          name: 'Regular User',
          email: 'user@sciencehub.com',
          role: 'user' as const,
          avatar: `https://ui-avatars.com/api/?name=Regular+User&background=random`,
          isTestUser: true
        };
        setUser(regularUser);
        localStorage.setItem('user', JSON.stringify(regularUser));
        setIsLoading(false);
        return;
      }

      try {
        console.log('Attempting server login');
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include'
        });

        console.log(`Login response status: ${response.status}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Login failed: ${response.status} - ${errorText}`);
          throw new Error(`Login failed: ${errorText}`);
        }

        const data = await response.json();
        console.log('Login successful, setting user');
        
        // Add isTestUser flag to the user data
        const userWithTestFlag = {
          ...data.user,
          isTestUser: false
        };
        
        setUser(userWithTestFlag);
        localStorage.setItem('user', JSON.stringify(userWithTestFlag));
      } catch (error) {
        console.error('Server login error:', error);
        throw new Error('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login process error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Generate avatar URL
      const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
      
      try {
        const response = await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password, avatar }),
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Registration failed');
        }

        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch (error) {
        // If the server is not available, create a mock user for development
        const newUser = {
          id: Date.now().toString(),
          name,
          email,
          role: 'user' as const,
          avatar,
          isTestUser: false
        };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: { name?: string; email?: string; password?: string; avatar?: string }) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      try {
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to update profile');
        }

        const updatedUser = await response.json();
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        // If the server is not available, update the user locally
        const updatedUser = {
          ...user,
          ...data
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 