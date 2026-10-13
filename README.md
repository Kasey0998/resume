# Krishna Sharma - Cloud & DevOps Portfolio

Static portfolio built with HTML, CSS and vanilla JavaScript. No build step or framework is required.

Live site: https://kasey0998.github.io/resume/

## Preview locally

Open `index.html` in a browser, or run a local server from this folder:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Visit `http://127.0.0.1:4173`.

## Content

- Six core skill groups prioritise professional AWS, Linux, Terraform, Jenkins, Docker, monitoring and networking experience.
- The expandable skills panel distinguishes supporting operational skills, application project experience and foundational knowledge.
- Experience covers AGAMI-TECH, REDDUSTTEK and TECHNOKRAFT, with supplied employment dates.
- Five project highlights describe AWS infrastructure, FreeSWITCH containerisation, Jenkins delivery, Linux maintenance and GomataVision CRM.
- LinkedIn uses the supplied `https://www.linkedin.com/in/krishna-sharma98` profile. Email and telephone links are available in Contact.
- The Download CV button serves `assets/documents/Krishna_Sharma_CV.pdf` from the website's own files.

Keep both the portfolio and CV in sync when employment or credentials change. Describe certification as earned in November 2022 unless renewal is confirmed. Add public project source links when repositories are available.

## Assets

The current stylised portrait is `assets/images/profile-placeholder-generated.jpg`. To use a different portrait, replace this image or update the image references in both `index.html` and `css/style.css`.

## Responsive and accessible behaviour

- Responsive navigation, grids, cards and headings support narrow phones, tablets and desktop screens.
- Mobile navigation supports Escape and keyboard focus; closed links are removed from keyboard navigation.
- Core content and navigation remain usable without JavaScript or browser storage.
- Reduced-motion preferences disable animated effects.

## CV updates

The PDF can be rebuilt from `scripts/generate_cv.py` with Python and ReportLab installed:

```sh
python3 scripts/generate_cv.py
```

Review the generated PDF after changing the content. Keep the public website and CV aligned.

## Deploy

For GitHub Pages, publish this folder's contents at the root of the `Kasey0998/resume` repository on `main`. Include `assets`, `css`, `js` and `.nojekyll`. No build command is needed. The CV travels with the site and is served at `/resume/assets/documents/Krishna_Sharma_CV.pdf`.

If the hosting domain changes, update the canonical URL, `og:url` and the absolute `og:image` URL in `index.html`.
