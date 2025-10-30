# Zoo Landers - Deployment Guide

Quick deployment guide with tested commands.

---

## Prerequisites

- SSH access to your Alliance Auth server
- Alliance Auth running in Docker
- Git installed

---

## Step 1: Backup

```bash
cd /app/aa-docker/
docker-compose down
tar -czf ~/aa-backup-$(date +%Y%m%d).tar.gz .
docker-compose up -d
```

---

## Step 2: Pull Updates

```bash
cd /app/aa-docker/
git pull origin main
```

---

## Step 3: Update Site Name

```bash
nano .env
```

Change:
```bash
AA_SITENAME=Zoo Landers
```

Save and exit (Ctrl+X, Y, Enter).

---

## Step 4: Extract and Modify Templates

### 4a. Base Template (for CSS/JS)

```bash
# Extract base-bs5.html
docker exec allianceauth_gunicorn cat /usr/local/lib/python3.11/site-packages/allianceauth/templates/allianceauth/base-bs5.html > ./templates/allianceauth/base-bs5.html

# Edit to add CSS/JS before </head>
nano ./templates/allianceauth/base-bs5.html
```

Add **before `</head>`**:
```html
    <!-- Zoo Landers Custom Styles -->
    {% load static %}
    <link rel="stylesheet" href="{% static 'allianceauth/css/zoo-custom.css' %}">
    <script src="{% static 'zoo-custom/js/zoo-enhancements.js' %}" defer></script>
```

### 4b. Sidebar Menu

```bash
# Extract sidebar
docker exec allianceauth_gunicorn cat /usr/local/lib/python3.11/site-packages/allianceauth/templates/allianceauth/side-menu.html > ./templates/allianceauth/side-menu.html

# Add custom links at the end
cat >> ./templates/allianceauth/side-menu.html << 'EOF'

<!-- Zoo Landers Custom Links -->
<li class="header" style="color: #FFD700; font-weight: bold; background-color: rgba(30, 144, 255, 0.1);">
    ZOO LANDERS
</li>
<li>
    <a href="https://discord.gg/YOUR_INVITE_CODE" target="_blank">
        <i class="fab fa-discord" style="color: #FFD700;"></i>
        <span>Discord Server</span>
    </a>
</li>
<li>
    <a href="https://zkillboard.com/corporation/YOUR_CORP_ID/" target="_blank">
        <i class="fas fa-crosshairs" style="color: #FFD700;"></i>
        <span>Killboard</span>
    </a>
</li>
EOF
```

**Replace** `YOUR_INVITE_CODE` and `YOUR_CORP_ID` with your actual values!

### 4c. Dashboard (Hero Banner)

```bash
# Create directory
mkdir -p ./templates/authentication/

# Extract dashboard
docker exec allianceauth_gunicorn cat /usr/local/lib/python3.11/site-packages/allianceauth/authentication/templates/authentication/dashboard.html > ./templates/authentication/dashboard.html

# Edit to add hero banner
nano ./templates/authentication/dashboard.html
```

Add **after `{% block content %}`** and **before `<div class="row">`**:
```html
    <!-- Zoo Landers Hero Banner -->
    <div class="zoo-hero-banner" style="background-image: url('/static/zoo-custom/images/hero-banner.jpg');">
        <div class="zoo-hero-content">
            <h1>Welcome to Zoo Landers</h1>
            <p>Center for Kids Who Can't Fly Good</p>
        </div>
    </div>
```

---

## Step 5: Verify docker-compose.yml

Ensure this line exists in volumes (around line 17):

```yaml
- ./static:/home/allianceauth/myauth/myauth/static/
```

If missing, add it and restart.

---

## Step 6: Collect Static Files

```bash
docker exec allianceauth_gunicorn python manage.py collectstatic --noinput
```

You'll see warnings about duplicate icon files - **this is expected and correct**! Your custom icons override the defaults.

---

## Step 7: Restart Services

```bash
docker-compose restart allianceauth_gunicorn allianceauth_worker allianceauth_beat nginx
```

Wait 30 seconds for services to fully restart.

---

## Step 8: Test

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Open incognito window**
3. **Visit your Alliance Auth URL**

### Checklist

- [ ] Browser tab shows "Zoo Landers"
- [ ] Zoo Landers logo in navbar (top-left)
- [ ] Blue gradient navbar
- [ ] Dark space-themed sidebar
- [ ] Custom "ZOO LANDERS" links in sidebar
- [ ] Hero banner on dashboard
- [ ] Favicon shows Zoo Landers badge
- [ ] Login page has custom background and logo

### Browser Console

Press **F12** → **Console** tab. You should see:
- `🦒 Zoo Landers Auth 🦁`
- `✓ Zoo Landers enhancements loaded`

No errors should appear.

---

## Common Issues

### CSS Not Applying

```bash
# Re-collect static
docker exec allianceauth_gunicorn python manage.py collectstatic --noinput --clear
docker-compose restart nginx
# Clear browser cache completely
```

### Logo Not Showing

```bash
# Verify icons were collected
docker exec allianceauth_gunicorn ls /var/www/myauth/static/allianceauth/icons/
# Should show all 8 icon files
```

### Custom Links Missing

```bash
# Verify template was modified
cat templates/allianceauth/side-menu.html | grep "ZOO LANDERS"
# Restart gunicorn
docker-compose restart allianceauth_gunicorn
```

### Hero Banner Missing

```bash
# Verify images exist
docker exec allianceauth_gunicorn ls /var/www/myauth/static/zoo-custom/images/
# Should show hero-banner.jpg and login-background.jpg
```

For more help, see **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)**

---

## Rollback

```bash
cd /app/aa-docker/
git reset --hard HEAD~1
docker exec allianceauth_gunicorn python manage.py collectstatic --noinput
docker-compose restart
```

---

## Next Steps

- Customize sidebar links (see [CUSTOMIZATION.md](CUSTOMIZATION.md))
- Adjust colors if desired
- Add additional custom templates

---

**Estimated Time**: 15-30 minutes
**Difficulty**: Easy

🦒 **Welcome to Zoo Landers!** 🦁
