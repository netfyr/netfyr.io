# netfyr.io

Source for the [netfyr website](https://netfyr.io/).

The site is static HTML, CSS and JavaScript in `public/`.

Preview locally:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory public
```

Open `http://127.0.0.1:8000/`. There is no build step; the GitHub Pages workflow
publishes `public/` on pushes to `main`.

The homepage follows the system's light or dark appearance until someone
chooses a theme. The icon button remembers that choice across visits in `netfyr-theme`.
The palette comes from the design site; the control is copied unchanged from
`netfyr-design/web/src/theme.js` and `theme.css` into `public/ui/`. Keep those two
files together when updating it. The preference is applied before styles load;
without JavaScript, the page follows the system appearance and hides the control.

The homepage logo uses the original SVG paths inline so the wordmark follows
the theme, with the design site's flame animation on hover. Reduced motion keeps the original artwork (W7);
JavaScript or asset failures leave the static logo available.
`public/brand/` copies the canonical `netfyr-design/src/flame*.js` modules and
their local SVG.js dependencies unchanged. Keep those files together when
updating the effect; vendor licenses are included alongside them.
