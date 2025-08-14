import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export const SEOHead = ({
  title = "Notes App - Modern Note Taking by Florian Jäger",
  description = "A beautiful and intuitive note-taking application with dark mode support, real-time search, and session storage. Created by Florian Jäger with modern web technologies.",
  keywords = "notes, note taking, productivity, dark mode, session storage, PWA, modern UI, glass morphism, Florian Jäger",
  ogImage = "/og-image.png",
  canonicalUrl = "https://florian-hunter.de"
}: SEOHeadProps) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Florian Jäger" />
      <meta name="creator" content="Florian Jäger" />
      <meta name="publisher" content="Florian Jäger" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Viewport and Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Note App" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Notes App - Modern Note Taking by Florian Jäger" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Notes App by Florian Jäger" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content="Notes App - Modern Note Taking by Florian Jäger" />
      <meta name="twitter:site" content="@flori950" />
      <meta name="twitter:creator" content="@flori950" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#007AFF" />
      <meta name="msapplication-TileColor" content="#007AFF" />
      <meta name="msapplication-navbutton-color" content="#007AFF" />
      <meta name="application-name" content="Notes App" />
      <meta name="msapplication-tooltip" content="Notes App - Modern Note Taking" />
      <meta name="msapplication-starturl" content="/" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Notes App",
          "description": description,
          "url": canonicalUrl,
          "applicationCategory": "ProductivityApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "author": {
            "@type": "Person",
            "name": "Florian Jäger",
            "url": "https://florian-hunter.de",
            "sameAs": [
              "https://github.com/flori950",
              "https://florian-hunter.de"
            ]
          },
          "creator": {
            "@type": "Person",
            "name": "Florian Jäger",
            "url": "https://florian-hunter.de"
          }
        })}
      </script>
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Favicon and App Icons */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/svg+xml" href="/favicon-emoji.svg" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#007AFF" />
      
      {/* PWA Manifest */}
      <link rel="manifest" href="/manifest.json" />
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
    </Helmet>
  );
};
