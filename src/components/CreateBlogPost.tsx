import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// API base URL - can be changed to match your environment
const API_BASE_URL = 'http://localhost:5000/api';

const CreateBlogPost: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  console.log('CreateBlogPost component rendering');
  console.log('Current user:', user);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check permissions
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

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

      <form onSubmit={handleSubmit} className="space-y-6">
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
};

export { CreateBlogPost }; 