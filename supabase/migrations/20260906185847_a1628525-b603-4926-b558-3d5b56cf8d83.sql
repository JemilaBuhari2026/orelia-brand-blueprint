REVOKE EXECUTE ON FUNCTION public.subscribe_to_newsletter(TEXT, TEXT, TEXT, BOOLEAN) FROM anon, authenticated;

CREATE POLICY "Subscriber list is not publicly readable"
  ON public.newsletter_subscribers FOR SELECT TO authenticated
  USING (false);