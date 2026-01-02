import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MoodJournalDialogProps {
  mood: {
    emoji: string;
    label: string;
  };
  onSave: (note: string) => void;
  onClose: () => void;
}

export const MoodJournalDialog = ({ mood, onSave, onClose }: MoodJournalDialogProps) => {
  const [note, setNote] = useState('');

  const handleSave = () => {
    onSave(note);
    setNote('');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{mood.emoji}</span>
              <div>
                <h3 className="text-xl font-bold text-foreground">Feeling {mood.label}</h3>
                <p className="text-sm text-muted-foreground">Add a note (optional)</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Journal Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              What's on your mind?
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
              placeholder="Share your thoughts... (This is private and only visible to you)"
              className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              rows={6}
              autoFocus
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground">
                {note.length}/500 characters
              </p>
              <p className="text-xs text-purple-600">
                🔒 Private & encrypted
              </p>
            </div>
          </div>

          {/* Prompts */}
          <div className="mb-6 p-4 bg-purple-50 rounded-xl">
            <p className="text-sm font-medium text-foreground mb-2">Writing prompts:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• What happened today that made you feel this way?</li>
              <li>• What are you grateful for right now?</li>
              <li>• What would make you feel better?</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Mood {note && '& Note'}
            </Button>
            <Button
              onClick={() => onSave('')}
              variant="outline"
              className="flex-1"
            >
              Skip & Save
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
