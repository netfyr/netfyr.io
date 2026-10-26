# netfyr.io

Source for the [netfyr website](https://netfyr.io/).

The site is static HTML, CSS and JavaScript in `public/`.

Preview locally:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory public
```

Open `http://127.0.0.1:8000/`. There is no build step; the GitHub Pages workflow
publishes `public/` on pushes to `main`.

The homepage logo uses the original SVG paths inline and the design site's
flame animation on hover. Reduced motion keeps the original artwork (W7);
JavaScript or asset failures leave the static logo available.
`public/brand/` copies the canonical `netfyr-design/src/flame*.js` modules and
their local SVG.js dependencies unchanged. Keep those files together when
updating the effect; vendor licenses are included alongside them.
