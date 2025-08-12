import React, { useEffect } from 'react';
import { ThemeControl } from '../components/ThemeControl';
import { NotesApp } from '../components/notes/NotesApp';
import { setupCSP, createHoneypot, securityManager } from '../utils/security';

export const Index = () => {
  // Initialize security features
  useEffect(() => {
    // Set up Content Security Policy
    setupCSP();
    
    // Create honeypot for bot detection
    createHoneypot();
    
    // Validate environment
    if (!securityManager.validateEnvironment()) {
      console.warn('Environment validation failed');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Premium Header */}
      <header className="ambient-header shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-accent-light flex items-center justify-center">
                  <span className="text-2xl" role="img" aria-hidden="true">📝</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-primary">Notes</h1>
                  <p className="text-sm text-secondary hidden sm:block">
                    Beautiful session-based notes with premium design
                  </p>
                </div>
              </div>
            </div>
            
            <ThemeControl />
          </div>
        </div>
      </header>

      {/* Main Content with Glass Effect */}
      <main className="flex-1 overflow-hidden p-6">
        <div className="container h-full">
          <div className="card h-full overflow-hidden">
            <NotesApp />
          </div>
        </div>
      </main>
    </div>
  );
};
