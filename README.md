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

GitHub Pages is configured to deploy the Pelican build through GitHub Actions. Generated output stays in the ignored `output/` directory locally; GitHub Actions uploads it as a Pages artifact. The repository contains Pelican source, not a checked-in copy of the generated site.

The legacy Hugo publisher in `mirzayevio/blog` has been disabled. Do not re-enable it; its deploy key must not be used to publish here.

The current resume is carried over from the old site and may be outdated. Confirm employment, contact details, and public personal information before publishing an updated version. The supplied conference slides are not included; add them only when ready to publish.
