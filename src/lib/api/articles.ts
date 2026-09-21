import { Article, CreateArticleDto, UpdateArticleDto } from "@/types";
import { apiClient } from "./client";

const LOCAL_STORAGE_KEY = "hizu_articles_data_v1";

// Rich initial seed articles focusing on 3D printing filaments, product design workflows, and fabrication technology
export const INITIAL_SEED_ARTICLES: Article[] = [
  {
    id: "art-1-filament-guide",
    title: "راهنمای جامع فیلامنت‌های پرینت سه‌بعدی: مقایسه PLA، PETG، ABS، TPU و نایلون کربن",
    slug: "3d-printing-filament-comparison-guide",
    summary: "بررسی تخصصی خواص مکانیکی، دمای اکستروژن، مقاومت حرارتی و رفتار جمع‌شدگی رایج‌ترین متریال‌های پرینت 3بعدی صنعتی و انتخاب بهترین گزینه برای ساخت قطعات در کارگاه هیزو.",
    category: "متریال و فیلامنت",
    tags: ["پرینت 3بعدی", "فیلامنت", "PLA", "PETG", "ABS", "PA12-CF", "متریال شناسی"],
    author: "تیم مهندسی مواد هیزو",
    authorRole: "متخصص متریال و ساخت دیجیتال",
    readTimeMinutes: 7,
    isPublished: true,
    publishedAt: "2026-09-18T10:00:00Z",
    createdAt: "2026-09-18T09:30:00Z",
    updatedAt: "2026-09-19T14:20:00Z",
    viewsCount: 342,
    coverImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    content: `## مقدمه: انتخاب هوشمندانه متریال در ساخت دیجیتال

انتخاب متریال مناسب در فرآیند پرینت سه‌بعدی (FDM / FFF) نقشی تعیین‌کننده در عملکرد مکانیکی، دقت ابعادی و دوام بلندمدت محصول دارد. هر فیلامنت دارای مشخصات حرارتی، انقباضی و پیوند بین لایه‌ای متفاوتی است که پیش از شروع ساخت باید تحلیل شود.

در این مقاله، تجربیات عملی کارگاه هیزو در تست و تولید هزاران قطعه صنعتی را بررسی می‌کنیم تا تفاوت‌های کلیدی بین متریال‌های پرکاربرد را به دقت بشناسید.

---

### 1. مقایسه جامع پارامترهای فنی فیلامنت‌ها

در جدول زیر، مشخصات کلیدی پنج فیلامنت اصلی مقایسه شده است:

| نوع فیلامنت | دمای نازل (°C) | دمای بستر (°C) | مقاومت ضربه‌ای | انقباض و جمع‌شدگی (Warping) | نیاز به انکلوژر محفظه |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PLA+** | 195 - 215 | 50 - 60 | متوسط | بسیار کم | خیر |
| **PETG** | 230 - 250 | 70 - 85 | خوب | کم | اختیاری |
| **ABS / ASA** | 240 - 260 | 90 - 110 | بسیار بالا | بالا | **بله (ضروری)** |
| **TPU (انعطاف‌پذیر)** | 210 - 230 | 30 - 50 | عالی (الاستیک) | بسیار کم | خیر |
| **PA12-CF (نایلون کربن)** | 260 - 290 | 90 - 110 | فوق‌العاده مقاوم | متوسط | بله |

---

### 2. بررسی ویژگی‌های هر فیلامنت در کاربردهای واقعی

#### الف) پلی‌لاکتیک اسید (PLA / PLA+)
- **مزایا:** پرینت بسیار آسان بدون اعوجاج، جزئیات ظاهری فوق‌العاده، عدم تصاعد گازهای سمی، سازگار با محیط زیست.
- **معایب:** مقاومت دمایی پایین (تغییر فرم در بالای 55 درجه سانتی‌گراد)، شکنندگی در برابر بارهای دینامیکی ضربه‌ای.
- **بهترین کاربرد:** نمونه‌های اولیه ارگونومی، ماکت‌های معماری، قالب‌های سیلیکونی غیرحرارتی و کیس‌های دکوراتیو.

#### ب) پلی‌اتیلن ترفتالات گلیکول (PETG)
- **مزایا:** مقاومت شیمیایی و رطوبتی بالا، انعطاف‌پذیری بیشتر نسبت به PLA، چسبندگی فوق‌العاده بین لایه‌ها، مقاومت حرارتی تا 75 درجه سانتی‌گراد.
- **معایب:** تمایل به رشته‌زنی (Stringing)، نیاز به کنترل دقیق رطوبت فیلامنت قبل از پرینت.
- **بهترین کاربرد:** قطعات مکانیکی سبک، قطعات در تماس با آب و محیط بیرون، پایه‌ها و نگه‌دارنده‌های ابزار کارگاه.

#### ج) آکریلونیتریل بوتادین استایرن (ABS / ASA)
- **مزایا:** مقاومت ضربه‌ای و سایشی بسیار عالی، قابلیت سنباده‌زنی و پولیش با بخار استون، مقاومت دمایی تا 100 درجه سانتی‌گراد.
- **معایب:** انقباض حرارتی شدید (نیاز به هیت‌بد داغ و محفظه ایزوله کاملاً بسته)، بوی متصاعده هنگام ذوب.
- **بهترین کاربرد:** قطعات خودرو، محفظه تجهیزات الکترونیکی صنعتی، چرخ‌دنده‌ها و اتصالات تحت تنش.

#### د) نایلون تقویت‌شده با الیاف کربن (PA12-CF)
- **مزایا:** استحکام مکانیکی نزدیک به آلومینیوم با وزنی بسیار کمتر، مقاومت حرارتی تا 150 درجه، ضریب اصطکاک پایین، ثبات ابعادی بی‌نظیر.
- **معایب:** قیمت بالا، سایندگی شدید نازل‌های برنجی (نیاز به نازل فولاد سخت یا یاقوت)، جذب رطوبت سریع.
- **بهترین کاربرد:** قطعات پهپاد و رباتیک پیشرفته، فیکسچرهای صنعتی ماشین‌کاری و براکت‌های جایگزین فلز.

---

> [!TIP]
> **توصیه فنی کارگاه هیزو:** برای قطعاتی که در زیر نور آفتاب یا محیط باز نصب می‌شوند، متریال **ASA** به مراتب از ABS عملکرد بهتری دارد، زیرا زنجیره پلیمری آن در برابر اشعه فرابنفش (UV) تخریب نمی‌شود.

### نتیجه‌گیری و انتخاب نهایی
اگر اولویت شما سهولت ساخت و دقت بصری است، PLA انتخاب اول است. برای قطعات کاربردی رومیزی PETG مطمئن‌ترین انتخاب به شمار می‌رود، و برای قطعات نهایی با کارکرد مکانیکی سنگین، نایلون کربن PA12-CF در آزمایشگاه هیزو استاندارد طلایی است.`
  },
  {
    id: "art-2-product-design-workflow",
    title: "فرآیند طراحی محصول صنعتی: از ایده اولیه و CAD تا نمونه فیزیکی در هیزو",
    slug: "industrial-product-design-and-prototyping-workflow",
    summary: "گام‌به‌گام نحوه مهندسی محصول، بهینه‌سازی ساخت‌پذیری (DFM)، تحلیل تلورانس‌ها و ساخت پروتوتایپ‌های صنعتی ترکیبی با CNC و پرینت 3بعدی.",
    category: "طراحی محصول",
    tags: ["طراحی صنعتی", "DFM", "CAD", "نمونه‌سازی سریع", "مهندسی معکوس"],
    author: "سهراب پارسا",
    authorRole: "مدیر ارشد طراحی صنعتی هیزو",
    readTimeMinutes: 6,
    isPublished: true,
    publishedAt: "2026-09-15T08:00:00Z",
    createdAt: "2026-09-15T07:30:00Z",
    updatedAt: "2026-09-16T11:15:00Z",
    viewsCount: 289,
    coverImage: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80",
    content: `## از طراحی مفهومی تا کارگاه ساخت فیزیکی

در توسعه محصولات سخت‌افزاری و مکاترونیک، فاصله میان یک ایده روی کاغذ و محصولی که به درستی مونتاژ و آزمایش شود، نیازمند یک فرآیند مهندسی نظام‌مند است. در استودیو طراحی و ساخت هیزو، این مسیر به هفت گام استاندارد تفکیک شده است.

---

### مراحل هفت‌گانه توسعه محصول در هیزو

#### 1. تعریف نیازمندی‌های محصول (PRD)
پیش از باز کردن نرم‌افزارهای سه‌بعدی، مشخصات عملکردی، شرایط محیطی کارکرد (دما، رطوبت، ارتعاش)، حجم تولید هدف و بازه قیمتی تدوین می‌شود.

#### 2. اسکچینگ و طراحی فرم ارگونومیک
بررسی تعامل کاربر با قطعه، محل قرارگیری پورت‌ها، کلیدها یا شاسی‌های اتصال از طریق مدل‌سازی خمیری و اسکچ‌های سریع دیجیتال.

#### 3. مدل‌سازی سه‌بعدی پارامتریک در CAD
ایجاد هندسه دقیق با نرم‌افزارهای SolidWorks و Rhino با تعریف متغیرهای پارامتریک برای اصلاح سریع در فازهای بعدی.

#### 4. تحلیل ساخت‌پذیری (Design for Manufacturing - DFM)
آیا قطعه بدون ایجاد تیغه‌برخورد در دستگاه 5 محوره CNC قابل ماشین‌کاری است؟ آیا ضخامت دیواره‌ها در پرینت سه‌بعدی تحمل خمش دارند؟ در این مرحله زوایای درفت (Draft Angle) و شعاع فیلت‌ها بهینه‌سازی می‌شوند.

#### 5. پروتوتایپ سریع اولیه (Rapid Prototyping)
پرینت سریع 24 ساعته با پرینترهای ابعاد بزرگ هیزو جهت ارزیابی ابعاد واقعی در دست (Fit & Form Test).

#### 6. ساخت قطعه عملکردی نهایی با متریال مهندسی
فرزکاری آلومینیوم 7075 با CNC یا پخت لیزری نایلون کربن برای آزمون‌های بارگذاری مکانیکی و کارکرد تحت فشار واقعی.

#### 7. تولید محدود و تدوین مستندات تولید انبوه
تهیه نقشه‌های دوبعدی انفجاری مطابق استاندارد ISO، تحلیل تلورانس زنجیره‌ای (Tolerance Stack-up) و فیکسچربندی برای خط تولید.

---

> [!NOTE]
> **نکته کلیدی مهندسی:** هزینه اصلاح یک خطای طراحی در فاز CAD یک دلار است، در فاز پروتوتایپ ده دلار، در فاز قالب‌سازی هزار دلار، و پس از تحویل به مشتری ده‌هزار دلار! آزمون زودهنگام نمونه اولیه، مهم‌ترین ابزار کاهش ریسک پروژه است.`
  },
  {
    id: "art-3-sls-vs-fdm-industrial",
    title: "فناوری پرینت سه‌بعدی پخت لیزری SLS در برابر FDM صنعتی: کدام متد مناسب پروژه شماست؟",
    slug: "industrial-sls-vs-fdm-comparison",
    summary: "تحلیل مقایسه‌ای دو روش برتر پرینت صنعتی از نظر خواص ایزوتروپیک، مقاومت در برابر فشار، عدم نیاز به ساپورت و صرفه اقتصادی در تیراژهای نیمه‌صنعتی.",
    category: "پرینت 3بعدی",
    tags: ["SLS", "FDM", "فناوری ساخت", "پرینت صنعتی", "تکنولوژی"],
    author: "کارگروه فناوری هیزو",
    authorRole: "بخش پژوهش و توسعه",
    readTimeMinutes: 5,
    isPublished: true,
    publishedAt: "2026-09-12T12:00:00Z",
    createdAt: "2026-09-12T11:00:00Z",
    updatedAt: "2026-09-13T09:00:00Z",
    viewsCount: 195,
    coverImage: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1200&q=80",
    content: `## رقابت دو غول ساخت افزایشی: FDM و SLS

فناوری‌های **FDM (Fused Deposition Modeling)** و **SLS (Selective Laser Sintering)** هر دو ستون‌های اصلی ساخت قطعات پلیمری هستند، اما رویکرد آن‌ها در لایه‌نشانی متریال کاملاً متفاوت است.

### تفاوت اساسی مکانیسم ساخت
- در **FDM** یک رشته ترموپلاستیک پیوسته ذوب شده و روی میز کار لایه‌به‌لایه‌ اکسترود می‌شود. پیوند بین لایه‌ها فیزیکی-حرارتی است و مقاومت در جهت محور Z کمتر از محورهای X و Y است (خاصیت آن‌ایزوتروپیک).
- در **SLS** یک پرتو لیزر پرتوان CO2 ذرات میکرونی پودر پلیمر را به یکدیگر جوش می‌دهد. پودر فشرده نشده پیرامون قطعه به عنوان ساپورت عمل کرده و نیاز به هرگونه داربست ساپورتی را از بین می‌برد. در نتیجه قطعه در تمام جهات خواص مقاومتی یکنواخت (ایزوتروپیک) دارد.

---

### جدول مقایسه سر‌به‌سر

| مشخصه فنی | تکنولوژی FDM صنعتی | تکنولوژی SLS پخت لیزری |
| :--- | :--- | :--- |
| **آزادی هندسی و شیارهای داخلی** | متوسط (محدود به زاویه ساپورت) | **نامحدود (ساپورت طبیعی با پودر)** |
| **رفتار مکانیکی محور Z** | حدود 60% تا 75% محور XY | **بالای 90% (تقریباً ایزوتروپیک کامل)** |
| **زبری سطح و کیفیت ظاهری** | خطوط لایه مشهود (نیاز به سنباده) | سطح مات شنی یکنواخت و حرفه‌ای |
| **هزینه نمونه تکی** | بسیار اقتصادی | مناسب برای قطعات حساس و تیراژ متوسط |
| **هوابندی و مقاومت در برابر فشار مایعات** | نیاز به سیلر و پرداخت شیمیایی | مناسب برای محفظه‌های فیلتر و هیدرولیک سبک |

---

### چه زمانی کدام روش را در هیزو سفارش دهیم؟
1. **FDM را انتخاب کنید اگر:** به دنبال پروتوتایپ سریع ارزان‌قیمت، بررسی ابعاد قطعه یا قطعات حجیم بزرگ‌تر از 500 میلیمتر با هزینه مناسب هستید.
2. **SLS را انتخاب کنید اگر:** قطعه نهایی با کانال‌های خنک‌کاری پیچیده، قطعات زنده یا لولایی متحرک یکپارچه، یا قطعات نهایی با ظاهر کارخانه‌ای و مقاومت برابر در تمام محورها می‌خواهید.`
  }
];

// Helper functions for persistent storage
function loadStoredArticles(): Article[] {
  if (typeof window === "undefined") return INITIAL_SEED_ARTICLES;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SEED_ARTICLES));
      return INITIAL_SEED_ARTICLES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_SEED_ARTICLES;
  } catch (err) {
    console.error("Failed to load articles from localStorage:", err);
    return INITIAL_SEED_ARTICLES;
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
      coverImage: dto.coverImage || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
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
