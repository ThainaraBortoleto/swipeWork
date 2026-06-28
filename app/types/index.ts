export type Category =
  | 'desenvolvimento'
  | 'design'
  | 'marketing'
  | 'fotografia'
  | 'video'
  | 'redacao'
  | 'saude'
  | 'educacao'
  | 'reforma'
  | 'domestico'
  | 'consultoria'
  | 'traducao'

export interface Professional {
  id: string
  name: string
  avatar: string
  profession: string
  category: Category
  description: string
  hourlyRate: number
  rating: number
  reviewCount: number
  location: {
    city: string
    state: string
    distanceKm: number
  }
  tags: string[]
  services: string[]
  available: boolean
  responseTimeHours: number
  joinedAt: string
}