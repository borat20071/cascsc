import React, { useState, useEffect } from 'react';
import { Users, CalendarDays, MessageSquare, Settings, Plus, Edit2, Trash2, FileText, Eye, CheckCircle, AlertCircle, UserPlus, AlertTriangle, Mail, CheckSquare, Archive } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import type { Member, Event, BlogPost, User, ContactRequest, TeamMember } from '../types';

// Mock user data to use when the API endpoint is not available
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150',
    joinDate: '2023-01-15'
  },
  {
    id: '2',
    name: 'Editor User',
    email: 'editor@example.com',
    role: 'editor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150',
    joinDate: '2023-02-20'
  },
  {
    id: '3',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150',
    joinDate: '2023-03-10'
  }
];

// Mock contact requests for when the API endpoint is not available
const MOCK_CONTACT_REQUESTS: ContactRequest[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    subject: 'Question about membership',
    message: 'I would like to know more about the membership benefits and how to join the club.',
    status: 'new',
    timestamp: '2024-10-15T14:30:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    subject: 'Upcoming event inquiry',
    message: 'I saw your upcoming science fair event. Could you provide more details about the registration process?',
    status: 'read',
    timestamp: '2024-10-14T09:15:00Z'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    subject: 'Volunteer opportunities',
    message: 'I am interested in volunteering for the club. What opportunities are available and how can I get involved?',
    status: 'replied',
    timestamp: '2024-10-12T16:45:00Z'
  }
];

// Add to the mock data section
const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Ahmmad Abdullah Mahmud',
    role: 'President',
    bio: 'Leading the CASC Science Club with passion and dedication. Focused on creating a positive learning environment for all members.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400',
    social: {
      email: 'ahmmadabdullah@example.com',
      website: '#',
      twitter: '#',
      linkedin: '#'
    }
  },
  {
    id: '2',
    name: 'Sajid Hossain',
    role: 'Vice President',
    bio: 'Dedicated to supporting club activities and ensuring smooth operations. Specializes in coordinating research initiatives.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400',
    social: {
      email: 'sajid.hossain@example.com',
      website: '#',
      twitter: '#',
      linkedin: '#'
    }
  },
  {
    id: '3',
    name: 'Farhana Islam',
    role: 'Secretary',
    bio: 'Manages administrative tasks and communication. Ensures that all club members are informed and engaged in activities.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&h=400',
    social: {
      email: 'farhana.islam@example.com',
      website: '#',
      twitter: '#',
      linkedin: '#'
    }
  }
];

