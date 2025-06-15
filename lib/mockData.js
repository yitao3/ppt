export const templates = [
  {
    id: 1,
    title: "Modern Business Presentation",
    description: "A clean and professional template perfect for business presentations, featuring modern design elements and easy-to-customize layouts.",
    category: "Business",
    tags: ["Business", "Modern", "Professional"],
    preview_images: [
      "https://picsum.photos/800/450?random=1",
      "https://picsum.photos/800/450?random=2",
      "https://picsum.photos/800/450?random=3"
    ],
    file_url: "#",
    file_size: 2500,
    slide_count: 15,
    aspect_ratio: "16:9",
    download_count: 1250,
    featured: true,
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    title: "Creative Portfolio Template",
    description: "Showcase your work with this creative and visually appealing template, perfect for designers and artists.",
    category: "Creative",
    tags: ["Portfolio", "Creative", "Design"],
    preview_images: [
      "https://picsum.photos/800/450?random=4",
      "https://picsum.photos/800/450?random=5",
      "https://picsum.photos/800/450?random=6"
    ],
    file_url: "#",
    file_size: 3200,
    slide_count: 12,
    aspect_ratio: "16:9",
    download_count: 890,
    featured: true,
    created_at: "2024-01-14T15:30:00Z"
  },
  {
    id: 3,
    title: "Educational Presentation",
    description: "An engaging template designed for educational purposes, with clear layouts and visual aids.",
    category: "Education",
    tags: ["Education", "Learning", "Academic"],
    preview_images: [
      "https://picsum.photos/800/450?random=7",
      "https://picsum.photos/800/450?random=8",
      "https://picsum.photos/800/450?random=9"
    ],
    file_url: "#",
    file_size: 2800,
    slide_count: 20,
    aspect_ratio: "16:9",
    download_count: 1560,
    featured: false,
    created_at: "2024-01-13T09:15:00Z"
  },
  {
    id: 4,
    title: "Marketing Strategy Template",
    description: "Perfect for presenting marketing strategies and campaigns with professional charts and graphs.",
    category: "Marketing",
    tags: ["Marketing", "Strategy", "Business"],
    preview_images: [
      "https://picsum.photos/800/450?random=10",
      "https://picsum.photos/800/450?random=11",
      "https://picsum.photos/800/450?random=12"
    ],
    file_url: "#",
    file_size: 3500,
    slide_count: 18,
    aspect_ratio: "16:9",
    download_count: 2100,
    featured: true,
    created_at: "2024-01-12T14:45:00Z"
  },
  {
    id: 5,
    title: "Project Timeline Template",
    description: "Track and present project progress with this timeline-based template, featuring Gantt charts and milestone markers.",
    category: "Project",
    tags: ["Project", "Timeline", "Management"],
    preview_images: [
      "https://picsum.photos/800/450?random=13",
      "https://picsum.photos/800/450?random=14",
      "https://picsum.photos/800/450?random=15"
    ],
    file_url: "#",
    file_size: 2900,
    slide_count: 16,
    aspect_ratio: "16:9",
    download_count: 980,
    featured: false,
    created_at: "2024-01-11T11:20:00Z"
  },
  {
    id: 6,
    title: "Financial Report Template",
    description: "Professional template for financial presentations, featuring data visualization and financial charts.",
    category: "Finance",
    tags: ["Finance", "Report", "Data"],
    preview_images: [
      "https://picsum.photos/800/450?random=16",
      "https://picsum.photos/800/450?random=17",
      "https://picsum.photos/800/450?random=18"
    ],
    file_url: "#",
    file_size: 3100,
    slide_count: 14,
    aspect_ratio: "16:9",
    download_count: 1750,
    featured: true,
    created_at: "2024-01-10T16:30:00Z"
  }
];

export const getTemplateById = (id) => {
  return templates.find(template => template.id === parseInt(id));
};

export const getTemplates = (page = 1, limit = 24, sort = 'created_at', featuredOnly = false) => {
  let filteredTemplates = [...templates];
  
  if (featuredOnly) {
    filteredTemplates = filteredTemplates.filter(template => template.featured);
  }

  // Sort templates
  filteredTemplates.sort((a, b) => {
    if (sort === 'created_at') {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    if (sort === 'download_count') {
      return b.download_count - a.download_count;
    }
    return 0;
  });

  // Pagination
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedTemplates = filteredTemplates.slice(start, end);

  return {
    data: paginatedTemplates,
    count: filteredTemplates.length
  };
}; 