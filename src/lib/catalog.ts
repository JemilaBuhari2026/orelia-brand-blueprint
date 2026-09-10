/**
 * Hey! You Wellness — product catalogue model.
 *
 * This is the structured source of truth for products. It is intentionally
 * shaped so it can migrate to the backend later without changing components:
 * product -> inventory -> cart -> checkout -> orders.
 *
 * CONTENT SAFETY RULES (do not break):
 * - No prices, nutrition figures, certifications, clinical or medical claims.
 * - No invented flavours, variants, allergen or regulatory statements.
 * - Optional fields stay undefined until approved content exists. The UI must
 *   never render an empty field.
 *
 * IMAGE ARCHITECTURE:
 * - All product imagery below is a TEMPORARY development asset (see
 *   `imageStatus`). Final photography replaces the file at the same path /
 *   aspect ratio; no layout or component change is required.
 */
import furafrost from "@/assets/product-furafrost.jpg";
import moodbars from "@/assets/product-moodbars.jpg";
import crunchsticksAsset from "@/assets/crunch-sticks-current.png.asset.json";
import crunchsticksModelOneAsset from "@/assets/crunch-sticks-model-current-1.png.asset.json";
import crunchsticksModelTwoAsset from "@/assets/crunch-sticks-model-current-2.png.asset.json";
import crunchsticksModelThreeAsset from "@/assets/crunch-sticks-model-current-3.png.asset.json";
import cocoaboost from "@/assets/product-cocoaboost.jpg";
import cocoaBoostAsset from "@/assets/cocoa-boost-current.png.asset.json";
import superfoods from "@/assets/product-superfoods.jpg";
import naijacola from "@/assets/product-naijacola.jpg";
import naijaColaAsset from "@/assets/naija-cola-current.png.asset.json";
import {
  defaultProductCommerce,
  type ProductCommerce,
} from "@/lib/commerce";


export type ProductStatus =
  | "available"
  | "coming-soon"
  | "sold-out"
  | "concept"
  | "hidden";

export const statusLabels: Record<ProductStatus, string> = {
  available: "Available",
  "coming-soon": "Coming soon",
  "sold-out": "Sold out",
  concept: "Future concept",
  hidden: "Hidden",
};

/** CTA wording per status. Commerce is not live, so never "Buy now". */
export const statusCta: Record<ProductStatus, string> = {
  available: "Explore",
  "coming-soon": "Coming soon",
  "sold-out": "Explore",
  concept: "Explore concept",
  hidden: "Explore",
};

export type ProductCategory =
  | "Drinks"
  | "Snacks"
  | "Pantry"
  | "Frozen & chilled";

export type ProductImage = {
  src: string;
  /** Descriptive alt text — replaced together with the photography. */
  alt: string;
  /** Development placeholder vs approved brand photography. */
  imageStatus: "development-placeholder" | "approved-photography";
};

export type ProductVariant = {
  id: string;
  name: string;
  status: ProductStatus;
};

export type ProductFaq = {
  question: string;
  answer: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Product family the product belongs to (see `productFamilies`). */
  family: string;
  familySlug: string;
  category: ProductCategory;
  role: string;
  status: ProductStatus;
  featured: boolean;
  /** Ordering hint for "Newest" sorting — lower is earlier in the roadmap. */
  order: number;

  hero: ProductImage;
  gallery?: ProductImage[];

  shortDescription: string;
  longDescription?: string;

  tasteProfile: string;
  heroIngredient: string;
  ingredients: string[];
  /** Ingredient slugs that link into the African ingredient library. */
  africanIngredients: string[];
  /** Responsible, non-medical positioning. Never a health claim. */
  wellnessPositioning: string;
  ingredientStory: string;
  howToEnjoy: string[];

  size?: string;
  variants?: ProductVariant[];

  /**
   * Commerce extension (SPRINT 3, architecture only). Left undefined while no
   * real commercial data exists — see `getProductCommerce`.
   */
  commerce?: ProductCommerce;


  faqs?: ProductFaq[];
  relatedSlugs?: string[];

  seoTitle: string;
  seoDescription: string;

  /** Legacy alias kept so existing pages keep working. */
  image: string;
  proposition: string;
};

