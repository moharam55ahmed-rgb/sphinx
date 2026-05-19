/** Static content mirrored from frontend data/site.ts for database seeding */

const categorySlug = {
  commercial: 'commercial',
  administrative: 'administrative',
  medical: 'medical',
  'mixed-use': 'mixed-use',
};

const projectsData = (categoriesMap) => [
  {
    title: { en: 'City Hub Mall', ar: 'مول سيتي هوب' },
    slug: 'city-hub-mall',
    shortDescription: {
      en: 'A premium commercial mall in El Shorouk City, located in the heart of the club district near El Shorouk Club and City Club, featuring modern architecture, open dining areas, and a vibrant shopping and entertainment experience.',
      ar: 'مول تجاري مميز بمدينة الشروق، يقع في قلب منطقة النادي بالقرب من نادي الشروق وسيتي كلوب، ويتميز بتصميم معماري حديث ومساحات مفتوحة للمطاعم والكافيهات وتجربة تسوق وترفيه نابضة بالحياة.',
    },
    description: {
      en: 'City Hub Mall is one of the prominent commercial projects in El Shorouk City. It is located in the heart of the club district, facing El Shorouk Club and City Club. The project features modern architecture, open dining spaces, and an integrated shopping and entertainment experience for residents and visitors.',
      ar: 'سيتي هوب مول هو أحد أبرز المشروعات التجارية بمدينة الشروق، يقع في قلب منطقة النادي، ويواجه نادي الشروق ونادي سيتي كلوب. يتميز المشروع بتصميم معماري حديث ومساحات مفتوحة للمطاعم والكافيهات، ويوفر تجربة تسوق وترفيه متكاملة للسكان والزوار.',
    },
    categoryId: categoriesMap[categorySlug.commercial],
    mainImage: '/images/projects/city-hub-mall.jpg',
    gallery: [
      '/images/projects/city-hub-mall.jpg',
      '/images/projects/city-hub-mall-2.jpg',
      '/images/gallery/gallery-1.jpg',
      '/images/gallery/gallery-2.jpg',
      '/images/gallery/gallery-12.jpg',
    ],
    features: [
      { en: 'Prime location in the club district', ar: 'موقع متميز بمنطقة النادي' },
      { en: 'Open dining areas', ar: 'مساحات مفتوحة للمطاعم' },
      { en: 'Modern architectural design', ar: 'تصميم معماري حديث' },
      { en: 'Integrated shopping and entertainment', ar: 'تجربة تسوق وترفيه متكاملة' },
    ],
    isFeatured: true,
    sortOrder: 1,
    status: 'published',
  },
  {
    title: { en: 'Mercado Mall', ar: 'ميركادو مول' },
    slug: 'mercado-mall',
    shortDescription: {
      en: 'A fully integrated commercial mall in El Shorouk City, designed across multiple floors with diverse retail spaces, restaurants, and entertainment services.',
      ar: 'مول تجاري متكامل الخدمات بمدينة الشروق، يتكون من عدة طوابق ويضم وحدات تجارية متنوعة تبدأ من مساحات مناسبة، مع مزيج من المحلات والمطاعم والخدمات الترفيهية.',
    },
    description: {
      en: 'Mercado Mall is a fully integrated commercial mall in El Shorouk City, serving vibrant and densely populated areas. The project includes multiple floors, diverse retail units with different spaces, restaurants, and entertainment services.',
      ar: 'ميركادو مول هو مول تجاري متكامل الخدمات بمدينة الشروق، يخدم المناطق الحيوية والكثيفة بالسكان. يتكون المشروع من عدة طوابق ويضم وحدات تجارية متنوعة بمساحات مختلفة، إلى جانب المطاعم والخدمات الترفيهية.',
    },
    categoryId: categoriesMap[categorySlug.commercial],
    mainImage: '/images/projects/mercado-mall.jpg',
    gallery: [
      '/images/projects/mercado-mall.jpg',
      '/images/projects/mercado-mall-2.jpg',
      '/images/gallery/gallery-3.jpg',
      '/images/gallery/gallery-4.jpg',
      '/images/gallery/gallery-11.jpg',
    ],
    features: [
      { en: 'Diverse commercial units', ar: 'وحدات تجارية متنوعة' },
      { en: 'Spaces starting from 29 sqm', ar: 'مساحات تبدأ من 29 متر مربع' },
      { en: 'Prime location in El Shorouk City', ar: 'موقع حيوي بمدينة الشروق' },
      { en: 'Restaurants and entertainment services', ar: 'مطاعم وخدمات ترفيهية' },
    ],
    isFeatured: true,
    sortOrder: 2,
    status: 'published',
  },
  {
    title: { en: 'Arena Mall', ar: 'ارينا مول' },
    slug: 'arena-mall',
    shortDescription: {
      en: 'A modern mixed-use service mall in El Shorouk City, offering commercial, administrative, and medical units in a strategic location opposite the French University.',
      ar: 'مول خدمي حديث متعدد الاستخدامات بمدينة الشروق، يضم وحدات تجارية وإدارية وطبية، ويقع في موقع استراتيجي مقابل الجامعة الفرنسية.',
    },
    description: {
      en: 'Arena Mall is a modern mixed-use service mall in El Shorouk City, offering commercial, administrative, and medical units. The project is strategically located opposite the French University and provides a practical and elegant environment for businesses, clinics, and retail stores.',
      ar: 'أرينا مول هو مول خدمي حديث متعدد الاستخدامات بمدينة الشروق، يضم وحدات تجارية وإدارية وطبية. يقع المشروع في موقع استراتيجي مقابل الجامعة الفرنسية، ويوفر بيئة عملية وأنيقة للشركات والعيادات والمحال التجارية.',
    },
    categoryId: categoriesMap[categorySlug['mixed-use']],
    mainImage: '/images/projects/arena-mall.jpg',
    gallery: [
      '/images/projects/arena-mall.jpg',
      '/images/projects/arena-mall-2.jpg',
      '/images/gallery/gallery-5.jpg',
      '/images/gallery/gallery-6.jpg',
      '/images/gallery/gallery-10.jpg',
    ],
    features: [
      { en: 'Commercial, administrative, and medical units', ar: 'وحدات تجارية وإدارية وطبية' },
      { en: 'Located opposite the French University', ar: 'موقع مقابل الجامعة الفرنسية' },
      { en: 'Immediate delivery', ar: 'تسليم فوري' },
      { en: 'Guaranteed rental return', ar: 'عائد إيجاري مضمون' },
    ],
    isFeatured: true,
    sortOrder: 3,
    status: 'published',
  },
  {
    title: { en: 'Solaria Mall', ar: 'سولاريا مول' },
    slug: 'solaria-mall',
    shortDescription: {
      en: 'A mixed-use development in the heart of El Shorouk City, offering commercial, administrative, and medical units near educational institutions and key urban destinations.',
      ar: 'مشروع متعدد الاستخدامات في قلب مدينة الشروق، يمتد على مساحة كبيرة ويجمع بين الوحدات التجارية والإدارية والطبية مع موقع قريب من المؤسسات التعليمية والمناطق الحيوية.',
    },
    description: {
      en: 'Solaria Mall is a mixed-use development in the heart of El Shorouk City, extending over approximately 6,400 square meters. It combines commercial, administrative, and medical units and enjoys a strategic location near educational institutions and key urban destinations.',
      ar: 'سولاريا مول هو مشروع متعدد الاستخدامات في قلب مدينة الشروق، يمتد على مساحة تقريبية 6400 متر مربع، ويجمع بين الوحدات التجارية والإدارية والطبية. يتميز المشروع بموقع قريب من المؤسسات التعليمية والمناطق الحيوية، ويقدم تجربة عصرية متكاملة للأعمال والاستثمار.',
    },
    categoryId: categoriesMap[categorySlug['mixed-use']],
    mainImage: '/images/projects/solaria-mall.jpg',
    gallery: [
      '/images/projects/solaria-mall.jpg',
      '/images/projects/solaria-mall-2.jpg',
      '/images/gallery/gallery-7.jpg',
      '/images/gallery/gallery-8.jpg',
      '/images/gallery/gallery-9.jpg',
    ],
    features: [
      { en: 'Approximately 6,400 sqm', ar: 'مساحة تقريبية 6400 متر مربع' },
      { en: 'Commercial, administrative, and medical units', ar: 'وحدات تجارية وإدارية وطبية' },
      { en: 'Strategic location in El Shorouk City', ar: 'موقع استراتيجي بمدينة الشروق' },
      { en: 'Mixed-use development', ar: 'مشروع متعدد الاستخدامات' },
    ],
    isFeatured: true,
    sortOrder: 4,
    status: 'published',
  },
];

