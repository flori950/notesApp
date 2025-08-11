import React, { useState, useCallback } from 'react';
import { useSessionStorage } from '../../hooks/use-session-storage';
import { securityManager } from '../../utils/security';
import jsPDF from 'jspdf';
import { Toast as ToastComponent } from '../ui/Toast';

// Types
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Main NotesApp component
export const NotesApp: React.FC = () => {
  const [notes, setNotes] = useSessionStorage<Note[]>('notes', []);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const selectedNote = notes.find(note => note.id === selectedNoteId) || null;

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Filter notes based on search term
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Create new note
  const createNote = useCallback(() => {
    // Rate limiting check
    if (!securityManager.checkRateLimit('create_note')) {
      showToast('Too many actions. Please wait a moment.', 'error');
      return;
    }

    const now = new Date().toISOString();
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'Untitled Note',
      content: '',
      createdAt: now,
      updatedAt: now,
    };

    setNotes(prev => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    showToast('New note created', 'success');
  }, [setNotes, showToast]);

  // Update note with autosave
  const updateNote = useCallback((noteId: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    // Rate limiting check
    if (!securityManager.checkRateLimit('update_note')) {
      return;
    }

    // Sanitize inputs
    const sanitizedUpdates: Partial<Omit<Note, 'id' | 'createdAt'>> = {};
    if (updates.title !== undefined) {
      sanitizedUpdates.title = securityManager.sanitizeInput(updates.title);
    }
    if (updates.content !== undefined) {
      sanitizedUpdates.content = securityManager.sanitizeInput(updates.content);
    }

    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, ...sanitizedUpdates, updatedAt: new Date().toISOString() }
        : note
    ));
  }, [setNotes]);

  // Export note to PDF
  const exportToPDF = useCallback((note: Note) => {
    try {
      const pdf = new jsPDF();
      
      // Set font and title
      pdf.setFontSize(20);
      pdf.text(note.title || 'Untitled Note', 20, 30);
      
      // Add date
      pdf.setFontSize(12);
      pdf.text(`Created: ${formatDate(note.createdAt)}`, 20, 45);
      pdf.text(`Updated: ${formatDate(note.updatedAt)}`, 20, 55);
      
      // Add content
      pdf.setFontSize(11);
      const splitContent = pdf.splitTextToSize(note.content || 'No content', 170);
      pdf.text(splitContent, 20, 75);
      
      // Save the PDF
      const fileName = `${note.title || 'note'}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      showToast('Note exported to PDF successfully', 'success');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      showToast('Failed to export note to PDF', 'error');
    }
  }, [showToast]);

  // Delete note
  const deleteNote = useCallback((noteId: string) => {
    // Rate limiting check
    if (!securityManager.checkRateLimit('delete_note')) {
      showToast('Too many actions. Please wait a moment.', 'error');
      return;
    }

    const noteToDelete = notes.find(note => note.id === noteId);
    if (!noteToDelete) return;

    setNotes(prev => prev.filter(note => note.id !== noteId));
    
    // Clear selection if deleted note was selected
    if (selectedNoteId === noteId) {
      setSelectedNoteId(null);
    }
    
    showToast(`Deleted "${noteToDelete.title}"`, 'success');
  }, [notes, selectedNoteId, setNotes, showToast]);

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="flex h-full rounded-3xl overflow-hidden">
      {/* Glass Sidebar */}
      <div className="w-96 bg-sidebar flex flex-col">
        {/* Sidebar Header */}
        <div className="p-8 border-b border-glass">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-primary">Your Notes</h2>
              <p className="text-sm text-tertiary mt-1">{notes.length} total</p>
            </div>
            <button
              onClick={createNote}
              className="btn btn-primary btn-sm"
              title="Create new note"
            >
              <span role="img" aria-hidden="true">✨</span>
              New Note
            </button>
          </div>

          {/* Premium Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search your notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-card border-glass"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔍</span>
          </div>
        </div>

        {/* Premium Notes List */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {filteredNotes.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-tertiary">
                {searchTerm ? 'No notes match your search' : 'Create your first note to get started'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNotes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`note-item w-full p-6 text-left rounded-2xl transition-all duration-300 ${
                    selectedNoteId === note.id ? 'selected' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-primary truncate flex-1 text-lg">
                      {note.title || 'Untitled Note'}
                    </h3>
                    <span className="text-xs text-tertiary ml-4 flex-shrink-0 font-medium">
                      {formatDate(note.updatedAt)}
                    </span>
                  </div>
                  <p className="text-sm text-secondary line-clamp-3 leading-relaxed">
                    {note.content || 'No content'}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Premium Glass Editor */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            {/* Premium Editor Header */}
            <div className="p-8 border-b border-glass bg-bg-elevated backdrop-filter backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-6">
                  <input
                    type="text"
                    value={selectedNote.title}
                    onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                    className="text-3xl font-bold bg-transparent border-none p-0 focus:outline-none focus:ring-0 w-full"
                    placeholder="Note title..."
                  />
                  {/* Elegant Last Updated - Subtle and Beautiful */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-2 h-2 rounded-full bg-accent-color opacity-60"></div>
                    <span className="text-xs text-tertiary font-medium">
                      Last edited {formatDate(selectedNote.updatedAt)}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => exportToPDF(selectedNote)}
                    className="group relative p-3 rounded-2xl bg-glass border border-glass hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                    title="Export to PDF"
                  >
                    <span role="img" aria-hidden="true" className="text-xl group-hover:scale-110 transition-transform duration-200">📄</span>
                  </button>
                  <button
                    onClick={() => deleteNote(selectedNote.id)}
                    className="group relative p-3 rounded-2xl bg-glass border border-glass hover:border-red-300 hover:bg-red-50 transition-all duration-300"
                    title="Delete note"
                  >
                    <span role="img" aria-hidden="true" className="text-xl group-hover:scale-110 transition-transform duration-200">🗑️</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Premium Editor Content */}
            <div className="flex-1 p-8">
              <textarea
                value={selectedNote.content}
                onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
                placeholder="Start writing your thoughts..."
                className="w-full h-full resize-none border-none p-0 focus:outline-none focus:ring-0 bg-transparent text-lg leading-relaxed"
                style={{ minHeight: 'calc(100vh - 300px)' }}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-12">
            <div className="max-w-md">
              <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-accent-light flex items-center justify-center">
                <span className="text-4xl" role="img" aria-hidden="true">📝</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary">Ready to write?</h3>
              <p className="text-secondary mb-8 leading-relaxed">
                Select a note from the sidebar to start editing, or create a new one to capture your thoughts.
              </p>
              <button onClick={createNote} className="btn btn-primary btn-lg">
                <span role="img" aria-hidden="true">✨</span>
                Create your first note
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Smooth Non-Intrusive Toast Notifications */}
      {toast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
          <div className="pointer-events-auto">
            <ToastComponent
              message={toast.message}
              type={toast.type}
              onClose={hideToast}
            />
          </div>
        </div>
      )}
    </div>
  );
};
