import { useState } from 'react';
import { X, Download, ExternalLink, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

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

interface ResourceViewerProps {
  resource: Resource;
  onClose: () => void;
}

const ResourceViewer = ({ resource, onClose }: ResourceViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const getFileUrl = () => {
    if (resource.isUploaded && resource.fileUrl) {
      return `http://localhost:5000${resource.fileUrl}`;
    }
    return resource.link;
  };

  const renderContent = () => {
    const url = getFileUrl();

    // Video player
    if (resource.category === 'video') {
      // If it's a YouTube link
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('youtube.com')) {
          const urlParams = new URLSearchParams(new URL(url).search);
          videoId = urlParams.get('v') || '';
        } else if (url.includes('youtu.be')) {
          videoId = url.split('/').pop() || '';
        }

        return (
          <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={resource.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
            />
          </div>
        );
      }

      // If it's an uploaded video file
      return (
        <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden">
          <video
            controls
            className="w-full h-full"
            onLoadedData={() => setIsLoading(false)}
          >
            <source src={url} type="video/mp4" />
            <source src={url} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // Audio player
    if (resource.category === 'audio') {
      return (
        <div className="w-full p-8 bg-gradient-to-br from-lavender-light to-healing-light rounded-2xl">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-foreground mb-2">{resource.title}</h3>
            <p className="text-sm text-muted-foreground">{resource.description}</p>
          </div>
          <audio
            controls
            className="w-full"
            onLoadedData={() => setIsLoading(false)}
          >
            <source src={url} type="audio/mpeg" />
            <source src={url} type="audio/wav" />
            <source src={url} type="audio/ogg" />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }

    // PDF viewer
    if (resource.category === 'pdf') {
      return (
        <div className="w-full h-[600px] bg-black rounded-2xl overflow-hidden">
          <iframe
            src={`${url}#toolbar=1`}
            title={resource.title}
            className="w-full h-full"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      );
    }

    // For articles and external links
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-bold text-foreground mb-2">{resource.title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">{resource.description}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <Button variant="healing" size="lg">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Link
          </Button>
        </a>
      </div>
    );
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    if (mb < 1) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">{resource.title}</h2>
              <p className="text-sm text-muted-foreground capitalize">
                {resource.category}
                {resource.isUploaded && resource.fileSize && ` • ${formatFileSize(resource.fileSize)}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {resource.isUploaded && (
                <a href={getFileUrl()} download={resource.fileName || resource.title}>
                  <Button variant="ghost" size="icon">
                    <Download className="w-5 h-5" />
                  </Button>
                </a>
              )}
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading && (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-healing border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading {resource.category}...</p>
              </div>
            )}
            <div className={isLoading ? 'hidden' : ''}>
              {renderContent()}
            </div>

            {/* Description */}
            {resource.description && resource.category !== 'audio' && (
              <div className="mt-6 p-4 bg-muted rounded-2xl">
                <p className="text-sm text-foreground">{resource.description}</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResourceViewer;
