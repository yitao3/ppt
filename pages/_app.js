import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Viewport Meta Tag */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Default SEO Meta Tags */}
        <title>Professional PowerPoint Templates - Free Download | Templates</title>
        <meta name="description" content="Download professional PowerPoint templates for free. High-quality business, corporate, marketing, and creative presentation templates. Ready-to-use designs for your next presentation." />
        <meta name="keywords" content="PowerPoint templates, presentation templates, business templates, free download, professional presentations, corporate templates, marketing templates" />
        <meta name="author" content="Templates" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Professional PowerPoint Templates - Free Download" />
        <meta property="og:description" content="Download professional PowerPoint templates for free. High-quality business, corporate, marketing, and creative presentation templates." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.freepowerpointslides.com" />
        <meta property="og:image" content="https://www.freepowerpointslides.com/logo-brand.png" />
        <meta property="og:site_name" content="Templates" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Professional PowerPoint Templates - Free Download" />
        <meta name="twitter:description" content="Download professional PowerPoint templates for free. High-quality business, corporate, marketing, and creative presentation templates." />
        <meta name="twitter:image" content="https://www.freepowerpointslides.com/logo-brand.png" />
        
        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#007aff" />
        <link rel="canonical" href="https://www.freepowerpointslides.com" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp; 