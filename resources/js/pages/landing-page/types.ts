import type { InertiaFormProps } from '@inertiajs/react';
import type React from 'react';

export type LandingStat = { value: string; label: string; color?: string };
export type LandingFeature = { title: string; description: string; icon: string };
export type LandingLink = { name: string; href: string };
export type LandingTestimonial = {
  name: string; role: string; company?: string; content: string; rating: number; avatar?: string;
};

// Stored sections share presentation fields, with content collections for each editor.
export type LandingSection = {
  key: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  background_color?: string;
  text_color?: string;
  layout?: string;
  image_position?: string;
  transparent?: boolean;
  button_style?: string;
  height?: number;
  announcement_text?: string;
  primary_button_text?: string;
  secondary_button_text?: string;
  overlay?: boolean;
  overlay_color?: string;
  stats?: LandingStat[];
  stats_title?: string;
  stats_subtitle?: string;
  card?: { name: string; title: string; company: string; initials: string };
  columns?: number;
  show_icons?: boolean;
  features_list?: LandingFeature[];
  screenshots_list?: { src: string; alt: string; title: string; description: string }[];
  reasons?: LandingFeature[];
  story_title?: string;
  story_content?: string;
  image_title?: string;
  image_subtitle?: string;
  image_icon?: string;
  parallax?: boolean;
  values?: LandingFeature[];
  members?: { name: string; role: string; bio: string; image: string; linkedin?: string; twitter?: string; email?: string }[];
  cta_title?: string;
  cta_subtitle?: string;
  cta_description?: string;
  cta_button_text?: string;
  cta_text?: string;
  cta_link?: string;
  trust_title?: string;
  trust_stats?: LandingStat[];
  testimonials?: LandingTestimonial[];
  default_testimonials?: LandingTestimonial[];
  faq_text?: string;
  button_text?: string;
  faqs?: { question: string; answer: string }[];
  privacy_text?: string;
  benefits?: LandingFeature[];
  form_title?: string;
  info_title?: string;
  info_description?: string;
  newsletter_title?: string;
  newsletter_subtitle?: string;
  links?: Record<string, LandingLink[]>;
  footerText?: string;
  social_links?: { name: string; icon: string; href: string }[];
  section_titles?: Record<string, string>;
  templates_list?: { name: string; category: string }[];
};

export type LandingTheme = {
  primary_color?: string; secondary_color?: string; accent_color?: string;
  logo_light?: string; logo_dark?: string; favicon?: string;
};
export type LandingSeo = { meta_title?: string; meta_description?: string; meta_keywords?: string };
export type LandingConfig = {
  sections?: LandingSection[];
  theme?: LandingTheme;
  seo?: LandingSeo;
  brand?: { footerText?: string };
  custom_css?: string;
  custom_js?: string;
  section_order?: string[];
  section_visibility?: Record<string, boolean>;
};
export type LandingSettings = {
  company_name: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  contact_layout?: string;
  contact_background_color?: string;
  contact_show_map?: boolean;
  contact_map_location?: string;
  show_contact_form?: boolean;
  show_contact_info?: boolean;
  footerText?: string;
  config_sections?: LandingConfig;
};

export type SettingsEditorProps = {
  data: LandingSettings;
  setData: InertiaFormProps<LandingSettings>['setData'];
  errors: Record<string, string | undefined>;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  getSectionData: (key: string) => Partial<LandingSection>;
  updateSectionData: (key: string, updates: Partial<LandingSection>) => void;
  updateSectionVisibility: (key: string, visible: boolean) => void;
  t?: (key: string) => string;
};
