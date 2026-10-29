// Club member directory — shared by the Member List page and the homepage showcase
export type MemberTier = 'Founding Member' | 'Life Member' | 'General Member'

export type Member = {
  id: number
  name: string
  designation: string
  company: string
  tier: MemberTier
  avatar: string | null
}

export const MEMBERS: Member[] = [
  { id: 1,  name: 'Niaz Morshed Elite',           designation: 'Managing Director',   company: 'Borotakia Motors',          tier: 'Founding Member', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=144&h=144&fit=crop&auto=format' },
  { id: 2,  name: 'Hosne Ara-Naz',                designation: 'Director',             company: 'Homeland Insurance',        tier: 'Founding Member', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=144&h=144&fit=crop&auto=format' },
  { id: 3,  name: 'Dr. Rehena Siddiqua',          designation: 'Assistant Professor',  company: 'Asha University',           tier: 'Founding Member', avatar: 'https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?w=144&h=144&fit=crop&auto=format' },
  { id: 4,  name: 'Zakir Hossain',                designation: 'Director',             company: 'Port Land Group',           tier: 'Founding Member', avatar: 'https://images.unsplash.com/photo-1685760259914-ee8d2c92d2e0?w=144&h=144&fit=crop&auto=format' },
  { id: 5,  name: 'Md. Monirul Islam Yousuf',     designation: 'Director',             company: 'Borotakia Motors',          tier: 'Life Member',     avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=144&h=144&fit=crop&auto=format' },
  { id: 6,  name: 'Md. Faridul Alam',             designation: 'Director',             company: 'Mabia Group',               tier: 'Life Member',     avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=144&h=144&fit=crop&auto=format' },
  { id: 7,  name: 'Mamun-Ur-Rashid Chowdhury',    designation: 'Managing Director',    company: 'Four H Group',              tier: 'Life Member',     avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=144&h=144&fit=crop&auto=format' },
  { id: 8,  name: 'Taslima Begum',                designation: 'Chief Executive',      company: 'TB Pharma Ltd.',            tier: 'Life Member',     avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=144&h=144&fit=crop&auto=format' },
  { id: 9,  name: 'Khaled Mahmud',                designation: 'Chairman',             company: 'KM Steel Industries',       tier: 'Founding Member', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=144&h=144&fit=crop&auto=format' },
  { id: 10, name: 'Nadia Chowdhury',              designation: 'Managing Director',    company: 'Chowdhury Garments',        tier: 'General Member',  avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=144&h=144&fit=crop&auto=format' },
  { id: 11, name: 'Rafiq-ul-Islam',               designation: 'Director',             company: 'RI Shipping Corp.',         tier: 'General Member',  avatar: null },
  { id: 12, name: 'Shirin Akter',                 designation: 'Proprietor',           company: 'SA Trading House',          tier: 'General Member',  avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=144&h=144&fit=crop&auto=format' },
  { id: 13, name: 'A.K.M. Kamruzzaman',           designation: 'Chairman',             company: 'Kamruzzaman Group',         tier: 'Life Member',     avatar: null },
  { id: 14, name: 'Dr. Farida Khanam',            designation: 'Consultant',           company: 'Chittagong Medical College', tier: 'Life Member',    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=144&h=144&fit=crop&auto=format' },
  { id: 15, name: 'Nurul Huda Chowdhury',         designation: 'Managing Partner',     company: 'NHC Law Associates',        tier: 'Founding Member', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=144&h=144&fit=crop&auto=format' },
  { id: 16, name: 'Parvin Sultana',               designation: 'Director',             company: 'Sultana Real Estate',       tier: 'General Member',  avatar: 'https://images.unsplash.com/photo-1598550880863-4e8aa3d0edb4?w=144&h=144&fit=crop&auto=format' },
  { id: 17, name: 'M. Moniruzzaman',              designation: 'Managing Director',    company: 'MM Apparels Ltd.',          tier: 'Life Member',     avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=144&h=144&fit=crop&auto=format' },
  { id: 18, name: 'Roksana Jahan',                designation: 'Chief Financial Officer', company: 'Jahan Holdings',         tier: 'General Member',  avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=144&h=144&fit=crop&auto=format' },
  { id: 19, name: 'Syed Muraduzzaman',            designation: 'Director',             company: 'Murad Group',               tier: 'Founding Member', avatar: null },
  { id: 20, name: 'Fatema Khatun',                designation: 'Proprietor',           company: 'FK Boutique',               tier: 'General Member',  avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=144&h=144&fit=crop&auto=format' },
  { id: 21, name: 'Minhajul Abedin',              designation: 'Managing Director',    company: 'Abedin Textile Mills',      tier: 'Life Member',     avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=144&h=144&fit=crop&auto=format' },
  { id: 22, name: 'Salma Begum Chowdhury',        designation: 'Director',             company: 'SBC Group',                 tier: 'Founding Member', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=144&h=144&fit=crop&auto=format' },
  { id: 23, name: 'Anwar Hossain',                designation: 'Chief Executive',      company: 'AH Construction Ltd.',      tier: 'General Member',  avatar: null },
  { id: 24, name: 'Dilruba Yasmin',               designation: 'Director',             company: 'DY Pharma',                 tier: 'Life Member',     avatar: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=144&h=144&fit=crop&auto=format' },
]
