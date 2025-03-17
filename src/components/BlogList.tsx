import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Clock, Tag, User, Plus } from 'lucide-react';

// API base URL - can be changed to match your environment
const API_BASE_URL = 'http://localhost:5000/api';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  tags: string[];
  coverImage: string;
}

// Mock data for development when backend is unavailable
const MOCK_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Quantum Computing',
    excerpt: 'Exploring the potential applications and challenges of quantum computing technologies in the next decade.',
    author: {
      name: 'Dr. Alex Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=random'
    },
    publishedAt: '2023-06-15',
    readTime: '8 min read',
    tags: ['Quantum Physics', 'Technology', 'Computing'],
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '2',
    title: 'Understanding CRISPR Gene Editing',
    excerpt: 'A comprehensive guide to how CRISPR technology works and its implications for medicine and ethics.',
    author: {
      name: 'Dr. Sarah Chen',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=random'
    },
    publishedAt: '2023-05-22',
    readTime: '12 min read',
    tags: ['Genetics', 'Biology', 'Medicine'],
    coverImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '3',
    title: 'Climate Change: The Latest Research',
    excerpt: 'An overview of the most recent scientific findings on global climate change and its effects.',
    author: {
      name: 'Prof. Michael Rivera',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Rivera&background=random'
    },
    publishedAt: '2023-04-10',
    readTime: '10 min read',
    tags: ['Climate', 'Environment', 'Research'],
    coverImage: 'https://images.unsplash.com/photo-1584215189160-c9a8b8a90b6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }
];

function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  console.log('BlogList component rendering');
  console.log('Current user:', user);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Create headers object
        const headers: HeadersInit = {};
        
        // For hardcoded test users, add their ID in a custom header
        if (user && (user.email === 'admin@sciencehub.com' || 
            user.email === 'editor@sciencehub.com' || 
            user.email === 'user@sciencehub.com')) {
          console.log('Using development X-User-ID header for hardcoded test user in blog list');
          headers['X-User-ID'] = user.id;
        }
        
        const response = await fetch(`${API_BASE_URL}/blog`, {
          headers,
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        // Use mock data if server is not available
        setPosts(MOCK_POSTS);
        setError("Using demo content - backend not connected.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  const handleCreateNewPost = () => {
    console.log('Navigating to create new post page');
    navigate('/create-blog');
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="flex space-x-4">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const canCreatePost = user?.role === 'editor' || user?.role === 'admin';
  console.log('User can create post:', canCreatePost);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
        {canCreatePost && (
          <button
            onClick={handleCreateNewPost}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Create New Post
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-200">
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <Link to={`/blog/${post.id}`}>
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="h-8 w-8 rounded-full mr-2"
                    loading="lazy"
                  />
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{post.author.name}</span>
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {post.excerpt}
                </p>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="mr-4">{post.readTime}</span>
                  <Tag className="h-4 w-4 mr-1" />
                  <div className="flex gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export { BlogList };