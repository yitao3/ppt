import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
// import { templates as mockTemplates } from '../../data/templates' // 导入模拟数据并重命名
import { createClient } from '@supabase/supabase-js' // 导入 Supabase 客户端
import { logDownload, logVisit, getTemplates, getTemplateBySlug } from '../../lib/supabase' // 导入日志记录函数和数据获取函数

// Initialize Supabase client (only for client-side interactions where needed)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// R2 public URL (与 test 页面保持一致)
const R2_PUBLIC_URL = 'https://pub-4876cf14303b4b36a5cc53d21e13d078.r2.dev'

// 图片重试配置 (与 test 页面保持一致)
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1秒

export default function TemplateDetail({ template }) {
  const router = useRouter()
  const [isDownloading, setIsDownloading] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  // template 状态现在从 props 获取，不需要 useState(null)
  // const [loading, setLoading] = useState(true) // 加载状态不再由客户端 useEffect 管理
  const [error, setError] = useState(null) // 错误状态
  const [retryCounts, setRetryCounts] = useState({}) // 图片重试计数
  const hasLoggedVisit = useRef(false) // 添加一个 ref 来跟踪是否已经记录过访问量

  // 记录访问量 (在客户端加载后触发，且只触发一次)
  useEffect(() => {
    if (template && template.id && !hasLoggedVisit.current) {
      console.log('Logging visit for template ID:', template.id);
      logVisit(template.id);
      hasLoggedVisit.current = true; // 标记已经记录过访问量
    }
  }, [template]);

  // fetchTemplate 函数不再需要，数据通过 getStaticProps 获取
  // const fetchTemplate = async (templateSlug) => { ... }

  // 幻灯片数据 (现在从 template 状态中获取)
  const slides = template?.ppt_previews?.map(p => ({
    title: template?.title, // 可以根据实际需求调整
    subtitle: `Page ${p.page_number}`, // 可以根据实际需求调整
    gradient: template?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // 使用模板的梯度或默认值
    preview_url: p.preview_url
  })) || [
    // 如果没有预览图，提供一个默认幻灯片
    {
      title: template?.title || 'No Preview',
      subtitle: 'Preview not available',
      gradient: template?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  ];

  // 图片错误处理函数
  const handleImageError = (e, imageId, isThumbnail = false) => {
    const currentRetries = retryCounts[imageId] || 0;
    
    if (currentRetries < MAX_RETRIES) {
      console.log(`Retrying image load (${currentRetries + 1}/${MAX_RETRIES}):`, e.target.src);
      
      setRetryCounts(prev => ({
        ...prev,
        [imageId]: currentRetries + 1
      }));

      setTimeout(() => {
        e.target.src = e.target.src;
      }, RETRY_DELAY);
    } else {
      console.error('Image load failed after retries:', e.target.src);
      e.target.onerror = null;
      e.target.src = isThumbnail ? '/placeholder-thumb.jpg' : '/placeholder-image.jpg';
    }
  };

  // 加载状态现在由 getStaticProps 处理，如果 template 为空则显示 Not Found
  if (router.isFallback) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading template...</p>
      </div>
    )
  }

  // 如果模板未找到
  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Template not found</h1>
            <p className="mt-4 text-gray-600">The template you're looking for doesn't exist or an error occurred.</p>
            <button
              onClick={() => router.push('/')}
              className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleDownload = async () => {
    console.log('handleDownload called.');
    setIsDownloading(true)
    try {
      // 从template中获取文件URL
      const fileUrl = `${R2_PUBLIC_URL}/${template.r2_file_key}`
      
      // 记录下载量
      console.log('Attempting to log download for ID:', template.id);
      await logDownload(template.id) // 使用模板的真实 ID 记录下载量

      // 创建一个临时的a标签来触发下载
      const link = document.createElement('a')
      link.href = fileUrl
      link.download = `${template.title || 'presentation'}.pptx` // 设置下载文件名
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download failed:', error)
      // 可以在这里添加错误提示
    } finally {
      setIsDownloading(false)
    }
  }

  const nextSlide = () => {
    const nextIndex = (currentSlide + 1) % slides.length
    setCurrentSlide(nextIndex)
    goToSlide(nextIndex)
  }

  const prevSlide = () => {
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length
    setCurrentSlide(prevIndex)
    goToSlide(prevIndex)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
    // 获取被点击的缩略图元素
    const thumbnailElement = document.getElementById(`thumbnail-${index}`)
    if (thumbnailElement) {
      // 获取缩略图容器的宽度
      const container = thumbnailElement.parentElement
      const containerWidth = container.offsetWidth
      
      // 计算目标滚动位置，使被点击的缩略图居中
      const thumbnailWidth = thumbnailElement.offsetWidth
      const scrollLeft = thumbnailElement.offsetLeft - (containerWidth / 2) + (thumbnailWidth / 2)
      
      // 平滑滚动到目标位置
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      <Header />
      <main>
        {/* Main Title Section */}
        <section className="py-[30px] text-center">
          <div className="max-w-[1200px] mx-auto px-5">
            <h1 className="text-[48px] font-bold text-[#1d1d1f] mb-4 tracking-tight">{template.title}</h1>
            <div className="flex items-center justify-center gap-4">
              {/* Category */}
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-medium text-gray-700">Category:</span>
                <span className="px-3 py-1.5 bg-[#f5f5f7] text-[#007aff] rounded-[20px] text-sm font-medium border border-gray-200">
                  {template.category}
                </span>
              </div>

              {/* Subcategory */}
              {template.subcategory && (
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-medium text-gray-700">Subcategory:</span>
                  <span className="px-3 py-1.5 bg-[#f5f5f7] text-[#007aff] rounded-[20px] text-sm font-medium border border-gray-200">
                    {template.subcategory}
                  </span>
                </div>
              )}

              {/* Tag */}
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-medium text-gray-700">Tag:</span>
                <span className="px-3 py-1.5 bg-[#f5f5f7] text-[#007aff] rounded-[20px] text-sm font-medium border border-gray-200">
                  presentation
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="pt-[40px] pb-[100px]">
          <div className="max-w-[1350px] mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 items-start">
              {/* Left - Preview Section */}
              <div className="relative max-w-[804px]">
                <div className="relative bg-white rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] overflow-hidden aspect-[16/9] border border-gray-100 mb-6 transition-transform duration-300">
                  <div className="w-full h-full relative overflow-hidden">
                    {template.ppt_previews && template.ppt_previews.length > 0 ? (
                      <img
                        src={template.ppt_previews[currentSlide].preview_url}
                        alt={`Preview of ${template.title} - Slide ${template.ppt_previews[currentSlide].page_number}`}
                        className="absolute inset-0 w-full h-full object-contain bg-white"
                        style={{ opacity: 1 }}
                        onError={(e) => handleImageError(e, `detail-preview-${template.id}-${template.ppt_previews[currentSlide].id}`)}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <span className="text-gray-500">No preview available</span>
                      </div>
                    )}
                  </div>

                  {/* Page Number Display */}
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    {currentSlide + 1}/{template.ppt_previews?.length || 1}
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute top-1/2 -translate-y-1/2 left-4 w-12 h-12 bg-white/95 backdrop-blur-[20px] border border-[rgba(0,0,0,0.08)] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white hover:scale-108 hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] z-10"
                  >
                    <svg className="w-[18px] h-[18px] fill-[#1d1d1f]" viewBox="0 0 24 24">
                      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute top-1/2 -translate-y-1/2 right-4 w-12 h-12 bg-white/95 backdrop-blur-[20px] border border-[rgba(0,0,0,0.08)] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white hover:scale-108 hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] z-10"
                  >
                    <svg className="w-[18px] h-[18px] fill-[#1d1d1f]" viewBox="0 0 24 24">
                      <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                    </svg>
                  </button>
                </div>

                {/* Thumbnail Navigation */}
                <div className="flex overflow-x-auto gap-4 pb-4 pt-2 custom-scrollbar snap-x snap-mandatory scroll-smooth">
                  {template.ppt_previews?.map((preview, index) => (
                    <button
                      key={preview.id}
                      id={`thumbnail-${index}`}
                      onClick={() => goToSlide(index)}
                      className={`flex-shrink-0 w-[calc(20%-16px)] aspect-[16/9] rounded-lg overflow-hidden border-2 transition-all duration-300 snap-center ${
                        currentSlide === index
                          ? 'border-blue-500 shadow-lg scale-[1.02]'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <div className="w-full h-full relative">
                        <img
                          src={preview.thumbnail_url}
                          alt={`Thumbnail ${index + 1}`}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => handleImageError(e, `thumbnail-${preview.id}`, true)}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right - Info Section */}
              <div className="bg-white rounded-[20px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] w-[380px]">
                <div className="h-[84px] mb-4">
                  <h2 className="text-[28px] font-semibold text-[#1d1d1f] leading-tight">{template.title}</h2>
                </div>
                <div className="relative group mb-6">
                  <div className="h-[102px] overflow-hidden">
                    <p className="text-[17px] text-[#515154] leading-[1.5] line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                      {template.description || '这是一套精心设计的商务简约风格PPT模板，采用现代化的设计理念和清晰的布局结构，适用于企业汇报、产品发布、项目展示等多种商务场景。模板包含丰富的页面样式，让您的演示更加专业和出色。'}
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-300"></div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 text-gray-700">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    <span className="text-[13px] font-semibold flex-shrink-0">Downloads:</span>
                    <span className="text-[13px]">{template.downloads || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <span className="text-[13px] font-semibold flex-shrink-0">Views:</span>
                    <span className="text-[13px]">{template.views || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    <span className="text-[13px] font-semibold flex-shrink-0">File Size:</span>
                    <span className="text-[13px]">{(template.file_size / (1024 * 1024)).toFixed(2)}M</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    </svg>
                    <span className="text-[13px] font-semibold flex-shrink-0">Slides:</span>
                    <span className="text-[13px]">{template.slides || 36}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    </svg>
                    <span className="text-[13px] font-semibold flex-shrink-0">Aspect Ratio:</span>
                    <span className="text-[13px]">{template.aspect_ratio || '16:9'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                    <span className="text-[13px] font-semibold flex-shrink-0">Format:</span>
                    <span className="text-[13px]">{template.format || 'PPTX'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span className="text-[13px] font-semibold flex-shrink-0">Update Time:</span>
                    <span className="text-[13px] min-w-[90px]">{template.update_time || '2024-12-15'}</span>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className={`w-full px-6 py-4 text-white rounded-[12px] text-[17px] font-semibold cursor-pointer transition-all duration-300 shadow-md
                  ${isDownloading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-br from-[#007aff] to-[#0051d5] hover:shadow-xl hover:translate-y-[-2px]'}`}
                >
                  {isDownloading ? 'Downloading...' : `Download Template (${(template.file_size / (1024 * 1024)).toFixed(2)} MB)`}
                </button>
                <p className="text-center text-gray-500 text-sm mt-3">Free download • PowerPoint format • {template.page_count} slides included</p>
              </div>
            </div>
          </div>
        </section>

        {/* Advantages Section */}
        <section className="py-[100px] bg-white">
          <div className="max-w-[1200px] mx-auto px-5">
            <h2 className="text-[40px] font-bold text-[#1d1d1f] text-center mb-5">Why Choose Us</h2>
            <p className="text-[21px] text-[#86868b] text-center mb-20">Six Core Advantages, Make Your Presentation More Excellent</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div className="text-[32px] mb-4">🎨</div>
                <h3 className="text-[20px] font-semibold text-[#1d1d1f] mb-2">Professional Design</h3>
                <p className="text-[15px] text-[#515154] leading-[1.5]">
                  Crafted by experienced designers, every detail is meticulously refined to ensure commercial-grade visual excellence.
                </p>
              </div>
              <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div className="text-[32px] mb-4">⚡</div>
                <h3 className="text-[20px] font-semibold text-[#1d1d1f] mb-2">Efficient & Ready-to-Use</h3>
                <p className="text-[15px] text-[#515154] leading-[1.5]">
                  Ready-to-use templates require no complex modifications. Simply replace text and images for a professional presentation.
                </p>
              </div>
              <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div className="text-[32px] mb-4">🔧</div>
                <h3 className="text-[20px] font-semibold text-[#1d1d1f] mb-2">Easy to Edit</h3>
                <p className="text-[15px] text-[#515154] leading-[1.5]">
                  Standard PowerPoint format allows free editing of all elements, supporting one-click color changes and font adjustments.
                </p>
              </div>
              <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div className="text-[32px] mb-4">📱</div>
                <h3 className="text-[20px] font-semibold text-[#1d1d1f] mb-2">Multi-device Compatible</h3>
                <p className="text-[15px] text-[#515154] leading-[1.5]">
                  Perfectly adapts to various screen sizes and display devices, ensuring optimal presentation on computers, tablets, and projectors.
                </p>
              </div>
              <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div className="text-[32px] mb-4">🎯</div>
                <h3 className="text-[20px] font-semibold text-[#1d1d1f] mb-2">Rich Scenarios</h3>
                <p className="text-[15px] text-[#515154] leading-[1.5]">
                  Covers various applications including business reports, product launches, data analysis, and team introductions.
                </p>
              </div>
              <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div className="text-[32px] mb-4">🆕</div>
                <h3 className="text-[20px] font-semibold text-[#1d1d1f] mb-2">Regular Updates</h3>
                <p className="text-[15px] text-[#515154] leading-[1.5]">
                  Stay current with design trends through regular template updates and style refreshes, keeping your presentations modern and fresh.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export async function getStaticPaths() {
  const templates = await getTemplates(); // 获取所有模板以生成路径
  const paths = templates.map(template => ({
    params: { slug: template.slug },
  }));

  return { paths, fallback: false }; // fallback: false 意味着只渲染 getStaticPaths 返回的路径
}

export async function getStaticProps({ params }) {
  const template = await getTemplateBySlug(params.slug); // 根据 slug 获取单个模板数据

  if (!template) {
    return {
      notFound: true, // 如果没有找到模板，返回 404 页面
    };
  }

  return {
    props: {
      template,
    },
    revalidate: 60, // 每 60 秒重新生成一次页面，以获取最新数据
  };
} 