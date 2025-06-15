import { getTemplateById, logDownload } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { id } = req.query
    const template = await getTemplateById(id)

    if (!template) {
      return res.status(404).json({ message: 'Template not found' })
    }

    // Log the download
    await logDownload(
      id,
      req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      req.headers['user-agent']
    )

    // Return the download URL
    return res.status(200).json({ url: template.file_url })
  } catch (error) {
    console.error('Download error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 