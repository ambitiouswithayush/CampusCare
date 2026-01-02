import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  Play,
  Music,
  FileText,
  FileCheck,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { resourcesAPI } from '@/services/api';
import { toast } from 'sonner';
import ResourceViewer from '@/components/resources/ResourceViewer';

interface Resource {
  _id: string;
  title: string;
  description: string;
  category: 'video' | 'audio' | 'pdf' | 'article' | 'guide' | 'helpline' | 'other';
  link: string;
  isUploaded?: boolean;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

const categoryIcons = {
  video: Play,
  audio: Music,
  pdf: FileCheck,
  article: FileText,
  guide: BookOpen,
  helpline: FileText,
  other: FileText,
};

const categoryColors = {
  video: { bg: 'bg-healing-light', text: 'text-healing' },
  audio: { bg: 'bg-lavender-light', text: 'text-lavender' },
  pdf: { bg: 'bg-crisis-light', text: 'text-crisis' },
  article: { bg: 'bg-sunrise-light', text: 'text-sunrise' },
  guide: { bg: 'bg-healing-light', text: 'text-healing' },
  helpline: { bg: 'bg-crisis-light', text: 'text-crisis' },
  other: { bg: 'bg-muted', text: 'text-muted-foreground' },
};

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'video' | 'audio' | 'pdf' | 'article' | 'guide' | 'helpline'>('all');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      loadResources();
    }
  }, [user, navigate]);

  const loadResources = async () => {
    try {
      setIsLoading(true);
      const response = await resourcesAPI.getResources();
      if (response.success) {
        setResources(response.resources);
      }
    } catch (error) {
      console.error('Failed to load resources:', error);
      toast.error('Failed to load resources');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(search.toLowerCase()) ||
      resource.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || resource.category === filter;
    return matchesSearch && matchesFilter;
  });

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading resources...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sunrise-light">
              <BookOpen className="w-5 h-5 text-sunrise" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">Resource Library</h1>
              <p className="text-xs text-muted-foreground">Learn at your own pace</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources..."
              className="pl-12"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {(['all', 'video', 'audio', 'pdf', 'article', 'guide', 'helpline'] as const).map((category) => (
              <Button
                key={category}
                variant={filter === category ? 'healing' : 'soft'}
                size="sm"
                onClick={() => setFilter(category)}
              >
                {category === 'all' ? 'All' : category === 'pdf' ? 'PDFs' : category.charAt(0).toUpperCase() + category.slice(1) + 's'}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {resources.length === 0 ? 'No resources available yet.' : 'No resources found. Try a different search.'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredResources.map((resource, index) => {
              const Icon = categoryIcons[resource.category] || FileText;
              const colors = categoryColors[resource.category] || categoryColors.other;

              return (
                <motion.div
                  key={resource._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-3xl bg-card shadow-card border border-border/50 hover:shadow-glow transition-all duration-300 group cursor-pointer"
                  onClick={() => setSelectedResource(resource)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl ${colors.bg} group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground mb-1 group-hover:text-healing transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {resource.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground capitalize">
                          {resource.category}
                        </span>
                        {resource.isUploaded && (
                          <span className="px-2 py-1 text-xs rounded-full bg-healing-light text-healing">
                            Uploaded
                          </span>
                        )}
                      </div>
                    </div>
                    <Play className="w-5 h-5 text-muted-foreground group-hover:text-healing transition-colors" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Resource Viewer Modal */}
      {selectedResource && (
        <ResourceViewer
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </div>
  );
};

export default Resources;
