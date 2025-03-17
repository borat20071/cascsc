import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';
import { ArrowLeft, Save, AlertCircle, AlertTriangle } from 'lucide-react';

interface UserFormProps {
  mode: 'add' | 'edit';
}

// Mock user for editing when API is not available
const MOCK_EDIT_USER = {
  id: '1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin' as const,
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150',
  joinDate: '2023-01-15'
};

export function UserForm({ mode }: UserFormProps) {
  const { userId } = useParams<{ userId: string }>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'editor' | 'admin'>('user');
  const [avatar, setAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [error, setError] = useState<string | null>(null);
  const [apiMissing, setApiMissing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (mode === 'edit' && userId) {
      // Fetch user data for editing
      const fetchUser = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            credentials: 'include',
            headers: user ? { 'X-User-ID': user.id } : {}
          });

          if (response.status === 404) {
            console.warn('API endpoint /api/users not found. Using mock data instead.');
            // Use mock data if API is missing
            setName(MOCK_EDIT_USER.name);
            setEmail(MOCK_EDIT_USER.email);
            setRole(MOCK_EDIT_USER.role);
            setAvatar(MOCK_EDIT_USER.avatar || '');
            setApiMissing(true);
          } else if (!response.ok) {
            throw new Error('Failed to fetch user data');
          } else {
            const userData = await response.json();
            setName(userData.name);
            setEmail(userData.email);
            setRole(userData.role);
            setAvatar(userData.avatar || '');
          }
        } catch (err) {
          console.error('Error fetching user:', err);
          
          // If it's a network error, likely the API is missing
          if (err instanceof Error && err.message.includes('Failed to fetch')) {
            console.warn('API endpoint seems to be missing. Using mock data.');
            setName(MOCK_EDIT_USER.name);
            setEmail(MOCK_EDIT_USER.email);
            setRole(MOCK_EDIT_USER.role);
            setAvatar(MOCK_EDIT_USER.avatar || '');
            setApiMissing(true);
          } else {
            setError(err instanceof Error ? err.message : 'An error occurred');
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchUser();
    } else if (mode === 'add') {
      // Check if the users API endpoint exists
      fetch(`${API_BASE_URL}/users`, {
        method: 'HEAD',
        credentials: 'include',
        headers: user ? { 'X-User-ID': user.id } : {}
      })
      .catch(() => {
        setApiMissing(true);
      });
    }
  }, [userId, mode, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (apiMissing) {
      alert('API endpoint for user management is not available. Cannot save changes.');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const userData = {
        name,
        email,
        password: password || undefined, // Only include password if it's set
        role,
        avatar: avatar || undefined
      };

      const url = mode === 'add' 
        ? `${API_BASE_URL}/users` 
        : `${API_BASE_URL}/users/${userId}`;
      
      const method = mode === 'add' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { 'X-User-ID': user.id } : {})
        },
        credentials: 'include',
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save user');
      }

      // Navigate back to admin panel on success
      navigate('/admin');
    } catch (err) {
      console.error('Error saving user:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && mode === 'edit') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {mode === 'add' ? 'Add New User' : 'Edit User'}
          </h1>
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Admin Panel
          </button>
        </div>

        {apiMissing && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">API Endpoint Missing</h3>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                The API endpoint for user management does not exist. This form is for demonstration only and changes will not be saved.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <span className="text-red-800 dark:text-red-300">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {mode === 'add' ? 'Password *' : 'Password (leave blank to keep current)'}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required={mode === 'add' && !apiMissing}
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role *
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'user' | 'editor' | 'admin')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            >
              <option value="user">User</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Avatar URL
            </label>
            <input
              type="url"
              id="avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="https://example.com/avatar.jpg"
            />
            {avatar && (
              <div className="mt-2 flex items-center">
                <img src={avatar} alt="Avatar preview" className="h-10 w-10 rounded-full mr-2" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Preview</span>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`
                flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors
                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : apiMissing ? 'Continue (Demo)' : 'Save User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 