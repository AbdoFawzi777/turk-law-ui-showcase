import { t as localizeSystemText } from '@/utils/i18n';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { usePage } from '@inertiajs/react';

interface Faq {
  id: number;
  question: string;
  answer: string;
}

interface FaqSectionProps {
  brandColor?: string;
  faqs: Faq[];
  settings?: any;
  sectionData?: {
    title?: string;
    subtitle?: string;
    cta_text?: string;
    button_text?: string;
    default_faqs?: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export default function FaqSection({ faqs, settings, sectionData, brandColor = '#3b82f6' }: FaqSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  const { props } = usePage();

  // Get theme mode - check for demo mode and cookie
  let themeMode = (props as any).globalSettings?.themeMode || 'light';
  const isDemo = (props as any).globalSettings?.is_demo;

  React.useEffect(() => {
    if (isDemo) {
      const interval = setInterval(() => {
        forceUpdate();
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isDemo]);

  if (isDemo && typeof document !== 'undefined') {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(';').shift();
        return cookieValue ? decodeURIComponent(cookieValue) : null;
      }
      return null;
    };

    const themeSettingsCookie = getCookie('themeSettings');
    if (themeSettingsCookie) {
      try {
        const themeSettings = JSON.parse(themeSettingsCookie);
        if (themeSettings.appearance) {
          themeMode = themeSettings.appearance;
        }
      } catch (e) {
        // Silent error handling
      }
    }
  }

  const isDark = themeMode === 'dark';

  // Default FAQs if none provided
  const defaultFaqs = [
    {
      id: 1,
      question: "ما هو نظام إدارة القضايا القانونية؟",
      answer: "نظام إدارة القضايا القانونية هو حل متكامل يساعد مكاتب المحاماة والمتخصصين القانونيين على تنظيم القضايا والعملاء والمستندات والمواعيد والفواتير ومتابعتها من منصة واحدة."
    },
    {
      id: 2,
      question: "هل بيانات العملاء آمنة وسرية؟",
      answer: "نعم، نستخدم التشفير وإجراءات الأمان لحماية بيانات العملاء. صُمم النظام مع مراعاة سرية العلاقة بين المحامي وموكله ومتطلبات العمل القانوني."
    },
    {
      id: 3,
      question: "هل يمكن لأعضاء الفريق التعاون في القضايا؟",
      answer: "يدعم النظام تعاون الفريق بصلاحيات مرتبطة بالأدوار. يمكنك تعيين أعضاء للقضايا ومشاركة المستندات بأمان ومتابعة مساهماتهم مع التحكم في الوصول."
    },
    {
      id: 4,
      question: "كيف يعمل تسجيل الوقت وإعداد الفواتير؟",
      answer: "يمكنك تسجيل الساعات القابلة للفوترة داخل القضايا والمهام. ويُعد النظام الفواتير اعتمادًا على سجلات الوقت وأسعار الأتعاب لتسهيل عملية الفوترة."
    },
    {
      id: 5,
      question: "هل يمكنني إدارة مواعيد المحاكم والمواعيد النهائية؟",
      answer: "يساعدك التقويم على متابعة مواعيد الجلسات والمواعيد النهائية لتقديم المستندات والمراحل المهمة للقضية، مع تذكيرات تلقائية بالمواعيد."
    },
    {
      id: 6,
      question: "ما أنواع المستندات التي يمكنني تخزينها وإدارتها؟",
      answer: "يمكنك تخزين العقود والمذكرات القضائية والأدلة والمراسلات ومواد البحث القانوني. يدعم نظام المستندات إدارة الإصدارات والمشاركة الآمنة."
    },
    {
      id: 7,
      question: "هل يمكن استخدام النظام على الهاتف؟",
      answer: "نعم، يعمل تطبيق الويب على الهواتف، مما يتيح الاطلاع على معلومات القضايا وتحديث سجلات الوقت والتواصل مع العملاء من أي مكان."
    },
    {
      id: 8,
      question: "كيف أبدأ؟",
      answer: "أنشئ حسابًا وأكمل بيانات مكتبك، ثم ابدأ بإضافة القضايا والعملاء. الواجهة سهلة الاستخدام ولا تتطلب خبرة تقنية."
    }
  ];

  const backendFaqs = sectionData?.default_faqs?.map((faq: any, index: number) => ({
    id: index + 1,
    ...faq
  })) || defaultFaqs;

  const displayFaqs = faqs.length > 0 ? faqs : backendFaqs;

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section className={`py-12 sm:py-16 lg:py-20 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            {sectionData?.title || 'الأسئلة الشائعة'}
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed font-medium`}>
            {sectionData?.subtitle || 'هل لديك أسئلة؟ لدينا الإجابات. إذا لم تجد ما تبحث عنه، يمكنك التواصل مع فريق الدعم.'}
          </p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {displayFaqs.map((faq) => (
            <div
              key={faq.id}
              className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-lg`}
              style={{
                backgroundColor: isDark ? '#374151' : '#f9fafb',
                borderColor: isDark ? '#4b5563' : '#e5e7eb'
              }}
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full px-6 py-4 text-left flex justify-between items-center transition-colors cursor-pointer"
                style={{
                  backgroundColor: isDark ? '#374151' : '#f9fafb'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? '#4b5563' : '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? '#374151' : '#f9fafb';
                }}
                aria-expanded={openFaq === faq.id}
                aria-controls={`faq-answer-${faq.id}`}
                aria-describedby={`faq-question-${faq.id}`}
              >
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} pr-4`} id={`faq-question-${faq.id}`}>
                  {faq.question}
                </h3>
                {openFaq === faq.id ? (
                  <ChevronUp className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'} flex-shrink-0`} aria-hidden="true" />
                ) : (
                  <ChevronDown className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'} flex-shrink-0`} aria-hidden="true" />
                )}
              </button>

              {openFaq === faq.id && (
                <div
                  className={`px-6 pb-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                  style={{ backgroundColor: isDark ? '#374151' : '#f9fafb' }}
                  id={`faq-answer-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-question-${faq.id}`}
                >
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed pt-4`}>
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {(sectionData?.cta_text || sectionData?.button_text) && (
          <div className="text-center mt-8 sm:mt-12">
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              {sectionData?.cta_text || localizeSystemText("Still have questions?")}
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-semibold border"
              style={{ backgroundColor: brandColor, color: 'white', borderColor: brandColor }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = brandColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = brandColor;
                e.currentTarget.style.color = 'white';
              }}
            >
              {sectionData?.button_text || localizeSystemText("Contact Support")}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
