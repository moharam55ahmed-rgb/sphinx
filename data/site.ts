// Types
export interface Project {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  shortDescAr: string;
  shortDescEn: string;
  longDescAr: string;
  longDescEn: string;
  tagsAr: string[];
  tagsEn: string[];
  category: 'commercial' | 'administrative' | 'medical' | 'mixed-use';
  image: string;
  gallery: string[];
  facts: { ar: string; en: string }[];
}

export interface NewsItem {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  contentAr: string;
  contentEn: string;
  category: string;
  image: string;
  date: string;
}

export interface VideoItem {
  id: string;
  titleAr: string;
  titleEn: string;
  thumbnail: string;
  youtubeId: string;
  project?: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  project: string;
}

export interface Job {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  dateAr: string;
  dateEn: string;
}

export interface TeamMember {
  id: string;
  nameAr?: string;
  nameEn?: string;
  titleAr: string;
  titleEn: string;
  bioAr?: string;
  bioEn?: string;
  image: string;
  phone?: string;
  email?: string;
  linkedin?: string;
}

export interface StatItem {
  valueAr: string;
  valueEn: string;
  labelAr: string;
  labelEn: string;
}

export interface HeroSlide {
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  image: string;
  ctaPrimaryAr?: string;
  ctaPrimaryEn?: string;
  ctaSecondaryAr?: string;
  ctaSecondaryEn?: string;
  link?: string;
}

