# Farid Mirzayev's website

A Pelican static website, built from Markdown and Jinja templates. The generated site is deployed to GitHub Pages.

## Local development

Requires Python 3.12 or newer.

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m pelican content -s pelicanconf.py -d
python -m http.server 8000 --directory output
```

Open `http://localhost:8000/`. Rebuild after changes, or add `-r` to the Pelican command for automatic regeneration in a separate terminal.

Pages live in `content/pages/`, articles in `content/posts/`, the Jinja theme in `theme/templates/`, and styles in `theme/static/`. Pelican uses the `Slug` metadata to determine page URLs. New articles need at least `Title`, `Date`, and `Slug` metadata.

For a production-equivalent build and checks:

```powershell
python -m pelican content -s publishconf.py -d --fatal errors
python -m unittest discover -s tests -v
```

## Publishing

The workflow builds pull requests without deploying. Pushes to `main` build and deploy via the GitHub Pages Actions artifact; no cross-repository deploy key is required.

**Before merging this migration**, in repository **Settings → Pages**, change **Build and deployment → Source** from “Deploy from a branch” to **GitHub Actions**. Confirm that GitHub Actions and the `github-pages` environment are available. Then merge the branch and check the “Build and deploy site” workflow and the live site. The previous generated files remain in the repository as a transition fallback, but are not the source for the new build.

The old workflow in `mirzayevio/blog` also publishes to this repository. Disable it or revoke its deploy key before making further changes there, so it cannot overwrite the new source or site. Verify the new deployment before retiring the old setup.

The current resume is carried over from the old site and may be outdated. Confirm employment, contact details, and public personal information before publishing an updated version. The supplied conference slides are not included; add them only when ready to publish.
