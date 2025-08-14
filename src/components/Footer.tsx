export const Footer = () => {
  return (
    <footer className="ambient-header shadow-lg border-t border-accent-light/20">
      <div className="container py-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Creator Info Section */}
          <div className="flex items-center gap-4">
            <div>
              <span className="text-2xl" role="img" aria-hidden="true">👨‍💻</span>
            </div>
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold text-primary mb-1">Florian Jäger</h3>
              <p className="text-sm text-secondary">
                Developer & Creator of this Notes App
              </p>
            </div>
          </div>
          
          {/* Social Links Section */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary mr-2 hidden sm:inline">Connect with me:</span>
            
            {/* GitHub Link */}
            <a 
              href="https://github.com/flori950" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group w-12 h-12 rounded-2xl bg-accent-light hover:bg-accent flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              aria-label="GitHub Profile - flori950"
              title="Visit my GitHub Profile"
            >
              <span className="text-xl group-hover:scale-110 transition-transform duration-200" role="img" aria-hidden="true">🐙</span>
            </a>

            {/* Website Link */}
            <a 
              href="https://florian-hunter.de" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group w-12 h-12 rounded-2xl bg-accent-light hover:bg-accent flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              aria-label="Personal Website - florian-hunter.de"
              title="Visit my Personal Website"
            >
              <span className="text-xl group-hover:scale-110 transition-transform duration-200" role="img" aria-hidden="true">🌐</span>
            </a>
          </div>
        </div>
        
        {/* Copyright Section */}
        <div className="mt-8 pt-6 border-t border-accent-light/30 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-secondary">
            <span>© {new Date().getFullYear()} Note App</span>
            <span className="hidden sm:inline">•</span>
            <span>Built with ❤️ using React & TypeScript</span>
            <span className="hidden sm:inline">•</span>
            <span>Glass Morphism Design</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