// Data
export const projects: Project[] = [
  {
    id: '1',
    slug: 'city-hub-mall',
    nameAr: 'مول سيتي هوب',
    nameEn: 'City Hub Mall',
    shortDescAr: 'مول تجاري مميز بمدينة الشروق، يقع في قلب منطقة النادي بالقرب من نادي الشروق وسيتي كلوب، ويتميز بتصميم معماري حديث ومساحات مفتوحة للمطاعم والكافيهات وتجربة تسوق وترفيه نابضة بالحياة.',
    shortDescEn: 'A premium commercial mall in El Shorouk City, located in the heart of the club district near El Shorouk Club and City Club, featuring modern architecture, open dining areas, and a vibrant shopping and entertainment experience.',
    longDescAr: 'سيتي هوب مول هو أحد أبرز المشروعات التجارية بمدينة الشروق، يقع في قلب منطقة النادي، ويواجه نادي الشروق ونادي سيتي كلوب. يتميز المشروع بتصميم معماري حديث ومساحات مفتوحة للمطاعم والكافيهات، ويوفر تجربة تسوق وترفيه متكاملة للسكان والزوار.',
    longDescEn: 'City Hub Mall is one of the prominent commercial projects in El Shorouk City. It is located in the heart of the club district, facing El Shorouk Club and City Club. The project features modern architecture, open dining spaces, and an integrated shopping and entertainment experience for residents and visitors.',
    tagsAr: ['تجاري', 'مطاعم', 'ترفيه', 'مدينة الشروق'],
    tagsEn: ['Commercial', 'Dining', 'Entertainment', 'El Shorouk'],
    category: 'commercial',
    image: '/images/projects/city-hub-mall.jpg',
    gallery: ['/images/projects/city-hub-mall.jpg', '/images/projects/city-hub-mall-2.jpg'],
    facts: [
      { ar: 'موقع متميز بمنطقة النادي', en: 'Prime location in the club district' },
      { ar: 'مساحات مفتوحة للمطاعم', en: 'Open dining areas' },
      { ar: 'تصميم معماري حديث', en: 'Modern architectural design' },
      { ar: 'تجربة تسوق وترفيه متكاملة', en: 'Integrated shopping and entertainment' },
    ],
  },
  {
    id: '2',
    slug: 'mercado-mall',
    nameAr: 'ميركادو مول',
    nameEn: 'Mercado Mall',
    shortDescAr: 'مول تجاري متكامل الخدمات بمدينة الشروق، يتكون من عدة طوابق ويضم وحدات تجارية متنوعة تبدأ من مساحات مناسبة، مع مزيج من المحلات والمطاعم والخدمات الترفيهية.',
    shortDescEn: 'A fully integrated commercial mall in El Shorouk City, designed across multiple floors with diverse retail spaces, restaurants, and entertainment services.',
    longDescAr: 'ميركادو مول هو مول تجاري متكامل الخدمات بمدينة الشروق، يخدم المناطق الحيوية والكثيفة بالسكان. يتكون المشروع من عدة طوابق ويضم وحدات تجارية متنوعة بمساحات مختلفة، إلى جانب المطاعم والخدمات الترفيهية.',
    longDescEn: 'Mercado Mall is a fully integrated commercial mall in El Shorouk City, serving vibrant and densely populated areas. The project includes multiple floors, diverse retail units with different spaces, restaurants, and entertainment services.',
    tagsAr: ['تجاري', 'تسوق', 'مطاعم', 'استثمار'],
    tagsEn: ['Commercial', 'Shopping', 'Restaurants', 'Investment'],
    category: 'commercial',
    image: '/images/projects/mercado-mall.jpg',
    gallery: ['/images/projects/mercado-mall.jpg', '/images/projects/mercado-mall-2.jpg'],
    facts: [
      { ar: 'وحدات تجارية متنوعة', en: 'Diverse commercial units' },
      { ar: 'مساحات تبدأ من 29 متر مربع', en: 'Spaces starting from 29 sqm' },
      { ar: 'موقع حيوي بمدينة الشروق', en: 'Prime location in El Shorouk City' },
      { ar: 'مطاعم وخدمات ترفيهية', en: 'Restaurants and entertainment services' },
    ],
  },
  {
    id: '3',
    slug: 'arena-mall',
    nameAr: 'ارينا مول',
    nameEn: 'Arena Mall',
    shortDescAr: 'مول خدمي حديث متعدد الاستخدامات بمدينة الشروق، يضم وحدات تجارية وإدارية وطبية، ويقع في موقع استراتيجي مقابل الجامعة الفرنسية.',
    shortDescEn: 'A modern mixed-use service mall in El Shorouk City, offering commercial, administrative, and medical units in a strategic location opposite the French University.',
    longDescAr: 'أرينا مول هو مول خدمي حديث متعدد الاستخدامات بمدينة الشروق، يضم وحدات تجارية وإدارية وطبية. يقع المشروع في موقع استراتيجي مقابل الجامعة الفرنسية، ويوفر بيئة عملية وأنيقة للشركات والعيادات والمحال التجارية.',
    longDescEn: 'Arena Mall is a modern mixed-use service mall in El Shorouk City, offering commercial, administrative, and medical units. The project is strategically located opposite the French University and provides a practical and elegant environment for businesses, clinics, and retail stores.',
    tagsAr: ['تجاري', 'إداري', 'طبي', 'خدمات'],
    tagsEn: ['Commercial', 'Administrative', 'Medical', 'Services'],
    category: 'mixed-use',
    image: '/images/projects/arena-mall.jpg',
    gallery: ['/images/projects/arena-mall.jpg', '/images/projects/arena-mall-2.jpg'],
    facts: [
      { ar: 'وحدات تجارية وإدارية وطبية', en: 'Commercial, administrative, and medical units' },
      { ar: 'موقع مقابل الجامعة الفرنسية', en: 'Located opposite the French University' },
      { ar: 'تسليم فوري', en: 'Immediate delivery' },
      { ar: 'عائد إيجاري مضمون', en: 'Guaranteed rental return' },
    ],
  },
  {
    id: '4',
    slug: 'solaria-mall',
    nameAr: 'سولاريا مول',
    nameEn: 'Solaria Mall',
    shortDescAr: 'مشروع متعدد الاستخدامات في قلب مدينة الشروق، يمتد على مساحة كبيرة ويجمع بين الوحدات التجارية والإدارية والطبية مع موقع قريب من المؤسسات التعليمية والمناطق الحيوية.',
    shortDescEn: 'A mixed-use development in the heart of El Shorouk City, offering commercial, administrative, and medical units near educational institutions and key urban destinations.',
    longDescAr: 'سولاريا مول هو مشروع متعدد الاستخدامات في قلب مدينة الشروق، يمتد على مساحة تقريبية 6400 متر مربع، ويجمع بين الوحدات التجارية والإدارية والطبية. يتميز المشروع بموقع قريب من المؤسسات التعليمية والمناطق الحيوية، ويقدم تجربة عصرية متكاملة للأعمال والاستثمار.',
    longDescEn: 'Solaria Mall is a mixed-use development in the heart of El Shorouk City, extending over approximately 6,400 square meters. It combines commercial, administrative, and medical units and enjoys a strategic location near educational institutions and key urban destinations.',
    tagsAr: ['تجاري', 'إداري', 'طبي', 'متعدد الاستخدامات'],
    tagsEn: ['Commercial', 'Administrative', 'Medical', 'Mixed-use'],
    category: 'mixed-use',
    image: '/images/projects/solaria-mall.jpg',
    gallery: ['/images/projects/solaria-mall.jpg', '/images/projects/solaria-mall-2.jpg'],
    facts: [
      { ar: 'مساحة تقريبية 6400 متر مربع', en: 'Approximately 6,400 sqm' },
      { ar: 'وحدات تجارية وإدارية وطبية', en: 'Commercial, administrative, and medical units' },
      { ar: 'موقع استراتيجي بمدينة الشروق', en: 'Strategic location in El Shorouk City' },
      { ar: 'مشروع متعدد الاستخدامات', en: 'Mixed-use development' },
    ],
  },
];