const newsData = [
  {
    title: { en: 'Press Conference Announcing Solaria Mall', ar: 'المؤتمر الصحفي للإعلان عن سولاريا مول' },
    slug: 'press-conference-solaria-mall',
    excerpt: {
      en: "Media coverage announcing the launch of Solaria Mall in El Shorouk City as one of the company's latest projects.",
      ar: 'تغطية إعلامية للإعلان عن إطلاق سولاريا مول بمدينة الشروق كأحد أحدث مشروعات الشركة.',
    },
    content: {
      en: 'Comprehensive media coverage announcing the launch of Solaria Mall in El Shorouk City as one of the latest projects by SPHINX Real Estate Development. This project represents a significant milestone for the company.',
      ar: 'تغطية إعلامية شاملة للإعلان عن إطلاق سولاريا مول بمدينة الشروق كأحد أحدث مشروعات شركة سفنكس للتطوير العقاري. يمثل هذا المشروع نقلة نوعية في مشروعات الشركة.',
    },
    mainImage: '/images/news/news-1.jpg',
    category: 'projects',
    publishedAt: new Date('2024-08-15'),
    status: 'published',
  },
  {
    title: { en: 'Cityscape Egypt 2024 Activities', ar: 'فعاليات سيتي سكيب في مصر لعام 2024' },
    slug: 'cityscape-egypt-2024',
    excerpt: {
      en: "The company participated in one of Egypt and the Middle East's largest real estate exhibitions to showcase premium investment opportunities.",
      ar: 'مشاركة الشركة في واحد من أكبر المعارض العقارية في مصر والشرق الأوسط لعرض فرص استثمارية مميزة.',
    },
    content: {
      en: 'SPHINX Real Estate Development participated in Cityscape 2024, one of the largest real estate exhibitions in Egypt and the Middle East, to showcase its latest projects and investment opportunities.',
      ar: 'شاركت شركة سفنكس للتطوير العقاري في معرض سيتي سكيب 2024، أحد أكبر المعارض العقارية في مصر والشرق الأوسط، لعرض أحدث مشروعاتها وفرصها الاستثمارية.',
    },
    mainImage: '/images/news/news-2.jpg',
    category: 'exhibitions',
    publishedAt: new Date('2024-09-20'),
    status: 'published',
  },
  {
    title: { en: 'Invest with a Name Backed by Real Estate Experience', ar: 'استثمر مع اسم له خبرات سابقة في التطوير العقاري والعمراني' },
    slug: 'invest-with-experience',
    excerpt: {
      en: 'Extended experience across real estate, urban, residential, commercial, and administrative development sectors.',
      ar: 'خبرات ممتدة في قطاعات التطوير العقاري والعمراني والسكني والتجاري والإداري.',
    },
    content: {
      en: 'SPHINX Real Estate Development has over 20 years of experience across various real estate development sectors, making it the ideal choice for secure investment.',
      ar: 'تتمتع شركة سفنكس للتطوير العقاري بخبرات ممتدة تزيد عن 20 عامًا في مختلف قطاعات التطوير العقاري، مما يجعلها الخيار الأمثل للاستثمار الآمن.',
    },
    mainImage: '/images/news/news-3.jpg',
    category: 'investment',
    publishedAt: new Date('2024-07-10'),
    status: 'published',
  },
  {
    title: { en: 'We Help You Choose the Right Investment Project', ar: 'نساعدك في اختيار المشروع الأنسب للاستثمار' },
    slug: 'choose-right-investment',
    excerpt: {
      en: 'Choosing the right project starts with location, unit type, payment plan, and expected return.',
      ar: 'اختيار المشروع المناسب يبدأ من الموقع، نوع الوحدة، نظام السداد، والعائد المتوقع.',
    },
    content: {
      en: 'We provide specialized consultations to help you choose the investment project that best suits your goals, considering location, unit type, and payment plan.',
      ar: 'نقدم استشارات متخصصة لمساعدتك في اختيار المشروع الاستثماري الأنسب لأهدافك، مع الأخذ في الاعتبار الموقع ونوع الوحدة ونظام السداد.',
    },
    mainImage: '/images/news/news-4.jpg',
    category: 'investment',
    publishedAt: new Date('2024-06-25'),
    status: 'published',
  },
  {
    title: { en: 'Investment Opportunity in a Major Commercial Service Mall in El Shorouk', ar: 'فرصة للاستثمار في أحدث وأكبر مول تجاري خدمي في قلب مدينة الشروق' },
    slug: 'investment-opportunity-commercial-mall',
    excerpt: {
      en: 'An investment opportunity in a vital location in El Shorouk City near residential and service areas.',
      ar: 'فرصة استثمارية في موقع حيوي بمدينة الشروق بالقرب من المناطق الخدمية والسكنية.',
    },
    content: {
      en: 'A distinguished investment opportunity in the heart of El Shorouk City, in a vital location near residential and service areas, with attractive investment returns.',
      ar: 'فرصة استثمارية مميزة في قلب مدينة الشروق، في موقع حيوي بالقرب من المناطق الخدمية والسكنية، مع عوائد استثمارية مجزية.',
    },
    mainImage: '/images/news/news-5.jpg',
    category: 'real-estate',
    publishedAt: new Date('2024-05-30'),
    status: 'published',
  },
  {
    title: { en: 'Launching the Fourth Project by SPHINX Real Estate Development', ar: 'انطلاق المشروع الرابع لشركة سفنكس للتطوير العقاري' },
    slug: 'fourth-project-launch',
    excerpt: {
      en: 'Launching Solaria Mall as a mixed-use development offering commercial, administrative, and medical units.',
      ar: 'إطلاق مشروع سولاريا مول كمشروع متعدد الاستخدامات يضم وحدات تجارية وإدارية وطبية.',
    },
    content: {
      en: 'SPHINX Real Estate Development announced the launch of its fourth project "Solaria Mall" as a mixed-use development offering commercial, administrative, and medical units.',
      ar: 'أعلنت شركة سفنكس للتطوير العقاري عن إطلاق مشروعها الرابع "سولاريا مول" كمشروع متعدد الاستخدامات يضم وحدات تجارية وإدارية وطبية.',
    },
    mainImage: '/images/news/news-6.jpg',
    category: 'projects',
    publishedAt: new Date('2024-04-15'),
    status: 'published',
  },
];

