import { CompareItem, RadarMetric, ProductAnalysis, FeatureSectionComparison } from "@/types";

export const RADAR_METRICS: RadarMetric[] = [
  { key: "precision", label: "دقت ابعادی", fullMark: 10 },
  { key: "durability", label: "استحکام متریال", fullMark: 10 },
  { key: "value", label: "ارزش خرید", fullMark: 10 },
  { key: "portability", label: "سبکی و ارگونومی", fullMark: 10 },
  { key: "technique", label: "فناوری ساخت", fullMark: 10 },
  { key: "availability", label: "آمادگی تحویل", fullMark: 10 },
];

/**
 * Parses tolerance string (e.g. "±0.005 mm" -> 0.005)
 */
function parseToleranceValue(tol?: string): number | null {
  if (!tol) return null;
  const match = tol.match(/([0-9]+\.?[0-9]*)/);
  return match ? parseFloat(match[1]) : null;
}

/**
 * Parses weight string (e.g. "1850 g" -> 1850)
 */
function parseWeightGrams(weight?: string): number | null {
  if (!weight) return null;
  const match = weight.match(/([0-9]+)/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Calculates 6 radar metric scores (0 to 10) for a product
 */
export function calculateProductMetrics(item: CompareItem): { [key: string]: number } {
  // 1. Precision & Tolerance (lower tolerance number = higher precision)
  const tolVal = parseToleranceValue(item.tolerance);
  let precisionScore = 7.5;
  if (tolVal !== null) {
    if (tolVal <= 0.005) precisionScore = 9.9;
    else if (tolVal <= 0.01) precisionScore = 9.3;
    else if (tolVal <= 0.02) precisionScore = 8.7;
    else if (tolVal <= 0.05) precisionScore = 7.9;
    else if (tolVal <= 0.1) precisionScore = 6.8;
    else precisionScore = 6.0;
  }

  // 2. Material Durability & Quality
  const mat = (item.material || "").toLowerCase();
  let durabilityScore = 7.5;
  if (mat.includes("titanium") || mat.includes("تیتانیوم")) durabilityScore = 9.8;
  else if (mat.includes("7075") || mat.includes("aerospace")) durabilityScore = 9.5;
  else if (mat.includes("brass") || mat.includes("برنج")) durabilityScore = 9.1;
  else if (mat.includes("6061") || mat.includes("aluminum")) durabilityScore = 8.8;
  else if (mat.includes("carbon") || mat.includes("pa12") || mat.includes("کربن")) durabilityScore = 8.5;
  else if (mat.includes("oak") || mat.includes("walnut") || mat.includes("چوب")) durabilityScore = 8.0;

  // 3. Price & Value (normalized between 1M and 15M)
  let valueScore = 7.0;
  if (item.price <= 1500000) valueScore = 9.6;
  else if (item.price <= 2500000) valueScore = 9.0;
  else if (item.price <= 4500000) valueScore = 8.2;
  else if (item.price <= 7000000) valueScore = 7.4;
  else if (item.price <= 10000000) valueScore = 6.6;
  else valueScore = 5.8;

  // 4. Portability / Weight Optimization
  const w = parseWeightGrams(item.weight);
  let portabilityScore = 7.0;
  if (w !== null) {
    if (w <= 100) portabilityScore = 9.8;
    else if (w <= 200) portabilityScore = 9.2;
    else if (w <= 500) portabilityScore = 8.4;
    else if (w <= 1500) portabilityScore = 7.2;
    else if (w <= 2500) portabilityScore = 6.0;
    else portabilityScore = 5.0;
  }

  // 5. Fabrication Technique
  const tech = (item.technique || "").toLowerCase();
  let techniqueScore = 7.5;
  if (tech.includes("5-axis") || tech.includes("wire edm") || tech.includes("5 محوره") || tech.includes("۵ محوره")) techniqueScore = 9.7;
  else if (tech.includes("sls") || tech.includes("high-speed cnc") || tech.includes("لیزر نانو")) techniqueScore = 9.3;
  else if (tech.includes("laser") || tech.includes("bending") || tech.includes("برش لیزر")) techniqueScore = 8.5;
  else if (tech.includes("parametric") || tech.includes("cnc")) techniqueScore = 8.8;

  // 6. Stock Availability
  let availabilityScore = 7.0;
  if (item.stockQuantity >= 25) availabilityScore = 9.8;
  else if (item.stockQuantity >= 15) availabilityScore = 9.0;
  else if (item.stockQuantity >= 8) availabilityScore = 8.2;
  else if (item.stockQuantity >= 1) availabilityScore = 7.2;
  else availabilityScore = 4.5;

  return {
    precision: precisionScore,
    durability: durabilityScore,
    value: valueScore,
    portability: portabilityScore,
    technique: techniqueScore,
    availability: availabilityScore,
  };
}

/**
 * Extracts pros (good points) and cons (drawbacks) for a single product
 */
export function analyzeProduct(item: CompareItem): ProductAnalysis {
  const metrics = calculateProductMetrics(item);
  const goodPoints: string[] = [];
  const drawbacks: string[] = [];

  const tolVal = parseToleranceValue(item.tolerance);
  const w = parseWeightGrams(item.weight);
  const mat = (item.material || "").toLowerCase();
  const tech = (item.technique || "").toLowerCase();

  // Good Points
  if (tolVal !== null && tolVal <= 0.01) {
    goodPoints.push(`دقت ابعادی فوق‌العاده میکرونی (${item.tolerance}) مناسب مصارف حساس مهندسی`);
  } else if (item.tolerance) {
    goodPoints.push(`تلرانس ساخت کنترل شده طبق استاندارد (${item.tolerance})`);
  }

  if (mat.includes("titanium") || mat.includes("تیتانیوم")) {
    goodPoints.push("استفاده از آلیاژ خالص تیتانیوم گرید 5 با مقاومت در برابر سایش و خوردگی شیمیایی");
  } else if (mat.includes("7075") || mat.includes("aerospace")) {
    goodPoints.push("آلیاژ آلومینیوم فوق‌مقاوم 7075-T6 با بهینه‌سازی توپولوژیک وزن و ممان اینرسی");
  } else if (mat.includes("brass") || mat.includes("برنج")) {
    goodPoints.push("شمش برنجی سنگین و یکپارچه C360 با آکوستیک بی‌نظیر و پرداخت دستی لوکس");
  } else if (mat.includes("carbon") || mat.includes("pa12")) {
    goodPoints.push("پلیمر مهندسی تقویت‌شده با فیبرکربن با خاصیت خود‌روان‌کنندگی و مقاومت حرارتی 160 درجه");
  } else if (mat.includes("oak") || mat.includes("walnut")) {
    goodPoints.push("چوب طبیعی اشباع‌شده با روغن‌های ارگانیک و اتصالات پنهان و مقاوم");
  }

  if (w !== null && w <= 200) {
    goodPoints.push(`وزن بسیار بهینه و سبک (${item.weight}) با حفظ یکپارچگی ساختار فیزیکی`);
  }

  if (tech.includes("5-axis") || tech.includes("wire edm") || tech.includes("sls")) {
    goodPoints.push(`فرآیند ساخت پیشرفته و دقیق کارگاهی (${item.technique})`);
  }

  if (item.stockQuantity >= 15) {
    goodPoints.push(`موجودی آماده بالا در انبار کارگاه (${item.stockQuantity} عدد) با امکان ارسال فوری`);
  }

  if (item.price <= 2500000) {
    goodPoints.push("قیمت بسیار اقتصادی و ارزش خرید عالی نسبت به استانداردهای صنعتی و کارگاهی");
  }

  // Drawbacks / Limitations
  if (item.price >= 8000000) {
    drawbacks.push("قیمت اولیه نسبتاً بالا به دلیل ماشین‌کاری سنگین شمش خالص و متریال پریمیوم");
  }

  if (w !== null && w >= 1500) {
    drawbacks.push(`وزن بالا (${item.weight})؛ مناسب قرارگیری ثابت در میز کار یا خطوط بدون جابجایی`);
  }

  if (item.stockQuantity < 6) {
    drawbacks.push(`موجودی انبار محدود (${item.stockQuantity} عدد) به دلیل حساسیت و زمان‌بر بودن فرآیند ساخت`);
  }

  if (tolVal !== null && tolVal >= 0.05) {
    drawbacks.push(`تلرانس ساخت آزادتر نسبت به قطعات میکرونی فرز 5 محوره (${item.tolerance})`);
  }

  if (!item.tolerance) {
    drawbacks.push("عدم درج تلرانس عددی خاص در شناسنامه قطعه");
  }

  if (drawbacks.length === 0) {
    drawbacks.push("نیازمند نگهداری استاندارد در برابر ضربات بسیار شدید یا مواد شیمیایی خورنده");
  }

  // Calculate sum of metrics
  const totalScore = Number(
    (Object.values(metrics).reduce((acc, v) => acc + v, 0)).toFixed(1)
  );

  return {
    productId: item.id,
    metrics,
    goodPoints: goodPoints.slice(0, 3),
    drawbacks: drawbacks.slice(0, 2),
    totalScore,
  };
}

/**
 * Builds the feature-by-feature comparison sections and determines winners
 */
export function buildFeatureComparisons(items: CompareItem[]): FeatureSectionComparison[] {
  if (items.length === 0) return [];

  const analyses = items.map(analyzeProduct);

  const sections: {
    key: string;
    title: string;
    description: string;
    getValue: (item: CompareItem) => string;
    getScore: (item: CompareItem, analysis: ProductAnalysis) => number;
    winnerReason: (winner: CompareItem, highestScore: number) => string;
  }[] = [
    {
      key: "price",
      title: "قیمت و هزینه خرید",
      description: "ارزیابی بهینگی قیمت تمام‌شده قطعه نسبت به مشخصات و کارکرد صنعتی.",
      getValue: (i) => `${i.price.toLocaleString("fa-IR")} تومان`,
      getScore: (i, a) => a.metrics.value,
      winnerReason: (w) => `نازل‌ترین قیمت تمام‌شده و ارزش خرید اقتصادی (${w.price.toLocaleString("fa-IR")} تومان)`,
    },
    {
      key: "material",
      title: "متریال مهندسی و دوام آلیاژ",
      description: "استحکام متریال، پایداری ساختاری در شرایط کاری و مقاومت فیزیکی.",
      getValue: (i) => i.material || "نامشخص",
      getScore: (i, a) => a.metrics.durability,
      winnerReason: (w) => `استفاده از متریال با خواص مکانیکی برتر (${w.material})`,
    },
    {
      key: "tolerance",
      title: "دقت ساخت و تلرانس ابعادی",
      description: "میزان خطای مجاز ابعادی طبق استاندارد ایزو کارگاه هیزو.",
      getValue: (i) => i.tolerance ? `TOL: ${i.tolerance}` : "استاندارد عمومی",
      getScore: (i, a) => a.metrics.precision,
      winnerReason: (w) => `بالاترین دقت ساخت و بسته‌ترین تلورانس میکرونی (${w.tolerance})`,
    },
    {
      key: "weight_dimensions",
      title: "وزن و ابعاد فیزیکی",
      description: "بهینه‌سازی نسبت وزن به ابعاد و سهولت در نصب و بکارگیری.",
      getValue: (i) => [i.dimensions, i.weight].filter(Boolean).join(" | ") || "استاندارد",
      getScore: (i, a) => a.metrics.portability,
      winnerReason: (w) => `وزن بهینه و مهندسی سبک‌تر (${w.weight || w.dimensions})`,
    },
    {
      key: "technique",
      title: "فرآیند و تکنولوژی تولید",
      description: "روش تولید و نوع ماشین‌آلات صنعتی استفاده شده در کارگاه هیزو.",
      getValue: (i) => i.technique || "ماشین‌کاری کارگاهی",
      getScore: (i, a) => a.metrics.technique,
      winnerReason: (w) => `فناوری تولید پیشرفته‌تر و کیفیت پرداخت بالاتر (${w.technique})`,
    },
    {
      key: "stock",
      title: "موجودی انبار و آمادگی تحویل",
      description: "تعداد قطعه آماده در انبار کارگاه و سرعت ارسال به مشتری.",
      getValue: (i) => i.stockQuantity > 0 ? `${i.stockQuantity.toLocaleString("fa-IR")} عدد آماده ارسال` : "سفارش ساخت",
      getScore: (i, a) => a.metrics.availability,
      winnerReason: (w) => `بالاترین تعداد موجودی آماده ارسال فوری (${w.stockQuantity.toLocaleString("fa-IR")} عدد)`,
    },
  ];

  return sections.map((sec) => {
    const scores: { [id: string]: number } = {};
    const values: { [id: string]: string } = {};

    let maxScore = -1;
    let winnerId: string | null = null;
    let tie = false;

    items.forEach((item) => {
      const a = analyses.find((an) => an.productId === item.id)!;
      const score = Number(sec.getScore(item, a).toFixed(1));
      scores[item.id] = score;
      values[item.id] = sec.getValue(item);

      if (score > maxScore) {
        maxScore = score;
        winnerId = item.id;
        tie = false;
      } else if (score === maxScore) {
        tie = true;
      }
    });

    const finalWinnerId = tie ? null : winnerId;
    const winnerItem = items.find((i) => i.id === finalWinnerId);
    const winnerReason = winnerItem
      ? sec.winnerReason(winnerItem, maxScore)
      : "هر دو/سه محصول در این بخش امتیاز و کارایی برابری دارند.";

    return {
      key: sec.key,
      title: sec.title,
      description: sec.description,
      scores,
      values,
      winnerId: finalWinnerId,
      winnerReason,
    };
  });
}

/**
 * Calculates overall comparison outcome and winner
 */
export function determineOverallWinner(items: CompareItem[]): {
  winnerId: string | null;
  winnerItem: CompareItem | null;
  highestTotal: number;
  isTie: boolean;
  analyses: ProductAnalysis[];
  summary: string;
} {
  if (items.length === 0) {
    return { winnerId: null, winnerItem: null, highestTotal: 0, isTie: false, analyses: [], summary: "" };
  }

  const analyses = items.map(analyzeProduct);

  let highestTotal = -1;
  let winnerId: string | null = null;
  let isTie = false;

  analyses.forEach((a) => {
    if (a.totalScore > highestTotal) {
      highestTotal = a.totalScore;
      winnerId = a.productId;
      isTie = false;
    } else if (a.totalScore === highestTotal) {
      isTie = true;
    }
  });

  const winnerItem = items.find((i) => i.id === winnerId) || null;

  let summary = "";
  if (isTie) {
    summary = "محصولات انتخابی از نظر مجموع امتیازات فنی و اقتصادی در رده مساوی قرار گرفته‌اند. انتخاب نهایی به اولویت خاص پروژه شما (نظیر دقت میکرونی یا وزن کمتر) بستگی دارد.";
  } else if (winnerItem) {
    summary = `«${winnerItem.name}» با کسب بالاترین مجموع امتیاز (${highestTotal} از 60)، به عنوان محصول برتر این مقایسه شناخته شد. این قطعه به دلیل توازن عالی میان متریال، فرآیند ساخت و ارزش خرید، بهترین راندمان را ارائه می‌دهد.`;
  }

  return {
    winnerId: isTie ? null : winnerId,
    winnerItem: isTie ? null : winnerItem,
    highestTotal,
    isTie,
    analyses,
    summary,
  };
}