export const heroSlides: HeroSlide[] = [
  {
    id: '1',
    titleAr: 'سفنكس للتطوير العقاري',
    titleEn: 'SPHINX Real Estate Development',
    subtitleAr: 'بساطة الاستثمار برؤية عصرية وفرص عقارية موثوقة',
    subtitleEn: 'Simplifying real estate investment with a modern vision and trusted opportunities.',
    image: '/images/hero/hero-1.jpg',
    ctaPrimaryAr: 'اكتشف مشاريعنا',
    ctaPrimaryEn: 'Explore Projects',
    ctaSecondaryAr: 'تواصل معنا',
    ctaSecondaryEn: 'Contact Us',
    link: '/projects',
  },
  {
    id: '2',
    titleAr: 'Mercado Mall',
    titleEn: 'Mercado Mall',
    subtitleAr: 'أكبر مول تجاري متكامل الخدمات بمدينة الشروق',
    subtitleEn: 'A fully integrated commercial mall in El Shorouk City.',
    image: '/images/hero/hero-2.jpg',
    link: '/projects/mercado-mall',
  },
  {
    id: '3',
    titleAr: 'Arena Mall',
    titleEn: 'Arena Mall',
    subtitleAr: 'استثمارك الناجح في موقع استراتيجي',
    subtitleEn: 'A successful investment opportunity in a strategic location.',
    image: '/images/hero/hero-3.jpg',
    link: '/projects/arena-mall',
  },
  {
    id: '4',
    titleAr: 'City Hub Mall',
    titleEn: 'City Hub Mall',
    subtitleAr: 'أفضل استثمار في مدينة الشروق',
    subtitleEn: 'A premium investment destination in El Shorouk City.',
    image: '/images/hero/hero-4.jpg',
    link: '/projects/city-hub-mall',
  },
  {
    id: '5',
    titleAr: 'Solaria Mall',
    titleEn: 'Solaria Mall',
    subtitleAr: 'ضوء يشع بالحياة',
    subtitleEn: 'A new light of life, business, and investment.',
    image: '/images/hero/hero-5.jpg',
    link: '/projects/solaria-mall',
  },
];

