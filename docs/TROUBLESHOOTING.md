# Zoo Landers - Troubleshooting Guide

Common issues and solutions.

---

## CSS Not Applying

**Symptoms**: Site still has default theme, no blue/gold colors

**Solutions**:

1. **Verify CSS file was collected**
   ```bash
   docker exec allianceauth_gunicorn ls -lh /var/www/myauth/static/allianceauth/css/
   # Should show zoo-custom.css
   ```

2. **Re-collect static files**
   ```bash
   docker exec allianceauth_gunicorn python manage.py collectstatic --noinput --clear
   docker-compose restart nginx
   ```

3. **Check base-bs5.html includes CSS**
   ```bash
   cat /app/aa-docker/templates/allianceauth/base-bs5.html | grep zoo-custom
   # Should show the link tag
   ```

4. **Clear browser cache completely**
   - Press Ctrl+Shift+Delete
   - Select "All time"
   - Check "Cached images and files"
   - Clear

5. **Test in incognito mode**
   - Open new incognito/private window
   - Visit your site

6. **Check browser console for errors**
   - Press F12
   - Go to Console tab
   - Look for 404 errors on zoo-custom.css

---

## Logo/Icons Not Showing

**Symptoms**: Default Alliance Auth logo still appears

**Solutions**:

1. **Verify icons were collected**
   ```bash
   docker exec allianceauth_gunicorn ls -la /var/www/myauth/static/allianceauth/icons/
   # Should show 8 Zoo Landers icon files
   ```

2. **Check file sizes**
   ```bash
   docker exec allianceauth_gunicorn ls -lh /var/www/myauth/static/allianceauth/icons/allianceauth.png
   # Should be around 7-10KB (Zoo Landers logo)
   ```

3. **Force re-collect**
   ```bash
   docker exec allianceauth_gunicorn python manage.py collectstatic --noinput --clear
   docker-compose restart nginx
   ```

4. **Check browser cache**
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - Or clear browser cache completely

---

## Custom Sidebar Links Missing

**Symptoms**: No "ZOO LANDERS" section in sidebar

**Solutions**:

1. **Verify template was modified**
   ```bash
   cat /app/aa-docker/templates/allianceauth/side-menu.html | grep -A5 "ZOO LANDERS"
   # Should show your custom links
   ```

2. **Check file exists**
   ```bash
   ls -la /app/aa-docker/templates/allianceauth/side-menu.html
   ```

3. **Restart gunicorn**
   ```bash
   docker-compose restart allianceauth_gunicorn
   # Wait 30 seconds
   ```

4. **Hard refresh browser**
   - Ctrl+Shift+R or clear cache

---

## Hero Banner Missing/Broken

**Symptoms**: No welcome banner on dashboard, or error about staticfiles

**Solutions**:

1. **Check dashboard template exists**
   ```bash
   ls -la /app/aa-docker/templates/authentication/dashboard.html
   ```

2. **Verify image exists**
   ```bash
   docker exec allianceauth_gunicorn ls -la /var/www/myauth/static/zoo-custom/images/
   # Should show hero-banner.jpg
   ```

3. **Check for static file errors**
   - Look at browser console (F12 → Console)
   - If you see "Missing staticfiles manifest entry", the template is using `{% static %}` instead of direct path
   - Edit dashboard.html and use: `url('/static/zoo-custom/images/hero-banner.jpg')`

4. **Re-collect images**
   ```bash
   docker exec allianceauth_gunicorn python manage.py collectstatic --noinput --clear
   docker-compose restart allianceauth_gunicorn
   ```

---

## Login Page Not Customized

**Symptoms**: Default login page, no Zoo Landers branding

**Solutions**:

1. **Check login template exists**
   ```bash
   ls -la /app/aa-docker/templates/authentication/templates/public/login.html
   ```

2. **Check base template**
   ```bash
   ls -la /app/aa-docker/templates/authentication/templates/public/base.html
   ```

3. **Verify background image collected**
   ```bash
   docker exec allianceauth_gunicorn ls /var/www/myauth/static/zoo-custom/images/login-background.jpg
   ```

4. **Restart and clear cache**
   ```bash
   docker-compose restart allianceauth_gunicorn
   # Clear browser cache
   ```

---

## Site Name Not Updated

**Symptoms**: Still shows old site name

**Solutions**:

1. **Check .env file**
   ```bash
   grep AA_SITENAME /app/aa-docker/.env
   # Should show: AA_SITENAME=Zoo Landers
   ```

2. **Restart all services**
   ```bash
   docker-compose restart
   ```

3. **Clear browser cache**

---

## JavaScript Enhancements Not Working

**Symptoms**: No console messages, no animations

**Solutions**:

1. **Check browser console for errors**
   - Press F12 → Console
   - Look for JavaScript errors

2. **Verify JS file collected**
   ```bash
   docker exec allianceauth_gunicorn ls /var/www/myauth/static/zoo-custom/js/
   # Should show zoo-enhancements.js
   ```

3. **Check base-bs5.html includes script**
   ```bash
   cat /app/aa-docker/templates/allianceauth/base-bs5.html | grep zoo-enhancements
   ```

4. **Disable if causing issues**
   - Edit base-bs5.html
   - Comment out: `<!-- <script src="..." defer></script> -->`
   - Restart gunicorn

---

## Page Layout Broken

**Symptoms**: Content overlapping, weird spacing, broken design

**Solutions**:

1. **Check for template syntax errors**
   ```bash
   docker logs allianceauth_gunicorn --tail 50 | grep -i error
   ```

2. **Verify template matches original structure**
   - Re-extract the template from container
   - Compare with your customized version
   - Make sure you didn't break any `{% %}` tags

3. **Test with minimal changes**
   - Remove your customizations one by one
   - Find which change broke the layout

4. **Restore from Git**
   ```bash
   cd /app/aa-docker/
   git checkout templates/allianceauth/base-bs5.html
   docker-compose restart allianceauth_gunicorn
   ```

---

## Changes Not Appearing After Git Pull

**Symptoms**: Pulled updates but nothing changed

**Solutions**:

1. **Verify files updated**
   ```bash
   git log -1  # Check latest commit
   git status  # Check for uncommitted changes
   ```

2. **Run collectstatic**
   ```bash
   docker exec allianceauth_gunicorn python manage.py collectstatic --noinput
   ```

3. **Restart services**
   ```bash
   docker-compose restart
   ```

4. **Clear browser cache**
   - Incognito mode or hard refresh

---

## Duplicate Files Warning on collectstatic

**Symptoms**: Warnings about "another file with destination path"

**This is NORMAL and EXPECTED!**

The warnings mean your custom files are overriding the defaults, which is exactly what we want.

Your custom Zoo Landers icons are being used instead of default Alliance Auth icons.

**No action needed.**

---

## Performance Issues

**Symptoms**: Slow page loads

**Solutions**:

1. **Check image sizes**
   ```bash
   du -h /app/aa-docker/static/zoo-custom/images/
   # Hero banner should be < 500KB
   # Login background should be < 500KB
   ```

2. **Optimize images**
   - Use https://tinypng.com/
   - Or reduce quality:
   ```bash
   convert hero-banner.jpg -quality 80 hero-banner-optimized.jpg
   ```

3. **Check container resources**
   ```bash
   docker stats allianceauth_gunicorn
   # Look for high CPU/memory usage
   ```

4. **Check logs for errors**
   ```bash
   docker logs allianceauth_gunicorn --tail 100
   ```

---

## Alliance Auth Update Broke Customizations

**Symptoms**: Theme broken after updating Alliance Auth

**Solutions**:

1. **Re-extract templates**
   - Template structure may have changed
   - Follow DEPLOY.md Step 4 again
   - Re-apply your customizations

2. **Check Python version**
   - Path may have changed from `python3.11` to `python3.12`
   - Update extract commands accordingly

3. **Review Alliance Auth changelog**
   - Check for breaking changes
   - https://gitlab.com/allianceauth/allianceauth/-/releases

---

## Getting Help

### Check Logs

```bash
# Gunicorn logs
docker logs allianceauth_gunicorn --tail 100

# Nginx logs
docker logs aa-docker-nginx-1 --tail 50

# All services
docker-compose logs --tail 50
```

### Verify File Permissions

```bash
ls -la /app/aa-docker/static/
ls -la /app/aa-docker/templates/

# Should be owned by your user or uid 1000
```

### Test Components Individually

1. **Test CSS only**: Comment out JS in base-bs5.html
2. **Test without hero banner**: Comment out dashboard banner
3. **Test default theme**: Remove zoo-custom.css link

### Rollback

If all else fails:

```bash
cd /app/aa-docker/
git reset --hard HEAD~1
docker exec allianceauth_gunicorn python manage.py collectstatic --noinput --clear
docker-compose restart
```

---

## Still Stuck?

1. Check **Alliance Auth docs**: https://allianceauth.readthedocs.io/
2. Check **this repo issues**: https://github.com/guarzo/zoo-aa/issues
3. Review **deployment guide**: [DEPLOY.md](DEPLOY.md)
4. Check **customization guide**: [CUSTOMIZATION.md](CUSTOMIZATION.md)

---

**Most issues are solved by:**
1. Re-running `collectstatic`
2. Restarting services
3. Clearing browser cache

🔧 **Good luck!**
