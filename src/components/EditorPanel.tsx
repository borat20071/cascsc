import React, { useState, useEffect } from 'react';
import { CalendarDays, MessageSquare, FileText, Plus, Edit2, Trash2, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import type { Event, BlogPost } from '../types';

function EditorPanel() {
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
          headers: user ? { 'X-User-ID': user.id } : {}
        });
        
        if (!eventsResponse.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);
        
        // Fetch blog posts
        const postsResponse = await fetch(`${API_BASE_URL}/blog`, {
          credentials: 'include',
          headers: user ? { 'X-User-ID': user.id } : {}
        });
        
        if (!postsResponse.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        
        const postsData = await postsResponse.json();
        setBlogPosts(postsData);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [user]);

  const goToCreateBlog = () => {
    navigate('/create-blog');
  };

  const goToCreateEvent = () => {
    navigate('/editor/create-event');
  };

  const confirmDeleteEvent = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      // Delete event logic
      console.log(`Deleting event ${eventId}`);
      // Call API endpoint to delete event
      // Then refresh list
    }
  };

  const confirmDeletePost = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      // Delete post logic
      console.log(`Deleting post ${postId}`);
      // Call API endpoint to delete post
      // Then refresh list
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Editor Dashboard</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex items-center px-6 py-3 text-sm font-medium ${
              activeTab === 'content'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('content')}
          >
            <FileText className="w-5 h-5 mr-2" />
            Content Management
          </button>
          <button
            className={`flex items-center px-6 py-3 text-sm font-medium ${
              activeTab === 'events'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('events')}
          >
            <CalendarDays className="w-5 h-5 mr-2" />
            Upcoming Events
          </button>
          <button
            className={`flex items-center px-6 py-3 text-sm font-medium ${
              activeTab === 'forum'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('forum')}
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Forum Activity
          </button>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading data...</p>
            </div>
          ) : (
            <>
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
                      <p className="text-gray-500 dark:text-gray-400">There are no blog posts yet. Create one to get started.</p>
                    </div>
                  ) : (
                    <div>
                      {/* Content Analytics */}
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Content Stats</h3>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Posts</p>
                            <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                              {blogPosts.length}
                            </p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Recent Activity</p>
                            <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                              {blogPosts.filter(post => {
                                const date = new Date(post.publishedAt);
                                const now = new Date();
                                const diff = now.getTime() - date.getTime();
                                return diff < 30 * 24 * 60 * 60 * 1000; // 30 days
                              }).length}
                            </p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Most Popular Tag</p>
                            <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                              {(() => {
                                const tagCount: Record<string, number> = {};
                                blogPosts.forEach(post => {
                                  post.tags.forEach(tag => {
                                    tagCount[tag] = (tagCount[tag] || 0) + 1;
                                  });
                                });
                                
                                let maxTag = '';
                                let maxCount = 0;
                                Object.entries(tagCount).forEach(([tag, count]) => {
                                  if (count > maxCount) {
                                    maxTag = tag;
                                    maxCount = count;
                                  }
                                });
                                
                                return maxTag || 'None';
                              })()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Blog Posts Table */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Title
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Date
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {blogPosts.map(post => (
                              <tr key={post.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                  {post.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(post.publishedAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    Published
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex justify-end space-x-2">
                                    <Link 
                                      to={`/blog/${post.id}`}
                                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                    >
                                      <Eye className="w-5 h-5" />
                                    </Link>
                                    <Link 
                                      to={`/editor/edit-blog/${post.id}`}
                                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                      <Edit2 className="w-5 h-5" />
                                    </Link>
                                    <button 
                                      onClick={() => confirmDeletePost(post.id)}
                                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                      <Trash2 className="w-5 h-5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'events' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Events</h2>
                    <button 
                      onClick={goToCreateEvent}
                      className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Event</span>
                    </button>
                  </div>

                  {events.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Events</h3>
                      <p className="text-gray-500 dark:text-gray-400">There are no upcoming events. Create one to get started.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {events.map(event => (
                        <div 
                          key={event.id} 
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {new Date(event.date).toLocaleDateString()} • {event.location}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Link 
                                to={`/editor/edit-event/${event.id}`}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                <Edit2 className="w-5 h-5" />
                              </Link>
                              <button 
                                onClick={() => confirmDeleteEvent(event.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          
                          <p className="mt-4 text-gray-700 dark:text-gray-300 line-clamp-3">
                            {event.description}
                          </p>
                          
                          <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs mr-2">
                              {event.registeredUsers}/{event.capacity} registered
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'forum' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Forum Activity</h2>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                      Forum moderation features coming soon. Visit the Forum page to view current discussions.
                    </p>
                    <Link 
                      to="/forum"
                      className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Go to Forum
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export { EditorPanel }; 