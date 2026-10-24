# I Am Nirav Mehta — website

Static site (HTML/CSS/JS) built from the Figma design, plus one PHP file for the newsletter form.

```
index.html          page markup
assets/css/style.css
assets/js/main.js   nav, carousels, marquee, scroll reveal, newsletter submit
assets/img/         optimized WebP images exported from Figma
subscribe.php       newsletter handler (PHP mail())
.htaccess           gzip, caching, HTTPS redirect (commented out)
```

## Deploy to Hostinger
1. hPanel → Websites → your domain → File Manager → open `public_html`.
2. Upload everything in this repo (except `.git` and `README.md`) into `public_html`.
   Alternatively use hPanel → Advanced → Git to deploy from this repository.
3. In `subscribe.php`, set `$to` to the inbox that should receive signups.
4. After SSL is issued for the domain, uncomment the HTTPS block in `.htaccess`.

## Preview locally
Open `index.html` in a browser, or run `php -S localhost:8000` to test the form too.
