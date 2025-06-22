import { getTemplates } from '../lib/supabase'

const Sitemap = () => {
  return null
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
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${templates.map(template => `
  <url>
    <loc>${baseUrl}/template/${template.slug}</loc>
    <lastmod>${template.updated_at || template.created_at || new Date().toISOString()}</lastmod>
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