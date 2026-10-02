import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

/**
 * Catalogue text content as stored in the database. Images stay resolved from
 * the bundled/CDN asset pointers in `catalog.ts` (product_images.image_ref
 * records which pointer each product uses).
 */
export type DbProductContent = {
  name: string;
  family: string | null;
  shortDescription: string | null;
  longDescription: string | null;
  tasteProfile: string | null;
  heroIngredient: string | null;
  ingredients: string[];
  africanIngredients: string[];
  wellnessPositioning: string | null;
  ingredientStory: string | null;
  howToEnjoy: string[];
  size: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

export const getProductContent = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1).max(80) }).parse(data))
  .handler(async ({ data }): Promise<DbProductContent | null> => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const client = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const { data: row, error } = await client
      .from("commerce_products")
      .select(
        "name, family, short_description, long_description, taste_profile, hero_ingredient, ingredients, african_ingredients, wellness_positioning, ingredient_story, how_to_enjoy, size, seo_title, seo_description",
      )
      .eq("catalog_slug", data.slug)
      .neq("catalog_status", "hidden")
      .maybeSingle();

    if (error) {
      console.error("product content read failed", error.message);
      throw new Error("We couldn't load this product right now. Please try again shortly.");
    }
    if (!row || !row.name) return null;

    return {
      name: row.name,
      family: row.family,
      shortDescription: row.short_description,
      longDescription: row.long_description,
      tasteProfile: row.taste_profile,
      heroIngredient: row.hero_ingredient,
      ingredients: row.ingredients,
      africanIngredients: row.african_ingredients,
      wellnessPositioning: row.wellness_positioning,
      ingredientStory: row.ingredient_story,
      howToEnjoy: row.how_to_enjoy,
      size: row.size,
      seoTitle: row.seo_title,
      seoDescription: row.seo_description,
    };
  });
