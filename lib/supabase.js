import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const R2_PUBLIC_URL = process.env.Public_Development_URL || 'https://pub-4876cf14303b4b36a5cc53d21e13d078.r2.dev'

export const getTemplates = async () => {
  try {
    const { data: pptFiles, error } = await supabase
      .from('ppt_files')
      .select(`
        *,
        ppt_previews (
          id,
          page_number,
          preview_url,
          thumbnail_url
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Process preview image URLs to ensure correct R2 format
    const processedPptFiles = pptFiles.map(file => {
      const previews = file.ppt_previews?.map(p => ({
        ...p,
        preview_url: p.preview_url ? `${R2_PUBLIC_URL}/${p.preview_url}` : null,
        thumbnail_url: p.thumbnail_url ? `${R2_PUBLIC_URL}/${p.thumbnail_url}` : null,
      })) || [];
      
      return {
        ...file,
        preview_url: previews[0]?.thumbnail_url || previews[0]?.preview_url || '/placeholder-image.png',
        category: file.category || 'Uncategorized',
        ppt_previews: previews,
      }
    })

    return processedPptFiles
  } catch (error) {
    console.error('Error fetching templates from Supabase:', error)
    return []
  }
}

export const getTemplateBySlug = async (templateSlug) => {
  try {
    const { data: specificPpt, error: supabaseError } = await supabase
      .from('ppt_files')
      .select(`
        *,
        ppt_previews (
          id,
          page_number,
          preview_url,
          thumbnail_url
        )
      `)
      .eq('slug', templateSlug)
      .single();

    if (supabaseError && supabaseError.code !== 'PGRST116') {
      throw supabaseError
    }

    let fetchedTemplate = specificPpt;

    if (fetchedTemplate) {
      const previews = fetchedTemplate.ppt_previews?.map(p => ({
        ...p,
        preview_url: p.preview_url ? `${R2_PUBLIC_URL}/${p.preview_url}` : null,
        thumbnail_url: p.thumbnail_url ? `${R2_PUBLIC_URL}/${p.thumbnail_url}` : null,
      })) || [];

      fetchedTemplate = {
        ...fetchedTemplate,
        downloads: fetchedTemplate.download_count || 0,
        views: fetchedTemplate.view_count || 0,
        file_size: fetchedTemplate.file_size || 0,
        slides: fetchedTemplate.page_count || 0,
        aspect_ratio: '16:9',
        format: fetchedTemplate.file_type || 'PPTX',
        update_time: fetchedTemplate.updated_at ? new Date(fetchedTemplate.updated_at).toISOString().split('T')[0] : null,
        ppt_previews: previews,
      };
    }
    return fetchedTemplate
  } catch (err) {
    console.error('Error fetching template by slug from Supabase:', err)
    return null
  }
}

export const logDownload = async (templateId) => {
  try {
    const { data, error } = await supabase
      .rpc('increment_download_count', { ppt_id_param: templateId })

    if (error) {
      console.error('Error incrementing download count:', error)
      throw error
    }
    console.log(`Template ${templateId} download count incremented.`, data);
    return true;
  } catch (error) {
    console.error('Failed to log download:', error);
    return false;
  }
};

export const logVisit = async (templateId) => {
  try {
    const { data, error } = await supabase
      .rpc('increment_view_count', { ppt_id_param: templateId })

    if (error) {
      console.error('Error incrementing view count:', error)
      throw error
    }
    console.log(`Template ${templateId} view count incremented.`, data);
    return true;
  } catch (error) {
    console.error('Failed to log visit:', error);
    return false;
  }
}; 