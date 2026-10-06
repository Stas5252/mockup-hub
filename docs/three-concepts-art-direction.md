# BLOOM / BITE CLUB / AERIS — art direction, October 2026

Existing section order and brand-specific interactions were retained. The revision changes composition, photography, typography, hover states and motion rather than adding landing-page sections.

- **BLOOM:** ivory, burgundy and botanical green; Cormorant Garamond; original floral campaign hero; staggered editorial collection; matching flower basket and rose photography; four distinct bouquet previews.
- **BITE CLUB:** red, ink and acid yellow; condensed Oswald display type; isolated original burger hero; large photographs with separate product information; moving ticker, floating product and animated roulette.
- **AERIS:** sand, olive and limestone; original coastal campaign image; large alternating room scenes; distinct Dune and Sea interiors; spa photography; restrained curtain reveal and parallax. Room imagery remains visible on phones.

References reviewed: [Flower Dose](https://flowerdose.com.au/), [Wuillemin](https://wuillemin-fleuristes.ch/en/), [VICIO](https://vicio.com/), [Burrocacao](https://www.gelateriaburrocacao.it/), [Salterra](https://www.salterra.com/), [Vinha](https://www.vinhaboutiquehotel.com/). Their branding, assets and source code were not copied.

Campaign and floral product visuals named `hero-*`, `powder-rose`, `garden-basket`, `peonies`, `tulips`, `eucalyptus`, `dune-deluxe`, `sea-suite`, and `spa` were generated for these concepts. Remaining `photo-*` assets are downloaded versions of the original Unsplash photography. All images and fonts are hosted inside this repository. Font licenses are in `mockups/_shared/fonts/licenses`.

BLOOM retains automatic pricing and adds usable cart inspection/removal. BITE retains food filtering, its cart, the three-dish −12% table and roulette; the table and roulette selections can be added to the existing cart. AERIS retains dates, room prices and mood selection; date searches display stay totals and room selection opens a demonstration inquiry. The inquiry explicitly states that it does not send data or create a real reservation.

## Verification

Start `python -m http.server 3000` at repository root, then run `node scripts/verify-three-concepts.mjs`. It uses the existing `puppeteer-core` dependency and Chromium (`CHROME_PATH` can override `/usr/bin/chromium`). `MOCKUP_BASE_URL` overrides the local address.

Checks cover 360, 390, 768 and 1440 px layouts, horizontal overflow, photographs, mobile navigation, bouquet price combinations, cart totals/removal, category filters, full-table pricing and selection limits, roulette ordering, hotel dates and stay totals, room inquiries, and reduced-motion visibility. Desktop and mobile screenshots were visually reviewed. No JavaScript browser errors were observed in the final local run.