export const news: NewsItem[] = [
  {
    id: '1',
    slug: 'press-conference-solaria-mall',
    titleAr: 'المؤتمر الصحفي للإعلان عن سولاريا مول',
    titleEn: 'Press Conference Announcing Solaria Mall',
    excerptAr: 'تغطية إعلامية للإعلان عن إطلاق سولاريا مول بمدينة الشروق كأحد أحدث مشروعات الشركة.',
    excerptEn: 'Media coverage announcing the launch of Solaria Mall in El Shorouk City as one of the company\'s latest projects.',
    contentAr: 'تغطية إعلامية شاملة للإعلان عن إطلاق سولاريا مول بمدينة الشروق كأحد أحدث مشروعات شركة سفنكس للتطوير العقاري. يمثل هذا المشروع نقلة نوعية في مشروعات الشركة.',
    contentEn: 'Comprehensive media coverage announcing the launch of Solaria Mall in El Shorouk City as one of the latest projects by SPHINX Real Estate Development. This project represents a significant milestone for the company.',
    category: 'projects',
    image: '/images/news/news-1.jpg',
    date: '2024-08-15',
  },
  {
    id: '2',
    slug: 'cityscape-egypt-2024',
    titleAr: 'فعاليات سيتي سكيب في مصر لعام 2024',
    titleEn: 'Cityscape Egypt 2024 Activities',
    excerptAr: 'مشاركة الشركة في واحد من أكبر المعارض العقارية في مصر والشرق الأوسط لعرض فرص استثمارية مميزة.',
    excerptEn: 'The company participated in one of Egypt and the Middle East\'s largest real estate exhibitions to showcase premium investment opportunities.',
    contentAr: 'شاركت شركة سفنكس للتطوير العقاري في معرض سيتي سكيب 2024، أحد أكبر المعارض العقارية في مصر والشرق الأوسط، لعرض أحدث مشروعاتها وفرصها الاستثمارية.',
    contentEn: 'SPHINX Real Estate Development participated in Cityscape 2024, one of the largest real estate exhibitions in Egypt and the Middle East, to showcase its latest projects and investment opportunities.',
    category: 'exhibitions',
    image: '/images/news/news-2.jpg',
    date: '2024-09-20',
  },
  {
    id: '3',
    slug: 'invest-with-experience',
    titleAr: 'استثمر مع اسم له خبرات سابقة في التطوير العقاري والعمراني',
    titleEn: 'Invest with a Name Backed by Real Estate Experience',
    excerptAr: 'خبرات ممتدة في قطاعات التطوير العقاري والعمراني والسكني والتجاري والإداري.',
    excerptEn: 'Extended experience across real estate, urban, residential, commercial, and administrative development sectors.',
    contentAr: 'تتمتع شركة سفنكس للتطوير العقاري بخبرات ممتدة تزيد عن 20 عامًا في مختلف قطاعات التطوير العقاري، مما يجعلها الخيار الأمثل للاستثمار الآمن.',
    contentEn: 'SPHINX Real Estate Development has over 20 years of experience across various real estate development sectors, making it the ideal choice for secure investment.',
    category: 'investment',
    image: '/images/news/news-3.jpg',
    date: '2024-07-10',
  },
  {
    id: '4',
    slug: 'choose-right-investment',
    titleAr: 'نساعدك في اختيار المشروع الأنسب للاستثمار',
    titleEn: 'We Help You Choose the Right Investment Project',
    excerptAr: 'اختيار المشروع المناسب يبدأ من الموقع، نوع الوحدة، نظام السداد، والعائد المتوقع.',
    excerptEn: 'Choosing the right project starts with location, unit type, payment plan, and expected return.',
    contentAr: 'نقدم استشارات متخصصة لمساعدتك في اختيار المشروع الاستثماري الأنسب لأهدافك، مع الأخذ في الاعتبار الموقع ونوع الوحدة ونظام السداد.',
    contentEn: 'We provide specialized consultations to help you choose the investment project that best suits your goals, considering location, unit type, and payment plan.',
    category: 'investment',
    image: '/images/news/news-4.jpg',
    date: '2024-06-25',
  },
  {
    id: '5',
    slug: 'investment-opportunity-commercial-mall',
    titleAr: 'فرصة للاستثمار في أحدث وأكبر مول تجاري خدمي في قلب مدينة الشروق',
    titleEn: 'Investment Opportunity in a Major Commercial Service Mall in El Shorouk',
    excerptAr: 'فرصة استثمارية في موقع حيوي بمدينة الشروق بالقرب من المناطق الخدمية والسكنية.',
    excerptEn: 'An investment opportunity in a vital location in El Shorouk City near residential and service areas.',
    contentAr: 'فرصة استثمارية مميزة في قلب مدينة الشروق، في موقع حيوي بالقرب من المناطق الخدمية والسكنية، مع عوائد استثمارية مجزية.',
    contentEn: 'A distinguished investment opportunity in the heart of El Shorouk City, in a vital location near residential and service areas, with attractive investment returns.',
    category: 'real-estate',
    image: '/images/news/news-5.jpg',
    date: '2024-05-30',
  },
  {
    id: '6',
    slug: 'fourth-project-launch',
    titleAr: 'انطلاق المشروع الرابع لشركة سفنكس للتطوير العقاري',
    titleEn: 'Launching the Fourth Project by SPHINX Real Estate Development',
    excerptAr: 'إطلاق مشروع سولاريا مول كمشروع متعدد الاستخدامات يضم وحدات تجارية وإدارية وطبية.',
    excerptEn: 'Launching Solaria Mall as a mixed-use development offering commercial, administrative, and medical units.',
    contentAr: 'أعلنت شركة سفنكس للتطوير العقاري عن إطلاق مشروعها الرابع "سولاريا مول" كمشروع متعدد الاستخدامات يضم وحدات تجارية وإدارية وطبية.',
    contentEn: 'SPHINX Real Estate Development announced the launch of its fourth project "Solaria Mall" as a mixed-use development offering commercial, administrative, and medical units.',
    category: 'projects',
    image: '/images/news/news-6.jpg',
    date: '2024-04-15',
  },
];

