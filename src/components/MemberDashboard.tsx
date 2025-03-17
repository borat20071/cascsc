import React, { useState, useEffect } from 'react';
import { FileText, CalendarDays, Clock, Eye, Edit2, Trash2, Plus, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import type { Event, BlogPost } from '../types';

function EditorDashboard() {
  const [activeTab, setActiveTab] = useState('content');
  const [events, setEvents] = useState<Event[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch events
        const eventsResponse = await fetch(`${API_BASE_URL}/events`, {
          credentials: 'include',
          headers: user?.isTestUser ? { 'X-User-ID': user.id } : {}
        });
        
        if (!eventsResponse.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);
        
        // Fetch blog posts
        const postsResponse = await fetch(`${API_BASE_URL}/blog`, {
          credentials: 'include',
          headers: user?.isTestUser ? { 'X-User-ID': user.id } : {}
        });
        
        if (!postsResponse.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        
        const postsData = await postsResponse.json();
        setBlogPosts(postsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [user]);

  const goToCreateBlog = () => {
    navigate('/create-blog');
  };

  const confirmDeletePost = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      // Delete post logic
      console.log(`Deleting post ${postId}`);
      // Call API endpoint to delete post
      // Then refresh list
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error Loading Data</h2>
            <p className="text-gray-500 dark:text-gray-400">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'content', name: 'My Content', icon: FileText },
              { id: 'events', name: 'Events', icon: CalendarDays },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                    transition-colors duration-200
                    ${activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
      </div>

        <div className="p-6">
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Content Management</h2>
                <button 
                  onClick={goToCreateBlog}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Blog Post</span>
                </button>
              </div>

              {blogPosts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Blog Posts</h3>
                  <p className="text-gray-500 dark:text-gray-400">You have not created any blog posts yet. Create one to get started.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Recent Posts */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Your Recent Posts</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {blogPosts.filter(post => post.author.id === user?.id).map(post => (
                            <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                              <td className="px-6 py-4">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{post.title}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {new Date(post.publishedAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                                  Published
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex space-x-2">
                                  <Link to={`/blog/${post.id}`} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors">
                                    <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                  </Link>
                                  <Link to={`/blog/${post.id}?edit=true`} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors">
                                    <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                  </Link>
                                  <button 
                                    onClick={() => confirmDeletePost(post.id)}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Content Analytics */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Content Stats</h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Posts</p>
                        <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                          {blogPosts.filter(post => post.author.id === user?.id).length}
                        </p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Recent Activity</p>
                        <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                          {blogPosts.filter(post => 
                            post.author.id === user?.id && 
                            new Date(post.publishedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                          ).length}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last 30 days</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Reading Time</p>
                        <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                          {Math.round(blogPosts
                            .filter(post => post.author.id === user?.id)
                            .reduce((avg, post) => avg + parseInt(post.readTime.split(' ')[0], 10), 0) / 
                            Math.max(1, blogPosts.filter(post => post.author.id === user?.id).length)
                          )} min
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Events</h2>
                <Link
                  to="/calendar"
                  className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
                >
                  View Calendar →
                </Link>
        </div>

              {events.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Events</h3>
                  <p className="text-gray-500 dark:text-gray-400">There are no events scheduled.</p>
                </div>
              ) : (
          <div className="space-y-4">
                  {events.map(event => (
                    <div
                      key={event.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="bg-indigo-100 dark:bg-indigo-900 rounded-md p-2 text-center min-w-[60px]">
                            <div className="text-xs text-indigo-800 dark:text-indigo-300 uppercase font-semibold">
                              {new Date(event.date).toLocaleString('default', { month: 'short' })}
                            </div>
                            <div className="text-xl font-bold text-indigo-800 dark:text-indigo-300">
                              {new Date(event.date).getDate()}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{event.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{event.description}</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                </div>
              </div>
            ))}
          </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { EditorDashboard };