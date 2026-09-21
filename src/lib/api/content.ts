import { apiClient } from "./client";

export interface ProcessStep {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  displayOrder: number;
}

export interface ServiceSpec {
  label: string;
  value: string;
}

export interface FabricationService {
  id: string;
  slug: string;
  code: string;
  badge: string;
  coord: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  iconName: string;
  specs: ServiceSpec[];
  materials: string[];
  applications: string[];
  equipment: string;
  displayOrder: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  badge: string;
  displayOrder: number;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  displayOrder: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  englishRole: string;
  education: string;
  imageUrl: string;
  bio: string;
  specialties: string[];
  email: string;
  displayOrder: number;
}

export interface CompanyGoal {
  id: string;
  goalNumber: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  displayOrder: number;
}

export interface CompanyMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
  displayOrder: number;
}

export interface AboutContent {
  teamMembers: TeamMember[];
  goals: CompanyGoal[];
  milestones: CompanyMilestone[];
}

export interface HomeContent {
  processSteps: ProcessStep[];
  services: FabricationService[];
  faqs: FaqItem[];
  slides: HeroSlide[];
}

// Resilient default fallbacks matching backend seed
export const DEFAULT_PROCESS_STEPS: ProcessStep[] = [
  { id: "1", stepNumber: "01", title: "کشف و تحلیل نیاز", description: "دریافت فایل CAD، اسکچ یا نمونه فیزیکی و بررسی اهداف پروژه.", displayOrder: 1 },
  { id: "2", stepNumber: "02", title: "بررسی مهندسی DFM", description: "بهینه‌سازی هندسه برای ساخت و تعیین دقیق تلرانس‌های مجاز.", displayOrder: 2 },
  { id: "3", stepNumber: "03", title: "انتخاب متریال", description: "تطبیق آلیاژ آلومینیوم، چوب، فیبرکربن یا رزین متناسب با کارکرد.", displayOrder: 3 },
  { id: "4", stepNumber: "04", title: "تولید دقیق کارگاهی", description: "اجرای ماشین‌کاری CNC، پرینت صنعتی و مونتاژ قطعات در آتلیه.", displayOrder: 4 },
  { id: "5", stepNumber: "05", title: "تست کیفیت و تحویل", description: "اندازه‌گیری میکرومتری، کنترل کیفیت نهایی و بسته‌بندی ایمن.", displayOrder: 5 },
];

