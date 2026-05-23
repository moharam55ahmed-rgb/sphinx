require('dotenv').config();
const prisma = require('../src/config/prisma');
const bcrypt = require('bcryptjs');
const {
  projectsData,
  newsData,
  seoPages,
  navigationData,
  extraSettings,
  buildHomeSections,
  buildAboutSections,
  buildTeamCareersSections,
  buildPartnerCompanySections,
  partnerCompaniesPages,
  galleryImagesData,
  galleryVideosData,
  newsCategoriesData,
  galleryCategoriesData,
} = require('./seed-data');

async function upsertSection(section) {
  const { pageId, sectionKey, ...data } = section;
  const existing = await prisma.pageSection.findFirst({
    where: { pageId, sectionKey },
  });
  const payload = { pageId, sectionKey, isActive: true, ...data };
  if (existing) {
    await prisma.pageSection.update({
      where: { id: existing.id },
      data: payload,
    });
  } else {
    await prisma.pageSection.create({ data: payload });
  }
}

async function main() {
  console.log('Start seeding...');

  const adminPassword = await bcrypt.hash('Admin@123456', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { password: adminPassword },
    create: {
      name: 'Super Admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'SUPER_ADMIN',
    },
  });
  console.log('Created Super Admin:', admin.email);

  const settingsData = [
    { key: 'phone', group: 'contact', value: { text: '19474' } },
    { key: 'email', group: 'contact', value: { text: 'marketing@aswaqdev.com' } },
    { key: 'addressAr', group: 'contact', value: { text: 'فيلا 1/127 ملتقى النسور - شيراتون - مصر الجديدة - القاهرة' } },
    { key: 'addressEn', group: 'contact', value: { text: 'Villa 1/127, Moltaqa El-Nesour, Sheraton, Heliopolis, Cairo, Egypt' } },
    { key: 'whatsapp', group: 'contact', value: { text: '+201000000000' } },
    {
      key: 'socialLinks',
      group: 'social',
      value: {
        facebook: 'https://facebook.com/sphinxrealestate',
        youtube: 'https://youtube.com/@sphinxrealestate',
        instagram: 'https://instagram.com/sphinxrealestate',
        linkedin: 'https://linkedin.com/company/sphinxrealestate',
      },
    },
    ...extraSettings,
  ];

  for (const setting of settingsData) {
    await prisma.websiteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, group: setting.group },
      create: setting,
    });
  }
  console.log('Created Site Settings');

  const categoriesData = [
    { name: { en: 'Commercial', ar: 'تجاري' }, slug: 'commercial', sortOrder: 1 },
    { name: { en: 'Administrative', ar: 'إداري' }, slug: 'administrative', sortOrder: 2 },
    { name: { en: 'Medical', ar: 'طبي' }, slug: 'medical', sortOrder: 3 },
    { name: { en: 'Mixed-use', ar: 'متعدد الاستخدامات' }, slug: 'mixed-use', sortOrder: 4 },
  ];

  const categoriesMap = {};
  for (const cat of categoriesData) {
    const created = await prisma.projectCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    });
    categoriesMap[cat.slug] = created.id;
  }
  console.log('Created Project Categories');

  for (const proj of projectsData(categoriesMap)) {
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: proj,
      create: proj,
    });
  }
  console.log('Created Projects');

  const pagesData = [
    { title: { en: 'Home', ar: 'الرئيسية' }, slug: 'home', status: 'published' },
    { title: { en: 'About Us', ar: 'من نحن' }, slug: 'about', status: 'published' },
    { title: { en: 'Projects', ar: 'المشاريع' }, slug: 'projects', status: 'published' },
    { title: { en: 'Gallery', ar: 'جاليري' }, slug: 'gallery', status: 'published' },
    { title: { en: 'News', ar: 'آخر الأخبار' }, slug: 'news', status: 'published' },
    { title: { en: 'Team', ar: 'فريق العمل' }, slug: 'team', status: 'published' },
    { title: { en: 'Careers', ar: 'الوظائف' }, slug: 'careers', status: 'published' },
    { title: { en: 'Contact Us', ar: 'اتصل بنا' }, slug: 'contact', status: 'published' },
    { title: { en: 'Privacy Policy', ar: 'سياسة الخصوصية' }, slug: 'privacy', status: 'published' },
    { title: { en: 'Terms & Conditions', ar: 'الشروط والأحكام' }, slug: 'terms', status: 'published' },
    ...partnerCompaniesPages.map((p) => ({
      title: p.title,
      slug: p.slug,
      status: 'published',
    })),
  ];

  const pagesMap = {};
  for (const page of pagesData) {
    const created = await prisma.page.upsert({
      where: { slug: page.slug },
      update: { title: page.title, status: page.status },
      create: page,
    });
    pagesMap[page.slug] = created.id;
  }
  console.log('Created Pages');

  const allSections = [
    ...buildHomeSections(pagesMap),
    ...buildAboutSections(pagesMap),
    ...buildTeamCareersSections(pagesMap),
    ...buildPartnerCompanySections(pagesMap),
    {
      pageId: pagesMap.gallery,
      sectionKey: 'gallery-grid',
      sectionName: 'Gallery Grid',
      title: { en: 'Photo Gallery', ar: 'معرض الصور' },
      sortOrder: 1,
    },
    {
      pageId: pagesMap.news,
      sectionKey: 'news-list',
      sectionName: 'News List',
      title: { en: 'Latest News', ar: 'آخر الأخبار' },
      sortOrder: 1,
    },
    {
      pageId: pagesMap.contact,
      sectionKey: 'contact-hero',
      sectionName: 'Contact Banner',
      title: { en: 'Contact Us', ar: 'اتصل بنا' },
      subtitle: {
        en: 'Get in touch with us and our specialized team will address your inquiries',
        ar: 'تواصل معنا وسيتم مناقشة استفسارك من خلال فريقنا المختص',
      },
      backgroundImage: '/images/hero/hero-1.jpg',
      sortOrder: 0,
    },
    {
      pageId: pagesMap.contact,
      sectionKey: 'contact-info',
      sectionName: 'Contact Info',
      title: { en: 'Get in Touch', ar: 'تواصل معنا' },
      sortOrder: 1,
    },
  ];

  for (const sec of allSections) {
    await upsertSection(sec);
  }
  console.log('Created Sections');

  for (const seo of seoPages(pagesMap)) {
    await prisma.seoMeta.upsert({
      where: { slug: seo.slug },
      update: {
        metaTitle: seo.metaTitle,
        metaDescription: seo.metaDescription,
        pageType: seo.pageType,
        pageId: seo.pageId,
      },
      create: seo,
    });
  }
  console.log('Created SEO Meta');

  for (const article of newsData) {
    await prisma.news.upsert({
      where: { slug: article.slug },
      update: article,
      create: article,
    });
  }
  console.log('Created News');

  // Remove duplicate gallery links in header (keep /gallery/photos only)
  const headerGalleryDupes = await prisma.navigationItem.findMany({
    where: {
      location: 'header',
      OR: [{ url: '/gallery' }, { url: '/gallery/' }],
    },
  });
  for (const dup of headerGalleryDupes) {
    await prisma.navigationItem.delete({ where: { id: dup.id } });
  }

  for (const nav of navigationData) {
    const existing = await prisma.navigationItem.findFirst({
      where: { url: nav.url, location: nav.location },
    });
    const data = { ...nav, isActive: true, openInNewTab: false };
    if (existing) {
      await prisma.navigationItem.update({
        where: { id: existing.id },
        data: { label: nav.label, sortOrder: nav.sortOrder, isActive: true },
      });
    } else {
      await prisma.navigationItem.create({ data });
    }
  }
  console.log('Created Navigation Items');

  const newsCategoriesMap = {};
  for (const cat of newsCategoriesData) {
    const created = await prisma.newsCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, sortOrder: cat.sortOrder, isActive: true },
      create: cat,
    });
    newsCategoriesMap[cat.slug] = created.id;
  }
  console.log('Created News Categories');

  const galleryCategoriesMap = {};
  for (const cat of galleryCategoriesData) {
    const created = await prisma.galleryCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, sortOrder: cat.sortOrder, isActive: true },
      create: cat,
    });
    galleryCategoriesMap[cat.slug] = created.id;
  }
  console.log('Created Gallery Categories');

  const buildMediaPayload = (item, adminId) => {
    const { categorySlug, ...rest } = item;
    return {
      fileName: rest.fileName,
      originalName: rest.originalName,
      fileUrl: rest.fileUrl,
      mimeType: rest.mimeType,
      title:
        typeof rest.title === 'object' ? JSON.stringify(rest.title) : rest.title,
      altText: rest.altText,
      size: 0,
      uploadedBy: adminId,
      showInGallery: true,
      galleryCategoryId: categorySlug
        ? galleryCategoriesMap[categorySlug] || null
        : null,
    };
  };

  for (const img of galleryImagesData) {
    const existing = await prisma.media.findFirst({
      where: { fileName: img.fileName },
    });
    const payload = buildMediaPayload(img, admin.id);
    if (existing) {
      await prisma.media.update({ where: { id: existing.id }, data: payload });
    } else {
      await prisma.media.create({ data: payload });
    }
  }
  for (const vid of galleryVideosData) {
    const existing = await prisma.media.findFirst({
      where: { fileName: vid.fileName },
    });
    const payload = buildMediaPayload(vid, admin.id);
    if (existing) {
      await prisma.media.update({ where: { id: existing.id }, data: payload });
    } else {
      await prisma.media.create({ data: payload });
    }
  }
  console.log('Created Gallery Media (images + videos)');

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
