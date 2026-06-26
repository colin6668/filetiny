# Google AdSense Setup

This site is ready for AdSense, but real ads are disabled by default.

## 1. Get AdSense values

In Google AdSense, create display ad units and copy:

- Publisher client id: `ca-pub-0000000000000000`
- Ad slot ids: numeric ids for each ad unit

Recommended mapping:

- `hero-rectangle`: responsive display ad near the top of the page
- `image-compressor-inline`: inline ad in the image compressor section
- `pdf-to-text-inline`: inline ad in the PDF to Text section
- `word-counter-inline`: inline ad in the word counter section

## 2. Enable ads

Edit `ads.js`:

```js
const ADSENSE_CLIENT = 'ca-pub-0000000000000000';

const AD_SLOTS = {
  'hero-rectangle': '1111111111',
  'image-compressor-inline': '2222222222',
  'pdf-to-text-inline': '3333333333',
  'word-counter-inline': '4444444444'
};
```

If `ADSENSE_CLIENT` or a slot id is empty, the page shows a clean placeholder instead of loading AdSense.

## 3. ads.txt

After AdSense gives your publisher id, create `ads.txt` at the website root:

```txt
google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0
```

Replace `pub-0000000000000000` with the numeric part of your own `ca-pub-...` id.

## 4. Notes

- Do not click your own ads.
- Do not enable live ads before the site has useful content and policy pages.
- Keep `about.html`, `privacy.html`, `zh-about.html`, and `zh-privacy.html` published.
- Replace `https://filetiny.com/` in canonical links and `sitemap.xml` with the real domain before submitting to Search Console or AdSense.

