import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitContactEnquiry, type EnquiryType } from "@/lib/leads.functions";

export const ENQUIRY_LABELS: Record<EnquiryType, string> = {
  general: "General enquiry",
  corporate: "Corporate wellness",
  wholesale: "Stocking / wholesale",
  gifting: "Gifting",
  vending: "Vending",
  partnership: "Partnership",
  other: "Something else",
};

type Props = {
  types?: EnquiryType[];
  defaultType?: EnquiryType;
  showCompany?: boolean;
  className?: string;
};

const ALL_TYPES = Object.keys(ENQUIRY_LABELS) as EnquiryType[];

export function EnquiryForm({
  types = ALL_TYPES,
  defaultType = "general",
  showCompany = false,
  className = "rounded-3xl border border-border bg-card p-8",
}: Props) {
  const send = useServerFn(submitContactEnquiry);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      enquiryType: String(fd.get("enquiryType") ?? defaultType) as EnquiryType,
      message: String(fd.get("message") ?? "").trim(),
    };

    if (!payload.name) return setError("Please tell us your name.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(payload.email))
      return setError("Please enter a valid email address.");
    if (!payload.message) return setError("Please add a short message.");

    setState("sending");
    try {
      await send({ data: payload });
      form.reset();
      setState("sent");
    } catch (err) {
      setState("idle");
      setError(
        err instanceof Error && err.message
          ? err.message
          : "We couldn't send your message. Please try again in a moment.",
      );
    }
  }

  if (state === "sent") {
    return (
      <div role="status" className={className}>
        <h2 className="font-display text-3xl">You're on our radar 💜</h2>
        <p className="mt-3 text-muted-foreground">
          Thanks for reaching out. We've received your message and we'll be in touch.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-6 inline-flex h-11 items-center rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:bg-secondary"
        >
          Send another message
        </button>
      </div>
    );
  }

  const inputClass =
    "mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary";

  return (
    <form onSubmit={onSubmit} noValidate className={className}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input id="name" name="name" autoComplete="name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium">
            Phone <span className="text-muted-foreground">(optional)</span>
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
        </div>
        {showCompany ? (
          <div>
            <label htmlFor="company" className="text-sm font-medium">
              Company <span className="text-muted-foreground">(optional)</span>
            </label>
            <input id="company" name="company" autoComplete="organization" className={inputClass} />
          </div>
        ) : null}
        <div className="sm:col-span-2">
          <label htmlFor="enquiryType" className="text-sm font-medium">
            What is this about?
          </label>
          <select id="enquiryType" name="enquiryType" defaultValue={defaultType} className={inputClass}>
            {types.map((t) => (
              <option key={t} value={t}>
                {ENQUIRY_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="text-sm font-medium">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-6 inline-flex h-12 items-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
