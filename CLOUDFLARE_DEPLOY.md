# Cloudflare Pages Deploy Guide

This project is a static website. It does not need a VPS or backend server.

## Clean deploy folder

Use the `site/` folder for Cloudflare Pages.

Cloudflare Pages settings:

- Framework preset: `None`
- Build command: leave empty
- Build output directory: `/`

If you upload through GitHub, put the contents of `site/` at the root of the GitHub repository.

## Domain setup

Before launch, replace all placeholder canonical URLs with the real domain.

Files to update:

- `index.html`
- `zh.html`
- `about.html`
- `privacy.html`
- `zh-about.html`
- `zh-privacy.html`
- `sitemap.xml`
- `robots.txt`

If the domain is `filetiny.com`, canonical URLs should use:

```txt
https://filetiny.com/
```

## AdSense

AdSense is wired through `ads.js` but disabled by default.

After AdSense approval:

1. Put your publisher id into `ADSENSE_CLIENT`.
2. Put each ad unit slot id into `AD_SLOTS`.
3. Create a real `ads.txt` in the site root.

Do not click your own ads.

## Recommended launch checklist

- Buy domain
- Deploy `site/` to Cloudflare Pages
- Bind custom domain in Cloudflare Pages
- Update canonical URLs and sitemap
- Submit sitemap in Google Search Console
- Apply to Google AdSense
- Add AdSense ids after approval
