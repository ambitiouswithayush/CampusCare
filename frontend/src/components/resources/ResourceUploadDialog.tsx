import { useState } from 'react';
import { X, Upload, FileText, Play, Music, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { resourcesAPI } from '@/services/api';
import { toast } from 'sonner';

interface ResourceUploadDialogProps {
  onClose: () => void;
  onSuccess: () => void;
}

const categoryOptions = [
  { value: 'video', label: 'Video', icon: Play, accept: 'video/*' },
  { value: 'audio', label: 'Audio', icon: Music, accept: 'audio/*' },
  { value: 'pdf', label: 'PDF', icon: FileCheck, accept: 'application/pdf' },
  { value: 'article', label: 'Article (Link)', icon: FileText, accept: '' },
];

const ResourceUploadDialog = ({ onClose, onSuccess }: ResourceUploadDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('video');
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const selectedCategory = categoryOptions.find(opt => opt.value === category);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setLink(''); // Clear link if file is selected
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !category) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate that either file or link is provided
    if (category !== 'article' && !file && !link) {
      toast.error('Please upload a file or provide a link');
      return;
    }

    if (category === 'article' && !link) {
      toast.error('Please provide a link for the article');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // If it's an article or external link
      if (category === 'article' || link) {
        await resourcesAPI.createResource(title, description, category, link);
        toast.success('Resource added successfully!');
      } else if (file) {
        // Upload file
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);

        // Simulate upload progress (real implementation would use axios onUploadProgress)
        const interval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 200);

        await resourcesAPI.uploadResource(formData);

        clearInterval(interval);
        setUploadProgress(100);
        toast.success('File uploaded successfully!');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload resource');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
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
          className="bg-card rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between z-10">
            <div>
              <h2 className="text-xl font-bold text-foreground">Upload Resource</h2>
              <p className="text-sm text-muted-foreground">Add videos, audio files, PDFs, or links</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} disabled={isUploading}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Resource Type</label>
              <div className="grid grid-cols-2 gap-3">
                {categoryOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setCategory(opt.value);
                        setFile(null);
                        setLink('');
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        category === opt.value
                          ? 'border-healing bg-healing-light'
                          : 'border-border bg-card hover:border-healing/50'
                      }`}
                      disabled={isUploading}
                    >
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${
                        category === opt.value ? 'text-healing' : 'text-muted-foreground'
                      }`} />
                      <p className={`text-sm font-medium ${
                        category === opt.value ? 'text-healing' : 'text-foreground'
                      }`}>{opt.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter resource title"
                required
                disabled={isUploading}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the resource"
                rows={3}
                required
                disabled={isUploading}
                className="w-full px-4 py-3 rounded-2xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-healing resize-none"
              />
            </div>

            {/* File Upload or Link */}
            {category === 'article' ? (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Article Link *</label>
                <Input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://example.com/article"
                  required
                  disabled={isUploading}
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {category === 'video' ? 'Upload Video or YouTube Link' :
                   category === 'audio' ? 'Upload Audio File' :
                   'Upload PDF File'}
                </label>

                {/* YouTube link option for videos */}
                {category === 'video' && (
                  <div className="mb-3">
                    <Input
                      type="url"
                      value={link}
                      onChange={(e) => {
                        setLink(e.target.value);
                        setFile(null);
                      }}
                      placeholder="Or paste YouTube link"
                      disabled={isUploading}
                    />
                  </div>
                )}

                {!link && (
                  <>
                    <div className="relative">
                      <input
                        type="file"
                        id="file-upload"
                        accept={selectedCategory?.accept}
                        onChange={handleFileChange}
                        disabled={isUploading}
                        className="hidden"
                      />
                      <label
                        htmlFor="file-upload"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
                          file
                            ? 'border-healing bg-healing-light'
                            : 'border-border bg-card hover:border-healing/50'
                        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {file ? (
                          <>
                            <FileCheck className="w-8 h-8 text-healing mb-2" />
                            <p className="text-sm font-medium text-healing">{file.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{formatFileSize(file.size)}</p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                            <p className="text-sm font-medium text-foreground">Click to upload</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {category === 'video' ? 'MP4, WebM, MOV (max 100MB)' :
                               category === 'audio' ? 'MP3, WAV, OGG (max 100MB)' :
                               'PDF (max 100MB)'}
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && uploadProgress > 0 && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Uploading...</span>
                  <span className="text-healing font-medium">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-healing transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={onClose}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="healing"
                className="flex-1"
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload Resource'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResourceUploadDialog;
