# Zoo Landers Customization - Deployment Instructions

**Date**: 2025-10-30
**Status**: Ready for Deployment

---

## Overview

This guide walks you through deploying the Zoo Landers customizations to your Alliance Auth production environment. All customization files have been prepared and are ready to be deployed.

---

## Pre-Deployment Checklist

Before starting, ensure you have:

- [ ] SSH/terminal access to your deployment server
- [ ] Access to `/app/aa-docker/` directory (or your AA installation path)
- [ ] Docker and docker-compose installed and running
- [ ] Current backup of your Alliance Auth installation
- [ ] Current database backup

---

## Step 1: Backup Current Installation

Always backup before making changes!

```bash
# Navigate to your AA installation directory
cd /app/aa-docker/

# Stop services
docker-compose down

# Create backup
tar -czf ~/aa-backup-$(date +%Y%m%d-%H%M).tar.gz .

# Backup database
docker-compose up -d auth_mysql
docker exec auth_mysql mysqldump -u root -p${AA_DB_ROOT_PASSWORD} myauth > ~/aa-db-backup-$(date +%Y%m%d-%H%M).sql
docker-compose down

# Verify backups exist
ls -lh ~/aa-backup-* ~/aa-db-backup-*
```

---

## Step 2: Transfer Files to Server

From your local machine (where this repo is), transfer the customization files to your server:

```bash
# Option A: Using SCP
scp -r static/ user@your-server:/app/aa-docker/
scp -r templates/ user@your-server:/app/aa-docker/

# Option B: Using rsync (recommended - preserves permissions)
rsync -avz --progress static/ user@your-server:/app/aa-docker/static/
rsync -avz --progress templates/ user@your-server:/app/aa-docker/templates/

# Option C: If you're using Git for deployment
# On server:
cd /app/aa-docker/
git pull origin main  # or your branch name
```

---

## Step 3: Update .env File (Site Name)

On your deployment server:

```bash
cd /app/aa-docker/

# Edit .env file
nano .env  # or vim, vi, etc.
```

Find the line with `AA_SITENAME` and update it:

```bash
# Change from:
AA_SITENAME=Zoo-Auth

# To:
AA_SITENAME=Zoo Landers
```

Save and exit (Ctrl+X, then Y, then Enter in nano).

---

## Step 4: Extract and Customize Templates

Since templates can vary between Alliance Auth versions, you need to extract the base templates and add our customizations:

### 4a. Start services temporarily to extract templates

```bash
cd /app/aa-docker/
docker-compose up -d allianceauth_gunicorn
```

Wait a few seconds for the container to start, then:

### 4b. Extract base.html

```bash
# Extract the original template
docker exec allianceauth_gunicorn cat /usr/local/lib/python3.11/site-packages/allianceauth/templates/allianceauth/base.html > ./templates/allianceauth/base.html

# Now edit it to add our CSS
nano ./templates/allianceauth/base.html
```

Find the closing `</head>` tag and add BEFORE it:

```html
<!-- Zoo Landers Custom Styles -->
{% load static %}
<link rel="stylesheet" href="{% static 'allianceauth/css/zoo-custom.css' %}">
<script src="{% static 'zoo-custom/js/zoo-enhancements.js' %}" defer></script>
```

Save and exit.

**Alternative**: If you don't want to manually edit, you can use this sed command:

```bash
sed -i 's|</head>|    <!-- Zoo Landers Custom Styles -->\n    {% load static %}\n    <link rel="stylesheet" href="{% static '\''allianceauth/css/zoo-custom.css'\'' %}">\n    <script src="{% static '\''zoo-custom/js/zoo-enhancements.js'\'' %}" defer></script>\n</head>|' ./templates/allianceauth/base.html
```

### 4c. Extract and customize side-menu.html

```bash
# Extract the original
docker exec allianceauth_gunicorn cat /usr/local/lib/python3.11/site-packages/allianceauth/templates/allianceauth/side-menu.html > ./templates/allianceauth/side-menu.html

# Edit to add custom links
nano ./templates/allianceauth/side-menu.html
```

Add the content from `./templates/allianceauth/side-menu-additions.html` near the end of the menu (before any closing tags).

Or use this command to append at the end:

```bash
cat >> ./templates/allianceauth/side-menu.html << 'EOF'

<!-- Zoo Landers Custom Links Section -->
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

<li>
    <a href="https://evemaps.dotlan.net/" target="_blank">
        <i class="fas fa-map" style="color: #FFD700;"></i>
        <span>Dotlan Maps</span>
    </a>
</li>

<li>
    <a href="https://www.eveonline.com/" target="_blank">
        <i class="fas fa-rocket" style="color: #FFD700;"></i>
        <span>EVE Online</span>
    </a>
</li>
EOF
```