const newsCategoriesData = [
  { name: { en: 'Real Estate', ar: 'عقارات' }, slug: 'real-estate', sortOrder: 1 },
  { name: { en: 'Investment', ar: 'استثمار' }, slug: 'investment', sortOrder: 2 },
  { name: { en: 'Projects', ar: 'مشروعات' }, slug: 'projects', sortOrder: 3 },
  { name: { en: 'Exhibitions', ar: 'معارض' }, slug: 'exhibitions', sortOrder: 4 },
];

const galleryCategoriesData = [
  { name: { en: 'City Hub Mall', ar: 'سيتي هاب مول' }, slug: 'city-hub-mall', sortOrder: 1 },
  { name: { en: 'Mercado Mall', ar: 'ميركادو مول' }, slug: 'mercado-mall', sortOrder: 2 },
  { name: { en: 'Arena Mall', ar: 'أرينا مول' }, slug: 'arena-mall', sortOrder: 3 },
  { name: { en: 'Solaria Mall', ar: 'سولاريا مول' }, slug: 'solaria-mall', sortOrder: 4 },
  { name: { en: 'Events & Press', ar: 'فعاليات ومؤتمرات' }, slug: 'events', sortOrder: 5 },
];

const galleryImagesData = [
  { fileName: 'gallery-1.jpg', originalName: 'City Hub Mall 1', fileUrl: '/images/gallery/gallery-1.jpg', mimeType: 'image/jpeg', title: 'City Hub Mall', altText: 'City Hub Mall', categorySlug: 'city-hub-mall' },
  { fileName: 'gallery-2.jpg', originalName: 'City Hub Mall 2', fileUrl: '/images/gallery/gallery-2.jpg', mimeType: 'image/jpeg', title: 'City Hub Mall', altText: 'City Hub Mall', categorySlug: 'city-hub-mall' },
  { fileName: 'gallery-3.jpg', originalName: 'Mercado Mall 1', fileUrl: '/images/gallery/gallery-3.jpg', mimeType: 'image/jpeg', title: 'Mercado Mall', altText: 'Mercado Mall', categorySlug: 'mercado-mall' },
  { fileName: 'gallery-4.jpg', originalName: 'Mercado Mall 2', fileUrl: '/images/gallery/gallery-4.jpg', mimeType: 'image/jpeg', title: 'Mercado Mall', altText: 'Mercado Mall', categorySlug: 'mercado-mall' },
  { fileName: 'gallery-5.jpg', originalName: 'Arena Mall 1', fileUrl: '/images/gallery/gallery-5.jpg', mimeType: 'image/jpeg', title: 'Arena Mall', altText: 'Arena Mall', categorySlug: 'arena-mall' },
  { fileName: 'gallery-6.jpg', originalName: 'Arena Mall 2', fileUrl: '/images/gallery/gallery-6.jpg', mimeType: 'image/jpeg', title: 'Arena Mall', altText: 'Arena Mall', categorySlug: 'arena-mall' },
  { fileName: 'gallery-7.jpg', originalName: 'Solaria Mall 1', fileUrl: '/images/gallery/gallery-7.jpg', mimeType: 'image/jpeg', title: 'Solaria Mall', altText: 'Solaria Mall', categorySlug: 'solaria-mall' },
  { fileName: 'gallery-8.jpg', originalName: 'Solaria Mall 2', fileUrl: '/images/gallery/gallery-8.jpg', mimeType: 'image/jpeg', title: 'Solaria Mall', altText: 'Solaria Mall', categorySlug: 'solaria-mall' },
  { fileName: 'gallery-9.jpg', originalName: 'Solaria Mall 3', fileUrl: '/images/gallery/gallery-9.jpg', mimeType: 'image/jpeg', title: 'Solaria Mall', altText: 'Solaria Mall', categorySlug: 'solaria-mall' },
  { fileName: 'gallery-10.jpg', originalName: 'Arena Mall 3', fileUrl: '/images/gallery/gallery-10.jpg', mimeType: 'image/jpeg', title: 'Arena Mall', altText: 'Arena Mall', categorySlug: 'arena-mall' },
  { fileName: 'gallery-11.jpg', originalName: 'Mercado Mall 3', fileUrl: '/images/gallery/gallery-11.jpg', mimeType: 'image/jpeg', title: 'Mercado Mall', altText: 'Mercado Mall', categorySlug: 'mercado-mall' },
  { fileName: 'gallery-12.jpg', originalName: 'City Hub Mall 3', fileUrl: '/images/gallery/gallery-12.jpg', mimeType: 'image/jpeg', title: 'City Hub Mall', altText: 'City Hub Mall', categorySlug: 'city-hub-mall' },
];

