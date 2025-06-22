import { getTemplates } from '../lib/supabase'

const Sitemap = () => {
  return null
}

// 格式化日期为有效的ISO格式
const formatDate = (dateString) => {
  if (!dateString) {
    return new Date().toISOString()
  }
  
  try {
    const date = new Date(dateString)
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return new Date().toISOString()
    }
    return date.toISOString()
  } catch (error) {
    return new Date().toISOString()
  }
}

export const getServerSideProps = async ({ res }) => {
  const baseUrl = 'https://www.freepowerpointslides.com'
  
  // 获取所有模板
  const templates = await getTemplates()
  
  // 生成sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${templates.map(template => `
  <url>
    <loc>${baseUrl}/template/${template.slug}</loc>
    <lastmod>${formatDate(template.updated_at || template.created_at)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  `).join('')}
</urlset>`

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default Sitemap 