export const videos: VideoItem[] = [
  { id: '1', titleAr: 'تطورات أعمال الحفر في موقع سولاريا مول بمدينة الشروق', titleEn: 'Excavation Progress at Solaria Mall in El Shorouk City', thumbnail: '/images/videos/video-1.jpg', youtubeId: 'dQw4w9WgXcQ', project: 'solaria-mall' },
  { id: '2', titleAr: 'آخر تطورات موقع سولاريا مول - مدينة الشروق', titleEn: 'Latest Updates from Solaria Mall Site', thumbnail: '/images/videos/video-2.jpg', youtubeId: 'dQw4w9WgXcQ', project: 'solaria-mall' },
  { id: '3', titleAr: 'سولاريا مول - مدينة الشروق', titleEn: 'Solaria Mall - El Shorouk City', thumbnail: '/images/videos/video-3.jpg', youtubeId: 'dQw4w9WgXcQ', project: 'solaria-mall' },
  { id: '4', titleAr: 'سيتي كلوب مول مدينة الشروق', titleEn: 'City Club Mall El Shorouk City', thumbnail: '/images/videos/video-4.jpg', youtubeId: 'dQw4w9WgXcQ', project: 'city-hub-mall' },
  { id: '5', titleAr: 'سولاريا مول - سفنكس للتطوير العقاري', titleEn: 'Solaria Mall - SPHINX Real Estate Development', thumbnail: '/images/videos/video-5.jpg', youtubeId: 'dQw4w9WgXcQ', project: 'solaria-mall' },
  { id: '6', titleAr: 'سفنكس للتطوير تطرح سولاريا مول في مدينة الشروق', titleEn: 'SPHINX Launches Solaria Mall in El Shorouk City', thumbnail: '/images/videos/video-6.jpg', youtubeId: 'dQw4w9WgXcQ', project: 'solaria-mall' },
  { id: '7', titleAr: 'استثمارك في Arena Mall مش بس شراء وحدة، ده عائد مضمون وفرصة تبدأ صح', titleEn: 'Your Investment in Arena Mall is More Than Buying a Unit', thumbnail: '/images/videos/video-7.jpg', youtubeId: 'dQw4w9WgXcQ', project: 'arena-mall' },
  { id: '8', titleAr: 'المؤتمر الصحفي لشركة سفنكس للتطوير العقاري', titleEn: 'Press Conference by SPHINX Real Estate Development', thumbnail: '/images/videos/video-8.jpg', youtubeId: 'dQw4w9WgXcQ' },
  { id: '9', titleAr: 'أرينا مول مدينة الشروق', titleEn: 'Arena Mall El Shorouk City', thumbnail: '/images/videos/video-9.jpg', youtubeId: 'dQw4w9WgXcQ', project: 'arena-mall' },
  { id: '10', titleAr: 'المؤتمر الصحفي لطرح سولاريا مول', titleEn: 'Press Conference for Launching Solaria Mall', thumbnail: '/images/videos/video-10.jpg', youtubeId: 'dQw4w9WgXcQ', project: 'solaria-mall' },
  { id: '11', titleAr: 'ميركادو مول', titleEn: 'Mercado Mall', thumbnail: '/images/videos/video-11.jpg', youtubeId: 'dQw4w9WgXcQ', project: 'mercado-mall' },
  { id: '12', titleAr: 'سيتي هاب مول', titleEn: 'City Hub Mall', thumbnail: '/images/videos/video-12.jpg', youtubeId: 'dQw4w9WgXcQ', project: 'city-hub-mall' },
];

export const galleryImages: GalleryImage[] = [
  { id: '1', src: '/images/gallery/gallery-1.jpg', alt: 'City Hub Mall', project: 'city-hub-mall' },
  { id: '2', src: '/images/gallery/gallery-2.jpg', alt: 'City Hub Mall', project: 'city-hub-mall' },
  { id: '3', src: '/images/gallery/gallery-3.jpg', alt: 'Mercado Mall', project: 'mercado-mall' },
  { id: '4', src: '/images/gallery/gallery-4.jpg', alt: 'Mercado Mall', project: 'mercado-mall' },
  { id: '5', src: '/images/gallery/gallery-5.jpg', alt: 'Arena Mall', project: 'arena-mall' },
  { id: '6', src: '/images/gallery/gallery-6.jpg', alt: 'Arena Mall', project: 'arena-mall' },
  { id: '7', src: '/images/gallery/gallery-7.jpg', alt: 'Solaria Mall', project: 'solaria-mall' },
  { id: '8', src: '/images/gallery/gallery-8.jpg', alt: 'Solaria Mall', project: 'solaria-mall' },
  { id: '9', src: '/images/gallery/gallery-9.jpg', alt: 'Solaria Mall', project: 'solaria-mall' },
  { id: '10', src: '/images/gallery/gallery-10.jpg', alt: 'Arena Mall', project: 'arena-mall' },
  { id: '11', src: '/images/gallery/gallery-11.jpg', alt: 'Mercado Mall', project: 'mercado-mall' },
  { id: '12', src: '/images/gallery/gallery-12.jpg', alt: 'City Hub Mall', project: 'city-hub-mall' },
];