export type ProductFamily = {
  slug: string;
  name: string;
  description: string;
};

export const productFamilies: ProductFamily[] = [
  {
    slug: "gut-and-chill",
    name: "Gut & Chill",
    description: "Fermented, chilled and spoonable — millet at the centre.",
  },
  {
    slug: "food-x-mood",
    name: "Food × Mood",
    description: "Snacks built around the food and mood connection.",
  },
  {
    slug: "everyday-crunch",
    name: "Everyday Crunch",
    description: "Baked African staples with genuine crunch.",
  },
  {
    slug: "pour-and-go",
    name: "Pour & Go",
    description: "Drinks that carry West African ingredients well.",
  },
  {
    slug: "pantry",
    name: "Pantry",
    description: "Single-ingredient pouches for building your own routine.",
  },
];

export const products: Product[] = [
  {
    id: "hy-furafrost",
    slug: "furafrost",
    name: "Furafrost",
    family: "Gut & Chill",
    familySlug: "gut-and-chill",
    category: "Frozen & chilled",
    role: "Hero product",
    status: "coming-soon",
    featured: true,
    order: 1,
    hero: {
      src: furafrost,
      alt: "Furafrost, a chilled millet-based drink and frozen dessert, shown as a temporary development image",
      imageStatus: "development-placeholder",
    },
    shortDescription:
      "A millet-based probiotic drink and frozen dessert in one — fura reimagined for modern gut health.",
    tasteProfile:
      "Creamy and lightly tangy, with the gentle grain sweetness of millet and a cool, spoonable finish.",
    heroIngredient: "Fermented millet",
    ingredients: ["Fermented millet", "Live cultures", "Dates", "Warm spice blend"],
    africanIngredients: ["Millet"],
    wellnessPositioning: "Made with fermented millet and live cultures.",
    ingredientStory:
      "Fura da nono has nourished West African households for generations. Furafrost keeps that heritage intact and gives it a modern format, a modern texture and a gut-health purpose people can feel.",
    howToEnjoy: [
      "Chilled straight from the fridge as a drink",
      "Frozen for two hours as a soft dessert",
      "Blended with fruit for a thicker bowl",
    ],
    relatedSlugs: ["cocoa-boost", "superfoods", "mood-bars"],
    seoTitle: "Furafrost — Hey! You Wellness",
    seoDescription:
      "Furafrost is a millet-based drink and frozen dessert in one, built on the West African tradition of fura.",
    image: furafrost,
    proposition:
      "A millet-based probiotic drink and frozen dessert in one — fura reimagined for modern gut health.",
  },
  {
    id: "hy-mood-bars",
    slug: "mood-bars",
    name: "Mood Bars",
    family: "Food × Mood",
    familySlug: "food-x-mood",
    category: "Snacks",
    role: "Viral / social product",
    status: "coming-soon",
    featured: true,
    order: 2,
    hero: {
      src: moodbars,
      alt: "Mood Bars, a cocoa and date snack bar, shown as a temporary development image",
      imageStatus: "development-placeholder",
    },
    shortDescription:
      "A functional snack bar built around the food and mood connection — for the middle of a long day.",
    tasteProfile: "Chewy dates and toasted nuts against deep cocoa, finished with a little salt.",
    heroIngredient: "Cocoa",
    ingredients: ["Cocoa", "Dates", "Tiger nuts", "Groundnuts", "Ginger"],
    africanIngredients: ["Cocoa", "Tiger nut"],
    wellnessPositioning:
      "Formulated around ingredients associated with steady energy and everyday mood support.",
    ingredientStory:
      "What you eat shapes how you feel. Mood Bars take that idea seriously without turning it into a lecture — a snack that tastes like a treat and behaves like a decision you're glad you made.",
    howToEnjoy: [
      "The 3pm desk snack",
      "Before or after movement",
      "In a bag, for the days that run long",
    ],
    relatedSlugs: ["crunch-sticks", "cocoa-boost", "furafrost"],
    seoTitle: "Mood Bars — Hey! You Wellness",
    seoDescription:
      "Mood Bars are a cocoa, date and tiger nut snack bar designed for the middle of a long day.",
    image: moodbars,
    proposition:
      "A functional snack bar built around the food and mood connection — for the middle of a long day.",
  },
  {
    id: "hy-crunch-sticks",
    slug: "crunch-sticks",
    name: "Crunch Sticks",
    family: "Everyday Crunch",
    familySlug: "everyday-crunch",
    category: "Snacks",
    role: "Entry product",
    status: "coming-soon",
    featured: false,
    order: 3,
    hero: {
      src: crunchsticksAsset.url,
      alt: "Hey! You Crunch Sticks in their current purple product packaging",
      imageStatus: "approved-photography",
    },
    gallery: [
      {
        src: crunchsticksModelOneAsset.url,
        alt: "Hey! You model wearing purple branded clothing and carrying an orange branded tote",
        imageStatus: "approved-photography",
      },
      {
        src: crunchsticksModelTwoAsset.url,
        alt: "Hey! You model holding a packet of Crunch Sticks in a shopping centre",
        imageStatus: "approved-photography",
      },
      {
        src: crunchsticksModelThreeAsset.url,
        alt: "Hey! You model wearing a hijab and holding a packet of Crunch Sticks in a shopping centre",
        imageStatus: "approved-photography",
      },
    ],
    shortDescription:
      "Baked cassava sticks with real crunch — the accessible first taste of Hey! You.",
    tasteProfile: "Golden, crisp and savoury, seasoned lightly so the cassava keeps its character.",
    heroIngredient: "Cassava",
    ingredients: ["Cassava", "Cold-pressed oil", "Sea salt", "Spice seasoning"],
    africanIngredients: ["Cassava"],
    wellnessPositioning: "Baked rather than fried, made from a staple African root crop.",
    ingredientStory:
      "Cassava feeds millions of people every day and is almost never treated as a premium ingredient. Crunch Sticks give it the packaging, the format and the respect it has always deserved.",
    howToEnjoy: ["Straight from the pack", "With dips and small chops", "Shared on the table"],
    relatedSlugs: ["mood-bars", "superfoods", "naija-cola"],
    seoTitle: "Crunch Sticks — Hey! You Wellness",
    seoDescription:
      "Crunch Sticks are baked cassava sticks — the accessible first taste of Hey! You Wellness.",
    image: crunchsticksAsset.url,
    proposition: "Baked cassava sticks with real crunch — the accessible first taste of Hey! You.",
  },
  {
    id: "hy-cocoa-boost",
    slug: "cocoa-boost",
    name: "Cocoa Boost",
    family: "Pour & Go",
    familySlug: "pour-and-go",
    category: "Drinks",
    role: "Premium product",
    status: "coming-soon",
    featured: true,
    order: 4,
    hero: {
      src: cocoaBoostAsset.url,
      alt: "Hey! You Cocoa Boost can — a cocoa water and baobab drink",
      imageStatus: "approved-photography",
    },
    shortDescription:
      "A cocoa and baobab drink that brings together two of West Africa's most powerful ingredients.",
    tasteProfile: "Rich cocoa rounded by the bright, citrus tang of baobab.",
    heroIngredient: "Baobab",
    ingredients: ["Cocoa", "Baobab", "Dates", "Filtered water"],
    africanIngredients: ["Cocoa", "Baobab"],
    wellnessPositioning: "Cocoa and baobab, both long valued for their nutrient density.",
    ingredientStory:
      "Nigeria and Ghana grow much of the world's cocoa and export most of it raw. Cocoa Boost is a small argument for keeping more of that value — and that flavour — at home.",
    howToEnjoy: [
      "Cold, as a morning lift",
      "Alongside breakfast",
      "As the drink you bring to someone",
    ],
    relatedSlugs: ["furafrost", "naija-cola", "mood-bars"],
    seoTitle: "Cocoa Boost — Hey! You Wellness",
    seoDescription:
      "Cocoa Boost is a cocoa and baobab drink built on two of West Africa's best known ingredients.",
    image: cocoaBoostAsset.url,
    proposition:
      "A cocoa and baobab drink that brings together two of West Africa's most powerful ingredients.",
  },
  {
    id: "hy-superfoods",
    slug: "superfoods",
    name: "Hey! You Superfoods",
    family: "Pantry",
    familySlug: "pantry",
    category: "Pantry",
    role: "Functional range",
    status: "coming-soon",
    featured: false,
    order: 5,
    hero: {
      src: superfoods,
      alt: "Hey! You Superfoods single-ingredient pouches, shown as a temporary development image",
      imageStatus: "development-placeholder",
    },
    shortDescription:
      "Single-ingredient African superfood pouches for people who like to build their own routine.",
    tasteProfile:
      "Pure and unblended — baobab tart, moringa green and grassy, hibiscus deep and floral.",
    heroIngredient: "Baobab",
    ingredients: ["Baobab powder", "Moringa", "Hibiscus", "Tiger nut flour"],
    africanIngredients: ["Baobab", "Moringa", "Hibiscus", "Tiger nut"],
    wellnessPositioning: "Clean, single-origin ingredients with nothing added.",
    ingredientStory:
      "The most interesting wellness ingredients in the world are already growing across the continent. This range simply makes them easy to keep on a shelf and easy to use.",
    howToEnjoy: [
      "Stirred into smoothies and yoghurt",
      "Brewed as an infusion",
      "Baked into everyday food",
    ],
    relatedSlugs: ["furafrost", "cocoa-boost", "crunch-sticks"],
    seoTitle: "Hey! You Superfoods — Hey! You Wellness",
    seoDescription:
      "Single-ingredient African superfood pouches: baobab, moringa, hibiscus and tiger nut.",
    image: superfoods,
    proposition:
      "Single-ingredient African superfood pouches for people who like to build their own routine.",
  },
  {
    id: "hy-naija-cola",
    slug: "naija-cola",
    name: "Naija Cola",
    family: "Pour & Go",
    familySlug: "pour-and-go",
    category: "Drinks",
    role: "Future innovation",
    status: "concept",
    featured: false,
    order: 6,
    hero: {
      src: naijaColaAsset.url,
      alt: "Hey! You Naija Cola bottle and can — a kola nut craft cola",
      imageStatus: "approved-photography",
    },
    shortDescription:
      "A craft cola built on kola nut, the ingredient the world's colas were named after.",
    tasteProfile: "Dark, spiced and citrus-lifted, less sweet than the mainstream.",
    heroIngredient: "Kola nut",
    ingredients: ["Kola nut", "Citrus", "Warm spices", "Sparkling water"],
    africanIngredients: ["Kola nut"],
    wellnessPositioning: "A lower-sugar cola grounded in its original African ingredient.",
    ingredientStory:
      "Cola came from the kola nut. Naija Cola is a concept in development that returns the drink to where its name began.",
    howToEnjoy: ["Over ice", "With food", "The bottle you bring to the party"],
    relatedSlugs: ["cocoa-boost", "crunch-sticks", "furafrost"],
    seoTitle: "Naija Cola — Hey! You Wellness",
    seoDescription:
      "Naija Cola is a concept in development: a craft cola built on kola nut, where cola began.",
    image: naijaColaAsset.url,
    proposition: "A craft cola built on kola nut, the ingredient the world's colas were named after.",
  },
];

