# Raghav Gurung — Resume / Profile Site

Single-page resume and profile for **raghavgurung.com**. Built with static HTML, CSS, and JavaScript. Hosted on GitHub Pages.

## What’s included

- **index.html** — One-page layout: Hero, About, Experience, Education, Certifications, Skills, Contact
- **styles.css** — Responsive layout, dark theme, DM Sans + Instrument Serif
- **script.js** — Sticky nav, smooth scroll, “Download resume” → PDF generated from page content (html2pdf.js)
- **assets/profile.png** — Profile photo for the hero section

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
# Python 3
python3 -m http.server 8000

# Node (npx)
npx serve .
```

Then visit `http://localhost:8000`.

## Deploy to GitHub Pages

### 1. Create a repository

- On GitHub: **New repository**
- Name: `raghavgurung.github.io` (for a user/org site at `https://raghavgurung.github.io`)  
  **or** any other name (e.g. `resume`) if you prefer a project site like `https://raghavgurung.github.io/resume`.

### 2. Push this folder

From your project directory:

```bash
git init
git add .
git commit -m "Initial commit: resume site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and repo name.

### 3. Turn on GitHub Pages

- Repo → **Settings** → **Pages**
- **Source:** Deploy from a branch
- **Branch:** `main` (or `master`)
- **Folder:** `/ (root)` if your `index.html` is at the repo root
- Click **Save**

The site will be at:

- `https://raghavgurung.github.io` if the repo is `raghavgurung.github.io`
- `https://raghavgurung.github.io/resume` if the repo is e.g. `resume`

## Custom domain (raghavgurung.com)

### 1. Set the custom domain in GitHub

- Same repo → **Settings** → **Pages**
- Under **Custom domain**, enter: `raghavgurung.com`
- Save. If GitHub offers **Enforce HTTPS**, enable it after DNS is set.

### 2. Configure DNS at your registrar

Where you bought **raghavgurung.com**, add:

**Option A — A records (apex domain)**  
Add 4 A records for `raghavgurung.com`:

| Type | Name/Host | Value        |
|------|-----------|--------------|
| A    | `@`       | 185.199.108.153 |
| A    | `@`       | 185.199.109.153 |
| A    | `@`       | 185.199.110.153 |
| A    | `@`       | 185.199.111.153 |

**Option B — CNAME (www only)**  
If you use `www.raghavgurung.com`:

| Type  | Name/Host | Value                    |
|-------|------------|--------------------------|
| CNAME | `www`      | `raghavgurung.github.io` |

To use **both** apex and www: set the custom domain in GitHub to `raghavgurung.com`, add the A records above, and add a CNAME for `www` to `raghavgurung.github.io`. GitHub will redirect www to the apex if configured.

### 3. Wait and enable HTTPS

DNS can take up to 48 hours. When the domain shows as verified in **Pages**, enable **Enforce HTTPS**.

## “Download resume” button

The button uses [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) (loaded from a CDN in `index.html`). Clicking it generates a PDF from the main content section (About through Contact) and downloads it as `Raghav_Gurung_Resume.pdf`. No separate PDF file is stored in the repo.
