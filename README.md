# Is It Hot Right Now? website

The IIHRN website is built with [Quarto](https://quarto.org).

To render the website to `/_site`, run:

```bash
quarto run populate-places.ts && quarto render
```

The site is currently deployed on Netlify using GitHub Actions whenever someone pushes to the `main` branch (see [`publish.yml`](.github/workflows/publish.yml)).
