# lynxcc121-cmyk.github.io

Personal portfolio. Static HTML/CSS, vanilla JS, no build step.

```
.
├── index.html      single page, semantic markup
├── styles.css      one stylesheet, no framework
├── script.js       tab/scroll sync + mobile drawer
├── public/
│   ├── images/     project screenshots
│   ├── videos/     preview clips
│   └── favicon.*
├── .nojekyll       so Pages serves files starting with _
└── .gitignore
```

## Deploy (GitHub Pages)

It's a `<user>.github.io` repo, so Pages serves `main` from the root automatically. Push and it's live.

```sh
git add -A
git commit -m "rebuild"
git push
```

## Edit guide

- All copy lives directly in `index.html`. Section ids match the file tree links.
- To add a project: copy any `<article class="doc project">` block, change the `id`, swap the media paths, write a paragraph or two, and add a matching `<li>` in the tree and a `<a class="tab">` if you want it as a top tab.
- Colors are CSS variables at the top of `styles.css`.

## Notes

- Video (`preview-short.mp4`) is ~25 MB. It uses `preload="none"` so it doesn't auto-download, but if you re-encode it lower (720p, ~3 Mbps) the page feels lighter on slow connections.
- A few PNGs are over 1 MB. Re-encoding to WebP would cut load further.