const galleryVideosData = [
  { fileName: 'video-1.jpg', originalName: 'Solaria excavation', fileUrl: '/images/videos/video-1.jpg', mimeType: 'video/youtube', title: { en: 'Excavation Progress at Solaria Mall', ar: 'تطورات أعمال الحفر في موقع سولاريا مول' }, altText: 'Solaria Mall', categorySlug: 'solaria-mall' },
  { fileName: 'video-2.jpg', originalName: 'Solaria updates', fileUrl: '/images/videos/video-2.jpg', mimeType: 'video/youtube', title: { en: 'Latest Updates from Solaria Mall', ar: 'آخر تطورات موقع سولاريا مول' }, altText: 'Solaria Mall', categorySlug: 'solaria-mall' },
  { fileName: 'video-3.jpg', originalName: 'Solaria Mall', fileUrl: '/images/videos/video-3.jpg', mimeType: 'video/youtube', title: { en: 'Solaria Mall - El Shorouk', ar: 'سولاريا مول - مدينة الشروق' }, altText: 'Solaria Mall', categorySlug: 'solaria-mall' },
  { fileName: 'video-4.jpg', originalName: 'City Club Mall', fileUrl: '/images/videos/video-4.jpg', mimeType: 'video/youtube', title: { en: 'City Club Mall El Shorouk', ar: 'سيتي كلوب مول مدينة الشروق' }, altText: 'City Hub Mall', categorySlug: 'city-hub-mall' },
  { fileName: 'video-5.jpg', originalName: 'Solaria SPHINX', fileUrl: '/images/videos/video-5.jpg', mimeType: 'video/youtube', title: { en: 'Solaria Mall - SPHINX', ar: 'سولاريا مول - سفنكس' }, altText: 'Solaria Mall', categorySlug: 'solaria-mall' },
  { fileName: 'video-6.jpg', originalName: 'SPHINX launch', fileUrl: '/images/videos/video-6.jpg', mimeType: 'video/youtube', title: { en: 'SPHINX Launches Solaria Mall', ar: 'سفنكس تطرح سولاريا مول' }, altText: 'Solaria Mall', categorySlug: 'solaria-mall' },
  { fileName: 'video-7.jpg', originalName: 'Arena investment', fileUrl: '/images/videos/video-7.jpg', mimeType: 'video/youtube', title: { en: 'Investment in Arena Mall', ar: 'استثمارك في Arena Mall' }, altText: 'Arena Mall', categorySlug: 'arena-mall' },
  { fileName: 'video-8.jpg', originalName: 'Press conference', fileUrl: '/images/videos/video-8.jpg', mimeType: 'video/youtube', title: { en: 'Press Conference SPHINX', ar: 'المؤتمر الصحفي لسفنكس' }, altText: 'SPHINX', categorySlug: 'events' },
  { fileName: 'video-9.jpg', originalName: 'Arena Mall', fileUrl: '/images/videos/video-9.jpg', mimeType: 'video/youtube', title: { en: 'Arena Mall El Shorouk', ar: 'أرينا مول مدينة الشروق' }, altText: 'Arena Mall', categorySlug: 'arena-mall' },
  { fileName: 'video-10.jpg', originalName: 'Solaria press', fileUrl: '/images/videos/video-10.jpg', mimeType: 'video/youtube', title: { en: 'Press Conference Solaria', ar: 'المؤتمر الصحفي لطرح سولاريا' }, altText: 'Solaria Mall', categorySlug: 'events' },
  { fileName: 'video-11.jpg', originalName: 'Mercado Mall', fileUrl: '/images/videos/video-11.jpg', mimeType: 'video/youtube', title: { en: 'Mercado Mall', ar: 'ميركادو مول' }, altText: 'Mercado Mall', categorySlug: 'mercado-mall' },
  { fileName: 'video-12.jpg', originalName: 'City Hub Mall', fileUrl: '/images/videos/video-12.jpg', mimeType: 'video/youtube', title: { en: 'City Hub Mall', ar: 'سيتي هاب مول' }, altText: 'City Hub Mall', categorySlug: 'city-hub-mall' },
];

