// SEO-Optimierungen für die Landingpage
import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "HochzeitsappReally - Ihre perfekte Hochzeitsplanung",
  description = "HochzeitsappReally ist Ihre All-in-One-Lösung für eine stressfreie Hochzeitsplanung. Gästemanagement, Budgetplanung, Sitzordnung und mehr.",
  keywords = "Hochzeitsplanung, Hochzeitsapp, Gästemanagement, Budgetplanung, Hochzeit, Sitzordnung, Gästeliste, Hochzeitsorganisation",
  canonicalUrl = "https://hochzeitsapp-really.vercel.app",
  ogImage = "/images/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image"
}) => {
  return (
    <Helmet>
      {/* Grundlegende Meta-Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="theme-color" content="#e8a598" />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Meta-Tags für soziale Medien */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="HochzeitsappReally" />
      <meta property="og:locale" content="de_DE" />
      
      {/* Twitter Card Meta-Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Strukturierte Daten für Google */}
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "HochzeitsappReally",
            "applicationCategory": "LifestyleApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR"
            },
            "description": "${description}"
          }
        `}
      </script>
      
      {/* Weitere SEO-relevante Meta-Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="HochzeitsappReally Team" />
      <meta name="language" content="German" />
    </Helmet>
  );
};

export default SEO;
