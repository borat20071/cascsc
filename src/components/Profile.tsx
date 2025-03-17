import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Key, Shield } from 'lucide-react';

function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Validate passwords if changing
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        setIsLoading(false);
        return;
      }
      if (!formData.currentPassword) {
        setError('Current password is required to change password');
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully');
      setIsEditing(false);
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Please log in to view your profile</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-md">
            {success}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Name
                </div>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Email
                </div>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Change Password</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center">
                      <Key className="w-5 h-5 mr-2" />
                      Current Password
                    </div>
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setError(null);
                  setSuccess(null);
                  setFormData({
                    name: user.name,
                    email: user.email,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-2">
                <User className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</span>
              </div>
              <p className="text-lg text-gray-900 dark:text-white">{user.name}</p>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <Mail className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</span>
              </div>
              <p className="text-lg text-gray-900 dark:text-white">{user.email}</p>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <Shield className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</span>
              </div>
              <p className="text-lg text-gray-900 dark:text-white capitalize">{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { Profile };