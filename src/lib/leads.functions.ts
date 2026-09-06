import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export const ENQUIRY_TYPES = [
  "general",
  "corporate",
  "wholesale",
  "gifting",
  "vending",
  "partnership",
  "other",
] as const;

export type EnquiryType = (typeof ENQUIRY_TYPES)[number];

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please tell us your name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  enquiryType: z.enum(ENQUIRY_TYPES),
  message: z.string().trim().min(1, "Please add a short message.").max(4000),
});

export type ContactInput = z.infer<typeof contactSchema>;

const newsletterSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address.").max(255),
  firstName: z.string().trim().max(80).optional().or(z.literal("")),
  source: z.string().trim().max(60).default("website"),
  consent: z.literal(true),
});

// Anonymous, publishable-key client. Row Level Security allows submitting a form
// and nothing else — the stored enquiries stay unreadable from the public site.
function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
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
}

export const submitContactEnquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const { error } = await publicClient()
      .from("contact_enquiries")
      .insert({
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone ? data.phone : null,
        company: data.company ? data.company : null,
        enquiry_type: data.enquiryType,
        message: data.message,
      });

    if (error) {
      console.error("contact_enquiries insert failed", error);
      throw new Error("We couldn't send your message. Please try again in a moment.");
    }

    return { ok: true as const };
  });

export const subscribeToNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => newsletterSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: result, error } = await supabaseAdmin.rpc("subscribe_to_newsletter", {
      _email: data.email,
      _first_name: data.firstName ? data.firstName : undefined,
      _source: data.source,
      _consent: true,
    });

    if (error) {
      console.error("newsletter subscribe failed", error);
      throw new Error("We couldn't add you to the list. Please try again in a moment.");
    }

    return { status: (result as string) === "already_subscribed" ? ("already" as const) : ("subscribed" as const) };
  });
