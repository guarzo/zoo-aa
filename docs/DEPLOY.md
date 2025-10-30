# Zoo Landers Customization - Deployment Guide

**Quick deployment via Git** ⚡

---

## Pre-Deployment

```bash
# 1. Backup (just in case)
cd /app/aa-docker/
docker-compose down
tar -czf ~/aa-backup-$(date +%Y%m%d).tar.gz .
docker-compose up -d

# 2. Update from Git
git pull origin main  # or your branch name
```

---

## Deployment Steps

### 1. Update Site Name

```bash
# Edit .env
nano .env

# Change to:
AA_SITENAME=Zoo Landers

# Save and exit
```

### 2. Extract and Modify Templates

```bash
# Start services if not running
docker-compose up -d allianceauth_gunicorn

# Extract base.html and add CSS/JS includes
docker exec allianceauth_gunicorn cat /usr/local/lib/python3.11/site-packages/allianceauth/templates/allianceauth/base.html > ./templates/allianceauth/base.html

# Add CSS/JS before </head> tag
sed -i 's|</head>|    <!-- Zoo Landers Custom Styles -->\n    {% load static %}\n    <link rel="stylesheet" href="{% static '\''allianceauth/css/zoo-custom.css'\'' %}">\n    <script src="{% static '\''zoo-custom/js/zoo-enhancements.js'\'' %}" defer></script>\n</head>|' ./templates/allianceauth/base.html

# Extract side-menu.html
docker exec allianceauth_gunicorn cat /usr/local/lib/python3.11/site-packages/allianceauth/templates/allianceauth/side-menu.html > ./templates/allianceauth/side-menu.html

# Add custom sidebar section (replace YOUR_INVITE_CODE and YOUR_CORP_ID first!)
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

# Extract dashboard.html (for hero banner)
# Note: The dashboard is in the authentication app, not allianceauth
mkdir -p ./templates/authentication/
docker exec allianceauth_gunicorn cat /usr/local/lib/python3.11/site-packages/allianceauth/authentication/templates/authentication/dashboard.html > ./templates/authentication/dashboard.html

# Edit dashboard.html to add hero banner
# Add this after {% block content %} and before <div class="row">:
nano ./templates/authentication/dashboard.html
```

**Add this to dashboard.html after `{% block content %}`:**

```html
    <!-- Zoo Landers Hero Banner -->
    <div class="zoo-hero-banner" style="background-image: url('/static/zoo-custom/images/hero-banner.jpg');">
        <div class="zoo-hero-content">
            <h1>Welcome to Zoo Landers</h1>
            <p>Center for Kids Who Can't Fly Good</p>
        </div>
    </div>
```

### 3. Verify docker-compose.yml

Make sure this line exists in the volumes section (around line 17):

```yaml
- ./static:/home/allianceauth/myauth/myauth/static/
```

If not, add it and restart.

### 4. Collect Static Files

```bash
docker exec allianceauth_gunicorn python manage.py collectstatic --noinput
```

### 5. Restart Services

```bash
docker-compose restart allianceauth_gunicorn allianceauth_worker allianceauth_beat nginx
```

Wait 30 seconds for services to fully restart.

---

## Testing

1. Clear browser cache (Ctrl+Shift+Delete)
2. Open your Alliance Auth site in incognito mode
3. Verify:
   - [ ] Zoo Landers logo in navbar
   - [ ] Blue gradient navbar
   - [ ] Dark space sidebar
   - [ ] Custom links in sidebar
   - [ ] Favicon in browser tab
   - [ ] Hero banner on dashboard

---

## Troubleshooting

**CSS not applying?**
```bash
docker exec allianceauth_gunicorn python manage.py collectstatic --noinput
docker-compose restart nginx
# Clear browser cache
```

**Logo not showing?**
```bash
# Check if collected
docker exec allianceauth_gunicorn ls /var/www/myauth/static/allianceauth/icons/
# If empty, run collectstatic again
```

**Custom links not showing?**
```bash
# Verify template has your changes
cat templates/allianceauth/side-menu.html | grep "ZOO LANDERS"
# Restart gunicorn
docker-compose restart allianceauth_gunicorn
```

**Hero banner not showing or error?**
```bash
# Verify images were collected
docker exec allianceauth_gunicorn ls /var/www/myauth/static/zoo-custom/images/
# Make sure you're using direct path: url('/static/zoo-custom/images/hero-banner.jpg')
# NOT: url('{% static "..." %}')
```

---

## Rollback

```bash
git reset --hard HEAD~1  # Undo last commit
docker exec allianceauth_gunicorn python manage.py collectstatic --noinput
docker-compose restart
```

---

## Quick Reference

```bash
# Update from Git
git pull

# Collect static files
docker exec allianceauth_gunicorn python manage.py collectstatic --noinput

# Restart services
docker-compose restart

# Check logs
docker logs allianceauth_gunicorn --tail 50
```

---

**Estimated Time**: 15-30 minutes

For detailed troubleshooting, see `DEPLOYMENT_INSTRUCTIONS.md`
