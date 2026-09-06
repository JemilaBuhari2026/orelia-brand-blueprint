CREATE TYPE public.enquiry_type AS ENUM ('general','corporate','wholesale','gifting','vending','partnership','other');
CREATE TYPE public.enquiry_status AS ENUM ('new','in_progress','closed');

CREATE TABLE public.contact_enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  enquiry_type public.enquiry_type NOT NULL DEFAULT 'general',
  message TEXT NOT NULL,
  status public.enquiry_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.contact_enquiries TO anon, authenticated;
GRANT ALL ON public.contact_enquiries TO service_role;
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone may submit an enquiry"
  ON public.contact_enquiries FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(btrim(name)) BETWEEN 1 AND 120
    AND length(email) BETWEEN 3 AND 255
    AND email LIKE '%_@_%.__%'
    AND length(btrim(message)) BETWEEN 1 AND 4000
    AND (phone IS NULL OR length(phone) <= 40)
    AND (company IS NULL OR length(company) <= 160)
    AND status = 'new'
  );

CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  source TEXT NOT NULL DEFAULT 'website',
  consent BOOLEAN NOT NULL DEFAULT true,
  consent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX newsletter_subscribers_email_key
  ON public.newsletter_subscribers (lower(email));

GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER newsletter_subscribers_updated_at
  BEFORE UPDATE ON public.newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Subscribing runs through this function so the subscriber list itself stays
-- unreadable to the public while duplicates are handled gracefully.
CREATE OR REPLACE FUNCTION public.subscribe_to_newsletter(
  _email TEXT,
  _first_name TEXT DEFAULT NULL,
  _source TEXT DEFAULT 'website',
  _consent BOOLEAN DEFAULT true
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  clean_email TEXT := lower(btrim(_email));
  inserted BOOLEAN;
BEGIN
  IF _consent IS NOT TRUE THEN
    RAISE EXCEPTION 'consent_required';
  END IF;
  IF clean_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$' OR length(clean_email) > 255 THEN
    RAISE EXCEPTION 'invalid_email';
  END IF;

  INSERT INTO public.newsletter_subscribers (email, first_name, source, consent)
  VALUES (clean_email, nullif(btrim(coalesce(_first_name,'')), ''), coalesce(nullif(btrim(_source),''), 'website'), true)
  ON CONFLICT (lower(email)) DO NOTHING
  RETURNING true INTO inserted;

  IF inserted THEN
    RETURN 'subscribed';
  END IF;
  RETURN 'already_subscribed';
END;
$$;

REVOKE ALL ON FUNCTION public.subscribe_to_newsletter(TEXT, TEXT, TEXT, BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.subscribe_to_newsletter(TEXT, TEXT, TEXT, BOOLEAN) TO anon, authenticated, service_role;