const heroSlidesCustomData = [
  {
    title: { en: 'SPHINX Real Estate Development', ar: 'سفنكس للتطوير العقاري' },
    subtitle: { en: 'Simplifying real estate investment with a modern vision and trusted opportunities.', ar: 'بساطة الاستثمار برؤية عصرية وفرص عقارية موثوقة' },
    image: '/images/hero/hero-1.jpg',
    link: '/projects',
  },
  {
    title: { en: 'Mercado Mall', ar: 'Mercado Mall' },
    subtitle: { en: 'A fully integrated commercial mall in El Shorouk City.', ar: 'أكبر مول تجاري متكامل الخدمات بمدينة الشروق' },
    image: '/images/hero/hero-2.jpg',
    link: '/projects/mercado-mall',
  },
  {
    title: { en: 'Arena Mall', ar: 'Arena Mall' },
    subtitle: { en: 'A successful investment opportunity in a strategic location.', ar: 'استثمارك الناجح في موقع استراتيجي' },
    image: '/images/hero/hero-3.jpg',
    link: '/projects/arena-mall',
  },
  {
    title: { en: 'City Hub Mall', ar: 'City Hub Mall' },
    subtitle: { en: 'A premium investment destination in El Shorouk City.', ar: 'أفضل استثمار في مدينة الشروق' },
    image: '/images/hero/hero-4.jpg',
    link: '/projects/city-hub-mall',
  },
  {
    title: { en: 'Solaria Mall', ar: 'Solaria Mall' },
    subtitle: { en: 'A new light of life, business, and investment.', ar: 'ضوء يشع بالحياة' },
    image: '/images/hero/hero-5.jpg',
    link: '/projects/solaria-mall',
  },
];

const whyInvestItems = [
  { title: { en: 'Prime Locations', ar: 'مواقع متميزة' }, text: { en: 'Strategic projects in El Shorouk City', ar: 'مشروعات استراتيجية بمدينة الشروق' } },
  { title: { en: 'Diverse Portfolio', ar: 'محفظة متنوعة' }, text: { en: 'Commercial, administrative, and medical units', ar: 'وحدات تجارية وإدارية وطبية' } },
  { title: { en: 'Proven Track Record', ar: 'سجل حافل' }, text: { en: 'Over 20 years of development experience', ar: 'أكثر من 20 عامًا من الخبرة' } },
  { title: { en: 'Investment Returns', ar: 'عوائد استثمارية' }, text: { en: 'Attractive and reliable opportunities', ar: 'فرص جذابة وموثوقة' } },
  { title: { en: 'Flexible Spaces', ar: 'مساحات مرنة' }, text: { en: 'Units starting from 29 sqm', ar: 'وحدات تبدأ من 29 متر مربع' } },
  { title: { en: 'Dedicated Support', ar: 'دعم متخصص' }, text: { en: 'Expert team guides your investment', ar: 'فريق خبراء يرشد استثمارك' } },
];

const statsCustomData = [
  { title: { en: '+20', ar: '+20' }, text: { en: 'Years of Experience', ar: 'عامًا خبرة' } },
  { title: { en: '+4', ar: '+4' }, text: { en: 'Projects', ar: 'مشروعات' } },
  { title: { en: '+1000', ar: '+1000' }, text: { en: 'Clients', ar: 'عميل' } },
  { title: { en: '+400', ar: '+400' }, text: { en: 'Units and Investment Opportunities', ar: 'وحدة وفرصة استثمارية' } },
];

const visionMissionCustomData = [
  {
    title: { en: 'Our Vision', ar: 'رؤيتنا' },
    text: { en: 'To be the leading real estate developer in El Shorouk City, setting new standards for commercial and mixed-use developments.', ar: 'أن نكون الشركة الرائدة في التطوير العقاري بمدينة الشروق، ونضع معايير جديدة للمشروعات التجارية ومتعددة الاستخدامات.' },
  },
  {
    title: { en: 'Our Mission', ar: 'رسالتنا' },
    text: { en: 'Delivering premium real estate projects that combine modern design, strategic locations, and exceptional investment value.', ar: 'تقديم مشروعات عقارية متميزة تجمع بين التصميم العصري والمواقع الاستراتيجية والقيمة الاستثمارية الاستثنائية.' },
  },
  {
    title: { en: 'Our Values', ar: 'قيمنا' },
    text: { en: 'Integrity • Excellence • Innovation • Customer Focus', ar: 'النزاهة • التميز • الابتكار • التركيز على العميل' },
  },
];

