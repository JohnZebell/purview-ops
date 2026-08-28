# Vendored fonts for the social card

`route.tsx` renders the Open Graph card with Satori, which needs real font data
rather than a stylesheet. These two files are that data.

They are checked in rather than fetched during the build. A build that reaches
out to Google Fonts can fail because someone else's CDN is unreachable, for a
reason unrelated to anything in the commit being deployed.

| File | Family | Weight | Size |
|---|---|---|---|
| `fraunces-400-subset.ttf` | Fraunces | 400 | 25 KB |
| `inter-400-subset.ttf` | Inter | 400 | 37 KB |

Same two families and weights that `next/font` loads for the site itself, so
the card is set in the faces the page is set in.

## Subset

Both are subset to U+0020 through U+007E, plus NBSP and `· ’ ‘ " " – … é`.

Deliberately wider than the text currently on the card. Subsetting to the exact
strings would be a few kilobytes smaller and would mean that changing
`SITE_NAME` or `SITE_DESCRIPTION` renders missing glyphs, with nothing failing
to say so.

Changing the card to text outside that range is the one case that needs these
regenerated.

## Regenerating

Ask the Google Fonts CSS API for the subset, then download what it points at.
Send a default user agent: an old MSIE string gets a bare url back with no
`format()` on it, and a modern browser string gets woff2, which Satori does not
read.

```
https://fonts.googleapis.com/css2?family=Fraunces:wght@400&text=<url-encoded charset>
```

The response carries one `src: url(...) format('truetype')`. That url is the
file. Verify the result by parsing the font's `cmap` and confirming every
requested codepoint is covered, rather than by looking at the rendered card,
where a missing glyph can be a space.