**Important**: Replace `YOUR_INVITE_CODE` and `YOUR_CORP_ID` with your actual Discord invite code and corporation ID!

### 4d. Extract and customize dashboard.html (Optional but Recommended)

```bash
# Extract the original
docker exec allianceauth_gunicorn cat /usr/local/lib/python3.11/site-packages/allianceauth/templates/allianceauth/dashboard.html > ./templates/allianceauth/dashboard.html

# Edit to add hero banner
nano ./templates/allianceauth/dashboard.html
```

Find `{% block content %}` and add immediately after it:

```html
{% load static %}

<!-- Zoo Landers Hero Banner -->
<div class="zoo-hero-banner" style="background-image: url('{% static "zoo-custom/images/hero-banner.jpg" %}');">
    <div class="zoo-hero-content">
        <h1>Welcome to Zoo Landers</h1>
        <p>Center for Kids Who Can't Fly Good</p>
    </div>
</div>
```

---

## Step 5: Verify Directory Structure

Your deployment should now have this structure:

```
/app/aa-docker/
├── static/
│   ├── allianceauth/
│   │   ├── css/
│   │   │   └── zoo-custom.css
│   │   └── icons/
│   │       ├── allianceauth.png
│   │       ├── favicon-16x16.png
│   │       ├── favicon-32x32.png
│   │       ├── favicon-96x96.png
│   │       ├── apple-touch-icon.png
│   │       ├── android-chrome-192x192.png
│   │       ├── android-chrome-512x512.png
│   │       └── mstile-150x150.png
│   └── zoo-custom/
│       ├── images/
│       │   ├── hero-banner.jpg
│       │   └── login-background.jpg
│       └── js/
│           └── zoo-enhancements.js
├── templates/
│   └── allianceauth/
│       ├── base.html
│       ├── side-menu.html
│       └── dashboard.html (optional)
├── docker-compose.yml
└── .env
```

Verify with:

```bash
cd /app/aa-docker/
tree -L 4 static/ templates/
# or
find static/ templates/ -type f | sort
```

---

## Step 6: Update docker-compose.yml

Ensure your `docker-compose.yml` has the static files volume mounted.

```bash
nano docker-compose.yml
```

In the `x-allianceauth-base` section, verify these volume mounts exist (around line 17):

```yaml
volumes:
  - ./conf/local.py:/home/allianceauth/myauth/myauth/settings/local.py
  - ./conf/celery.py:/home/allianceauth/myauth/myauth/celery.py
  - ./conf/urls.py:/home/allianceauth/myauth/myauth/urls.py
  - ./conf/memory_check.sh:/memory_check.sh
  - ./templates:/home/allianceauth/myauth/myauth/templates/
  - ./static:/home/allianceauth/myauth/myauth/static/      # <- ADD THIS LINE IF MISSING
  - static-volume:/var/www/myauth/static
```

If you added the line, save and exit.

---

## Step 7: Collect Static Files

Now collect all static files so they're served by nginx:

```bash
cd /app/aa-docker/

# If services are not running, start them
docker-compose up -d

# Wait for gunicorn to be ready (check logs)
docker logs allianceauth_gunicorn --tail 20

# Collect static files
docker exec allianceauth_gunicorn python manage.py collectstatic --noinput

# You should see output like:
# X static files copied to '/var/www/myauth/static'
```

---

## Step 8: Restart Services

Restart all Alliance Auth services to pick up the changes:

```bash
cd /app/aa-docker/

# Full restart (recommended)
docker-compose restart allianceauth_gunicorn allianceauth_worker allianceauth_beat nginx

# Or restart everything
docker-compose restart
```

Wait 30-60 seconds for services to fully restart.

---

## Step 9: Verify Deployment

### Check Container Status

```bash
docker-compose ps

# All services should show "Up" or "Up (healthy)"
```

### Check Logs for Errors

```bash
# Check gunicorn logs
docker logs allianceauth_gunicorn --tail 50

# Check nginx logs
docker logs aa-docker-nginx-1 --tail 50

# Look for any ERROR or WARNING messages
```

### Test in Browser

1. **Clear browser cache** (Ctrl+Shift+Delete or Cmd+Shift+Delete)
   - Select "Cached images and files"
   - Clear from "All time"

2. **Open your Alliance Auth URL** in an incognito/private window

3. **Verify the following**:
   - [ ] Browser tab shows "Zoo Landers" as the title
   - [ ] Favicon appears in browser tab (Zoo Landers badge)
   - [ ] Navbar has blue gradient background
   - [ ] Logo appears in navbar (top-left)
   - [ ] Sidebar has dark space theme
   - [ ] Custom "ZOO LANDERS" section appears in sidebar
   - [ ] Hero banner appears on dashboard (if you added it)
   - [ ] Colors match Zoo Landers theme (blue, gold, navy)
   - [ ] Mobile view works (test on phone or resize browser)