// Add the ClubRegistration interface after the other interfaces
interface ClubRegistration {
  id: number;
  form_no: string;
  registration_no: string;
  full_name: string;
  date_of_birth: string;
  place_of_birth: string;
  gender: string;
  blood_group: string;
  religion: string;
  address: string;
  phone_no: string;
  email: string;
  guardian_name: string;
  guardian_mobile: string;
  school_name: string;
  class1: string;
  gpa1: string;
  class2: string;
  gpa2: string;
  hobby: string;
  correspondence: string;
  past_participant: string;
  why_join: string;
  clubs: string[];
  created_at: string;
}

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState<Event[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userApiMissing, setUserApiMissing] = useState(false);
  const [contactApiMissing, setContactApiMissing] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamApiMissing, setTeamApiMissing] = useState(false);
  const [registrations, setRegistrations] = useState<ClubRegistration[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // Debug log to see if user is available and has correct test user flag
      console.log('Current user in AdminPanel:', user);
      console.log('isTestUser flag present:', user?.isTestUser);
      console.log('user.id value:', user?.id);
      
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
        
        // Try to fetch users, but handle 404 gracefully
        try {
          console.log('Attempting to fetch users with headers:', 
            user ? { 'X-User-ID': user.id } : {});
          
          const usersResponse = await fetch(`${API_BASE_URL}/users`, {
            credentials: 'include',
            headers: user ? { 'X-User-ID': user.id } : {}
          });
          
          console.log('Users API response status:', usersResponse.status);
          
          if (usersResponse.status === 404) {
            // If the endpoint doesn't exist, use mock data
            console.warn('API endpoint /api/users not found. Using mock data instead.');
            setUsers(MOCK_USERS);
            setUserApiMissing(true);
          } else if (!usersResponse.ok) {
            console.error('Failed to fetch users. Status:', usersResponse.status);
            const errorText = await usersResponse.text();
            console.error('Error response body:', errorText);
            throw new Error(`Failed to fetch users. Status: ${usersResponse.status}`);
          } else {
            const usersData = await usersResponse.json();
            console.log('Successfully fetched users:', usersData);
            setUsers(usersData);
            setUserApiMissing(false);
          }
        } catch (userError) {
          console.error('Error fetching users:', userError);
          setUsers(MOCK_USERS);
          setUserApiMissing(true);
        }

        // Try to fetch contact requests, but handle 404 gracefully
        try {
          console.log('Attempting to fetch contact requests with headers:', 
            user ? { 'X-User-ID': user.id } : {});
          
          const contactResponse = await fetch(`${API_BASE_URL}/contact-requests`, {
            credentials: 'include',
            headers: user ? { 'X-User-ID': user.id } : {}
          });
          
          console.log('Contact API response status:', contactResponse.status);
          
          if (contactResponse.status === 404) {
            // If the endpoint doesn't exist, use mock data
            console.warn('API endpoint /api/contact-requests not found. Using mock data instead.');
            setContactRequests(MOCK_CONTACT_REQUESTS);
            setContactApiMissing(true);
          } else if (!contactResponse.ok) {
            throw new Error(`Failed to fetch contact requests: ${contactResponse.statusText}`);
          } else {
            const contactData = await contactResponse.json();
            setContactRequests(contactData);
          }
        } catch (err) {
          console.error('Error fetching contact requests:', err);
          setContactRequests(MOCK_CONTACT_REQUESTS);
          setContactApiMissing(true);
        }

        // Try to fetch team members, but handle 404 gracefully
        try {
          console.log('Attempting to fetch team members with headers:', 
            user ? { 'X-User-ID': user.id } : {});
          
          const teamResponse = await fetch(`${API_BASE_URL}/team-members`, {
            credentials: 'include',
            headers: user ? { 'X-User-ID': user.id } : {}
          });
          
          console.log('Team API response status:', teamResponse.status);
          
          if (teamResponse.status === 404) {
            // If the endpoint doesn't exist, use mock data
            console.warn('API endpoint /api/team-members not found. Using mock data instead.');
            setTeamMembers(MOCK_TEAM_MEMBERS);
            setTeamApiMissing(true);
          } else if (!teamResponse.ok) {
            throw new Error(`Failed to fetch team members: ${teamResponse.statusText}`);
          } else {
            const teamData = await teamResponse.json();
            setTeamMembers(teamData);
          }
        } catch (err) {
          console.error('Error fetching team members:', err);
          setTeamMembers(MOCK_TEAM_MEMBERS);
          setTeamApiMissing(true);
        }
        
        // Fetch club registrations
        try {
          const registrationsResponse = await fetch(`${API_BASE_URL}/club-registration`, {
            credentials: 'include',
            headers: user ? { 'X-User-ID': user.id } : {}
          });
          
          if (registrationsResponse.ok) {
            const registrationsData = await registrationsResponse.json();
            setRegistrations(registrationsData);
          } else {
            console.warn('Could not fetch club registrations:', registrationsResponse.status);
            setRegistrations([]);
          }
        } catch (regError) {
          console.error('Error fetching club registrations:', regError);
          setRegistrations([]);
        }
        
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
    navigate('/admin/create-event');
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
  
  const confirmDeleteUser = (userId: string) => {
    if (userApiMissing) {
      alert('User management API is not available. This is a mock interface.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this user?')) {
      console.log(`Deleting user ${userId}`);
      // Call API endpoint to delete user
      fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: user?.isTestUser ? { 'X-User-ID': user.id } : {}
      })
      .then(response => {
        if (response.ok) {
          // Remove user from state to update UI
          setUsers(users.filter(u => u.id !== userId));
        } else {
          throw new Error('Failed to delete user');
        }
      })
      .catch(err => {
        console.error('Error deleting user:', err);
        alert('Failed to delete user: ' + err.message);
      });
    }
  };

  const handleUpdateContactStatus = async (id: string, status: ContactRequest['status']) => {
    if (contactApiMissing) {
      // If API is missing, just update the UI locally
      setContactRequests(currentRequests => 
        currentRequests.map(request => 
          request.id === id ? { ...request, status } : request
        )
      );
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/contact-requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { 'X-User-ID': user.id } : {})
        },
        credentials: 'include',
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update contact request status');
      }

      // Update state after successful API call
      setContactRequests(currentRequests => 
        currentRequests.map(request => 
          request.id === id ? { ...request, status } : request
        )
      );
    } catch (error) {
      console.error('Error updating contact request status:', error);
      // Update UI anyway for better UX even if API call fails
      setContactRequests(currentRequests => 
        currentRequests.map(request => 
          request.id === id ? { ...request, status } : request
        )
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <nav className="flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
            {[
              { id: 'events', name: 'Events', icon: CalendarDays },
              { id: 'content', name: 'Content', icon: FileText },
              { id: 'members', name: 'User Management', icon: Users },
              { id: 'contact', name: 'Contact Requests', icon: Mail },
              { id: 'team', name: 'Team Members', icon: Users },
              { id: 'registrations', name: 'Club Registrations', icon: Users },
              { id: 'settings', name: 'Settings', icon: Settings }
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
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Events Management</h2>
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
                  <p className="text-gray-500 dark:text-gray-400">There are no events scheduled. Create one to get started.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {events.map(event => (
                    <div
                      key={event.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 flex flex-col justify-between transition-all hover:shadow-md"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{event.title}</h3>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => navigate(`/admin/edit-event/${event.id}`)}
                              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            </button>
                            <button 
                              onClick={() => confirmDeleteEvent(event.id)}
                              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{event.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Date:</span>
                            <span className="ml-2 text-gray-500 dark:text-gray-400">
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Location:</span>
                            <span className="ml-2 text-gray-500 dark:text-gray-400">{event.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <Link
                          to={`/calendar`}
                          className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
                        >
                          View on Calendar →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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
                          {blogPosts.filter(post => 
                            new Date(post.publishedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                          ).length}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last 30 days</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Reading Time</p>
                        <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                          {Math.round(blogPosts
                            .reduce((avg, post) => avg + parseInt(post.readTime.split(' ')[0], 10), 0) / 
                            Math.max(1, blogPosts.length)
                          )} min
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Blog Posts List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {blogPosts.map(post => (
                          <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{post.title}</span>
                            </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <img src={post.author.avatar} alt="" className="w-6 h-6 rounded-full" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">{post.author.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(post.publishedAt).toLocaleDateString()}
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
              )}
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
                {userApiMissing ? (
                  <button
                    onClick={() => alert('User management API is not available. This is a mock interface.')}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add User (Mock)</span>
                </button>
                ) : (
                  <Link 
                    to="/admin/add-user"
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add User</span>
                  </Link>
                )}
              </div>
              
              {userApiMissing && (
                <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 flex items-start mb-4">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">API Endpoint Missing</h3>
                    <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                      The API endpoint '/api/users' does not exist. Using mock data for demonstration. User management actions will not be saved.
                    </p>
                      </div>
                    </div>
              )}
              
              {users.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Users</h3>
                  <p className="text-gray-500 dark:text-gray-400">There are no users in the system yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {users.map(member => (
                        <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-4">
                              <img 
                                src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`} 
                                alt="" 
                                className="w-8 h-8 rounded-full"
                              />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${member.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                                member.role === 'editor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                              {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {member.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {member.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                              {userApiMissing ? (
                                <button
                                  onClick={() => alert('User management API is not available. This is a mock interface.')}
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors"
                                >
                        <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </button>
                              ) : (
                                <Link 
                                  to={`/admin/edit-user/${member.id}`}
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors"
                                >
                                  <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                </Link>
                              )}
                              {member.id !== user?.id && (
                                <button 
                                  onClick={() => confirmDeleteUser(member.id)}
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors"
                                >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                              )}
                    </div>
                          </td>
                        </tr>
                ))}
                    </tbody>
                  </table>
            </div>
          )}
            </div>
          )}

          {activeTab === 'contact' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contact Requests</h2>
                
                {contactApiMissing && (
                  <div className="flex items-center text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <span className="text-sm">Using demo data. Contact API is not available.</span>
                  </div>
                )}
              </div>
              
              {contactRequests.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">No contact requests yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Contact requests from website visitors will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">From</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subject</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {contactRequests.map((request) => (
                        <tr key={request.id} className={`${request.status === 'new' ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-2">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{request.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{request.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white">{request.subject}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(request.timestamp)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${request.status === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                              ${request.status === 'read' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                              ${request.status === 'replied' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                              ${request.status === 'archived' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' : ''}
                            `}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => {
                                // Show message details in a modal or expand row
                                alert(`Message from ${request.name}:\n\n${request.message}`);
                                if (request.status === 'new') {
                                  handleUpdateContactStatus(request.id, 'read');
                                }
                              }}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            {request.status !== 'replied' && (
                              <button 
                                onClick={() => handleUpdateContactStatus(request.id, 'replied')}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3"
                                title="Mark as replied"
                              >
                                <CheckSquare className="w-5 h-5" />
                              </button>
                            )}
                            {request.status !== 'archived' && (
                              <button 
                                onClick={() => handleUpdateContactStatus(request.id, 'archived')}
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                                title="Archive"
                              >
                                <Archive className="w-5 h-5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'team' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Team Members</h2>
                
                {teamApiMissing && (
                  <div className="flex items-center text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <span className="text-sm">Using demo data. Team API is not available.</span>
                  </div>
                )}
                
                <button
                  onClick={() => navigate('/admin/add-team-member')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Team Member
                </button>
              </div>
              
              {teamMembers.length === 0 ? (
            <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">No team members yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Add team members to showcase on the About page.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers.map(member => (
                    <div key={member.id} className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                      <div className="p-5">
                        <div className="flex items-center">
                          <img 
                            src={member.avatar} 
                            alt={member.name}
                            className="h-16 w-16 rounded-full object-cover mr-4"
                          />
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{member.name}</h3>
                            <p className="text-sm text-indigo-600 dark:text-indigo-400">{member.role}</p>
                          </div>
                        </div>
                        <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm line-clamp-3">{member.bio}</p>
                        <div className="mt-4 flex justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/admin/edit-team-member/${member.id}`)}
                            className="p-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to remove ${member.name} from the team?`)) {
                                // Delete logic would go here
                                console.log(`Delete team member ${member.id}`);
                              }
                            }}
                            className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'registrations' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Club Registrations</h2>
              </div>
              
              {registrations.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Registrations</h3>
                  <p className="text-gray-500 dark:text-gray-400">There are no club registrations yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clubs</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {registrations.map(registration => (
                        <tr key={registration.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{registration.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{registration.full_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{registration.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{registration.phone_no}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{registration.school_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {registration.clubs && registration.clubs.join(', ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(registration.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button 
                              className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                              onClick={() => {
                                // Open registration details in a modal or new page
                                alert(`Registration details for ${registration.full_name}:\n\n` + 
                                      `Email: ${registration.email}\n` +
                                      `Phone: ${registration.phone_no}\n` +
                                      `School: ${registration.school_name}\n` +
                                      `Clubs: ${registration.clubs.join(', ')}`);
                              }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                      
                      {registrations.length === 0 && (
                        <tr>
                          <td colSpan={8} className="py-4 text-center">No registrations found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Site Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Site Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        defaultValue="Science Club Community"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Site Description
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        defaultValue="A community for science enthusiasts to connect and learn together."
                      />
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Email Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="event-notifications"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        defaultChecked
                      />
                      <label htmlFor="event-notifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Send event notifications
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="new-members"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        defaultChecked
                      />
                      <label htmlFor="new-members" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Notify about new members
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="blog-comments"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        defaultChecked
                      />
                      <label htmlFor="blog-comments" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Notify about blog comments
                      </label>
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { AdminPanel };