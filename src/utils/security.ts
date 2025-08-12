// Security and Bot Protection Utilities

interface RateLimitEntry {
  count: number;
  lastAction: number;
  blocked: boolean;
}

class SecurityManager {
  private rateLimits: Map<string, RateLimitEntry> = new Map();
  private readonly MAX_ACTIONS_PER_MINUTE = 200; // Much more generous for typing
  private readonly BLOCK_DURATION_MS = 10 * 1000; // Shorter block duration - 10 seconds
  private readonly CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

  constructor() {
    // Cleanup old entries periodically
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL_MS);
    
    // Basic bot detection
    this.detectBots();
  }

  /**
   * Rate limiting for actions
   */
  checkRateLimit(action: string): boolean {
    const now = Date.now();
    const key = `${action}_${this.getClientId()}`;
    const entry = this.rateLimits.get(key);

    if (!entry) {
      this.rateLimits.set(key, { count: 1, lastAction: now, blocked: false });
      return true;
    }

    // Reset count if more than 30 seconds has passed (more typing-friendly)
    if (now - entry.lastAction > 30 * 1000) {
      entry.count = 1;
      entry.lastAction = now;
      entry.blocked = false;
      return true;
    }

    // Check if blocked
    if (entry.blocked && now - entry.lastAction < this.BLOCK_DURATION_MS) {
      return false;
    }

    // Increment count
    entry.count++;
    entry.lastAction = now;

    // Block if too many actions
    if (entry.count > this.MAX_ACTIONS_PER_MINUTE) {
      entry.blocked = true;
      console.warn(`Rate limit exceeded for action: ${action}`);
      return false;
    }

    return true;
  }

  /**
   * Basic bot detection
   */
  private detectBots(): void {
    // Check for headless browsers
    if (navigator.webdriver) {
      console.warn('Automated browser detected');
    }

    // Check for missing features that indicate a bot
    if (!window.navigator.languages || 
        !window.screen || 
        !window.history) {
      console.warn('Potential bot detected - missing browser features');
    }

    // Check for rapid-fire events (basic behavioral analysis)
    let eventCount = 0;
    const eventWindow = 1000; // 1 second

    ['click', 'keydown', 'mousemove'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        eventCount++;
        setTimeout(() => eventCount--, eventWindow);
        
        if (eventCount > 500) { // Much more lenient - 500 events per second
          console.warn('Suspicious activity detected - too many events');
        }
      });
    });
  }

  /**
   * Get a client identifier (simplified)
   */
  private getClientId(): string {
    // Create a simple client ID based on browser characteristics
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Client fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return hash.toString();
  }

  /**
   * Input sanitization
   */
  sanitizeInput(input: string): string {
    // Basic XSS prevention - preserve spaces for normal text
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .slice(0, 10000); // Limit length but don't trim spaces
  }

  /**
   * Clean up old rate limit entries
   */
  private cleanup(): void {
    const now = Date.now();
    const cutoff = now - (10 * 60 * 1000); // 10 minutes ago

    for (const [key, entry] of this.rateLimits.entries()) {
      if (entry.lastAction < cutoff) {
        this.rateLimits.delete(key);
      }
    }
  }

  /**
   * Check if the environment seems legitimate
   */
  validateEnvironment(): boolean {
    // Check for common bot indicators
    const botIndicators = [
      !window.navigator.cookieEnabled,
      !window.localStorage,
      !window.sessionStorage,
      navigator.userAgent.includes('bot'),
      navigator.userAgent.includes('crawl'),
      navigator.userAgent.includes('spider'),
      !document.hasFocus && document.hidden, // Hidden/unfocused tabs
    ];

    const suspiciousCount = botIndicators.filter(Boolean).length;
    
    if (suspiciousCount > 2) {
      console.warn('Environment validation failed - potential bot');
      return false;
    }

    return true;
  }
}

// Export singleton instance
export const securityManager = new SecurityManager();

// Content Security Policy helper
export const setupCSP = (): void => {
  // Add CSP meta tag if not already present
  if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'", // Vite requires unsafe-inline for dev
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');
    
    document.head.appendChild(cspMeta);
  }
};

// Honey pot for bot detection
export const createHoneypot = (): void => {
  const honeypot = document.createElement('input');
  honeypot.type = 'text';
  honeypot.name = 'website'; // Common bot target field
  honeypot.style.cssText = 'position:absolute;left:-9999px;opacity:0;pointer-events:none;';
  honeypot.tabIndex = -1;
  honeypot.setAttribute('aria-hidden', 'true');
  
  // If this field gets filled, it's likely a bot
  honeypot.addEventListener('input', () => {
    console.warn('Honeypot triggered - bot detected');
  });
  
  document.body.appendChild(honeypot);
};
