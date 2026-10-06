<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Product text content lives in the database (commerce_products, aliased as the products view); images resolve from asset pointers in src/lib/catalog.ts, referenced by product_images.image_ref. Why: protected images stay bundled while copy becomes database-managed.
- Signed-in bags live in carts/cart_items and change only through the cart_set_item / cart_merge / cart_clear database functions (RLS as caller); guests use localStorage. Why: website and mobile app share one bag contract with live updates.
