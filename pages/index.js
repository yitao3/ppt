import { useState, useEffect } from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import TemplateCard from '../components/TemplateCard'
import Stats from '../components/Stats'
import Footer from '../components/Footer'
import { getTemplates } from '../lib/supabase'
// import { templates as mockTemplates } from '../lib/mockData' // Removed mock data import

const categories = [
  { id: 'all', name: 'All' },
  { id: 'business-corporate', name: 'Business & Corporate' },
  { id: 'education-training', name: 'Education & Training' },
  { id: 'marketing-sales', name: 'Marketing & Sales' },
  { id: 'technology-startups', name: 'Technology & Startups' },
  { id: 'healthcare-medical', name: 'Healthcare & Medical' },
  { id: 'finance-investment', name: 'Finance & Investment' },
  { id: 'creative-design', name: 'Creative & Design' },
  { id: 'events-celebrations', name: 'Events & Celebrations' },
  { id: 'non-profit-social', name: 'Non-profit & Social' },
  { id: 'personal-lifestyle', name: 'Personal & Lifestyle' }
]

export default function Home({ templates: initialTemplates }) {
  const [templates, setTemplates] = useState(initialTemplates)
  const [filteredTemplates, setFilteredTemplates] = useState(initialTemplates)
  const [sortType, setSortType] = useState('featured')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  useEffect(() => {
    // 在客户端进行筛选和排序
    let tempTemplates = [...templates];

    // Category filter
    if (selectedCategory !== 'All') {
      tempTemplates = tempTemplates.filter(template => template.category === selectedCategory)
    }

    // Sort
    if (sortType === 'featured') {
      // Assuming isFeatured comes from Supabase or derived logic
      tempTemplates.sort((a, b) => (b.isFeatured ? 1 : -1) - (a.isFeatured ? 1 : -1))
    } else if (sortType === 'newest') {
      tempTemplates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortType === 'popular') {
      tempTemplates.sort((a, b) => b.downloadCount - a.downloadCount)
    }

    setFilteredTemplates(tempTemplates)
    setCurrentPage(1) // Reset to first page on filter/sort change
  }, [selectedCategory, sortType, templates])

  const handleSort = (type) => {
    setSortType(type)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage)
  const currentItems = filteredTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      <Head>
        <title>Professional PowerPoint Templates - Free Download | Templates</title>
        <meta name="description" content="Download professional PowerPoint templates for free. High-quality business, corporate, marketing, and creative presentation templates. Ready-to-use designs for your next presentation." />
        <meta name="keywords" content="PowerPoint templates, presentation templates, business templates, free download, professional presentations, corporate templates, marketing templates" />
        
        {/* Open Graph for Homepage */}
        <meta property="og:title" content="Professional PowerPoint Templates - Free Download" />
        <meta property="og:description" content="Download professional PowerPoint templates for free. High-quality business, corporate, marketing, and creative presentation templates." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.freepowerpointslides.com" />
        <meta property="og:image" content="https://www.freepowerpointslides.com/logo-brand.png" />
        
        {/* Twitter Card for Homepage */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Professional PowerPoint Templates - Free Download" />
        <meta name="twitter:description" content="Download professional PowerPoint templates for free. High-quality business, corporate, marketing, and creative presentation templates." />
        <meta name="twitter:image" content="https://www.freepowerpointslides.com/logo-brand.png" />
        
        <link rel="canonical" href="https://www.freepowerpointslides.com" />
      </Head>

      <Header />

      <main>
        {/* Hero Section */}
        <section className="hero">
          <h1>Unleash Your Ideas with Stunning PPT Templates.</h1>
          <p className="subtitle">High-Quality, Modern, and Easy-to-Use Templates for Every Need.</p>
          <p className="description">
            Discover thousands of professionally designed PowerPoint, Google Slides, and Keynote templates.
            Perfect for business, education, creative projects, and more.
          </p>
        </section>

        {/* Featured Templates */}
        <section className="featured-section">
          <div className="filter-controls">
            <div className="category-filters">
              {[ 'All', ...Array.from(new Set(templates.map(t => t.category))) ].map(category => (
                <button
                  key={category}
                  className={`category-button ${
                    selectedCategory === category ? 'active' : ''
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="sort-controls">
              <button
                className={`sort-button ${
                  sortType === 'featured' ? 'active' : ''
                }`}
                onClick={() => handleSort('featured')}
              >
                Featured
              </button>
              <button
                className={`sort-button ${
                  sortType === 'newest' ? 'active' : ''
                }`}
                onClick={() => handleSort('newest')}
              >
                Newest
              </button>
              <button
                className={`sort-button ${
                  sortType === 'popular' ? 'active' : ''
                }`}
                onClick={() => handleSort('popular')}
              >
                Popular
              </button>
            </div>
          </div>
          <div className="templates-grid">
            {currentItems.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>
              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`pagination-number ${
                      currentPage === i + 1 ? 'active' : ''
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </section>
        
        <Stats />

      </main>

      <Footer />
    </div>
  )
}

export async function getServerSideProps() {
  const supabaseTemplates = await getTemplates();

  return {
    props: {
      templates: supabaseTemplates,
    },
  };
} 