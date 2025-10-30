# Zoo Landers Alliance Auth

**Corporation**: Zoo Landers
**Tagline**: Center for Kids Who Can't Fly Good
**Status**: ✅ Deployed and Running

---

## Overview

This repository contains a complete custom theme for Alliance Auth featuring:

- 🎨 **Custom Blue/Gold Space Theme** - Unique branding throughout
- 🖼️ **Complete Icon Suite** - Favicons, logos, and app icons
- 🚀 **Hero Banner** - Dramatic welcome message on dashboard
- 🌐 **Custom Login Page** - Branded authentication experience
- ✨ **Interactive Enhancements** - Smooth animations and effects

![Zoo Landers Theme](docs/screenshot.png)

---

## Quick Deploy

```bash
# On your Alliance Auth server
cd /app/aa-docker/
git pull origin main
```

Then follow **[docs/DEPLOY.md](docs/DEPLOY.md)** for step-by-step instructions.

**Time**: 15-30 minutes

---

## Documentation

| File | Purpose |
|------|---------|
| **[DEPLOY.md](docs/DEPLOY.md)** | Deployment guide with tested commands |
| [CUSTOMIZATION.md](docs/CUSTOMIZATION.md) | How to customize colors, links, images |
| [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Common issues and solutions |

---

## Features

### Dashboard
- Custom hero banner with Zoo Landers branding
- Blue gradient navbar with gold accents
- Dark space-themed sidebar
- Responsive design for mobile

### Login Page
- Custom background image (Flyga theme)
- Zoo Landers logo and welcome message
- Branded login card with blue glow

### Branding
- Site name: "Zoo Landers"
- Complete favicon set for all platforms
- Custom scrollbars and UI elements

---

## File Structure

```
zoo-aa/
├── static/
│   ├── allianceauth/
│   │   ├── css/zoo-custom.css          # Theme styles (500+ lines)
│   │   └── icons/                      # All favicons and logos
│   └── zoo-custom/
│       ├── images/                     # Hero banner & login background
│       └── js/zoo-enhancements.js      # Interactive features
│
├── templates/
│   ├── allianceauth/                   # Base, sidebar, menus
│   └── authentication/                 # Login, dashboard
│
└── docs/                               # Documentation
```

---

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Zoo Blue | `#1e90ff` | Primary buttons, links, highlights |
| Zoo Navy | `#1a237e` | Sidebar, headers, dark accents |
| Zoo Gold | `#FFD700` | Hover states, icons, highlights |
| Space Dark | `#0a0a1a` | Backgrounds, footer |

---

## Maintenance

### After Alliance Auth Updates

```bash
cd /app/aa-docker/
git pull  # Get latest AA version
# Re-extract and modify templates (see DEPLOY.md step 2)
docker exec allianceauth_gunicorn python manage.py collectstatic --noinput
docker-compose restart
```

### Customizing

See **[docs/CUSTOMIZATION.md](docs/CUSTOMIZATION.md)** for:
- Changing colors
- Adding/removing sidebar links
- Updating images
- Modifying text

---

## Support

**Deployment issues?** Check [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
**Alliance Auth docs**: https://allianceauth.readthedocs.io/
**This repo**: https://github.com/guarzo/zoo-aa

---

## Credits

**Built with:**
- [Alliance Auth](https://gitlab.com/allianceauth/allianceauth)
- [Bootstrap 5](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/)

**Inspiration:**
- [Terra Nanotech Templates](https://github.com/terra-nanotech/tn-nt-auth-templates)
- [AA Theme Slate](https://github.com/ppfeufer/aa-theme-slate)

---

🦒 **Zoo Landers** 🦁
*Center for Kids Who Can't Fly Good*

**Version**: 1.0
**Last Updated**: 2025-10-30
