# Zoo Landers - Customization Guide

How to customize your Zoo Landers theme.

---

## Changing Colors

Edit `/app/aa-docker/static/allianceauth/css/zoo-custom.css`

Find the `:root` section at the top (around line 10):

```css
:root {
  /* Brand Colors */
  --zoo-blue: #1e90ff;           /* Change to your blue */
  --zoo-navy: #1a237e;           /* Change to your navy */
  --zoo-gold: #FFD700;           /* Change to your gold */
  --zoo-space-dark: #0a0a1a;     /* Change background */

  /* ... more colors ... */
}
```

**After changing**, run:
```bash
docker exec allianceauth_gunicorn python manage.py collectstatic --noinput
docker-compose restart nginx
```

Then **hard refresh** your browser (Ctrl+Shift+R).

---

## Adding/Removing Sidebar Links

Edit `/app/aa-docker/templates/allianceauth/side-menu.html`

Find the `<!-- Zoo Landers Custom Links -->` section at the bottom.

### Add a Link

```html
<li>
    <a href="https://your-link.com" target="_blank">
        <i class="fas fa-icon-name" style="color: #FFD700;"></i>
        <span>Link Text</span>
    </a>
</li>
```

**Icon names** from Font Awesome: https://fontawesome.com/icons

### Remove a Link

Just delete the `<li>...</li>` block.

**After changing**, restart:
```bash
docker-compose restart allianceauth_gunicorn
```

---

## Updating Images

### Replace Hero Banner

1. Create your new image (recommended: 1920x400px)
2. Save as `/app/aa-docker/static/zoo-custom/images/hero-banner.jpg`
3. Run:
```bash
docker exec allianceauth_gunicorn python manage.py collectstatic --noinput
```

### Replace Login Background

1. Create your new image (recommended: 1920x1080px)
2. Save as `/app/aa-docker/static/zoo-custom/images/login-background.jpg`
3. Run collectstatic (see above)

### Replace Logo/Favicon

1. Create your logo:
   - Navbar: 200x50px PNG
   - Favicon: 512x512px PNG (will be resized)

2. Use ImageMagick to create all sizes:
```bash
cd /app/aa-docker/static/allianceauth/icons/

# Navbar logo
convert your-logo.png -resize 200x50 -background none -gravity center -extent 200x50 allianceauth.png

# Favicons
convert your-logo.png -resize 16x16 favicon-16x16.png
convert your-logo.png -resize 32x32 favicon-32x32.png
convert your-logo.png -resize 96x96 favicon-96x96.png
convert your-logo.png -resize 180x180 apple-touch-icon.png
convert your-logo.png -resize 192x192 android-chrome-192x192.png
convert your-logo.png -resize 512x512 android-chrome-512x512.png
convert your-logo.png -resize 150x150 mstile-150x150.png
```

3. Run collectstatic and restart:
```bash
docker exec allianceauth_gunicorn python manage.py collectstatic --noinput
docker-compose restart nginx
```

---

## Changing Text

### Site Name

Edit `/app/aa-docker/.env`:
```bash
AA_SITENAME=Your New Name
```

Restart:
```bash
docker-compose restart
```

### Hero Banner Text

Edit `/app/aa-docker/templates/authentication/dashboard.html`

Find:
```html
<h1>Welcome to Zoo Landers</h1>
<p>Center for Kids Who Can't Fly Good</p>
```

Change to your text, then:
```bash
docker-compose restart allianceauth_gunicorn
```

### Login Page Text

Edit `/app/aa-docker/templates/authentication/templates/public/login.html`

Find the welcome text section and modify.

---

## Adjusting Hero Banner Height

Edit `/app/aa-docker/static/allianceauth/css/zoo-custom.css`

Find `.zoo-hero-banner` (around line 531):

```css
.zoo-hero-banner {
  height: 300px;  /* Change this value */
  /* ... */
}
```

**Recommended sizes:**
- Small: 200px
- Medium: 300px (current)
- Large: 400px

Don't forget collectstatic after changing!

---

## Disabling Features

### Disable JavaScript Enhancements

Edit `/app/aa-docker/templates/allianceauth/base-bs5.html`

Comment out the script line:
```html
<!-- <script src="{% static 'zoo-custom/js/zoo-enhancements.js' %}" defer></script> -->
```

### Disable Hero Banner

Edit `/app/aa-docker/templates/authentication/dashboard.html`

Remove or comment out the entire hero banner div:
```html
<!--
<div class="zoo-hero-banner" ...>
  ...
</div>
-->
```

---

## Adding Custom CSS

At the bottom of `/app/aa-docker/static/allianceauth/css/zoo-custom.css`, add:

```css
/* My Custom Styles */
.my-custom-class {
  /* Your styles here */
}
```

---

## Reverting to Default Theme

```bash
cd /app/aa-docker/

# Remove customizations
rm -rf static/allianceauth/css/zoo-custom.css
rm -rf static/allianceauth/icons/*
rm -rf static/zoo-custom/
rm -rf templates/allianceauth/*
rm -rf templates/authentication/*

# Restore defaults
docker exec allianceauth_gunicorn python manage.py collectstatic --noinput --clear
docker-compose restart
```

---

## Tips

### Preview Changes Locally

Use browser dev tools (F12) to test CSS changes before editing files:
1. Open dev tools
2. Go to "Elements" tab
3. Edit styles in the right panel
4. Copy working changes to your CSS file

### Keep Backups

Before major changes:
```bash
cp /app/aa-docker/static/allianceauth/css/zoo-custom.css zoo-custom.css.backup
```

### Version Control

Commit changes to Git:
```bash
cd /app/aa-docker/
git add static/ templates/
git commit -m "Customized colors and links"
git push
```

---

## Resources

- **Font Awesome Icons**: https://fontawesome.com/icons
- **Color Picker**: https://htmlcolorcodes.com/
- **Image Optimization**: https://tinypng.com/
- **CSS Reference**: https://developer.mozilla.org/en-US/docs/Web/CSS

---

🎨 **Happy Customizing!**