export const jobs: Job[] = [
  {
    id: '1',
    titleAr: 'مهندس مبيعات تقني',
    titleEn: 'Technical Sales Engineer',
    descriptionAr: 'مطلوب مهندس مبيعات في مصر',
    descriptionEn: 'Technical Sales Engineer required in Egypt',
    dateAr: '30 أغسطس 2024',
    dateEn: 'August 30, 2024',
  },
  {
    id: '2',
    titleAr: 'Senior Sales',
    titleEn: 'Senior Sales',
    descriptionAr: 'مطلوب موظف مبيعات خبرة',
    descriptionEn: 'Senior Sales position',
    dateAr: '23 يونيو 2025',
    dateEn: 'June 23, 2025',
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    nameAr: 'أحمد محمود',
    nameEn: 'Ahmed Mahmoud',
    titleAr: 'رئيس مجلس الإدارة',
    titleEn: 'Chairman',
    bioAr: 'قيادة استراتيجية لنمو محفظة سفنكس العقارية.',
    bioEn: 'Strategic leadership for SPHINX real estate portfolio growth.',
    image: '/images/team/team-1.jpg',
  },
  {
    id: '2',
    nameAr: 'محمد حسن',
    nameEn: 'Mohamed Hassan',
    titleAr: 'المدير التنفيذي',
    titleEn: 'Chief Executive Officer',
    image: '/images/team/team-2.jpg',
  },
  {
    id: '3',
    nameAr: 'سارة علي',
    nameEn: 'Sara Ali',
    titleAr: 'مدير المبيعات',
    titleEn: 'Sales Manager',
    image: '/images/team/team-3.jpg',
    email: 'sales@example.com',
  },
  {
    id: '4',
    nameAr: 'نور الدين',
    nameEn: 'Nour El Din',
    titleAr: 'مدير التسويق',
    titleEn: 'Marketing Manager',
    image: '/images/team/team-4.jpg',
  },
  {
    id: '5',
    nameAr: 'كريم يوسف',
    nameEn: 'Karim Youssef',
    titleAr: 'مدير تطوير الأعمال',
    titleEn: 'Business Development Manager',
    image: '/images/team/team-5.jpg',
    linkedin: 'linkedin.com/in/example',
  },
];

export const stats: StatItem[] = [
  { valueAr: '+20', valueEn: '+20', labelAr: 'عامًا خبرة', labelEn: 'Years of Experience' },
  { valueAr: '+4', valueEn: '+4', labelAr: 'مشروعات', labelEn: 'Projects' },
  { valueAr: '+1000', valueEn: '+1000', labelAr: 'عميل', labelEn: 'Clients' },
  { valueAr: '+400', valueEn: '+400', labelAr: 'وحدة وفرصة استثمارية', labelEn: 'Units and Investment Opportunities' },
];

export const siteInfo = {
  phone: '19474',
  email: 'marketing@aswaqdev.com',
  addressAr: 'فيلا 1/127 ملتقى النسور - شيراتون - مصر الجديدة - القاهرة',
  addressEn: 'Villa 1/127, Moltaqa El-Nesour, Sheraton, Heliopolis, Cairo, Egypt',
  whatsapp: '+201000000000',
  googleMaps: 'https://maps.google.com/?q=El+Shorouk+City,+Egypt',
  social: {
    facebook: 'https://facebook.com/sphinxrealestate',
    youtube: 'https://youtube.com/@sphinxrealestate',
    instagram: 'https://instagram.com/sphinxrealestate',
    linkedin: 'https://linkedin.com/company/sphinxrealestate',
  },
};

// Legacy exports for backward compatibility
export const contactInfo = siteInfo;
export const socialLinks = siteInfo.social;