/** Products a customer should ever see in the catalogue. */
export const visibleProducts = products.filter((p) => p.status !== "hidden");

export function getProduct(slug: string) {
  return visibleProducts.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  const bySlug = (product.relatedSlugs ?? [])
    .map((s) => visibleProducts.find((p) => p.slug === s))
    .filter((p): p is Product => Boolean(p) && p!.slug !== product.slug);

  if (bySlug.length >= limit) return bySlug.slice(0, limit);

  const fallback = visibleProducts.filter(
    (p) =>
      p.slug !== product.slug &&
      !bySlug.some((r) => r.slug === p.slug) &&
      (p.familySlug === product.familySlug ||
        p.category === product.category ||
        p.africanIngredients.some((i) => product.africanIngredients.includes(i))),
  );

  return [...bySlug, ...fallback].slice(0, limit);
}

/**
 * FAQs are derived from approved product data only — nothing is invented.
 * Returns undefined when there is nothing responsible to say.
 */
export function getProductFaqs(product: Product): ProductFaq[] {
  const faqs: ProductFaq[] = [];

  faqs.push({
    question: `Can I buy ${product.name} yet?`,
    answer:
      product.status === "concept"
        ? `${product.name} is a future concept. It is not in production, and we'll share more as the idea develops.`
        : product.status === "available"
          ? `${product.name} is available. Where to find it is listed on this page as stockists are confirmed.`
          : `${product.name} is still in development. Join the list and we'll tell you the moment it's ready.`,
  });

  faqs.push({
    question: "What's in it?",
    answer: `The named ingredients are ${listSentence(product.ingredients)}. Full ingredient declarations and nutrition information will be published once the formulation is final.`,
  });

  faqs.push({
    question: "How should I enjoy it?",
    answer: `${listSentence(product.howToEnjoy)}.`,
  });

  return [...faqs, ...(product.faqs ?? [])];
}

