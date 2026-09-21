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

export const contentApi = {
  async getProcessSteps(): Promise<ProcessStep[]> {
    try {
      const data = await apiClient<ProcessStep[]>("/api/content/process-steps");
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (e) {
      console.warn("Failed to fetch process steps from backend:", e);
    }
    return [];
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
      console.warn("Failed to fetch FAQs from backend:", e);
    }
    return [];
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