4. **Check browser console** (F12 → Console tab):
   - Should see: "🦒 Zoo Landers Auth 🦁"
   - Should see: "✓ Zoo Landers enhancements loaded"
   - No errors should appear

---

## Troubleshooting

### Issue: Logo/Icons Don't Appear

**Solution**:
```bash
# Check if files were collected
docker exec allianceauth_gunicorn ls -la /var/www/myauth/static/allianceauth/icons/

# If empty, run collectstatic again
docker exec allianceauth_gunicorn python manage.py collectstatic --noinput --clear

# Restart nginx
docker-compose restart nginx

# Clear browser cache completely
```

### Issue: CSS Not Applying

**Solution**:
```bash
# Check if CSS file was collected
docker exec allianceauth_gunicorn ls -la /var/www/myauth/static/allianceauth/css/

# Verify base.html includes the CSS
docker exec allianceauth_gunicorn cat /home/allianceauth/myauth/myauth/templates/allianceauth/base.html | grep zoo-custom

# Check browser Network tab (F12) to see if CSS file loads
# If it shows 404, re-run collectstatic
docker exec allianceauth_gunicorn python manage.py collectstatic --noinput

# Force browser to reload CSS: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
```

### Issue: Custom Links Don't Show in Sidebar

**Solution**:
```bash
# Verify side-menu.html exists and has custom content
docker exec allianceauth_gunicorn cat /home/allianceauth/myauth/myauth/templates/allianceauth/side-menu.html | grep "ZOO LANDERS"

# If nothing appears, the template wasn't properly created
# Restart from Step 4c

# Restart gunicorn to reload templates
docker-compose restart allianceauth_gunicorn

# Wait 30 seconds then refresh browser
```

### Issue: Hero Banner Image Doesn't Show

**Solution**:
```bash
# Check if image was collected
docker exec allianceauth_gunicorn ls -la /var/www/myauth/static/zoo-custom/images/

# If missing, run collectstatic
docker exec allianceauth_gunicorn python manage.py collectstatic --noinput

# Check browser Network tab (F12) for 404 errors on the image
# Verify the path in dashboard.html matches the actual file location
```

### Issue: Page Looks Broken/Unstyled

**Cause**: Might have broken the base.html template during editing

**Solution**:
```bash
# Check for Django template errors
docker exec allianceauth_gunicorn python manage.py check

# View error logs
docker logs allianceauth_gunicorn --tail 100 | grep -i error

# If needed, restore original base.html and try again
docker exec allianceauth_gunicorn cat /usr/local/lib/python3.11/site-packages/allianceauth/templates/allianceauth/base.html > ./templates/allianceauth/base.html
```

### Issue: JavaScript Enhancements Not Working

**Solution**:
```bash
# Check browser console (F12 → Console) for errors

# Verify JS file was collected
docker exec allianceauth_gunicorn ls -la /var/www/myauth/static/zoo-custom/js/

# Check if base.html includes the JS file
docker exec allianceauth_gunicorn cat /home/allianceauth/myauth/myauth/templates/allianceauth/base.html | grep zoo-enhancements

# The JS enhancements are optional - if they cause issues, you can comment out the script tag
```

---

## Rollback Procedure

If something goes wrong and you need to restore:

### Quick Rollback (Remove Customizations)

```bash
cd /app/aa-docker/

# Stop services
docker-compose down

# Remove custom files
rm -rf ./static/allianceauth/
rm -rf ./static/zoo-custom/
rm -rf ./templates/allianceauth/

# Restore original site name in .env
sed -i 's/AA_SITENAME=Zoo Landers/AA_SITENAME=Zoo-Auth/' .env

# Collect default static files
docker-compose up -d allianceauth_gunicorn
docker exec allianceauth_gunicorn python manage.py collectstatic --noinput --clear

# Restart all services
docker-compose restart
```

### Full Restore from Backup

```bash
cd /app/aa-docker/

# Stop all services
docker-compose down

# Restore from backup
cd /app/
rm -rf aa-docker/
tar -xzf ~/aa-backup-YYYYMMDD-HHMM.tar.gz

# Start services
cd aa-docker/
docker-compose up -d
```

---

## Performance Verification

After deployment, verify performance is acceptable:

### Check Page Load Time

```bash
# Test from server
curl -w "@-" -o /dev/null -s https://your-auth-url.com <<'EOF'
    time_namelookup:  %{time_namelookup}s\n
       time_connect:  %{time_connect}s\n
    time_appconnect:  %{time_appconnect}s\n
      time_redirect:  %{time_redirect}s\n
   time_starttransfer:  %{time_starttransfer}s\n
                     ----------\n
         time_total:  %{time_total}s\n
EOF
```

