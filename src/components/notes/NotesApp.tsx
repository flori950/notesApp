import { useState, useCallback } from 'react';
import { useSessionStorage } from '../../hooks/use-session-storage';
import { securityManager } from '../../utils/security';
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
export const NotesApp = () => {
  const [notes, setNotes] = useSessionStorage<Note[]>('notes', []);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

  // Export note to PDF with dynamic import
  const exportToPDF = useCallback(async (note: Note) => {
    try {
      // Dynamic import for jsPDF to reduce initial bundle size
      const { default: jsPDF } = await import('jspdf');
      
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
    <div className="flex flex-col lg:flex-row h-full rounded-none lg:rounded-3xl overflow-hidden relative">
      
      {/* Mobile Header - Only visible on mobile */}
      <div className="lg:hidden bg-bg-elevated border-b border-glass p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 rounded-xl bg-glass border border-glass"
          >
            <span className="text-xl">☰</span>
          </button>
          <h1 className="text-lg font-bold text-primary">Notes</h1>
        </div>
        <button
          onClick={createNote}
          className="btn btn-primary btn-sm"
        >
          <span role="img" aria-hidden="true">✨</span>
          New
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      {/* Glass Sidebar - Responsive */}
      <div className={`
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
        w-80 lg:w-96 
        bg-sidebar flex flex-col
        transition-transform duration-300 ease-in-out
      `}>
        {/* Sidebar Header - Hidden on mobile (shown in mobile header instead) */}
        <div className="hidden lg:block p-8 border-b border-glass">
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
              className="w-full px-4 py-3 rounded-2xl bg-card border-glass"
            />
          </div>
        </div>

        {/* Mobile Search - Only visible on mobile */}
        <div className="lg:hidden p-4 border-b border-glass">
          <div className="relative">
            <input
              type="text"
              placeholder="Search your notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-card border-glass"
            />
          </div>
        </div>

        {/* Premium Notes List */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {filteredNotes.length === 0 ? (
            <div className="p-4 lg:p-8 text-center">
              <div className="text-3xl lg:text-4xl mb-4">📝</div>
              <p className="text-tertiary text-sm lg:text-base">
                {searchTerm ? 'No notes match your search' : 'Create your first note to get started'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNotes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => {
                    setSelectedNoteId(note.id);
                    setIsMobileSidebarOpen(false); // Close sidebar on mobile when note is selected
                  }}
                  className={`note-item w-full p-4 lg:p-6 text-left rounded-2xl transition-all duration-300 ${
                    selectedNoteId === note.id ? 'selected' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2 lg:mb-3">
                    <h3 className="font-semibold text-primary truncate flex-1 text-base lg:text-lg">
                      {note.title || 'Untitled Note'}
                    </h3>
                    <span className="text-xs text-tertiary ml-2 lg:ml-4 flex-shrink-0 font-medium">
                      {formatDate(note.updatedAt)}
                    </span>
                  </div>
                  <p className="text-sm text-secondary line-clamp-2 lg:line-clamp-3 leading-relaxed">
                    {note.content || 'No content'}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Premium Glass Editor - Responsive */}
      <div className="flex-1 flex flex-col min-h-0">
        {selectedNote ? (
          <>
            {/* Premium Editor Header - Responsive */}
            <div className="p-4 lg:p-8 border-b border-glass bg-bg-elevated backdrop-filter backdrop-blur-xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={selectedNote.title}
                    onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                    className="text-xl lg:text-3xl font-bold bg-transparent border-none p-0 focus:outline-none focus:ring-0 w-full"
                    placeholder="Note title..."
                    onKeyDown={(e) => {
                      // Allow all normal characters including spaces
                      if (e.key === ' ') {
                        e.stopPropagation();
                      }
                    }}
                  />
                  {/* Elegant Last Updated - Subtle and Beautiful */}
                  <div className="flex items-center gap-2 mt-2 lg:mt-3">
                    <div className="w-2 h-2 rounded-full bg-accent-color opacity-60"></div>
                    <span className="text-xs text-tertiary font-medium">
                      Last edited {formatDate(selectedNote.updatedAt)}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons - Responsive */}
                <div className="flex items-center gap-2 lg:gap-3 justify-end lg:justify-start">
                  <button
                    onClick={() => exportToPDF(selectedNote)}
                    className="group relative p-2 lg:p-3 rounded-xl lg:rounded-2xl bg-glass border border-glass hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                    title="Export to PDF"
                  >
                    <span role="img" aria-hidden="true" className="text-lg lg:text-xl group-hover:scale-110 transition-transform duration-200">📄</span>
                  </button>
                  <button
                    onClick={() => deleteNote(selectedNote.id)}
                    className="group relative p-2 lg:p-3 rounded-xl lg:rounded-2xl bg-glass border border-glass hover:border-red-300 hover:bg-red-50 transition-all duration-300"
                    title="Delete note"
                  >
                    <span role="img" aria-hidden="true" className="text-lg lg:text-xl group-hover:scale-110 transition-transform duration-200">🗑️</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Premium Editor Content - Responsive */}
            <div className="flex-1 p-4 lg:p-8 min-h-0">
              <textarea
                value={selectedNote.content}
                onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
                placeholder="Start writing your thoughts..."
                className="w-full h-full resize-none border-none p-0 focus:outline-none focus:ring-0 bg-transparent text-base lg:text-lg leading-relaxed"
                style={{ minHeight: '200px' }}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-6 lg:p-12">
            <div className="max-w-md">
              <div className="w-16 h-16 lg:w-24 lg:h-24 mx-auto mb-6 lg:mb-8 rounded-2xl lg:rounded-3xl bg-accent-light flex items-center justify-center">
                <span className="text-3xl lg:text-4xl" role="img" aria-hidden="true">📝</span>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-4 text-primary">Ready to write?</h3>
              <p className="text-secondary mb-6 lg:mb-8 leading-relaxed text-sm lg:text-base">
                {window.innerWidth < 1024 ? 'Tap the menu to see your notes or create a new one.' : 'Select a note from the sidebar to start editing, or create a new one to capture your thoughts.'}
              </p>
              <button onClick={createNote} className="btn btn-primary btn-lg">
                <span role="img" aria-hidden="true">✨</span>
                Create your first note
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Smooth Non-Intrusive Toast Notifications - Responsive */}
      {toast && (
        <div className="fixed top-4 lg:top-6 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none px-4 lg:px-0">
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