export const DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-1",
    question: "چه فرمت‌های فایلی برای بررسی DFM و استعلام ساخت در هیزو پذیرفته می‌شود؟",
    badge: "CAD / CAM / VECTOR",
    answer: "ما تمامی فایل‌های استاندارد طراحی سه‌بعدی و مهندسی را در سامانه هیزو پردازش و بررسی می‌کنیم: مدل‌های سه‌بعدی و قالب: .STEP, .STP, .IGES, .SLDPRT, .X_T | پرینت 3بعدی صنعتی: .STL, .OBJ, .3MF | برش لیزر و CNC تختی: .DXF, .DWG, .AI, .SVG | نقشه‌های مهندسی ساخت: فایل‌های PDF با مشخصات تلورانسی GD&T.",
    displayOrder: 1,
  },
  {
    id: "faq-2",
    question: "تلورانس ابعادی و دقت ماشین‌کاری CNC و پرینت در هیزو چگونه تضمین می‌شود؟",
    badge: "ISO 2768-m",
    answer: "در فرآیند فرزکاری 5 محوره CNC، تلورانس هندسی و ابعادی قطعات تا محدوده ±0.01 میلی‌متر (مطابق استاندارد بین‌المللی ISO 2768-Fine) تضمین می‌گردد. در پرینت سه‌بعدی صنعتی با روش‌های SLS و رزین مهندسی SLA، دقت ابعادی در بازه ±0.05 میلی‌متر قرار دارد. کلیه قطعات حساس صنعتی همراه با گزارش اندازه‌گیری ابعادی CMM و برگه کنترل کیفیت نهایی تحویل می‌گردند.",
    displayOrder: 2,
  },
  {
    id: "faq-3",
    question: "زمان‌بندی تحویل سفارش‌های ساخت فوری و نمونه‌های اولیه (Prototype) چقدر است؟",
    badge: "FAST TURNAROUND",
    answer: "برای قطعات پرینت سه‌بعدی و برش لیزر فوری، تحویل نمونه اولیه بین 24 الی 48 ساعت کاری انجام می‌شود. سفارش‌های ماشین‌کاری دقیق CNC بسته به پیچیدگی سطوح 5 محوره، نوع آلیاژ و عملیات حرارتی بین 3 الی 6 روز کاری زمان‌بندی خواهند شد.",
    displayOrder: 3,
  },
  {
    id: "faq-4",
    question: "آیا امکان سفارش تیراژ محدود (Low-Volume Manufacturing) یا نمونه تک وجود دارد؟",
    badge: "PROTOTYPE TO BATCH",
    answer: "بله؛ ساختار کارگاه و خطوط ساخت هیزو بر پایه تولید انعطاف‌پذیر (Agile Fabrication) طراحی شده‌اند. شما می‌توانید از 1 قطعه نمونه اولیه تکی تا تیراژهای 500 الی 10,000 عددی را با هزینه بهینه ابزارسازی و بدون نیاز به هزینه‌های سنگین قالب‌سازی سفارش دهید.",
    displayOrder: 4,
  },
  {
    id: "faq-5",
    question: "چه متریال‌ها و پرداخت‌های سطحی (Surface Finishing) در کارگاه اجرا می‌شود؟",
    badge: "FINISHING LAB",
    answer: "متریال‌های قابل پردازش در هیزو شامل آلیاژهای آلومینیوم سری 6000 و 7075، برنج صنعتی، فولادهای زنگ‌نزن 304 و 316، تیتانیوم، تفلون صنعتی POM، پلیمرهای کربنی و چوب‌های سخت عمل‌آوری شده است. خدمات تکمیلی شامل آنودایز مات و رنگی، سندبلاست شیشه‌ای، پوشش‌های ضدسایش، پولیش مکانیکی و حکاکی نوری مشخصات فنی با لیزر می‌باشد.",
    displayOrder: 5,
  },
];

export const contentApi = {
  async getProcessSteps(): Promise<ProcessStep[]> {
    try {
      const data = await apiClient<ProcessStep[]>("/api/content/process-steps");
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (e) {
      console.warn("Failed to fetch process steps from backend, using defaults:", e);
    }
    return DEFAULT_PROCESS_STEPS;
  },

  async getServices(): Promise<FabricationService[]> {
    try {
      const data = await apiClient<FabricationService[]>("/api/content/services");
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (e) {
      console.warn("Failed to fetch services from backend:", e);
    }
    return [];
  },

  async getServiceBySlug(slug: string): Promise<FabricationService | null> {
    try {
      return await apiClient<FabricationService>(`/api/content/services/${slug}`);
    } catch (e) {
      console.warn(`Failed to fetch service ${slug}:`, e);
      return null;
    }
  },

  async getFaqs(): Promise<FaqItem[]> {
    try {
      const data = await apiClient<FaqItem[]>("/api/content/faqs");
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (e) {
      console.warn("Failed to fetch FAQs from backend, using defaults:", e);
    }
    return DEFAULT_FAQS;
  },

  async getSlides(): Promise<HeroSlide[]> {
    try {
      const data = await apiClient<HeroSlide[]>("/api/content/slides");
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (e) {
      console.warn("Failed to fetch slides from backend:", e);
    }
    return [];
  },

  async getAboutContent(): Promise<AboutContent | null> {
    try {
      return await apiClient<AboutContent>("/api/content/about");
    } catch (e) {
      console.warn("Failed to fetch about content from backend:", e);
      return null;
    }
  },

  async getHomeContent(): Promise<HomeContent | null> {
    try {
      return await apiClient<HomeContent>("/api/content/home");
    } catch (e) {
      console.warn("Failed to fetch home content from backend:", e);
      return null;
    }
  },
};