const teamCustomData = [
  {
    id: 'team-1',
    name: { en: 'Ahmed Mahmoud', ar: 'أحمد محمود' },
    jobTitle: { en: 'Chairman', ar: 'رئيس مجلس الإدارة' },
    bio: {
      en: 'Strategic leadership for SPHINX real estate portfolio growth.',
      ar: 'قيادة استراتيجية لنمو محفظة سفنكس العقارية.',
    },
    image: '/images/team/team-1.jpg',
    phone: '',
    email: '',
    linkedin: '',
  },
  {
    id: 'team-2',
    name: { en: 'Mohamed Hassan', ar: 'محمد حسن' },
    jobTitle: { en: 'Chief Executive Officer', ar: 'المدير التنفيذي' },
    bio: { en: '', ar: '' },
    image: '/images/team/team-2.jpg',
    phone: '',
    email: '',
    linkedin: '',
  },
  {
    id: 'team-3',
    name: { en: 'Sara Ali', ar: 'سارة علي' },
    jobTitle: { en: 'Sales Manager', ar: 'مدير المبيعات' },
    bio: { en: '', ar: '' },
    image: '/images/team/team-3.jpg',
    phone: '',
    email: 'sales@example.com',
    linkedin: '',
  },
  {
    id: 'team-4',
    name: { en: 'Nour El Din', ar: 'نور الدين' },
    jobTitle: { en: 'Marketing Manager', ar: 'مدير التسويق' },
    bio: { en: '', ar: '' },
    image: '/images/team/team-4.jpg',
    phone: '',
    email: '',
    linkedin: '',
  },
  {
    id: 'team-5',
    name: { en: 'Karim Youssef', ar: 'كريم يوسف' },
    jobTitle: { en: 'Business Development Manager', ar: 'مدير تطوير الأعمال' },
    bio: { en: '', ar: '' },
    image: '/images/team/team-5.jpg',
    phone: '',
    email: '',
    linkedin: 'linkedin.com/in/example',
  },
];

const relatedCompaniesCustomData = [
  {
    id: 'company-1',
    name: { en: 'Aswaq Group', ar: 'مجموعة أسواق' },
    logo: '',
    pageSlug: 'partner-aswaq',
    sortOrder: 0,
  },
  {
    id: 'company-2',
    name: { en: 'Elite Developments', ar: 'إيليت للتطوير' },
    logo: '',
    pageSlug: 'partner-elite',
    sortOrder: 1,
  },
  {
    id: 'company-3',
    name: { en: 'Horizon Holdings', ar: 'هورايزن القابضة' },
    logo: '',
    pageSlug: 'partner-horizon',
    sortOrder: 2,
  },
  {
    id: 'company-4',
    name: { en: 'Nile Ventures', ar: 'نايل فنتشرز' },
    logo: '',
    pageSlug: 'partner-nile',
    sortOrder: 3,
  },
];

const partnerCompaniesPages = [
  {
    slug: 'partner-aswaq',
    title: { en: 'Aswaq Group', ar: 'مجموعة أسواق' },
    description: {
      en: 'A strategic partner in retail and commercial real estate development.',
      ar: 'شريك استراتيجي في التجزئة والتطوير العقاري التجاري.',
    },
  },
  {
    slug: 'partner-elite',
    title: { en: 'Elite Developments', ar: 'إيليت للتطوير' },
    description: {
      en: 'Premium mixed-use developments across Greater Cairo.',
      ar: 'مشروعات متعددة الاستخدامات متميزة في القاهرة الكبرى.',
    },
  },
  {
    slug: 'partner-horizon',
    title: { en: 'Horizon Holdings', ar: 'هورايزن القابضة' },
    description: {
      en: 'Investment and asset management for commercial portfolios.',
      ar: 'استثمار وإدارة أصول للمحافظ التجارية.',
    },
  },
  {
    slug: 'partner-nile',
    title: { en: 'Nile Ventures', ar: 'نايل فنتشرز' },
    description: {
      en: 'Venture partnerships supporting innovation in real estate.',
      ar: 'شراكات استثمارية تدعم الابتكار في القطاع العقاري.',
    },
  },
];

const careersCustomData = [
  {
    title: { en: 'Technical Sales Engineer', ar: 'مهندس مبيعات تقني' },
    text: { en: 'Technical Sales Engineer required in Egypt', ar: 'مطلوب مهندس مبيعات في مصر' },
    date: { en: 'August 30, 2024', ar: '30 أغسطس 2024' },
  },
  {
    title: { en: 'Senior Sales', ar: 'Senior Sales' },
    text: { en: 'Senior Sales position', ar: 'مطلوب موظف مبيعات خبرة' },
    date: { en: 'June 23, 2025', ar: '23 يونيو 2025' },
  },
];

