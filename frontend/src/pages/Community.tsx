import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Send,
  Heart,
  MessageCircle,
  User,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { postsAPI } from '@/services/api';
import { toast } from 'sonner';

interface Post {
  _id: string;
  content: string;
  createdAt: string;
  replies: Reply[];
  anonymous: boolean;
}

interface Reply {
  _id: string;
  content: string;
  createdAt: string;
}

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      loadPosts();
    }
  }, [user, navigate]);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const response = await postsAPI.getPosts();
      if (response.success) {
        setPosts(response.posts);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePost = async () => {
    if (!newPost.trim()) return;

    try {
      const response = await postsAPI.createPost(newPost, true);
      if (response.success) {
        toast.success('Post created successfully!');
        setNewPost('');
        setShowNewPost(false);
        loadPosts(); // Reload posts
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error('Failed to create post');
    }
  };

  const handleReply = async (postId: string) => {
    if (!replyContent.trim()) return;

    try {
      const response = await postsAPI.replyToPost(postId, replyContent);
      if (response.success) {
        toast.success('Reply added!');
        setReplyContent('');
        setReplyingTo(null);
        loadPosts(); // Reload posts
      }
    } catch (error) {
      console.error('Failed to reply:', error);
      toast.error('Failed to add reply');
    }
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-lavender-light">
                <MessageCircle className="w-5 h-5 text-lavender" />
              </div>
              <div>
                <h1 className="font-bold text-foreground">Student Common Room</h1>
                <p className="text-xs text-muted-foreground">Anonymous peer support</p>
              </div>
            </div>
          </div>
          <Button variant="healing" size="sm" onClick={() => setShowNewPost(true)}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Post</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-2xl">
        {/* New Post Modal */}
        <AnimatePresence>
          {showNewPost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              onClick={() => setShowNewPost(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-card rounded-3xl p-6 w-full max-w-md shadow-card"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-bold text-foreground mb-4">Share with the community</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Your post will be anonymous. Be kind and supportive.
                </p>
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full h-32 p-4 rounded-2xl border-2 border-border bg-background resize-none focus:outline-none focus:border-healing transition-colors"
                />
                <div className="flex gap-3 mt-4">
                  <Button variant="ghost" className="flex-1" onClick={() => setShowNewPost(false)}>
                    Cancel
                  </Button>
                  <Button variant="healing" className="flex-1" onClick={handlePost}>
                    Post Anonymously
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
            </div>
          ) : (
            posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-3xl p-6 shadow-card border border-border/50"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 rounded-full bg-lavender-light">
                    <User className="w-4 h-4 text-lavender" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Anonymous Student</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <p className="text-foreground mb-4">{post.content}</p>

                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => setReplyingTo(replyingTo === post._id ? null : post._id)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-healing transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{post.replies.length} replies</span>
                  </button>
                </div>

                {/* Replies */}
                {post.replies.length > 0 && (
                  <div className="border-t border-border pt-4 space-y-3">
                    {post.replies.map((reply) => (
                      <div key={reply._id} className="pl-4 border-l-2 border-healing/30">
                        <p className="text-sm text-foreground">{reply.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input */}
                <AnimatePresence>
                  {replyingTo === post._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 flex gap-2"
                    >
                      <Input
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a supportive reply..."
                        className="flex-1"
                      />
                      <Button variant="healing" size="icon" onClick={() => handleReply(post._id)}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Community;
