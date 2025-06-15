import Link from 'next/link'
import Image from 'next/image'

export default function TemplateCard({ template }) {
  return (
    <div className="template-card" onClick={() => window.location.href = `/template/${template.slug}`}>
      <div 
        className="template-image aspect-[16/9] relative overflow-hidden rounded-t-lg"
      >
        <img
          src={template.preview_url}
          alt={template.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="template-info p-4">
        <div className="template-category text-xs text-gray-500 uppercase font-medium tracking-wider mb-1">{template.category}</div>
        <h3 className="template-title text-lg font-bold text-gray-900 leading-tight">{template.title}</h3>
      </div>
    </div>
  );
} 