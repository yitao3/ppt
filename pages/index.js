import { useState, useEffect, useMemo } from 'react'
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

const DOTS = '...'

const range = (start, end) => {
  const length = end - start + 1
  if (length <= 0) return []
  return Array.from({ length }, (_, idx) => idx + start)
}

const usePagination = ({
  totalPages,
  siblingCount = 1,
  currentPage
}) => {
  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 5

    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPages
    )

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2

    const firstPageIndex = 1
    const lastPageIndex = totalPages

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount
      let leftRange = range(1, leftItemCount)

      return [...leftRange, DOTS, totalPages]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount
      let rightRange = range(
        totalPages - rightItemCount + 1,
        totalPages
      )
      return [firstPageIndex, DOTS, ...rightRange]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex)
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex]
    }
  }, [totalPages, siblingCount, currentPage])

  return paginationRange || []
}

export default function Home({ templates: initialTemplates }) {
  const [templates, setTemplates] = useState(initialTemplates)
  const [filteredTemplates, setFilteredTemplates] = useState(initialTemplates)
  const [sortType, setSortType] = useState('featured')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  useEffect(() => {
    // 在客户端进行筛选和排序
    let tempTemplates = [...templates];

    // Category filter
    if (selectedCategory !== 'all') {
      const categoryName = categories.find(c => c.id === selectedCategory)?.name;
      tempTemplates = tempTemplates.filter(template => template.category === categoryName)
    }

    // Sort
    if (sortType === 'featured') {
      // Assuming isFeatured comes from Supabase or derived logic
      tempTemplates.sort((a, b) => (b.featured ? 1 : -1) - (a.featured ? 1 : -1))
    } else if (sortType === 'newest') {
      tempTemplates.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } else if (sortType === 'popular') {
      tempTemplates.sort((a, b) => b.download_count - a.download_count)
    }

    setFilteredTemplates(tempTemplates)
    setCurrentPage(1) // Reset to first page on filter/sort change
  }, [selectedCategory, sortType, templates])

  const handleSort = (type) => {
    setSortType(type)
  }

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage)
  const currentItems = filteredTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const paginationRange = usePagination({
    currentPage,
    totalPages,
    siblingCount: 2,
  })

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
          <div className="hero-content">
            <h1>Professional PowerPoint Templates</h1>
            <p className="subtitle">Free Download • Premium Quality • Ready to Use</p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">150+</span>
                <span className="stat-label">Templates</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Downloads</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Free</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Templates */}
        <section className="featured-section">
          <div className="filter-controls">
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-button ${
                    selectedCategory === category.id ? 'active' : ''
                  }`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.name}
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
                {paginationRange.map((pageNumber, index) => {
                  if (pageNumber === DOTS) {
                    return <span key={`${pageNumber}-${index}`} className="pagination-number">...</span>
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`pagination-number ${
                        currentPage === pageNumber ? 'active' : ''
                      }`}
                    >
                      {pageNumber}
                    </button>
                  )
                })}
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
  try {
    const supabaseTemplates = await getTemplates();
    
    // 只保留首页需要的字段，减少数据大小
    const optimizedTemplates = supabaseTemplates.map(template => ({
      id: template.id,
      title: template.title,
      slug: template.slug,
      category: template.category,
      subcategory: template.subcategory,
      preview_url: template.preview_url,
      download_count: template.download_count || 0,
      view_count: template.view_count || 0,
      created_at: template.created_at,
      updated_at: template.updated_at,
      featured: template.featured || false
    }));

    return {
      props: {
        templates: optimizedTemplates,
      },
    };
  } catch (error) {
    console.error('Error fetching templates:', error);
  return {
    props: {
        templates: [],
    },
    };
  }
} 