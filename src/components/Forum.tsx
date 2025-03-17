import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: string;
  replies: number;
}

function Forum() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("Fetching forum posts...");
        const response = await fetch(`${API_BASE_URL}/forum`, {
          credentials: 'include',
          headers: user?.isTestUser ? { 'X-User-ID': user.id } : {}
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch forum posts: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Fetched forum posts:", data);
        setPosts(data);
      } catch (err) {
        console.error("Error fetching forum posts:", err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("Cannot create post: No authenticated user");
      return;
    }

    console.log("Creating new forum post:", newPost);
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/forum`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user.isTestUser ? { 'X-User-ID': user.id } : {})
        },
        credentials: 'include',
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to create post (${response.status}):`, errorText);
        throw new Error(`Failed to create post: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Post created successfully:", data);
      setPosts(prev => [data, ...prev]);
      setNewPost({ title: '', content: '' });
    } catch (err) {
      console.error("Error creating forum post:", err);
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToPostDetail = (postId: string) => {
    console.log(`Navigating to forum post detail: ${postId}`);
    navigate(`/forum/${postId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Science Club Forum
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Join the discussion with fellow science enthusiasts.
        </p>
      </div>

      {user && (
        <div className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Content
              </label>
              <textarea
                id="content"
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Post...' : 'Create Post'}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => goToPostDetail(post.id)}
          >
            <div className="flex items-center mb-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="h-10 w-10 rounded-full mr-4"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {post.title}
                </h2>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="mr-2">{post.author.name}</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{post.content}</p>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{post.replies} {post.replies === 1 ? 'reply' : 'replies'}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export { Forum };