# netfyr.io

Source for the [netfyr website](https://netfyr.io/).

The site is static HTML, CSS and JavaScript in `public/`. The contributor guide
lives at `public/development/index.html` and is published at `/development/`.

Preview locally:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory public
```

Open `http://127.0.0.1:8000/`. There is no build step; the GitHub Pages workflow
publishes `public/` on pushes to `main`.

`public/ui/` copies the theme control from `netfyr-design/web/src/`;
`public/brand/` copies its flame modules and SVG.js dependencies. Update copied
files together with their licenses.
