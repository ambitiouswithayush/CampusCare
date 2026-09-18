import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  AlertTriangle,
  Heart,
  BookOpen,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { chatAPI } from '@/services/api';
import { toast } from 'sonner';

interface RecommendedResource {
  _id: string;
  title: string;
  description: string;
  category: string;
  link: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isCrisis?: boolean;
  resources?: RecommendedResource[];
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your CampusCare companion. I'm here to listen and support you. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = input;
    setInput('');
    setIsTyping(true);

    try {
      // Call backend AI API
      const response = await chatAPI.sendMessage(messageText);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.reply,
        sender: 'ai',
        timestamp: new Date(),
        isCrisis: response.crisis || false,
        resources: response.recommendedResources || [],
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      toast.error('Failed to get AI response. Please try again.');

      // Fallback message on error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Please try again in a moment, or contact campus support if you need immediate help.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl gradient-healing">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">AI Chat Corner</h1>
              <p className="text-xs text-muted-foreground">Your 24/7 companion</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-3xl ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-lg'
                      : message.isCrisis
                      ? 'bg-crisis-light border-2 border-crisis/30 rounded-bl-lg'
                      : 'bg-card shadow-card border border-border/50 rounded-bl-lg'
                  }`}
                >
                  {message.isCrisis && message.sender === 'ai' && (
                    <div className="flex items-center gap-2 mb-2 text-crisis">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-semibold">Crisis Support</span>
                    </div>
                  )}
                  <p className={message.sender === 'user' ? 'text-primary-foreground' : 'text-foreground'}>
                    {message.content}
                  </p>
                  <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>

                  {message.resources && message.resources.length > 0 && (
                    <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
                      {message.resources.map((resource) => (
                        <a
                          key={resource._id}
                          href={resource.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-2 p-2 rounded-xl bg-background/60 hover:bg-background transition-colors"
                        >
                          <BookOpen className="w-4 h-4 mt-0.5 shrink-0 text-healing" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{resource.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{resource.description}</p>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-card shadow-card border border-border/50 rounded-3xl rounded-bl-lg p-4">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-healing animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-healing animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-healing animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="bg-card border-t border-border p-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button variant="healing" size="icon" onClick={handleSend} disabled={!input.trim()}>
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Chat;