import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Clock, Send } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface Author {
  id: string;
  name: string;
  avatar: string;
}

interface Reply {
  id: string;
  content: string;
  timestamp: string;
  author: Author;
}

interface ForumPostDetail {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  author: Author;
  replies: Reply[];
}

function ForumDetail() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<ForumPostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newReply, setNewReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!postId) {
        setError('No post ID provided');
        setIsLoading(false);
        return;
      }

      try {
        console.log(`Fetching forum post ${postId} details...`);
        const response = await fetch(`${API_BASE_URL}/forum/${postId}`, {
          credentials: 'include',
          headers: user?.isTestUser ? { 'X-User-ID': user.id } : {}
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch post: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched post details:', data);
        setPost(data);
      } catch (err) {
        console.error('Error fetching post details:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostDetail();
  }, [postId, user]);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to reply');
      return;
    }

    if (!postId) {
      setError('No post ID provided');
      return;
    }

    if (!newReply.trim()) {
      setError('Reply cannot be empty');
      return;
    }

    console.log(`Submitting reply to post ${postId}...`);
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/forum/${postId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user.isTestUser ? { 'X-User-ID': user.id } : {})
        },
        credentials: 'include',
        body: JSON.stringify({ content: newReply }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to create reply (${response.status}):`, errorText);
        throw new Error(`Failed to reply: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Reply created successfully:', data);
      
      // Update the post with the new reply
      if (post) {
        setPost({
          ...post,
          replies: [...post.replies, data]
        });
      }
      
      setNewReply('');
    } catch (err) {
      console.error('Error creating reply:', err);
      setError(err instanceof Error ? err.message : 'Failed to create reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    navigate('/forum');
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
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={goBack}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forum
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-red-500 mb-4">Post not found</div>
        <button
          onClick={goBack}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forum
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back button */}
      <button
        onClick={goBack}
        className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Forum
      </button>

      {/* Post details */}
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="h-10 w-10 rounded-full mr-4"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {post.title}
            </h1>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span className="mr-2">{post.author.name}</span>
              <Clock className="h-4 w-4 mr-1" />
              <span>{new Date(post.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-line">{post.content}</p>
      </article>

      {/* Replies section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {post.replies.length === 0
            ? 'No replies yet'
            : `${post.replies.length} ${post.replies.length === 1 ? 'Reply' : 'Replies'}`}
        </h2>

        <div className="space-y-4">
          {post.replies.map((reply) => (
            <div
              key={reply.id}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center mb-2">
                <img
                  src={reply.author.avatar}
                  alt={reply.author.name}
                  className="h-8 w-8 rounded-full mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {reply.author.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(reply.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{reply.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reply form */}
      {user && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Add a Reply
          </h2>
          <form onSubmit={handleSubmitReply}>
            <div className="mb-4">
              <textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Write your reply here..."
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Reply
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export { ForumDetail }; 