import { Article, CreateArticleDto, UpdateArticleDto } from "@/types";
import { apiClient } from "./client";

const LOCAL_STORAGE_KEY = "hizu_articles_data_v1";

// Helper functions for persistent storage
function loadStoredArticles(): Article[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error("Failed to load articles from localStorage:", err);
    return [];
  }
}

function saveStoredArticles(articles: Article[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(articles));
  } catch (err) {
    console.error("Failed to save articles to localStorage:", err);
  }
}

export interface GetArticlesParams {
  category?: string;
  search?: string;
  onlyPublished?: boolean;
}

export const articlesApi = {
  // Get all articles with optional filtering
  async getArticles(params: GetArticlesParams = {}): Promise<Article[]> {
    try {
      const query = new URLSearchParams();
      if (params.category) query.append("category", params.category);
      if (params.search) query.append("search", params.search);
      if (params.onlyPublished !== undefined) query.append("onlyPublished", params.onlyPublished.toString());

      const data = await apiClient<Article[]>(`/api/articles?${query.toString()}`);
      if (Array.isArray(data) && data.length > 0) {
        // Synchronize with local storage
        saveStoredArticles(data);
        return data;
      }
    } catch (err) {
      // Backend not running or endpoint returned error; proceed with local storage fallback
    }

    let list = loadStoredArticles();

    if (params.onlyPublished) {
      list = list.filter((a) => a.isPublished);
    }

    if (params.category && params.category !== "همه") {
      list = list.filter((a) => a.category === params.category);
    }

    if (params.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // Get article by slug
  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const data = await apiClient<Article>(`/api/articles/${encodeURIComponent(slug)}`);
      if (data && data.id) {
        return data;
      }
    } catch (err) {
      // Fallback
    }

    const list = loadStoredArticles();
    const found = list.find((a) => a.slug === slug || a.id === slug);
    if (found) {
      // Increment views count locally
      found.viewsCount = (found.viewsCount || 0) + 1;
      saveStoredArticles(list);
      return found;
    }
    return null;
  },

  // Create article
  async createArticle(dto: CreateArticleDto): Promise<Article> {
    const slug = dto.slug?.trim() || dto.title.trim().toLowerCase().replace(/[^\w\u0600-\u06FF]+/g, "-");
    const newArticle: Article = {
      id: "art-" + Date.now(),
      title: dto.title.trim(),
      slug: slug || "article-" + Date.now(),
      summary: dto.summary.trim(),
      content: dto.content,
      coverImage: dto.coverImage || "/images/workshop-1.jpg",
      category: dto.category || "پرینت 3بعدی",
      tags: dto.tags || ["تکنولوژی", "ساخت"],
      author: dto.author || "کارشناس فنی هیزو",
      authorRole: dto.authorRole || "استودیو هیزو",
      readTimeMinutes: dto.readTimeMinutes || 5,
      isPublished: dto.isPublished ?? true,
      publishedAt: dto.isPublished ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewsCount: 0,
    };

    try {
      const remote = await apiClient<Article>("/api/articles", {
        method: "POST",
        body: JSON.stringify(newArticle),
      });
      if (remote && remote.id) {
        const list = loadStoredArticles();
        list.unshift(remote);
        saveStoredArticles(list);
        return remote;
      }
    } catch (err) {
      // Local fallback
    }

    const list = loadStoredArticles();
    list.unshift(newArticle);
    saveStoredArticles(list);
    return newArticle;
  },

  // Update article
  async updateArticle(dto: UpdateArticleDto): Promise<Article> {
    const list = loadStoredArticles();
    const index = list.findIndex((a) => a.id === dto.id);

    const updated: Article = {
      ...(index >= 0 ? list[index] : {}),
      id: dto.id,
      title: dto.title.trim(),
      slug: dto.slug.trim(),
      summary: dto.summary.trim(),
      content: dto.content,
      coverImage: dto.coverImage,
      category: dto.category,
      tags: dto.tags || [],
      author: dto.author || "کارشناس فنی هیزو",
      authorRole: dto.authorRole || "استودیو هیزو",
      readTimeMinutes: dto.readTimeMinutes || 5,
      isPublished: dto.isPublished,
      publishedAt: dto.isPublished ? (list[index]?.publishedAt || new Date().toISOString()) : undefined,
      createdAt: list[index]?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewsCount: list[index]?.viewsCount || 0,
    };

    try {
      const remote = await apiClient<Article>(`/api/articles/${dto.id}`, {
        method: "PUT",
        body: JSON.stringify(updated),
      });
      if (remote && remote.id) {
        if (index >= 0) list[index] = remote;
        else list.push(remote);
        saveStoredArticles(list);
        return remote;
      }
    } catch (err) {
      // Local fallback
    }

    if (index >= 0) {
      list[index] = updated;
    } else {
      list.push(updated);
    }
    saveStoredArticles(list);
    return updated;
  },

  // Delete article
  async deleteArticle(id: string): Promise<void> {
    try {
      await apiClient<void>(`/api/articles/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      // Local fallback
    }

    const list = loadStoredArticles().filter((a) => a.id !== id);
    saveStoredArticles(list);
  },

  // Toggle publish status
  async togglePublishStatus(id: string): Promise<Article | null> {
    const list = loadStoredArticles();
    const article = list.find((a) => a.id === id);
    if (!article) return null;

    article.isPublished = !article.isPublished;
    article.updatedAt = new Date().toISOString();
    if (article.isPublished && !article.publishedAt) {
      article.publishedAt = new Date().toISOString();
    }

    try {
      await apiClient<void>(`/api/articles/${id}/publish`, {
        method: "PATCH",
        body: JSON.stringify({ isPublished: article.isPublished }),
      });
    } catch (err) {
      // Local fallback
    }

    saveStoredArticles(list);
    return article;
  },
};
