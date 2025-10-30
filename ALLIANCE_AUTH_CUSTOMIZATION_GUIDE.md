# Alliance Auth Customization Guide

## Current Setup Analysis

**Environment:**
- Docker-based Alliance Auth installation (v4.11.0)
- Templates directory: `/app/aa-docker/templates` (mounted to container)
- Static files volume: `static-volume` mounted at `/var/www/myauth/static`
- Site name configured via `.env` file (`AA_SITENAME=Zoo-Auth`)
- Multiple plugins installed: corptools, memberaudit, wanderer, afat, aapayout, etc.

**Key Configuration Files:**
- `conf/local.py` - Main configuration (line 5: SITE_NAME)
- `docker-compose.yml` - Line 18: Templates mount, Line 19: Static files mount
- `.env` - Environment variables including AA_SITENAME

---

## 1. Change Site Branding/Name

Edit your `.env` file and update:
```bash
AA_SITENAME=Your Group Name Here
```

Then restart the containers:
```bash
docker-compose restart
```

---

## 2. Add Custom Images (Logo, Favicon, etc.)

### Directory Structure

Alliance Auth looks for images in these locations:
- `/allianceauth/icons/allianceauth.png` - Main logo (appears in navbar)
- `/allianceauth/icons/favicon-*.png` - Favicons (16x16, 32x32, 96x96)
- `/allianceauth/icons/apple-touch-icon.png` - Apple touch icon
- `/allianceauth/icons/android-chrome-*.png` - Android icons
- `/allianceauth/icons/mstile-150x150.png` - Microsoft tile

### Steps to Add Custom Images

1. **Create the directory structure on your host:**
   ```bash
   mkdir -p /app/aa-docker/static/allianceauth/icons
   ```

2. **Place your custom images** with these exact names:
   - `allianceauth.png` - Your logo (recommended: 200x50px or similar)
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `favicon-96x96.png`
   - `apple-touch-icon.png` (180x180px)
   - `android-chrome-192x192.png`
   - `android-chrome-512x512.png`

3. **Update docker-compose.yml** to mount the static directory.

   Add this line after line 18 in `docker-compose.yml`:
   ```yaml
   - ./static:/home/allianceauth/myauth/myauth/static/
   ```

4. **Run collectstatic** to copy files to the web server:
   ```bash
   docker exec allianceauth_gunicorn python manage.py collectstatic --noinput
   ```

5. **Restart nginx** to serve the new files:
   ```bash
   docker-compose restart nginx
   ```

---

## 3. Customize CSS Styling

### Create Custom CSS

1. **Create CSS directory:**
   ```bash
   mkdir -p /app/aa-docker/static/allianceauth/css/
   ```

2. **Create your custom CSS file:**
   ```bash
   touch /app/aa-docker/static/allianceauth/css/custom.css
   ```

3. **Add your custom styles** (example):
   ```css
   /* Custom color scheme */
   :root {
     --primary-color: #your-color;
     --secondary-color: #your-color;
   }

   /* Custom navbar styling */
   .navbar {
     background-color: #your-color !important;
   }

   /* Custom sidebar styling */
   .sidebar {
     background-color: #your-color !important;
   }
   ```

4. **Run collectstatic and restart:**
   ```bash
   docker exec allianceauth_gunicorn python manage.py collectstatic --noinput
   docker-compose restart nginx
   ```

---

## 4. Customize Templates (Sidebar, Header, etc.)

The templates directory is already mounted at `/app/aa-docker/templates/`.

### Override Sidebar Menu

1. **Create directory structure:**
   ```bash
   mkdir -p /app/aa-docker/templates/allianceauth
   ```

2. **Copy the original template from container:**
   ```bash
   docker exec allianceauth_gunicorn cat /usr/local/lib/python3.11/site-packages/allianceauth/templates/allianceauth/side-menu.html > /app/aa-docker/templates/allianceauth/side-menu.html
   ```

3. **Edit the template** to add custom links, modify menu structure, etc.

4. **Restart services:**
   ```bash
   docker-compose restart allianceauth_gunicorn allianceauth_worker allianceauth_beat
   ```

### Common Templates to Customize

- `allianceauth/side-menu.html` - Sidebar navigation
- `allianceauth/top-menu.html` - Top navigation bar
- `allianceauth/base.html` - Base template (use with caution)
- `allianceauth/icons.html` - Icon/favicon definitions

### Example: Adding External Links to Sidebar

Edit `/app/aa-docker/templates/allianceauth/side-menu.html` and add between existing menu items:

