# Realms

**Who will you be?**

Realms is a mobile app where your tabletop RPG characters come together to swap stories, share art and learn about one another. Catalogue your adventures, share information with your party and organise your campaign.

## Features

- **The Feed:** an at-a-glance summary of posts from the people you follow, their characters, their projects and your campaigns.
- **Profiles:** build your own identity and one for each of your characters. Characters can befriend other people's characters, and share art, diary entries and blog posts.
- **Personality and alignment:** answer questions in character to find out who your characters really are, and see how your party views them.
- **Campaign dashboards:** a private space for each campaign. Share artwork and memes, organise boards, schedule sessions and collect RSVPs.
- **Projects:** connect related posts into one timeline, such as painting a miniature from print to basing, so others can follow the whole journey.

## Get the app

Realms is currently available as a demo:

| Platform                      | Link                                                 |
| ----------------------------- | ---------------------------------------------------- |
| iOS (TestFlight)              | <https://testflight.apple.com/join/SmsPnbJK>         |
| Android (Google Play testing) | <https://play.google.com/apps/testing/app.therealms> |

We'd love to hear what you think: [share your feedback](https://docs.google.com/forms/d/e/1FAIpQLSeET7KSbn5ccqFNQkgipP0yzcLrrleTViaKCywwWVANHOp40w/viewform).

## About this repository

This is the source of the Realms landing page. It is a static site with no build step and no dependencies.

```
index.html          The page
css/                base (tokens, reset), components, layout
js/main.js          Carousels and the scroll fade on feature cards
assets/images/      Artwork, store buttons and QR codes
assets/fonts/       Self-hosted Inter and Cormorant (latin subset, woff2)
favicon.ico         Browser tab icon
apple-touch-icon.png  iOS home-screen icon
robots.txt          Crawler rules, points to the sitemap
sitemap.xml         List of pages for search engines
CNAME               Custom domain for GitHub Pages (therealms.app)
```

To preview it locally, serve the folder with any static server, for example:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

Notes for contributors:

- **Store links appear twice** in `index.html` (hero and footer). The QR codes in `assets/images/qr-ios.webp` and `qr-android.webp` encode the same URLs. If a store link changes, update both copies and regenerate the matching QR code.
- **Content Security Policy:** the page sets a strict CSP in a `<meta>` tag that only allows its own files. Adding analytics or any other third-party resource requires updating it.
- **Domain:** `https://therealms.app/` appears in the canonical link, `og:url`, `robots.txt` and `sitemap.xml`. If the domain changes, update all of them along with `CNAME`.
- **Images** are exported tightly cropped (no transparent padding or baked-in glow) at 2x their display size. Keep new exports the same way so the CSS doesn't need offsets to undo padding.