### Check Static File Sizes

```bash
# Check total static size
docker exec allianceauth_gunicorn du -sh /var/www/myauth/static/

# Check custom files specifically
docker exec allianceauth_gunicorn du -h /var/www/myauth/static/allianceauth/icons/
docker exec allianceauth_gunicorn du -h /var/www/myauth/static/zoo-custom/
```

### Monitor Container Resources

```bash
# Watch resource usage
docker stats --no-stream | grep allianceauth

# If resources are high, check logs for issues
docker logs allianceauth_gunicorn --tail 100
```

---

## Maintenance

### Updating Customizations

To update customizations in the future:

1. Make changes to files in your local repo
2. Test changes locally (if possible)
3. Transfer updated files to server (Step 2)
4. Run collectstatic (Step 7)
5. Restart services (Step 8)
6. Verify changes (Step 9)

### Alliance Auth Updates

When updating Alliance Auth itself:

1. **Before updating**: Backup your customizations
   ```bash
   tar -czf ~/zoo-customizations-$(date +%Y%m%d).tar.gz static/ templates/
   ```

2. **After updating**: Check if templates changed
   ```bash
   # Re-extract base templates and re-apply customizations
   # Follow Step 4 again
   ```

3. **Test thoroughly** after updating

---

## Customization Options

### Changing Links in Sidebar

Edit `./templates/allianceauth/side-menu.html` on the server:

```bash
nano /app/aa-docker/templates/allianceauth/side-menu.html
```

Add/remove/modify the `<li>` elements in the Zoo Landers section.

After saving:
```bash
docker-compose restart allianceauth_gunicorn
```

### Changing Colors

Edit `./static/allianceauth/css/zoo-custom.css`:

```bash
nano /app/aa-docker/static/allianceauth/css/zoo-custom.css
```

Modify the CSS custom properties at the top:
```css
:root {
  --zoo-blue: #1e90ff;      /* Change to your preferred blue */
  --zoo-gold: #FFD700;      /* Change to your preferred gold */
  /* etc. */
}
```

After saving:
```bash
docker exec allianceauth_gunicorn python manage.py collectstatic --noinput
docker-compose restart nginx
```

### Disabling JavaScript Enhancements

If the JavaScript causes any issues, edit `base.html` and remove or comment out:

```html
<!-- <script src="{% static 'zoo-custom/js/zoo-enhancements.js' %}" defer></script> -->
```

Then restart:
```bash
docker-compose restart allianceauth_gunicorn
```

---

## Support

### Checking Alliance Auth Version

```bash
docker exec allianceauth_gunicorn python manage.py --version
```

### Useful Commands Reference

```bash
# View all container logs
docker-compose logs -f

# Check specific service
docker-compose logs -f allianceauth_gunicorn

# Restart specific service
docker-compose restart allianceauth_gunicorn

# Check Django configuration
docker exec allianceauth_gunicorn python manage.py check --deploy

# Shell access to container
docker exec -it allianceauth_gunicorn bash

# Check static files location
docker exec allianceauth_gunicorn python manage.py findstatic allianceauth/icons/allianceauth.png

# Clear Django cache (if cache issues)
docker exec allianceauth_gunicorn python manage.py clear_cache
```

---

## Security Notes

1. **File Permissions**: Ensure files are owned by the correct user
   ```bash
   chown -R 1000:1000 /app/aa-docker/static/
   chown -R 1000:1000 /app/aa-docker/templates/
   ```

2. **HTTPS**: Ensure your site is served over HTTPS (should already be configured with nginx-proxy-manager)

3. **External Links**: Verify all external links in sidebar are trustworthy

4. **Updates**: Keep Alliance Auth and Docker images updated

---

## Success Criteria

Your deployment is successful when:

- ✅ Site loads without errors
- ✅ All images display correctly
- ✅ Colors match Zoo Landers brand
- ✅ Custom links work in sidebar
- ✅ Site is responsive on mobile
- ✅ No console errors in browser
- ✅ Performance is acceptable
- ✅ All existing functionality still works

---

## Next Steps After Deployment

1. **Test all functionality**: Login, character management, services, etc.
2. **Get feedback** from corp members
3. **Make adjustments** as needed
4. **Document any custom links** you added
5. **Set up monitoring** for errors (check logs regularly)
6. **Plan for updates** - schedule regular maintenance

---

**Deployment Prepared By**: Alliance Auth Customization Team
**Date**: 2025-10-30
**Version**: 1.0

For questions or issues, refer to:
- Alliance Auth Documentation: https://allianceauth.readthedocs.io/
- This repository: https://github.com/guarzo/zoo-aa
