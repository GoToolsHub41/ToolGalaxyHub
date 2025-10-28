export enum ToolCategory {
  FILE = 'file',
  IMAGE = 'image',
  TEXT = 'text',
  CODE = 'code',
  SEO = 'seo',
  VIDEO = 'video',
  AUDIO = 'audio',
  SECURITY = 'security',
}

export interface Tool {
  id: number
  slug: string
  name: string
  shortDescription: string
  fullDescription: string
  category: ToolCategory
  tags: string[]
  icon: string
  featured: boolean
  relatedTools: string[]
  componentName: string

  // SEO metadata
  metaTitle: string
  metaDescription: string
  metaKeywords: string[]

  // Usage instructions
  howToUse: string[]

  // Tool-specific config
  inputType: 'text' | 'file' | 'both'
  outputType: 'text' | 'file' | 'both'
  maxFileSize?: number
  acceptedFormats?: string[]
}

export interface CategoryInfo {
  id: ToolCategory
  name: string
  description: string
  icon: string
  color: string
}
