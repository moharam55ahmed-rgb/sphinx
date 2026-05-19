export type LegalSection = {
  id: string;
  title: { en: string; ar: string };
  paragraphs: { en: string[]; ar: string[] };
  bullets?: { en: string[]; ar: string[] };
};

export type LegalDocument = {
  slug: 'privacy' | 'terms';
  title: { en: string; ar: string };
  subtitle: { en: string; ar: string };
  lastUpdated: { en: string; ar: string };
  sections: LegalSection[];
};

export const privacyPolicy: LegalDocument = {
  slug: 'privacy',
  title: { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
  subtitle: {
    en: 'How SPHINX Real Estate Development collects, uses, and protects your personal information.',
    ar: 'كيف تجمع شركة سفنكس للتطوير العقاري معلوماتك الشخصية وتستخدمها وتحميها.',
  },
  lastUpdated: { en: 'May 16, 2026', ar: '16 مايو 2026' },
  sections: [
    {
      id: 'intro',
      title: { en: '1. Introduction', ar: '1. مقدمة' },
      paragraphs: {
        en: [
          'SPHINX Real Estate Development ("SPHINX", "we", "us", or "our") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains what information we collect when you visit our website, submit inquiries, apply for careers, or interact with our services, and how we handle that information in accordance with applicable laws in the Arab Republic of Egypt.',
          'By using our website or providing your data to us, you acknowledge that you have read and understood this policy. If you do not agree, please discontinue use of our digital services.',
        ],
        ar: [
          'تحترم شركة سفنكس للتطوير العقاري («سفنكس»، «نحن») خصوصيتك وتلتزم بحماية بياناتك الشخصية. توضح سياسة الخصوصية هذه المعلومات التي نجمعها عند زيارتك لموقعنا الإلكتروني أو إرسال استفسارات أو التقدم لوظائف أو التفاعل مع خدماتنا، وكيف نتعامل مع هذه المعلومات وفقاً للقوانين المعمول بها في جمهورية مصر العربية.',
          'باستخدامك لموقعنا أو تزويدنا ببياناتك، فإنك تقر بأنك قرأت هذه السياسة وفهمتها. إذا لم توافق، يرجى التوقف عن استخدام خدماتنا الرقمية.',
        ],
      },
    },
    {
      id: 'data-collected',
      title: { en: '2. Information We Collect', ar: '2. المعلومات التي نجمعها' },
      paragraphs: {
        en: [
          'We may collect the following categories of personal data depending on how you interact with us:',
        ],
        ar: ['قد نجمع الفئات التالية من البيانات الشخصية حسب طريقة تفاعلك معنا:'],
      },
      bullets: {
        en: [
          'Identity and contact data: full name, email address, phone number, and preferred language.',
          'Inquiry data: message content, project of interest, and communication preferences submitted via contact forms.',
          'Career data: résumé/CV, work history, and application details when you apply for a job.',
          'Technical data: IP address, browser type, device information, pages visited, and approximate location derived from logs.',
          'Marketing preferences: your choices regarding newsletters or promotional communications, where applicable.',
        ],
        ar: [
          'بيانات الهوية والتواصل: الاسم الكامل، البريد الإلكتروني، رقم الهاتف، واللغة المفضلة.',
          'بيانات الاستفسار: نص الرسالة، المشروع المطلوب، وتفضيلات التواصل المُرسلة عبر نماذج الاتصال.',
          'بيانات التوظيف: السيرة الذاتية، الخبرات، وتفاصيل الطلب عند التقدم لوظيفة.',
          'بيانات تقنية: عنوان IP، نوع المتصفح، معلومات الجهاز، الصفحات التي تمت زيارتها، والموقع التقريبي من السجلات.',
          'تفضيلات التسويق: اختياراتك بشأن النشرات أو الاتصالات الترويجية، عند الاقتضاء.',
        ],
      },
    },
    {
      id: 'how-we-use',
      title: { en: '3. How We Use Your Information', ar: '3. كيف نستخدم معلوماتك' },
      paragraphs: {
        en: ['We use personal data for legitimate business purposes, including:'],
        ar: ['نستخدم البيانات الشخصية لأغراض عمل مشروعة، بما في ذلك:'],
      },
      bullets: {
        en: [
          'Responding to your inquiries about our commercial and mixed-use real estate projects in El Shorouk City and related developments.',
          'Scheduling follow-up calls or meetings with our sales and customer relations teams.',
          'Processing job applications and managing recruitment workflows.',
          'Improving website performance, security, and user experience.',
          'Sending updates you have requested about projects, news, or company announcements.',
          'Complying with legal obligations, court orders, or regulatory requests.',
        ],
        ar: [
          'الرد على استفساراتك حول مشاريعنا التجارية ومتعددة الاستخدامات في مدينة الشروق والمشروعات ذات الصلة.',
          'ترتيب مكالمات أو اجتماعات متابعة مع فرق المبيعات وعلاقات العملاء.',
          'معالجة طلبات التوظيف وإدارة إجراءات التوظيف.',
          'تحسين أداء الموقع وأمنه وتجربة المستخدم.',
          'إرسال التحديثات التي طلبتها عن المشاريع أو الأخبار أو إعلانات الشركة.',
          'الامتثال للالتزامات القانونية أو الأوامر القضائية أو الطلبات التنظيمية.',
        ],
      },
    },
    {
      id: 'legal-basis',
      title: { en: '4. Legal Basis for Processing', ar: '4. الأساس القانوني للمعالجة' },
      paragraphs: {
        en: [
          'We process your data based on one or more of the following grounds: your consent (for example, when you submit a form), performance of steps prior to entering a contract at your request, our legitimate interests in operating and marketing our real estate business (balanced against your rights), and compliance with applicable Egyptian law.',
        ],
        ar: [
          'نعالج بياناتك بناءً على واحد أو أكثر من الأسس التالية: موافقتك (مثلاً عند إرسال نموذج)، تنفيذ خطوات قبل إبرام عقد بناءً على طلبك، مصالحنا المشروعة في تشغيل وتسويق أعمالنا العقارية (مع موازنة حقوقك)، والامتثال للقانون المصري المعمول به.',
        ],
      },
    },
    {
      id: 'sharing',
      title: { en: '5. Sharing and Disclosure', ar: '5. المشاركة والإفصاح' },
      paragraphs: {
        en: [
          'We do not sell your personal data. We may share information with trusted service providers who assist us with hosting, email delivery, analytics, or CRM systems, subject to confidentiality obligations. We may also disclose data to professional advisers, authorities, or successors in the event of a corporate transaction where permitted by law.',
          'Any international transfer of data will be conducted with appropriate safeguards where required.',
        ],
        ar: [
          'لا نبيع بياناتك الشخصية. قد نشارك المعلومات مع مزودي خدمات موثوقين يساعدوننا في الاستضافة أو البريد الإلكتروني أو التحليلات أو أنظمة إدارة العملاء، مع التزامات سرية. قد نفصح أيضاً للمستشارين المهنيين أو الجهات الرسمية أو خلفاء قانونيين في حالة معاملات شركات عند السماح بذلك قانوناً.',
          'أي نقل دولي للبيانات يتم مع ضمانات مناسبة عند الاقتضاء.',
        ],
      },
    },
    {
      id: 'cookies',
      title: { en: '6. Cookies and Similar Technologies', ar: '6. ملفات تعريف الارتباط والتقنيات المماثلة' },
      paragraphs: {
        en: [
          'Our website may use cookies and similar technologies to remember preferences (such as language or theme), measure traffic, and improve functionality. You can control cookies through your browser settings. Disabling certain cookies may limit some features of the site.',
        ],
        ar: [
          'قد يستخدم موقعنا ملفات تعريف الارتباط وتقنيات مماثلة لتذكر التفضيلات (مثل اللغة أو المظهر)، وقياس الزيارات، وتحسين الوظائف. يمكنك التحكم فيها من إعدادات المتصفح. تعطيل بعضها قد يحد من ميزات الموقع.',
        ],
      },
    },
    {
      id: 'retention',
      title: { en: '7. Data Retention', ar: '7. الاحتفاظ بالبيانات' },
      paragraphs: {
        en: [
          'We retain personal data only for as long as necessary to fulfill the purposes described in this policy, including satisfying legal, accounting, or reporting requirements. Inquiry records are typically retained for up to three (3) years unless a longer period is required for an active transaction or dispute.',
        ],
        ar: [
          'نحتفظ بالبيانات الشخصية فقط للمدة اللازمة لتحقيق الأغراض الموضحة في هذه السياسة، بما في ذلك المتطلبات القانونية والمحاسبية. تُحفظ سجلات الاستفسارات عادةً حتى ثلاث (3) سنوات ما لم تتطلب معاملة أو نزاع فترة أطول.',
        ],
      },
    },
    {
      id: 'rights',
      title: { en: '8. Your Rights', ar: '8. حقوقك' },
      paragraphs: {
        en: ['Subject to applicable law, you may have the right to:'],
        ar: ['وفقاً للقانون المعمول به، قد يكون لك الحق في:'],
      },
      bullets: {
        en: [
          'Request access to the personal data we hold about you.',
          'Request correction of inaccurate or incomplete data.',
          'Request deletion of your data where legally permitted.',
          'Object to or restrict certain processing activities.',
          'Withdraw consent where processing is consent-based, without affecting prior lawful processing.',
        ],
        ar: [
          'طلب الاطلاع على البيانات الشخصية التي نحتفظ بها عنك.',
          'طلب تصحيح بيانات غير دقيقة أو غير مكتملة.',
          'طلب حذف بياناتك حيث يسمح القانون بذلك.',
          'الاعتراض على بعض أنشطة المعالجة أو تقييدها.',
          'سحب الموافقة عندما تكون المعالجة قائمة على الموافقة، دون الإخلال بالمعالجة السابقة المشروعة.',
        ],
      },
    },
    {
      id: 'security',
      title: { en: '9. Security', ar: '9. الأمان' },
      paragraphs: {
        en: [
          'We implement appropriate technical and organizational measures to protect personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is completely secure, and we cannot guarantee absolute security.',
        ],
        ar: [
          'نطبق تدابير تقنية وتنظيمية مناسبة لحماية البيانات الشخصية من الوصول أو التعديل أو الإفصاح أو الإتلاف غير المصرح به. ومع ذلك، لا توجد طريقة نقل عبر الإنترنت آمنة تماماً، ولا يمكننا ضمان أمان مطلق.',
        ],
      },
    },
    {
      id: 'children',
      title: { en: '10. Children', ar: '10. الأطفال' },
      paragraphs: {
        en: [
          'Our services are not directed to individuals under the age of eighteen (18). We do not knowingly collect personal data from children. If you believe a child has provided us with data, please contact us so we can delete it promptly.',
        ],
        ar: [
          'خدماتنا غير موجهة لمن دون ثمانية عشر (18) عاماً. لا نجمع عن قصد بيانات شخصية من الأطفال. إذا اعتقدت أن طفلاً زودنا ببيانات، يرجى التواصل معنا لحذفها فوراً.',
        ],
      },
    },
    {
      id: 'changes',
      title: { en: '11. Changes to This Policy', ar: '11. تعديلات على السياسة' },
      paragraphs: {
        en: [
          'We may update this Privacy Policy from time to time. The "Last updated" date at the top of this page will reflect the latest version. Material changes may be communicated via our website or other appropriate channels.',
        ],
        ar: [
          'قد نحدّث سياسة الخصوصية من وقت لآخر. يعكس تاريخ «آخر تحديث» في أعلى الصفحة أحدث نسخة. قد يتم إبلاغك بالتغييرات الجوهرية عبر موقعنا أو قنوات أخرى مناسبة.',
        ],
      },
    },
    {
      id: 'contact',
      title: { en: '12. Contact Us', ar: '12. تواصل معنا' },
      paragraphs: {
        en: [
          'For privacy-related questions or to exercise your rights, please contact SPHINX Real Estate Development through the contact page on this website or the phone and email details published in our website settings. We will respond within a reasonable timeframe.',
        ],
        ar: [
          'للاستفسارات المتعلقة بالخصوصية أو لممارسة حقوقك، يرجى التواصل مع سفنكس للتطوير العقاري عبر صفحة اتصل بنا أو بيانات الهاتف والبريد المنشورة في إعدادات الموقع. سنرد خلال مدة معقولة.',
        ],
      },
    },
  ],
};

export const termsAndConditions: LegalDocument = {
  slug: 'terms',
  title: { en: 'Terms & Conditions', ar: 'الشروط والأحكام' },
  subtitle: {
    en: 'Terms governing your use of the SPHINX Real Estate Development website and digital services.',
    ar: 'الشروط التي تحكم استخدامك لموقع شركة سفنكس للتطوير العقاري وخدماتها الرقمية.',
  },
  lastUpdated: { en: 'May 16, 2026', ar: '16 مايو 2026' },
  sections: [
    {
      id: 'intro',
      title: { en: '1. Agreement to Terms', ar: '1. الموافقة على الشروط' },
      paragraphs: {
        en: [
          'These Terms and Conditions ("Terms") constitute a legally binding agreement between you ("User", "you") and SPHINX Real Estate Development ("SPHINX", "Company", "we", "us"), a real estate development company operating in Egypt. By accessing or using our website, you agree to be bound by these Terms and our Privacy Policy.',
          'If you do not agree with any part of these Terms, you must not use our website or rely on its content for investment or contractual decisions.',
        ],
        ar: [
          'تشكل هذه الشروط والأحكام («الشروط») اتفاقاً ملزماً بينك («المستخدم»، «أنت») وبين شركة سفنكس للتطوير العقاري («سفنكس»، «الشركة»، «نحن»)، وهي شركة تطوير عقاري تعمل في مصر. بدخولك أو استخدامك لموقعنا، فإنك توافق على الالتزام بهذه الشروط وسياسة الخصوصية.',
          'إذا لم توافق على أي جزء من هذه الشروط، يجب ألا تستخدم موقعنا أو تعتمد على محتواه لقرارات استثمارية أو تعاقدية.',
        ],
      },
    },
    {
      id: 'company',
      title: { en: '2. About SPHINX', ar: '2. عن سفنكس' },
      paragraphs: {
        en: [
          'SPHINX Real Estate Development develops and markets commercial, administrative, medical, and mixed-use real estate projects, primarily in El Shorouk City and surrounding areas. Information on this website is provided for general awareness of our portfolio, vision, and investment opportunities.',
        ],
        ar: [
          'تطور شركة سفنكس للتطوير العقاري وتسوّق مشروعات تجارية وإدارية وطبية ومتعددة الاستخدامات، أساساً في مدينة الشروق والمناطق المجاورة. المعلومات على هذا الموقع مقدمة للتعريف العام بمحفظتنا ورؤيتنا والفرص الاستثمارية.',
        ],
      },
    },
    {
      id: 'use',
      title: { en: '3. Permitted Use of the Website', ar: '3. الاستخدام المسموح للموقع' },
      paragraphs: {
        en: ['You agree to use the website only for lawful purposes. You must not:'],
        ar: ['توافق على استخدام الموقع لأغراض مشروعة فقط. يجب ألا:'],
      },
      bullets: {
        en: [
          'Attempt to gain unauthorized access to our systems, accounts, or data.',
          'Upload malicious code, spam, or misleading information through forms.',
          'Copy, scrape, or redistribute content for commercial use without written permission.',
          'Misrepresent your identity or affiliation when submitting inquiries or applications.',
          'Use the site in any manner that could damage our reputation or disrupt services.',
        ],
        ar: [
          'محاولة الوصول غير المصرح به إلى أنظمتنا أو حساباتنا أو بياناتنا.',
          'رفع أكواد ضارة أو رسائل مزعجة أو معلومات مضللة عبر النماذج.',
          'نسخ أو استخراج أو إعادة نشر المحتوى لاستخدام تجاري دون إذن كتابي.',
          'انتحال هوية أو انتماء عند إرسال استفسارات أو طلبات توظيف.',
          'استخدام الموقع بما يضر بسمعتنا أو يعطل الخدمات.',
        ],
      },
    },
    {
      id: 'ip',
      title: { en: '4. Intellectual Property', ar: '4. الملكية الفكرية' },
      paragraphs: {
        en: [
          'All content on this website—including text, graphics, logos, photographs, videos, project names, layouts, and software—is owned by SPHINX or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may view and print pages for personal, non-commercial reference only. Any other use requires prior written consent from SPHINX.',
        ],
        ar: [
          'جميع محتويات هذا الموقع—بما في ذلك النصوص والرسوم والشعارات والصور والفيديوهات وأسماء المشاريع والتصميمات والبرمجيات—مملوكة لسفنكس أو مرخصيها ومحمية بقوانين حقوق النشر والعلامات التجارية وغيرها. يمكنك الاطلاع والطباعة للاستخدام الشخصي غير التجاري فقط. أي استخدام آخر يتطلب موافقة كتابية مسبقة من سفنكس.',
        ],
      },
    },
    {
      id: 'disclaimer',
      title: {
        en: '5. Project Information & Investment Disclaimer',
        ar: '5. معلومات المشاريع وإخلاء المسؤولية الاستثمارية',
      },
      paragraphs: {
        en: [
          'Project descriptions, images, floor plans, availability, pricing, rental yields, and completion timelines displayed on this website are indicative and subject to change without notice. They do not constitute a binding offer, reservation, or contract unless confirmed in a signed written agreement with SPHINX or its authorized sales representatives.',
          'Real estate investments involve risks. Past performance or rendered visuals do not guarantee future results. You should conduct independent due diligence and seek professional legal, financial, and technical advice before making investment decisions.',
        ],
        ar: [
          'أوصاف المشاريع والصور والمخططات والتوافر والأسعار والعوائد والجداول الزمنية المعروضة على الموقع استرشادية وقابلة للتغيير دون إشعار. لا تشكل عرضاً أو حجزاً أو عقداً ملزماً إلا إذا أكدت باتفاقية مكتوبة وموقعة مع سفنكس أو ممثلي مبيعاتها المعتمدين.',
          'الاستثمار العقاري ينطوي على مخاطر. الأداء السابق أو الصور التخيلية لا يضمن نتائج مستقبلية. يجب إجراء دراسة مستقلة وطلب استشارة قانونية ومالية وفنية قبل اتخاذ قرارات استثمارية.',
        ],
      },
    },
    {
      id: 'inquiries',
      title: { en: '6. Inquiries, Bookings, and Contracts', ar: '6. الاستفسارات والحجوزات والعقود' },
      paragraphs: {
        en: [
          'Submitting a contact form, WhatsApp message, or phone inquiry does not create a contractual relationship or guarantee unit allocation. Any sale, lease, or investment is subject to availability, internal approval, KYC/AML requirements where applicable, and execution of official contracts under Egyptian law.',
          'Payment terms, delivery schedules, and handover conditions will be specified exclusively in the relevant contract and its annexes.',
        ],
        ar: [
          'إرسال نموذج اتصال أو رسالة واتساب أو استفسار هاتفي لا ينشئ علاقة تعاقدية ولا يضمن تخصيص وحدة. أي بيع أو إيجار أو استثمار يخضع للتوافر والموافقات الداخلية ومتطلبات التعرف على العميل ومكافحة غسل الأموال عند الاقتضاء، وتوقيع عقود رسمية وفق القانون المصري.',
          'شروط السداد وجداول التسليم وشروط التسليم تُحدد حصرياً في العقد ذي الصلة وملحقاته.',
        ],
      },
    },
    {
      id: 'third-party',
      title: { en: '7. Third-Party Links', ar: '7. روابط طرف ثالث' },
      paragraphs: {
        en: [
          'Our website may contain links to third-party websites (such as maps, social media, or video platforms). We are not responsible for the content, privacy practices, or availability of those external sites. Accessing them is at your own risk.',
        ],
        ar: [
          'قد يحتوي موقعنا على روابط لمواقع طرف ثالث (مثل الخرائط أو وسائل التواصل أو منصات الفيديو). لسنا مسؤولين عن محتوى أو ممارسات خصوصية أو توافر تلك المواقع. الوصول إليها على مسؤوليتك.',
        ],
      },
    },
    {
      id: 'liability',
      title: { en: '8. Limitation of Liability', ar: '8. تحديد المسؤولية' },
      paragraphs: {
        en: [
          'To the fullest extent permitted by Egyptian law, SPHINX shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the website or reliance on its content, including loss of profits, data, or business opportunities.',
          'Our total liability for any claim relating to the website shall not exceed the amount you paid to us through the website in the twelve (12) months preceding the claim, or one thousand Egyptian pounds (EGP 1,000), whichever is greater, except where liability cannot be limited by law.',
        ],
        ar: [
          'في أقصى حد يسمح به القانون المصري، لا تتحمل سفنكس أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية ناتجة عن استخدام الموقع أو الاعتماد على محتواه، بما في ذلك فقدان الأرباح أو البيانات أو الفرص.',
          'إجمالي مسؤوليتنا عن أي مطالبة متعلقة بالموقع لا يتجاوز ما دفعته لنا عبر الموقع خلال الاثني عشر (12) شهراً السابقة للمطالبة، أو ألف جنيه مصري (1,000 ج.م)، أيهما أكبر، إلا حيث لا يجوز تقييد المسؤولية قانوناً.',
        ],
      },
    },
    {
      id: 'indemnity',
      title: { en: '9. Indemnification', ar: '9. التعويض' },
      paragraphs: {
        en: [
          'You agree to indemnify and hold harmless SPHINX, its directors, employees, and agents from any claims, damages, or expenses (including reasonable legal fees) arising from your breach of these Terms or misuse of the website.',
        ],
        ar: [
          'توافق على تعويض سفنكس ومديريها وموظفيها ووكلائها والدفاع عنهم ضد أي مطالبات أو أضرار أو مصروفات (بما في ذلك أتعاب محاماة معقولة) ناتجة عن مخالفتك لهذه الشروط أو إساءة استخدام الموقع.',
        ],
      },
    },
    {
      id: 'law',
      title: { en: '10. Governing Law & Disputes', ar: '10. القانون الواجب التطبيق والنزاعات' },
      paragraphs: {
        en: [
          'These Terms are governed by the laws of the Arab Republic of Egypt. Any dispute arising out of or in connection with these Terms or the website shall be subject to the exclusive jurisdiction of the competent courts in Cairo, Egypt, unless mandatory consumer protection rules provide otherwise.',
        ],
        ar: [
          'تخضع هذه الشروط لقوانين جمهورية مصر العربية. أي نزاع ينشأ عن هذه الشروط أو الموقع يخضع للاختصاص الحصري للمحاكم المختصة في القاهرة، ما لم تنص قواعد حماية المستهلك الإلزامية على غير ذلك.',
        ],
      },
    },
    {
      id: 'changes',
      title: { en: '11. Changes to Terms', ar: '11. تعديل الشروط' },
      paragraphs: {
        en: [
          'We reserve the right to modify these Terms at any time. Updated Terms will be posted on this page with a revised "Last updated" date. Continued use of the website after changes constitutes acceptance of the updated Terms.',
        ],
        ar: [
          'نحتفظ بحق تعديل هذه الشروط في أي وقت. تُنشر الشروط المحدثة على هذه الصفحة مع تاريخ «آخر تحديث» جديد. استمرار استخدام الموقع بعد التعديل يعني قبول الشروط المحدثة.',
        ],
      },
    },
    {
      id: 'contact',
      title: { en: '12. Contact', ar: '12. التواصل' },
      paragraphs: {
        en: [
          'For questions regarding these Terms, please visit our Contact page or use the official communication channels listed on the website.',
        ],
        ar: [
          'للاستفسارات حول هذه الشروط، يرجى زيارة صفحة اتصل بنا أو استخدام قنوات التواصل الرسمية المدرجة على الموقع.',
        ],
      },
    },
  ],
};

export const legalDocuments: Record<'privacy' | 'terms', LegalDocument> = {
  privacy: privacyPolicy,
  terms: termsAndConditions,
};
