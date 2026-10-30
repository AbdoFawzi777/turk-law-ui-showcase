export const defaultLandingPageSections = {
  sections: [
    {
      key: 'header',
      transparent: false,
      background_color: '#ffffff',
      text_color: '#1f2937',
      button_style: 'solid'
    },
    {
      key: 'hero',
      title: "حل متكامل لإدارة القضايا القانونية",
      subtitle: "سهّل أعمال مكتب المحاماة بإدارة متكاملة للقضايا والعملاء والمستندات.",
      announcement_text: '⚖️ New: Advanced Court Calendar Integration',
      primary_button_text: 'Start Free Trial',
      secondary_button_text: 'Login',
      image: '',
      background_color: '#f8fafc',
      text_color: '#1f2937',
      layout: 'image-right',
      height: 600,
      stats: [
        { value: '500+', label: "مكاتب المحاماة" },
        { value: '25+', label: 'الدول' },
        { value: '98%', label: "رضا العملاء" }
      ],
      card: {
        name: 'Sarah Mitchell',
        title: "الشريك الرئيسي",
        company: 'Mitchell & Associates',
        initials: 'SM'
      }
    },
    {
      key: 'features',
      title: "إدارة متكاملة للعمل القانوني",
      description: "كل ما تحتاجه لإدارة القضايا والعملاء والإجراءات القانونية بكفاءة.",
      background_color: '#ffffff',
      layout: 'grid',
      columns: 3,
      image: '',
      show_icons: true,
      features_list: [
        {
          title: "إدارة القضايا",
          description: "نظّم جميع قضاياك القانونية وتابعها في مكان واحد.",
          icon: 'briefcase'
        },
        {
          title: "بوابة العملاء",
          description: "تواصل آمن مع العملاء ومشاركة آمنة للمستندات.",
          icon: 'users'
        },
        {
          title: "تسجيل الوقت والفوترة",
          description: "تسجيل تلقائي للوقت مع نظام فوترة متكامل.",
          icon: 'clock'
        }
      ]
    },
    {
      key: 'screenshots',
      title: "تعرّف على النظام أثناء العمل",
      subtitle: "استكشف الواجهة المصممة لتسهيل إدارة أعمال مكتبك القانوني.",
      screenshots_list: [
        {
          src: '/public/screenshots/a-advocate-saas-pic.png',
          alt: 'Legal Case Management Dashboard',
          title: "لوحة إدارة القضايا",
          description: "نظرة شاملة على القضايا القانونية والمواعيد النهائية وتقدم العمل"
        },
        {
          src: '/public/screenshots/client-advocate-saas-pic.png',
          alt: 'Client Management System',
          title: "إدارة العملاء",
          description: "قاعدة بيانات متكاملة للعملاء تشمل بيانات التواصل وسجل القضايا"
        },
        {
          src: '/public/screenshots/g-advocate-saas-pic.png',
          alt: 'Legal Invoice Management',
          title: "إدارة الفواتير",
          description: "إعداد فواتير احترافية وإدارة فوترة الخدمات القانونية"
        },
        {
          src: '/public/screenshots/i-advocate-saas-pic.png',
          alt: 'Legal Time Tracking',
          title: "تسجيل الوقت",
          description: "تسجيل دقيق للساعات القابلة للفوترة مع إعداد الفواتير تلقائيًا"
        },
        {
          src: '/public/screenshots/calendar-advocate-saas-pic.png',
          alt: 'Legal Calendar Management',
          title: "التقويم وتنظيم المواعيد",
          description: "أدر مواعيد المحاكم واجتماعات العملاء والمواعيد النهائية في تقويم واحد"
        }
      ]
    },
    {
      key: 'why_choose_us',
      title: 'لماذا تختار Advocate SaaS؟',
      subtitle: 'نحن الحل الموثوق لإدارة الممارسات القانونية.',
      reasons: [
        { title: 'تنفيذ سريع', description: 'شغّل مكتبك القانوني في أقل من 24 ساعة.', icon: 'clock' },
        { title: 'خبرة قانونية', description: 'صُمم بواسطة متخصصين قانونيين للمتخصصين القانونيين.', icon: 'users' }
      ],
      stats: [
        { value: '500+', label: 'مكتب قانوني', color: 'blue' },
        { value: '98%', label: 'رضا العملاء', color: 'green' }
      ]
    },
    // {
    //   key: 'templates',
    //   title: 'استكشف قوالبنا',
    //   subtitle: 'اختر من قوالبنا المصممة باحتراف لإنشاء بطاقة أعمالك الرقمية المثالية.',
    //   background_color: '#f8fafc',
    //   layout: 'grid',
    //   columns: 3,
    //   templates_list: [
    //     { name: 'freelancer', category: 'professional' },
    //     { name: 'doctor', category: 'medical' },
    //     { name: 'restaurant', category: 'food' },
    //     { name: 'realestate', category: 'business' },
    //     { name: 'fitness', category: 'health' },
    //     { name: 'photography', category: 'creative' },
    //     { name: 'lawfirm', category: 'professional' },
    //     { name: 'cafe', category: 'food' },
    //     { name: 'salon', category: 'beauty' },
    //     { name: 'construction', category: 'business' },
    //     { name: 'eventplanner', category: 'services' },
    //     { name: 'tech-startup', category: 'technology' }
    //   ],
    //   cta_text: 'View All Templates',
    //   cta_link: '#'
    // },
    {
      key: 'about',
      title: 'عن Advocate SaaS',
      description: 'نحن شغوفون بتطوير إدارة الممارسات القانونية.',
      story_title: 'تمكين المتخصصين القانونيين منذ 2020',
      story_content: 'أسس Advocate SaaS متخصصون قانونيون وخبراء تقنية استجابةً للحاجة إلى إدارة فعالة للممارسات القانونية.',
      image: '',
      background_color: '#f9fafb',
      layout: 'image-right',
      stats: [
        { value: '4+ سنوات', label: 'خبرة', color: 'blue' },
        { value: '500+', label: 'مكتب قانوني', color: 'green' },
        { value: '25+', label: 'دولة', color: 'purple' }
      ]
    },
    {
      key: 'team',
      title: 'تعرّف على فريقنا',
      subtitle: 'نحن فريق متنوع من المبتكرين وحلّالِي المشكلات.',
      cta_title: 'هل تريد الانضمام إلى فريقنا؟',
      cta_description: 'نبحث دائمًا عن أشخاص موهوبين.',
      cta_button_text: 'عرض الوظائف المتاحة',
      members: [
        { name: 'Sarah Johnson', role: "المؤسس والرئيس التنفيذي", bio: "مدير سابق في مجال التقنية القانونية بخبرة تتجاوز 15 عامًا.", image: '', linkedin: '#', email: 'sarah@advocate.com' }
      ]
    },
    {
      key: 'testimonials',
      title: 'ماذا يقول عملاؤنا',
      subtitle: 'لا تكتفِ بكلامنا فقط.',
      trust_title: 'موثوق به من مكاتب قانونية حول العالم',
      trust_stats: [
        { value: '4.9/5', label: 'متوسط التقييم', color: 'blue' },
        { value: '500+', label: 'مكتب قانوني', color: 'green' }
      ],
      testimonials: [
        { name: 'Michael Rodriguez', role: "الشريك المدير", company: 'Rodriguez Law Group', content: "ساهم النظام في تطوير إدارة أعمال مكتبنا القانوني بالكامل.", rating: 5 }
      ]
    },
    {
      key: 'plans',
      title: 'اختر خطتك',
      subtitle: 'ابدأ بخطتنا المجانية وقم بالترقية مع نمو أعمالك.',
      faq_text: 'هل لديك أسئلة حول خططنا؟ تواصل مع فريق المبيعات.'
    },
    {
      key: 'faq',
      title: 'الأسئلة الشائعة',
      subtitle: 'هل لديك أسئلة؟ لدينا الإجابات.',
      cta_text: 'هل ما زالت لديك أسئلة؟',
      button_text: 'تواصل مع الدعم',
      faqs: [
        { question: 'كيف يساعد Advocate SaaS مكاتب المحاماة؟', answer: 'يوفر Advocate SaaS أدوات شاملة لإدارة القضايا وفوترة العملاء وإدارة المستندات والبحث القانوني في منصة واحدة.' }
      ]
    },
    {
      key: 'newsletter',
      title: 'ابقَ على اطلاع مع Advocate SaaS',
      subtitle: 'احصل على أحدث مستجدات التقنية القانونية ونصائح إدارة الممارسة.',
      // privacy_text: 'No spam, unsubscribe at any time.',
      benefits: [
        { icon: '⚖️', title: 'مستجدات التقنية القانونية', description: 'أحدث مزايا وتحسينات التقنية القانونية' }
      ]
    },
    {
      key: 'contact',
      title: 'تواصل معنا',
      subtitle: 'هل لديك أسئلة حول Advocate SaaS؟ يسعدنا التواصل معك.',
      form_title: 'أرسل لنا رسالة',
      info_title: 'معلومات التواصل',
      info_description: 'نحن هنا لمساعدتك والإجابة عن أي سؤال لديك.',
      layout: 'split',
      background_color: '#f9fafb'
    },
    {
      key: 'footer',
      description: 'نطوّر إدارة الممارسات القانونية بحلول تقنية مبتكرة.',
      newsletter_title: 'ابقَ على اطلاع',
      newsletter_subtitle: 'اشترك في نشرتنا البريدية للحصول على المستجدات',
      links: {
        product: [{ name: 'المزايا', href: '#features' }, { name: 'الأسعار', href: '#pricing' }],
        company: [{ name: 'من نحن', href: '#about' }, { name: 'التواصل', href: '#contact' }]
      },
      social_links: [
        { name: 'Facebook', icon: 'Facebook', href: '#' },
        { name: 'Twitter', icon: 'Twitter', href: '#' }
      ],
      section_titles: {
        product: 'Product',
        company: 'Company'
      }
    }
  ],
  theme: {
    primary_color: '#10b77f',
    secondary_color: '#ffffff',
    accent_color: '#f7f7f7',
    logo_light: '',
    logo_dark: '',
    favicon: ''
  },
  seo: {
    meta_title: 'Legal Case Management System - Complete Law Firm Solution',
    meta_description: 'Comprehensive legal case management software for law firms. Manage cases, clients, documents, billing, and court schedules in one platform.',
    meta_keywords: 'legal case management, law firm software, case management system, legal billing, court calendar, document management'
  },
  custom_css: '',
  custom_js: '',
  section_order: ['header', 'hero', 'features', 'screenshots', 'why_choose_us', 'about', 'team', 'testimonials', 'plans', 'faq', 'newsletter', 'contact', 'footer'],
  section_visibility: {
    header: true,
    hero: true,
    features: true,
    screenshots: true,
    why_choose_us: true,
    // templates: true,
    about: true,
    team: true,
    testimonials: true,
    plans: true,
    faq: true,
    newsletter: true,
    contact: true,
    footer: true
  }
};
