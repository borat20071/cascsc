import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft, MessageSquare, Share2, Tag, User, Edit, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Author {
  id: string;
  name: string;
  avatar: string;
}

interface Comment {
  id: string;
  content: string;
  author: Author;
  timestamp: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: Author;
  publishedAt: string;
  readTime: string;
  tags: string[];
  coverImage: string;
  comments: Comment[];
}

// Mock data for development when backend is unavailable
const MOCK_BLOG_POSTS: Record<string, BlogPost> = {
  '1': {
    id: '1',
    title: 'The Future of Quantum Computing',
    content: `
# The Future of Quantum Computing

Quantum computing represents one of the most promising frontiers in technology today. Unlike classical computers that use bits (0s and 1s), quantum computers use quantum bits or qubits that can exist in multiple states simultaneously, thanks to the principles of superposition and entanglement.

## Current Challenges

Despite the tremendous potential, quantum computing faces several significant challenges:

1. **Decoherence**: Quantum states are extremely fragile and can be disrupted by the slightest environmental interactions.
2. **Error Correction**: Quantum error correction is much more complex than classical error correction.
3. **Scalability**: Building quantum computers with enough qubits to outperform classical computers on practical problems remains difficult.

## Recent Breakthroughs

Several recent breakthroughs have accelerated progress in the field:

- **Quantum Supremacy**: Google's demonstration of quantum supremacy in 2019 was a watershed moment, showing that a quantum computer could perform a specific task faster than the world's best supercomputers.
- **Error Mitigation**: New techniques for mitigating errors without full error correction are extending the capabilities of current quantum hardware.
- **Hybrid Approaches**: Combining quantum and classical computing resources has shown promise for near-term applications.

## Potential Applications

The potential applications of quantum computing span numerous fields:

### Drug Discovery
Quantum computers could simulate molecular interactions with unprecedented accuracy, potentially revolutionizing pharmaceutical research.

### Materials Science
Designing new materials with specific properties could be accelerated through quantum simulation.

### Optimization Problems
Complex optimization problems in logistics, finance, and energy distribution could be solved more efficiently.

### Cryptography
Quantum computers could break current encryption methods but also enable new, more secure quantum encryption protocols.

## The Road Ahead

While a universal fault-tolerant quantum computer may still be years away, the field is advancing rapidly. The next decade is likely to see quantum computers solving increasingly practical problems, working alongside classical systems in a hybrid computing ecosystem.

As researchers continue to overcome technical challenges and explore new approaches, the dream of harnessing quantum mechanics for computational advantage grows closer to reality.
    `,
    excerpt: 'Exploring the potential applications and challenges of quantum computing technologies in the next decade.',
    author: {
      id: '101',
      name: 'Dr. Alex Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=random'
    },
    publishedAt: '2023-06-15',
    readTime: '8 min read',
    tags: ['Quantum Physics', 'Technology', 'Computing'],
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    comments: [
      {
        id: '101',
        content: 'Fascinating article! I wonder how quantum computing will affect cybersecurity in the next five years.',
        author: {
          id: '201',
          name: 'Emily White',
          avatar: 'https://ui-avatars.com/api/?name=Emily+White&background=random'
        },
        timestamp: '2023-06-16T14:30:00Z'
      },
      {
        id: '102',
        content: 'Great overview of the challenges. I think error correction is the biggest hurdle to overcome before we see practical quantum advantage.',
        author: {
          id: '202',
          name: 'Michael Brown',
          avatar: 'https://ui-avatars.com/api/?name=Michael+Brown&background=random'
        },
        timestamp: '2023-06-17T09:45:00Z'
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Understanding CRISPR Gene Editing',
    content: `
# Understanding CRISPR Gene Editing

CRISPR-Cas9 has revolutionized genetic engineering, offering unprecedented precision in editing DNA. This powerful tool has implications for medicine, agriculture, and beyond.

## How CRISPR Works

The CRISPR-Cas9 system consists of two key components:

1. **Guide RNA (gRNA)**: This molecule guides the system to the target DNA sequence.
2. **Cas9 Enzyme**: This acts as molecular scissors, cutting the DNA at the specified location.

Once the DNA is cut, the cell's natural repair mechanisms activate. Scientists can harness these repair processes to delete genes or insert new genetic material.

## Medical Applications

CRISPR holds enormous potential for treating genetic diseases:

- **Sickle Cell Disease**: Clinical trials using CRISPR to correct the genetic mutation causing sickle cell disease have shown promising results.
- **Cancer Therapy**: Researchers are exploring ways to use CRISPR to enhance immune cells' ability to fight cancer.
- **Genetic Disorders**: From cystic fibrosis to Huntington's disease, CRISPR offers hope for conditions previously considered untreatable.

## Ethical Considerations

The power to edit the human genome raises important ethical questions:

1. **Germline Editing**: Changes made to reproductive cells would be passed to future generations, raising profound ethical concerns.
2. **Enhancement vs. Treatment**: Where should we draw the line between treating disease and enhancing human capabilities?
3. **Equity and Access**: How can we ensure this technology doesn't exacerbate existing inequalities?

## The Future of CRISPR

As the technology matures, we can expect:

- More precise editing with fewer off-target effects
- Simplified delivery systems for therapeutic applications
- Expanded applications in synthetic biology and bioengineering

CRISPR represents one of the most significant scientific breakthroughs of our time, with the potential to transform medicine and our relationship with the natural world.
    `,
    excerpt: 'A comprehensive guide to how CRISPR technology works and its implications for medicine and ethics.',
    author: {
      id: '102',
      name: 'Dr. Sarah Chen',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=random'
    },
    publishedAt: '2023-05-22',
    readTime: '12 min read',
    tags: ['Genetics', 'Biology', 'Medicine'],
    coverImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    comments: [
      {
        id: '201',
        content: 'This explanation really helped me understand CRISPR better. Do you think we\'ll see widespread clinical applications within the next decade?',
        author: {
          id: '301',
          name: 'Robert Kim',
          avatar: 'https://ui-avatars.com/api/?name=Robert+Kim&background=random'
        },
        timestamp: '2023-05-23T10:15:00Z'
      }
    ]
  },
  '3': {
    id: '3',
    title: 'Climate Change: The Latest Research',
    content: `
# Climate Change: The Latest Research

Climate science continues to evolve as researchers gather more data and refine their models. This article summarizes the most recent findings and their implications.

## Temperature Trends

Global temperature records continue to show a clear warming trend:

- The past decade (2011-2020) was the warmest on record.
- 2020 tied with 2016 as the warmest year ever recorded.
- The rate of warming has accelerated in recent decades.

## Ocean Changes

The world's oceans are changing in several concerning ways:

1. **Ocean Acidification**: As oceans absorb CO2, they become more acidic, threatening marine ecosystems, particularly coral reefs and shellfish.
2. **Sea Level Rise**: Improved satellite measurements show sea levels rising at approximately 3.7 mm per year, faster than previously estimated.
3. **Ocean Warming**: Over 90% of excess heat from greenhouse gases is absorbed by oceans, disrupting marine life and weather patterns.

## Arctic Amplification

The Arctic is warming more than twice as fast as the global average, with profound implications:

- **Sea Ice Loss**: Summer Arctic sea ice could disappear completely by 2050.
- **Permafrost Thaw**: Accelerated thawing releases methane and CO2, potentially creating a dangerous feedback loop.
- **Changing Jet Stream**: Arctic warming appears to be altering the jet stream, contributing to extreme weather events at lower latitudes.

## Tipping Points

Recent research has focused on potential tipping points in the climate system:

- **Amazon Dieback**: Parts of the Amazon rainforest may be approaching a threshold where forest converts to savanna.
- **Ice Sheet Instability**: Evidence suggests the West Antarctic Ice Sheet may have already passed a point of irreversible retreat.
- **Gulf Stream Weakening**: The Atlantic Meridional Overturning Circulation (AMOC) has shown signs of slowing, which could dramatically affect European climate.

## Mitigation Pathways

Climate scientists have clarified what's needed to meet Paris Agreement goals:

- Global emissions must fall by approximately 7.6% every year between 2020 and 2030 to limit warming to 1.5°C.
- Net-zero CO2 emissions must be achieved by 2050.
- Negative emissions technologies will likely be necessary, but cannot substitute for rapid near-term emissions reductions.

The latest research emphasizes both the urgency of climate action and the fact that every fraction of a degree of warming avoided matters for limiting harmful impacts.
    `,
    excerpt: 'An overview of the most recent scientific findings on global climate change and its effects.',
    author: {
      id: '103',
      name: 'Prof. Michael Rivera',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Rivera&background=random'
    },
    publishedAt: '2023-04-10',
    readTime: '10 min read',
    tags: ['Climate', 'Environment', 'Research'],
    coverImage: 'https://images.unsplash.com/photo-1584215189160-c9a8b8a90b6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    comments: [
      {
        id: '301',
        content: 'Very informative article. The tipping points concern me the most - are there any signs that we\'re making progress fast enough to avoid them?',
        author: {
          id: '401',
          name: 'Lisa Johnson',
          avatar: 'https://ui-avatars.com/api/?name=Lisa+Johnson&background=random'
        },
        timestamp: '2023-04-11T16:20:00Z'
      },
      {
        id: '302',
        content: 'I appreciate the clear presentation of the latest data. Do you have any recommendations for reliable sources where the general public can stay informed about climate science?',
        author: {
          id: '402',
          name: 'David Wilson',
          avatar: 'https://ui-avatars.com/api/?name=David+Wilson&background=random'
        },
        timestamp: '2023-04-12T09:30:00Z'
      },
      {
        id: '303',
        content: 'The section on Arctic amplification was particularly eye-opening. I hadn\'t realized the jet stream connection to extreme weather events.',
        author: {
          id: '403',
          name: 'Jennifer Taylor',
          avatar: 'https://ui-avatars.com/api/?name=Jennifer+Taylor&background=random'
        },
        timestamp: '2023-04-13T14:45:00Z'
      }
    ]
  }
};

// API base URL - can be changed to match your environment
const API_BASE_URL = 'http://localhost:5000/api';

function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(id !== 'new');  // Don't show loading screen for new posts
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // For editing a new post
  const [isEditMode] = useState(id === 'new');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  console.log('BlogPost component rendering with id:', id);
  console.log('Current user:', user);
  console.log('Is Edit Mode:', isEditMode);

  const canEditPost = user && post && (user.role === 'admin' || (user.role === 'editor' && post.author.id === user.id));

  // Skip fetching for new posts to avoid unnecessary API calls
  useEffect(() => {
    if (id === 'new') {
      console.log('Creating new post - skipping API fetch');
      if (user) {
        const emptyPost = {
          id: 'new',
          title: '',
          excerpt: '',
          content: '',
          author: {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          },
          publishedAt: new Date().toISOString(),
          readTime: '1 min read',
          coverImage: '',
          tags: [],
          comments: []
        };
        setPost(emptyPost);
        setIsLoading(false);
      } else {
        setError("You must be logged in to create a post");
        setIsLoading(false);
      }
      return;
    }
    
    const fetchPost = async () => {
      if (!id) {
        console.log('No id provided, returning');
        return;
      }
      
      console.log(`Attempting to fetch post with id: ${id}`);
      
      try {
        // Create headers object with basic content type
        const headers: HeadersInit = {};
        
        // For hardcoded test users, add their ID in a custom header
        // This is a development-only feature
        if (user && (user.email === 'admin@sciencehub.com' || 
            user.email === 'editor@sciencehub.com' || 
            user.email === 'user@sciencehub.com')) {
          console.log('Using development X-User-ID header for hardcoded test user in blog');
          headers['X-User-ID'] = user.id;
        }
        
        // The URL depends on whether we're creating a new post or viewing an existing one
        const apiUrl = id === 'new' 
          ? `${API_BASE_URL}/blog/new` 
          : `${API_BASE_URL}/blog/${id}`;
        
        console.log(`Fetching blog post from: ${apiUrl}`);
        
        const response = await fetch(apiUrl, { 
          headers,
          credentials: 'include' 
        });
        
        console.log('API response status:', response.status);
        
        if (!response.ok) {
          console.error('Failed to fetch post, status:', response.status);
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        console.log('Successfully fetched post data:', data);
        setPost(data);
        
        // If this is a new post, initialize the form fields
        if (id === 'new') {
          setTitle(data.title || '');
          setContent(data.content || '');
          setExcerpt(data.excerpt || '');
          setCoverImage(data.coverImage || '');
          setTags(data.tags || []);
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        // Use mock data if server is not available
        if (id === 'new') {
          console.log('Creating empty blog post template for new post');
          // Create an empty blog post template
          if (user) {
            const emptyPost = {
              id: 'new',
              title: '',
              excerpt: '',
              content: '',
              author: {
                id: user.id,
                name: user.name,
                avatar: user.avatar
              },
              publishedAt: new Date().toISOString(),
              readTime: '1 min read',
              coverImage: '',
              tags: [],
              comments: []
            };
            console.log('Setting empty post:', emptyPost);
            setPost(emptyPost);
            
            // Initialize form fields for new post
            setTitle('');
            setContent('');
            setExcerpt('');
            setCoverImage('');
            setTags([]);
          } else {
            console.error('User not logged in, cannot create new post');
            setError("You must be logged in to create a post");
          }
        } else if (MOCK_BLOG_POSTS[id]) {
          console.log('Using mock data for post:', id);
          setPost(MOCK_BLOG_POSTS[id]);
          setError("Using demo content - backend not connected");
        } else {
          console.error('Post not found in mock data');
          setError("Post not found");
        }
      } finally {
        setIsLoading(false);
        console.log('Finished loading post');
      }
    };

    fetchPost();
  }, [id, user]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Create headers object with basic content type
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // For hardcoded test users, add their ID in a custom header
      if (user.email === 'admin@sciencehub.com' || 
          user.email === 'editor@sciencehub.com' || 
          user.email === 'user@sciencehub.com') {
        console.log('Using development X-User-ID header for hardcoded test user in blog creation');
        headers['X-User-ID'] = user.id;
      }
      
      const postData = {
        title,
        content,
        excerpt,
        coverImage,
        tags
      };
      
      console.log('Submitting post data:', postData);
      
      const response = await fetch(`${API_BASE_URL}/blog`, {
        method: 'POST',
        headers,
        body: JSON.stringify(postData),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const createdPost = await response.json();
      console.log('Post created successfully:', createdPost);
      
      // Navigate to the new post
      navigate(`/blog/${createdPost.id}`);
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while creating the post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !post || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      // Create headers object with basic content type
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // For hardcoded test users, add their ID in a custom header
      if (user.email === 'admin@sciencehub.com' || 
          user.email === 'editor@sciencehub.com' || 
          user.email === 'user@sciencehub.com') {
        console.log('Using development X-User-ID header for hardcoded test user comment');
        headers['X-User-ID'] = user.id;
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/blog/${id}/comments`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ content: newComment }),
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to post comment');
        }

        const createdComment = await response.json();
        
        // Update the post with the new comment
        setPost({
          ...post,
          comments: [...post.comments, createdComment]
        });
      } catch (err) {
        console.error('Error posting comment:', err);
        // Handle offline mode - add a mock comment
        const mockComment = {
          id: Date.now().toString(),
          content: newComment,
          author: {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          },
          timestamp: new Date().toISOString()
        };
        setPost({
          ...post,
          comments: [...post.comments, mockComment]
        });
      }

      // Reset the comment form
      setNewComment('');
    } catch (err) {
      console.error('Submit error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    console.log('Rendering loading skeleton');
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-8 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
        <button
          onClick={() => navigate('/blog')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Back to Blog
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-8 text-center">
        <p className="text-gray-700 dark:text-gray-300">Post not found</p>
        <button
          onClick={() => navigate('/blog')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Back to Blog
        </button>
      </div>
    );
  }

  // For new posts, directly render the edit form without going through other conditions
  if (id === 'new') {
    if (!user) {
      return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-8 text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 dark:text-red-300">You must be logged in to create a post</p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Log In
          </button>
        </div>
      );
    }

    if (user.role !== 'admin' && user.role !== 'editor') {
      return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-8 text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 dark:text-red-300">You must be an admin or editor to create a post</p>
          </div>
          <button
            onClick={() => navigate('/blog')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Back to Blog
          </button>
        </div>
      );
    }

    console.log('Directly rendering edit form for new post');
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-8">
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center mb-6 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Blog</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Create New Blog Post
        </h1>

        {error && (
          <div className="mb-6 p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmitPost} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800"
              placeholder="Enter post title"
              required
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Excerpt *
            </label>
            <input
              type="text"
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800"
              placeholder="A brief summary of the post"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content (Markdown) *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 font-mono"
              placeholder="Write your blog post using Markdown..."
              required
            />
          </div>

          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cover Image URL
            </label>
            <input
              type="url"
              id="coverImage"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800"
              placeholder="https://example.com/image.jpg"
            />
            {coverImage && (
              <div className="mt-2">
                <img 
                  src={coverImage} 
                  alt="Cover preview" 
                  className="h-40 object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800"
                placeholder="Add a tag"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 transition-colors"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/blog')}
              className="px-4 py-2 mr-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Save Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Continue with the original isEditMode condition for other cases
  if (isEditMode && id !== 'new') {
    console.log('Rendering edit form for existing post');
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-8">
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center mb-6 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Blog</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Edit Blog Post
        </h1>

        {error && (
          <div className="mb-6 p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmitPost} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800"
              placeholder="Enter post title"
              required
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Excerpt *
            </label>
            <input
              type="text"
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800"
              placeholder="A brief summary of the post"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content (Markdown) *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 font-mono"
              placeholder="Write your blog post using Markdown..."
              required
            />
          </div>

          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cover Image URL
            </label>
            <input
              type="url"
              id="coverImage"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800"
              placeholder="https://example.com/image.jpg"
            />
            {coverImage && (
              <div className="mt-2">
                <img 
                  src={coverImage} 
                  alt="Cover preview" 
                  className="h-40 object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800"
                placeholder="Add a tag"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 transition-colors"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/blog')}
              className="px-4 py-2 mr-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Save Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-8">
      {error && (
        <div className="mb-6 p-4 border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-200">
          <p>{error}</p>
        </div>
      )}
      
      <div className="mb-8">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg mb-8"
          loading="lazy"
        />
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-10 w-10 rounded-full mr-4"
              loading="lazy"
            />
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {post.author.name}
              </h3>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
          
          {canEditPost && (
            <button
              onClick={() => navigate(`/edit-blog/${post.id}`)}
              className="flex items-center px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
            >
              <Edit className="h-4 w-4 mr-1" />
              <span>Edit</span>
            </button>
          )}
        </div>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
        {post.title}
      </h1>
      
      <div className="flex flex-wrap gap-2 mb-8">
        {post.tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Comments ({post.comments.length})
        </h2>
        
        {user ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add a comment
            </label>
            <textarea
              id="comment"
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800"
              placeholder="Share your thoughts..."
              required
            />
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md text-center">
            <p className="text-gray-700 dark:text-gray-300">
              Please <a href="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">log in</a> to comment.
            </p>
          </div>
        )}
        
        <div className="space-y-6">
          {post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
              >
                <div className="flex items-start">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="h-8 w-8 rounded-full mr-3"
                    loading="lazy"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {comment.author.name}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export { BlogPost };