function listSentence(items: string[]) {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]!.toLowerCase()}`;
}

/* ---------------- Discovery ---------------- */

export const productCategories: ProductCategory[] = [
  "Drinks",
  "Snacks",
  "Pantry",
  "Frozen & chilled",
];

export const catalogueStatuses: ProductStatus[] = ["coming-soon", "available", "concept"].filter(
  (s) => visibleProducts.some((p) => p.status === s),
) as ProductStatus[];

/** Every ingredient that at least one visible product names. */
export const ingredientFilters: string[] = Array.from(
  new Set(visibleProducts.flatMap((p) => p.ingredients)),
).sort((a, b) => a.localeCompare(b));

export type SortKey = "featured" | "az" | "newest";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "az", label: "A–Z" },
  { value: "newest", label: "Newest" },
];

export type CatalogueQuery = {
  search?: string;
  families?: string[];
  categories?: string[];
  statuses?: string[];
  ingredients?: string[];
  sort?: SortKey;
};

export function filterProducts(query: CatalogueQuery): Product[] {
  const term = (query.search ?? "").trim().toLowerCase();

  const result = visibleProducts.filter((p) => {
    if (query.families?.length && !query.families.includes(p.familySlug)) return false;
    if (query.categories?.length && !query.categories.includes(p.category)) return false;
    if (query.statuses?.length && !query.statuses.includes(p.status)) return false;
    if (
      query.ingredients?.length &&
      !query.ingredients.some((i) => p.ingredients.includes(i))
    )
      return false;

    if (!term) return true;
    const haystack = [
      p.name,
      p.family,
      p.category,
      p.shortDescription,
      p.tasteProfile,
      p.heroIngredient,
      ...p.ingredients,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(term);
  });

  const sort = query.sort ?? "featured";
  return [...result].sort((a, b) => {
    if (sort === "az") return a.name.localeCompare(b.name);
    if (sort === "newest") return b.order - a.order;
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.order - b.order;
  });
}
