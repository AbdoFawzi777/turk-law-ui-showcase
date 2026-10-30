import { t as localizeSystemText } from '@/utils/i18n';
import React, { useState } from 'react';
import { Linkedin, Twitter, Mail } from 'lucide-react';
import { getImagePath } from '@/utils/helpers';
import { Link } from '@inertiajs/react';

interface TeamSectionProps {
    brandColor?: string;
    settings?: any;
    sectionData?: {
        title?: string;
        subtitle?: string;
        members?: Array<{
            name: string;
            role: string;
            bio: string;
            image?: string;
            linkedin?: string;
            twitter?: string;
            email?: string;
        }>;
        cta_title?: string;
        cta_description?: string;
        cta_button_text?: string;
    };
}

export default function TeamSection({ settings, sectionData, brandColor = '#3b82f6' }: TeamSectionProps) {
    const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());

    const handleImgError = (index: number) => {
        setImgErrors(prev => new Set(prev).add(index));
    };
    const defaultMembers = [
        {
            name: 'Sarah Johnson',
            role: "المؤسس والرئيس التنفيذي",
            bio: "مدير تقني سابق بخبرة تتجاوز 15 عامًا في الابتكار الرقمي، مهتم بتطوير حلول أعمال مستدامة.",
            image: '',
            linkedin: '#',
            twitter: '#',
            email: 'sarah@advocate.com'
        },
        {
            name: 'Michael Chen',
            role: "المدير التقني",
            bio: "مطور برمجيات متخصص في تطبيقات الويب والذكاء الاصطناعي، يقود الرؤية التقنية وتطوير المنتجات.",
            image: '',
            linkedin: '#',
            twitter: '#',
            email: 'michael@advocate.com'
        },
        {
            name: 'Emily Rodriguez',
            role: "رئيس قسم التصميم",
            bio: "متخصص في تصميم الواجهات وتجربة المستخدم، يركز على تقديم تجربة سهلة وجذابة تعزز التفاعل.",
            image: '',
            linkedin: '#',
            twitter: '#',
            email: 'emily@advocate.com'
        },
        {
            name: 'David Kim',
            role: "رئيس قسم التسويق",
            bio: "متخصص في التسويق وتنمية الأعمال، بخبرة في البرمجيات المقدمة للشركات واستقطاب العملاء عبر القنوات الرقمية.",
            image: '',
            linkedin: '#',
            twitter: '#',
            email: 'david@advocate.com'
        }
    ];

    const teamMembers = sectionData?.members && sectionData.members.length > 0
        ? sectionData.members
        : defaultMembers;

    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {sectionData?.title || 'تعرّف على فريقنا'}
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
                        {sectionData?.subtitle || 'نحن فريق متنوع من المبتكرين والمصممين وحلّالِي المشكلات، يجمعنا شغف تطوير التواصل المهني.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-colors">
                            {/* Profile Image */}
                            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden" style={{ backgroundColor: brandColor }}>
                                {member?.image && !imgErrors.has(index) ? (
                                    <img
                                        src={getImagePath(member.image)}
                                        alt={member?.name || 'عضو الفريق'}
                                        className="w-full h-full object-cover"
                                        onError={() => handleImgError(index)}
                                    />
                                ) : (
                                    <span className="text-white text-lg font-bold">
                                        {member.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                )}
                            </div>

                            {/* Member Info */}
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-gray-700 font-medium mb-3">
                                    {member.role}
                                </p>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                    {member.bio}
                                </p>

                                {/* Social Links */}
                                <div className="flex justify-center gap-2">
                                    {member.linkedin && (
                                        <a
                                            href={member.linkedin}
                                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200 hover:border-gray-300 transition-colors"
                                        >
                                            <Linkedin className="w-4 h-4 text-gray-600" />
                                        </a>
                                    )}
                                    {member.twitter && (
                                        <a
                                            href={member.twitter}
                                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200 hover:border-gray-300 transition-colors"
                                        >
                                            <Twitter className="w-4 h-4 text-gray-600" />
                                        </a>
                                    )}
                                    {member.email && (
                                        <a
                                            href={`mailto:${member.email}`}
                                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200 hover:border-gray-300 transition-colors"
                                        >
                                            <Mail className="w-4 h-4 text-gray-600" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* دعوة للانضمام إلى الفريق */}
                {(sectionData?.cta_title || sectionData?.cta_description || sectionData?.cta_button_text) && (
                    <div className="text-center mt-8 sm:mt-12 lg:mt-16">
                        <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 max-w-2xl mx-auto">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                {sectionData?.cta_title || 'هل تريد الانضمام إلى فريقنا؟'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {sectionData?.cta_description || 'نبحث دائمًا عن أشخاص موهوبين يشاركوننا الشغف بالابتكار والتميز. تعرّف على الوظائف المتاحة.'}
                            </p>
                            <Link
                                href={'#contact'}
                                className="inline-flex items-center px-8 py-3 rounded-lg transition-all font-semibold border"
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
                                {sectionData?.cta_button_text || localizeSystemText("View Open Positions")}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