const seoPages = (pagesMap) => [
  {
    slug: 'home',
    pageType: 'page',
    pageId: pagesMap.home,
    metaTitle: 'SPHINX Real Estate Development | Premium Real Estate Investment',
    metaDescription: 'SPHINX Real Estate Development offers commercial, administrative, and medical real estate projects in El Shorouk City with a modern vision and trusted investment opportunities.',
  },
  {
    slug: 'about',
    pageType: 'page',
    pageId: pagesMap.about,
    metaTitle: 'About Us | SPHINX Real Estate Development',
    metaDescription: 'Learn about SPHINX Real Estate Development — our vision, mission, and commitment to premium projects in El Shorouk City.',
  },
  {
    slug: 'projects',
    pageType: 'page',
    pageId: pagesMap.projects,
    metaTitle: 'Our Projects | SPHINX Real Estate Development',
    metaDescription: 'Explore commercial and mixed-use malls by SPHINX in El Shorouk City.',
  },
  {
    slug: 'contact',
    pageType: 'page',
    pageId: pagesMap.contact,
    metaTitle: 'Contact Us | SPHINX Real Estate Development',
    metaDescription: 'Get in touch with SPHINX Real Estate Development for investment inquiries.',
  },
  {
    slug: 'news',
    pageType: 'page',
    pageId: pagesMap.news,
    metaTitle: 'News | SPHINX Real Estate Development',
    metaDescription: 'Latest news and updates from SPHINX Real Estate Development.',
  },
  {
    slug: 'gallery',
    pageType: 'page',
    pageId: pagesMap.gallery,
    metaTitle: 'Gallery | SPHINX Real Estate Development',
    metaDescription: 'Photo and video gallery of SPHINX projects.',
  },
  {
    slug: 'privacy',
    pageType: 'page',
    pageId: pagesMap.privacy,
    metaTitle: 'Privacy Policy | SPHINX Real Estate Development',
    metaDescription:
      'Learn how SPHINX Real Estate Development collects, uses, and protects your personal information.',
  },
  {
    slug: 'terms',
    pageType: 'page',
    pageId: pagesMap.terms,
    metaTitle: 'Terms & Conditions | SPHINX Real Estate Development',
    metaDescription:
      'Terms governing your use of the SPHINX Real Estate Development website and digital services.',
  },
];

const navigationData = [
  { label: { en: 'Home', ar: 'الرئيسية' }, url: '/', location: 'header', sortOrder: 1 },
  { label: { en: 'About Us', ar: 'من نحن' }, url: '/about', location: 'header', sortOrder: 2 },
  { label: { en: 'Projects', ar: 'المشاريع' }, url: '/projects', location: 'header', sortOrder: 3 },
  { label: { en: 'Gallery', ar: 'الجاليري' }, url: '/gallery/photos', location: 'header', sortOrder: 4 },
  { label: { en: 'News', ar: 'الأخبار' }, url: '/news', location: 'header', sortOrder: 5 },
  { label: { en: 'Team', ar: 'الفريق' }, url: '/team', location: 'header', sortOrder: 6 },
  { label: { en: 'Careers', ar: 'التوظيف' }, url: '/careers', location: 'header', sortOrder: 7 },
  { label: { en: 'Contact', ar: 'اتصل بنا' }, url: '/contact', location: 'header', sortOrder: 8 },
  { label: { en: 'Home', ar: 'الرئيسية' }, url: '/', location: 'footer', sortOrder: 1 },
  { label: { en: 'About Us', ar: 'من نحن' }, url: '/about', location: 'footer', sortOrder: 2 },
  { label: { en: 'Projects', ar: 'المشاريع' }, url: '/projects', location: 'footer', sortOrder: 3 },
  { label: { en: 'News', ar: 'الأخبار' }, url: '/news', location: 'footer', sortOrder: 4 },
];

const extraSettings = [
  {
    key: 'siteName',
    group: 'general',
    value: { en: 'SPHINX Real Estate Development', ar: 'سفنكس للتطوير العقاري' },
  },
  {
    key: 'aboutText',
    group: 'general',
    value: {
      en: 'SPHINX Real Estate Development is a leading force in commercial and mixed-use real estate in El Shorouk City.',
      ar: 'شركة سفنكس للتطوير العقاري رائدة في التطوير العقاري التجاري ومتعدد الاستخدامات بمدينة الشروق.',
    },
  },
  {
    key: 'officeHours',
    group: 'contact',
    value: { en: 'Sat - Thu: 9 AM - 6 PM', ar: 'السبت - الخميس: 9 ص - 6 م' },
  },
  {
    key: 'googleMaps',
    group: 'contact',
    value: { text: 'https://maps.google.com/?q=El+Shorouk+City,+Egypt' },
  },
];