```html
<li>
    <a href="https://your-external-site.com" target="_blank">
        <i class="fas fa-external-link-alt"></i>
        <span>External Link</span>
    </a>
</li>
```

---

## 5. Available Theme Packages

Consider installing pre-built themes:

**TN-NT Auth Templates** (Updated Oct 2025)
- Provides Terra Nanotech theme
- Bootstrap 3 fallback for older apps
- Install: Add to `conf/requirements.txt`

**AA Theme Slate**
- Bootstrap Slate theme for Alliance Auth
- Available on GitHub: ppfeufer/aa-theme-slate

---

## 6. Configuration Settings in local.py

Key customization settings available in `conf/local.py`:

```python
# Site branding
SITE_NAME = os.environ.get("AA_SITENAME")

# Static files location
STATIC_ROOT = "/var/www/myauth/static/"

# Template directories (automatically includes ./templates/)
# Custom templates override defaults when paths match
```

---

## Important Notes

1. **File Paths Must Match Exactly**: To override a default file, your custom file must be at an identical path after `static/` or `templates/`

2. **Always Run collectstatic**: After changing static files, run:
   ```bash
   docker exec allianceauth_gunicorn python manage.py collectstatic --noinput
   ```

3. **Restart Services**: After template changes, restart:
   ```bash
   docker-compose restart allianceauth_gunicorn
   ```

4. **Backup First**: Before major customizations, backup your current setup:
   ```bash
   docker-compose down
   tar -czf aa-backup-$(date +%Y%m%d).tar.gz /app/aa-docker/
   ```

5. **Updates May Override**: Manual customizations may need updates after Alliance Auth upgrades

---

## Celery Task Status (Validated)

### Celery Health Check Results

✅ **All systems operational:**

- **Celery Beat Scheduler**: Running and sending scheduled tasks
  - Container: `allianceauth_worker_beat` (Up and healthy)
  - Scheduler: `allianceauth.crontab.schedulers.OffsetDatabaseScheduler`
  - 20 periodic tasks enabled and scheduled

- **Celery Workers**: 2 workers running with thread pool
  - `aa-docker-allianceauth_worker-1` (healthy)
  - `aa-docker-allianceauth_worker-2` (healthy)
  - Concurrency: 5 threads each
  - 100+ registered tasks

- **Redis Broker**: Connected and operational
  - Connection: `redis://redis:6379/0`
  - Health check: Passed

### Active Scheduled Tasks

Tasks confirmed running:
- `afat_update_esi_fatlinks` - Every 1 minute
- `fleetfinder_check_fleet_adverts` - Every 1 minute
- `memberaudit_run_regular_updates` - Every 15 minutes
- `Character Audit Rolling Update` - At :15 and :45 of each hour
- `Corporation Audit Update` - At :30 of each hour
- `discord.update_all_usernames` - Every 12 hours
- `standingssync.run_regular_sync` - Every 2 hours
- `standings_requests_standings_update` - Every 30 minutes
- And 12 more periodic tasks

### Configuration Note

**Warning in logs**: `STANDINGSSYNC_REPLACE_CONTACTS` setting is invalid.

To fix, edit `conf/local.py` line 141:
```python
# Change from:
STANDINGSSYNC_REPLACE_CONTACTS = "merge"

# To one of the valid options:
STANDINGSSYNC_REPLACE_CONTACTS = True   # Replace all contacts
# OR
STANDINGSSYNC_REPLACE_CONTACTS = False  # Don't replace contacts
```

---

## Quick Reference Commands

```bash
# View containers status
docker ps --filter "name=allianceauth"

# View beat scheduler logs
docker logs allianceauth_worker_beat --tail 50

# View worker logs
docker logs aa-docker-allianceauth_worker-1 --tail 50

# Check active Celery tasks
docker exec allianceauth_gunicorn celery -A myauth inspect active

# Check scheduled tasks
docker exec allianceauth_gunicorn celery -A myauth inspect scheduled

# Run collectstatic
docker exec allianceauth_gunicorn python manage.py collectstatic --noinput

# Restart all Alliance Auth services
docker-compose restart allianceauth_gunicorn allianceauth_worker allianceauth_beat nginx
```

---

## Official Documentation

- **Customization Guide**: https://allianceauth.readthedocs.io/en/latest/customizing/index.html
- **Template Framework**: https://allianceauth.readthedocs.io/en/latest/development/custom/framework/templates.html
- **Custom Themes**: https://allianceauth.readthedocs.io/en/v4.5.0/development/custom/custom-themes.html

---

*Generated on 2025-10-30 for Alliance Auth v4.11.0 Docker installation*