function buildHomeSections(pagesMap) {
  return [
    {
      pageId: pagesMap.home,
      sectionKey: 'hero-slider',
      sectionName: 'Hero Slider',
      title: { en: 'Hero Slider', ar: 'سلايدر الرئيسية' },
      sortOrder: 1,
      customData: heroSlidesCustomData,
    },
    {
      pageId: pagesMap.home,
      sectionKey: 'video-intro',
      sectionName: 'Video Intro',
      title: { en: 'Investment Opportunities', ar: 'فرص استثمارية' },
      subtitle: { en: 'Discover our projects', ar: 'اكتشف مشاريعنا' },
      description: {
        en: 'Premium commercial and mixed-use developments in El Shorouk City.',
        ar: 'مشروعات تجارية ومتعددة الاستخدامات متميزة بمدينة الشروق.',
      },
      image: '/images/videos/video-3.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      buttonText: { en: 'Watch Video', ar: 'شاهد الفيديو' },
      sortOrder: 2,
    },
    {
      pageId: pagesMap.home,
      sectionKey: 'about-preview',
      sectionName: 'About Preview',
      title: { en: 'SPHINX Real Estate Development', ar: 'سفنكس للتطوير العقاري' },
      description: {
        en: 'A leading force in real estate development with a vision for modern living and investment.',
        ar: 'قوة رائدة في التطوير العقاري برؤية للمعيشة والاستثمار العصري.',
      },
      image: '/images/projects/solaria-mall.jpg',
      sortOrder: 3,
    },
    {
      pageId: pagesMap.home,
      sectionKey: 'vision-mission',
      sectionName: 'Vision Mission Values',
      title: { en: 'Vision & Mission', ar: 'الرؤية والرسالة' },
      customData: visionMissionCustomData,
      sortOrder: 4,
    },
    {
      pageId: pagesMap.home,
      sectionKey: 'projects-preview',
      sectionName: 'Projects Preview',
      title: { en: 'Our Projects', ar: 'مشاريعنا' },
      subtitle: { en: 'Featured developments', ar: 'مشروعات مميزة' },
      sortOrder: 5,
    },
    {
      pageId: pagesMap.home,
      sectionKey: 'why-invest',
      sectionName: 'Why Invest',
      title: { en: 'Why Invest With Us', ar: 'لماذا تستثمر معنا' },
      customData: whyInvestItems,
      sortOrder: 6,
    },
    {
      pageId: pagesMap.home,
      sectionKey: 'stats',
      sectionName: 'Statistics',
      title: { en: 'Our Numbers', ar: 'أرقامنا' },
      customData: statsCustomData,
      sortOrder: 7,
    },
    {
      pageId: pagesMap.home,
      sectionKey: 'news-preview',
      sectionName: 'News Preview',
      title: { en: 'Latest News', ar: 'آخر الأخبار' },
      sortOrder: 8,
    },
    {
      pageId: pagesMap.home,
      sectionKey: 'related-companies',
      sectionName: 'Related Companies',
      title: { en: 'Related Companies', ar: 'شركات ذات صلة' },
      subtitle: {
        en: 'Trusted partners and affiliated companies in our network.',
        ar: 'شركاء وشركات تابعة موثوقة ضمن شبكة أعمالنا.',
      },
      customData: relatedCompaniesCustomData,
      sortOrder: 9,
    },
    {
      pageId: pagesMap.home,
      sectionKey: 'cta',
      sectionName: 'Call to Action',
      title: { en: 'Ready to Invest?', ar: 'مستعد للاستثمار؟' },
      description: {
        en: 'Contact our team today and discover the right opportunity for you.',
        ar: 'تواصل مع فريقنا اليوم واكتشف الفرصة المناسبة لك.',
      },
      sortOrder: 10,
    },
  ];
}

function buildPartnerCompanySections(pagesMap) {
  const sections = [];
  for (const partner of partnerCompaniesPages) {
    if (!pagesMap[partner.slug]) continue;
    sections.push(
      {
        pageId: pagesMap[partner.slug],
        sectionKey: 'company-hero',
        sectionName: 'Company Hero',
        title: partner.title,
        subtitle: { en: 'Related Company', ar: 'شركة شريكة' },
        sortOrder: 1,
      },
      {
        pageId: pagesMap[partner.slug],
        sectionKey: 'company-main',
        sectionName: 'Company Content',
        title: partner.title,
        description: partner.description,
        sortOrder: 2,
      }
    );
  }
  return sections;
}

function buildAboutSections(pagesMap) {
  return [
    {
      pageId: pagesMap.about,
      sectionKey: 'about-main',
      sectionName: 'About Main',
      title: { en: 'About SPHINX', ar: 'عن سفنكس' },
      subtitle: { en: 'About Us', ar: 'من نحن' },
      description: {
        en: 'SPHINX Real Estate Development delivers premium commercial, administrative, and medical projects in El Shorouk City with a modern vision and trusted investment opportunities.',
        ar: 'تقدم شركة سفنكس للتطوير العقاري مشروعات تجارية وإدارية وطبية متميزة بمدينة الشروق برؤية عصرية وفرص استثمارية موثوقة.',
      },
      sortOrder: 1,
    },
    {
      pageId: pagesMap.about,
      sectionKey: 'about-vmv',
      sectionName: 'Vision Mission Values',
      title: { en: 'Vision, Mission & Values', ar: 'الرؤية والرسالة والقيم' },
      customData: visionMissionCustomData,
      sortOrder: 2,
    },
    {
      pageId: pagesMap.about,
      sectionKey: 'about-stats',
      sectionName: 'About Stats',
      title: { en: 'Our Impact', ar: 'أثرنا' },
      customData: statsCustomData,
      sortOrder: 3,
    },
    {
      pageId: pagesMap.about,
      sectionKey: 'about-cta',
      sectionName: 'About CTA',
      title: { en: 'Start Your Investment Journey', ar: 'ابدأ رحلة استثمارك' },
      description: {
        en: 'Speak with our experts today.',
        ar: 'تحدث مع خبرائنا اليوم.',
      },
      sortOrder: 4,
    },
  ];
}

function buildTeamCareersSections(pagesMap) {
  return [
    {
      pageId: pagesMap.team,
      sectionKey: 'team-members',
      sectionName: 'Team Members',
      title: { en: 'Our Team', ar: 'فريق العمل' },
      customData: teamCustomData,
      sortOrder: 1,
    },
    {
      pageId: pagesMap.careers,
      sectionKey: 'careers-list',
      sectionName: 'Careers List',
      title: { en: 'Join Our Team', ar: 'انضم لفريقنا' },
      customData: careersCustomData,
      sortOrder: 1,
    },
  ];
}

module.exports = {
  projectsData,
  newsData,
  newsCategoriesData,
  galleryCategoriesData,
  galleryImagesData,
  galleryVideosData,
  seoPages,
  navigationData,
  extraSettings,
  buildHomeSections,
  buildAboutSections,
  buildTeamCareersSections,
  buildPartnerCompanySections,
  partnerCompaniesPages,
};
