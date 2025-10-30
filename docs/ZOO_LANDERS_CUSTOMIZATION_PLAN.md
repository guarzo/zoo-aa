# Zoo Landers Alliance Auth Customization Plan

**Project**: Zoo Landers Corporation Auth Branding
**Date**: 2025-10-30
**Purpose**: Transform the Alliance Auth instance into a unique, branded experience matching Zoo Landers identity

---

## Executive Summary

This plan outlines a comprehensive customization strategy for the Zoo Landers Alliance Auth installation. The approach is divided into progressive phases, from simple branding changes to advanced UI customization, allowing for incremental implementation with immediate visual impact.

**Brand Identity Extracted from Assets:**
- **Corporation Name**: Zoo Landers
- **Tagline**: "Center for Kids Who Can't Fly Good"
- **Visual Theme**: Space exploration meets zoo animals (lunar lander with giraffe, lion, monkey mascots)
- **Alternative Branding**: "Flyga" (possible tagline or alternate name)

---

## Brand Asset Analysis

### Available Images

| Image | Dimensions | Best Use Case | Description |
|-------|-----------|---------------|-------------|
| `zoo.png` | ~2.8MB | Background/Hero | Clean lunar lander with animals on moon surface |
| `zoo2.png` | ~540KB | Logo/Header | "Flyga" text with animals, transparent background |
| `zoo3.png` | ~983KB | Banner/Hero | "ZOO LANDERS Flyga" with space background |
| `zoo4.png` | ~1.1MB | Splash Screen | "Flyga" with dramatic radial light effect |
| `zoo5.png` | ~1.8MB | Primary Logo | Official seal/badge with full corp name |

### Color Palette (Extracted from Images)

```css
/* Primary Colors */
--zoo-blue: #1e90ff;           /* Cyan-blue from text */
--zoo-navy: #1a237e;           /* Deep blue from badge */
--zoo-gold: #FFD700;           /* Yellow accents, giraffe */

/* Secondary Colors */
--zoo-brown-dark: #4a3728;     /* Lion mane */
--zoo-brown-light: #8b7355;    /* Monkey, neutral tones */
--zoo-white: #ffffff;          /* Clean backgrounds, text */

/* Background/Accent */
--zoo-space-dark: #0a0a1a;     /* Space background */
--zoo-purple-nebula: #4a1a6e;  /* Purple nebula tones */
--zoo-green-nebula: #2d5a3d;   /* Green nebula accents */

/* UI States */
--zoo-success: #4caf50;        /* Keep standard green */
--zoo-warning: #ff9800;        /* Keep standard orange */
--zoo-danger: #f44336;         /* Keep standard red */
--zoo-info: var(--zoo-blue);   /* Use brand blue */
```

### Recommended Image Processing

Before implementation, optimize images:

```bash
# Create optimized versions
mkdir -p ./static/allianceauth/icons/
mkdir -p ./static/zoo-custom/images/

# Logo for navbar (recommended: 200x50px)
convert images/zoo2.png -resize 200x50 ./static/allianceauth/icons/allianceauth.png

# Favicon set (multiple sizes required)
convert images/zoo5.png -resize 16x16 ./static/allianceauth/icons/favicon-16x16.png
convert images/zoo5.png -resize 32x32 ./static/allianceauth/icons/favicon-32x32.png
convert images/zoo5.png -resize 96x96 ./static/allianceauth/icons/favicon-96x96.png

# Mobile icons
convert images/zoo5.png -resize 180x180 ./static/allianceauth/icons/apple-touch-icon.png
convert images/zoo5.png -resize 192x192 ./static/allianceauth/icons/android-chrome-192x192.png
convert images/zoo5.png -resize 512x512 ./static/allianceauth/icons/android-chrome-512x512.png

# Microsoft tile
convert images/zoo5.png -resize 150x150 ./static/allianceauth/icons/mstile-150x150.png

# Hero/background images (web-optimized)
convert images/zoo3.png -quality 85 -resize 1920x ./static/zoo-custom/images/hero-banner.jpg
convert images/zoo4.png -quality 85 -resize 1920x ./static/zoo-custom/images/login-background.jpg
```

---

## Implementation Phases

### Phase 1: Basic Branding (30 minutes)

**Goal**: Update site name and favicon with minimal changes

**Steps:**

1. **Update Site Name**
   - File: `.env`
   - Change: `AA_SITENAME=Zoo Landers`
   - Restart: `docker-compose restart`

2. **Add Favicon (Minimal Approach)**
   ```bash
   # Create icon directory in templates (for quick override)
   mkdir -p ./templates/allianceauth/

   # Copy favicon to static directory
   mkdir -p ./static/allianceauth/icons/
   cp images/zoo5.png ./static/allianceauth/icons/favicon.png

   # Collect static files
   docker exec allianceauth_gunicorn python manage.py collectstatic --noinput

   # Restart nginx
   docker-compose restart nginx
   ```

**Testing**: Visit site, check browser tab for new name and icon

**Risk**: Low
**Reversibility**: High (easily undone)

---

### Phase 2: Logo and Icon Suite (1 hour)

**Goal**: Replace all logos and icons throughout the interface

**Prerequisites**: ImageMagick or similar for image resizing (or use pre-sized images)

**Steps:**

1. **Prepare Image Files** (see "Recommended Image Processing" above)

2. **Update docker-compose.yml** (if not already configured)
   ```yaml
   # Add after line 17 in allianceauth-base volumes:
   - ./static:/home/allianceauth/myauth/myauth/static/
   ```

3. **Directory Structure**
   ```bash
   ./static/
   ├── allianceauth/
   │   └── icons/
   │       ├── allianceauth.png          # Main logo (200x50px)
   │       ├── favicon-16x16.png
   │       ├── favicon-32x32.png
   │       ├── favicon-96x96.png
   │       ├── apple-touch-icon.png      # 180x180
   │       ├── android-chrome-192x192.png
   │       ├── android-chrome-512x512.png
   │       └── mstile-150x150.png        # 150x150
   └── zoo-custom/
       └── images/
           ├── hero-banner.jpg
           └── login-background.jpg
   ```

4. **Deploy Static Files**
   ```bash
   docker exec allianceauth_gunicorn python manage.py collectstatic --noinput
   docker-compose restart nginx
   ```

5. **Verify Changes**
   - Check navbar logo (top-left)
   - Check browser favicons
   - Check mobile bookmarks (test on phone if possible)

**Testing Checklist**:
- [ ] Desktop browser tab shows new favicon
- [ ] Navbar displays Zoo Landers logo
- [ ] Mobile home screen icon (if applicable)
- [ ] Logo scales properly on mobile

**Risk**: Low
**Reversibility**: High (remove static files and re-run collectstatic)

---

### Phase 3: Custom CSS Styling (2-3 hours)

**Goal**: Apply Zoo Landers color scheme throughout the interface

**Approach**: Create CSS overrides using the color palette

**Steps:**

1. **Create Custom CSS File**
   ```bash
   mkdir -p ./static/allianceauth/css/
   touch ./static/allianceauth/css/zoo-custom.css
   ```

2. **Base Stylesheet** (`./static/allianceauth/css/zoo-custom.css`)

   ```css
   /*
    * Zoo Landers Alliance Auth Custom Styles
    * Corporation: Zoo Landers
    * Theme: Space Exploration Zoo
    */

   /* ========================================
      CSS CUSTOM PROPERTIES (VARIABLES)
      ======================================== */

   :root {
     /* Brand Colors */
     --zoo-blue: #1e90ff;
     --zoo-navy: #1a237e;
     --zoo-gold: #FFD700;
     --zoo-brown-dark: #4a3728;
     --zoo-brown-light: #8b7355;
     --zoo-space-dark: #0a0a1a;
     --zoo-purple-nebula: #4a1a6e;
     --zoo-green-nebula: #2d5a3d;

     /* UI State Colors */
     --zoo-success: #4caf50;
     --zoo-warning: #ff9800;
     --zoo-danger: #f44336;
     --zoo-info: var(--zoo-blue);

     /* Neutrals */
     --zoo-white: #ffffff;
     --zoo-gray-light: #f5f5f5;
     --zoo-gray-medium: #cccccc;
     --zoo-gray-dark: #333333;
   }

   /* ========================================
      GLOBAL OVERRIDES
      ======================================== */

   body {
     background-color: var(--zoo-space-dark);
     font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
   }

   /* Main content wrapper */
   .wrapper {
     background-color: var(--zoo-gray-light);
   }

   /* ========================================
      NAVIGATION BAR
      ======================================== */

   .navbar,
   .navbar-default {
     background: linear-gradient(135deg, var(--zoo-navy) 0%, var(--zoo-blue) 100%) !important;
     border: none !important;
     box-shadow: 0 2px 8px rgba(0,0,0,0.3);
   }

   .navbar-brand {
     padding: 10px 15px !important;
   }

   .navbar-brand img {
     max-height: 40px;
     width: auto;
   }

   .navbar .navbar-nav > li > a,
   .navbar-default .navbar-nav > li > a {
     color: var(--zoo-white) !important;
     font-weight: 500;
     transition: all 0.3s ease;
   }

   .navbar .navbar-nav > li > a:hover,
   .navbar-default .navbar-nav > li > a:hover {
     color: var(--zoo-gold) !important;
     background-color: rgba(255, 255, 255, 0.1) !important;
   }

   .navbar .navbar-nav > .active > a,
   .navbar-default .navbar-nav > .active > a {
     background-color: rgba(255, 255, 255, 0.2) !important;
     color: var(--zoo-gold) !important;
   }

   /* ========================================
      SIDEBAR NAVIGATION
      ======================================== */

   .sidebar,
   .main-sidebar {
     background: linear-gradient(180deg, var(--zoo-navy) 0%, var(--zoo-space-dark) 100%) !important;
   }

   .sidebar-menu > li > a,
   .main-sidebar .sidebar-menu > li > a {
     color: var(--zoo-white) !important;
     border-left: 3px solid transparent;
     transition: all 0.3s ease;
   }

   .sidebar-menu > li > a:hover,
   .main-sidebar .sidebar-menu > li > a:hover {
     background-color: rgba(30, 144, 255, 0.2) !important;
     border-left-color: var(--zoo-gold);
     color: var(--zoo-gold) !important;
   }

   .sidebar-menu > li.active > a,
   .main-sidebar .sidebar-menu > li.active > a {
     background-color: rgba(30, 144, 255, 0.3) !important;
     border-left-color: var(--zoo-gold);
     color: var(--zoo-gold) !important;
   }

   /* Sidebar icons */
   .sidebar-menu > li > a > .fa,
   .sidebar-menu > li > a > .fas,
   .sidebar-menu > li > a > .fab {
     color: var(--zoo-gold);
   }

   /* ========================================
      BUTTONS
      ======================================== */

   .btn-primary {
     background: linear-gradient(135deg, var(--zoo-blue) 0%, var(--zoo-navy) 100%) !important;
     border-color: var(--zoo-blue) !important;
     color: var(--zoo-white) !important;
     transition: all 0.3s ease;
   }

   .btn-primary:hover,
   .btn-primary:focus {
     background: linear-gradient(135deg, var(--zoo-navy) 0%, var(--zoo-blue) 100%) !important;
     border-color: var(--zoo-navy) !important;
     transform: translateY(-2px);
     box-shadow: 0 4px 12px rgba(30, 144, 255, 0.4);
   }

   .btn-success {
     background-color: var(--zoo-success) !important;
     border-color: var(--zoo-success) !important;
   }

   .btn-warning {
     background-color: var(--zoo-warning) !important;
     border-color: var(--zoo-warning) !important;
   }

   .btn-danger {
     background-color: var(--zoo-danger) !important;
     border-color: var(--zoo-danger) !important;
   }

   /* ========================================
      PANELS & CARDS
      ======================================== */

   .panel-primary,
   .card-primary {
     border-color: var(--zoo-blue) !important;
   }

   .panel-primary > .panel-heading,
   .card-primary .card-header {
     background: linear-gradient(135deg, var(--zoo-blue) 0%, var(--zoo-navy) 100%) !important;
     border-color: var(--zoo-blue) !important;
     color: var(--zoo-white) !important;
   }

   .panel-heading {
     font-weight: 600;
   }

   /* ========================================
      TABLES
      ======================================== */

   .table > thead > tr > th {
     background-color: var(--zoo-navy) !important;
     color: var(--zoo-white) !important;
     border-bottom: 2px solid var(--zoo-gold);
   }

   .table-striped > tbody > tr:nth-of-type(odd) {
     background-color: rgba(30, 144, 255, 0.05);
   }

   .table-hover > tbody > tr:hover {
     background-color: rgba(30, 144, 255, 0.1) !important;
   }

   /* ========================================
      FORMS
      ======================================== */

   .form-control:focus {
     border-color: var(--zoo-blue) !important;
     box-shadow: 0 0 0 0.2rem rgba(30, 144, 255, 0.25) !important;
   }

   .input-group-addon {
     background-color: var(--zoo-navy) !important;
     color: var(--zoo-white) !important;
     border-color: var(--zoo-blue) !important;
   }

   /* ========================================
      ALERTS & NOTIFICATIONS
      ======================================== */

   .alert-info {
     background-color: rgba(30, 144, 255, 0.1) !important;
     border-color: var(--zoo-blue) !important;
     color: var(--zoo-navy) !important;
   }

   .alert-success {
     background-color: rgba(76, 175, 80, 0.1) !important;
     border-color: var(--zoo-success) !important;
   }

   /* ========================================
      LOGIN PAGE (if accessible)
      ======================================== */

   .login-page {
     background-image: url('/static/zoo-custom/images/login-background.jpg');
     background-size: cover;
     background-position: center;
     background-attachment: fixed;
   }

   .login-box,
   .login-card {
     background-color: rgba(255, 255, 255, 0.95);
     border-radius: 8px;
     box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
   }

   /* ========================================
      FOOTER
      ======================================== */

   .main-footer,
   footer {
     background: linear-gradient(135deg, var(--zoo-space-dark) 0%, var(--zoo-navy) 100%) !important;
     color: var(--zoo-white) !important;
   }

   .main-footer a,
   footer a {
     color: var(--zoo-gold) !important;
   }

   .main-footer a:hover,
   footer a:hover {
     color: var(--zoo-blue) !important;
   }

   /* ========================================
      BADGES & LABELS
      ======================================== */

   .badge-primary,
   .label-primary {
     background-color: var(--zoo-blue) !important;
   }

   .badge-success,
   .label-success {
     background-color: var(--zoo-success) !important;
   }

   /* ========================================
      CUSTOM ELEMENTS
      ======================================== */

   /* Add subtle space theme to content areas */
   .content-wrapper,
   .main-content {
     background: linear-gradient(180deg, var(--zoo-gray-light) 0%, var(--zoo-white) 100%);
   }

   /* Accent borders */
   .box,
   .card {
     border-top: 3px solid var(--zoo-blue);
   }

   /* Custom scrollbar (Webkit browsers) */
   ::-webkit-scrollbar {
     width: 12px;
   }

   ::-webkit-scrollbar-track {
     background: var(--zoo-space-dark);
   }

   ::-webkit-scrollbar-thumb {
     background: var(--zoo-blue);
     border-radius: 6px;
   }

   ::-webkit-scrollbar-thumb:hover {
     background: var(--zoo-gold);
   }

   /* ========================================
      RESPONSIVE ADJUSTMENTS
      ======================================== */

   @media (max-width: 768px) {
     .navbar-brand img {
       max-height: 30px;
     }

     .sidebar {
       font-size: 14px;
     }
   }

   /* ========================================
      PRINT STYLES
      ======================================== */

   @media print {
     .sidebar,
     .navbar {
       display: none !important;
     }
   }
   ```

3. **Include Custom CSS in Templates**

   Create template override to inject custom CSS:

   ```bash
   mkdir -p ./templates/allianceauth/
   ```

   Copy base template from container and modify:
   ```bash
   docker exec allianceauth_gunicorn cat /usr/local/lib/python3.11/site-packages/allianceauth/templates/allianceauth/base.html > ./templates/allianceauth/base.html
   ```

   Edit `./templates/allianceauth/base.html` and add before `</head>`:
   ```html
   <!-- Zoo Landers Custom Styles -->
   <link rel="stylesheet" href="{% static 'allianceauth/css/zoo-custom.css' %}">
   ```

4. **Deploy and Test**
   ```bash
   # Collect static files
   docker exec allianceauth_gunicorn python manage.py collectstatic --noinput

   # Restart services
   docker-compose restart allianceauth_gunicorn allianceauth_worker allianceauth_beat nginx
   ```

**Testing Checklist**:
- [ ] Navbar uses blue gradient background
- [ ] Sidebar has dark space theme
- [ ] Buttons use Zoo Landers colors
- [ ] Hover effects show gold accent
- [ ] Tables have styled headers
- [ ] Forms have blue focus states
- [ ] No broken layouts on mobile

**Risk**: Medium (CSS conflicts possible)
**Reversibility**: High (remove CSS file and template override)

---

### Phase 4: Template Customization (2-4 hours)

**Goal**: Customize page layouts, add custom elements, modify navigation

**Approach**: Override specific templates with customized versions

**Key Templates to Override:**

1. **Navigation & Layout**
   - `allianceauth/base.html` - Main layout template
   - `allianceauth/side-menu.html` - Sidebar navigation
   - `allianceauth/top-menu.html` - Top navigation bar

2. **Landing/Home**
   - `allianceauth/dashboard.html` - Dashboard layout

3. **Authentication**
   - `registration/login.html` - Login page

**Implementation Example: Custom Sidebar with Corp Links**

1. **Extract Original Template**
   ```bash
   mkdir -p ./templates/allianceauth/
   docker exec allianceauth_gunicorn cat /usr/local/lib/python3.11/site-packages/allianceauth/templates/allianceauth/side-menu.html > ./templates/allianceauth/side-menu.html
   ```

2. **Modify Template** (`./templates/allianceauth/side-menu.html`)

   Add custom section after existing menu items:
   ```html
   <!-- Zoo Landers Custom Links -->
   <li class="header" style="color: #FFD700; font-weight: bold;">ZOO LANDERS</li>

   <li>
       <a href="https://your-discord-invite-link" target="_blank">
           <i class="fab fa-discord" style="color: #FFD700;"></i>
           <span>Discord Server</span>
       </a>
   </li>

   <li>
       <a href="https://your-doctrine-page" target="_blank">
           <i class="fas fa-rocket" style="color: #FFD700;"></i>
           <span>Ship Doctrines</span>
       </a>
   </li>

   <li>
       <a href="https://your-wiki-or-guide" target="_blank">
           <i class="fas fa-book" style="color: #FFD700;"></i>
           <span>Corp Wiki</span>
       </a>
   </li>

   <li>
       <a href="https://zkillboard.com/corporation/YOUR_CORP_ID/" target="_blank">
           <i class="fas fa-crosshairs" style="color: #FFD700;"></i>
           <span>Killboard</span>
       </a>
   </li>
   ```

3. **Add Hero Banner to Dashboard**

   Extract dashboard template:
   ```bash
   docker exec allianceauth_gunicorn cat /usr/local/lib/python3.11/site-packages/allianceauth/templates/allianceauth/dashboard.html > ./templates/allianceauth/dashboard.html
   ```

   Add custom header section after `{% block content %}`:
   ```html
   <!-- Zoo Landers Hero Banner -->
   <div class="zoo-hero-banner" style="
       background-image: url('{% static "zoo-custom/images/hero-banner.jpg" %}');
       background-size: cover;
       background-position: center;
       height: 200px;
       border-radius: 8px;
       margin-bottom: 20px;
       display: flex;
       align-items: center;
       justify-content: center;
       box-shadow: 0 4px 12px rgba(0,0,0,0.3);
   ">
       <div style="
           background: rgba(10, 10, 26, 0.8);
           padding: 20px 40px;
           border-radius: 8px;
           text-align: center;
       ">
           <h1 style="color: #1e90ff; margin: 0; font-size: 2.5em; text-shadow: 2px 2px 4px #000;">
               Welcome to Zoo Landers
           </h1>
           <p style="color: #FFD700; margin: 10px 0 0 0; font-size: 1.2em;">
               Center for Kids Who Can't Fly Good
           </p>
       </div>
   </div>
   ```

4. **Deploy Templates**
   ```bash
   # Templates are auto-loaded from mounted volume
   # Just restart gunicorn workers
   docker-compose restart allianceauth_gunicorn allianceauth_worker allianceauth_beat
   ```

**Testing Checklist**:
- [ ] Custom sidebar links appear and work
- [ ] Hero banner displays on dashboard
- [ ] Images load correctly
- [ ] Links open in new tabs
- [ ] Mobile layout remains functional

**Risk**: Medium-High (template structure changes between versions)
**Reversibility**: High (delete template overrides)

---

### Phase 5: Advanced Customization (4-8 hours)

**Goal**: Deep customization including custom views, advanced theming, plugin integration

**Recommended Approaches:**

#### Option A: Custom Django App (Terra Nanotech Approach)

Create a standalone Django app for Zoo Landers theming (similar to `tn-nt-auth-templates`).

**Pros**:
- Packaged, maintainable solution
- Can be versioned and shared
- Clean separation of customizations
- Easier updates

**Cons**:
- Requires Python/Django knowledge
- More initial setup time
- Overkill for simple customizations

**Structure**:
```
zoo-landers-templates/
├── zoo_templates/
│   ├── __init__.py
│   ├── __version__.py
│   ├── static/
│   │   └── zoo_templates/
│   │       ├── css/
│   │       ├── js/
│   │       └── images/
│   └── templates/
│       └── allianceauth/
│           ├── base.html
│           ├── side-menu.html
│           └── dashboard.html
├── setup.py
└── README.md
```

**Implementation**:
1. Create Python package structure
2. Add to `conf/requirements.txt`
3. Install in container
4. Configure in `INSTALLED_APPS`

#### Option B: JavaScript Enhancements

Add dynamic elements via custom JavaScript:

**File**: `./static/zoo-custom/js/zoo-enhancements.js`

```javascript
/**
 * Zoo Landers Custom JavaScript Enhancements
 */

(function() {
    'use strict';

    // Add "Flyga" watermark to pages
    function addFlyga() {
        const flyga = document.createElement('div');
        flyga.className = 'zoo-flyga-watermark';
        flyga.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            opacity: 0.3;
            pointer-events: none;
            z-index: 9999;
            font-size: 48px;
            font-weight: bold;
            color: #1e90ff;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            font-family: 'Impact', sans-serif;
            transform: rotate(-15deg);
        `;
        flyga.textContent = 'Flyga';
        document.body.appendChild(flyga);
    }

    // Animate sidebar icons on hover
    function animateSidebarIcons() {
        const icons = document.querySelectorAll('.sidebar-menu .fa, .sidebar-menu .fas');
        icons.forEach(icon => {
            icon.style.transition = 'transform 0.3s ease';
            icon.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.3) rotate(5deg)';
            });
            icon.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }

    // Add particle effect to background (optional, performance-intensive)
    function addParticleBackground() {
        // Implementation would require particles.js or similar library
        console.log('Particle background would be initialized here');
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        addFlyga();
        animateSidebarIcons();
        // addParticleBackground(); // Uncomment if desired
    });

})();
```

Include in `base.html`:
```html
<script src="{% static 'zoo-custom/js/zoo-enhancements.js' %}"></script>
```

#### Option C: Custom Landing Page

Create custom view with Corp information:

**File**: `./conf/urls.py` (add custom route)
```python
from django.urls import path
from django.shortcuts import render

def zoo_welcome(request):
    context = {
        'corp_name': 'Zoo Landers',
        'tagline': 'Center for Kids Who Can\'t Fly Good',
        # Add more context data
    }
    return render(request, 'zoo-custom/welcome.html', context)

# Add to urlpatterns
urlpatterns = [
    path('welcome/', zoo_welcome, name='zoo-welcome'),
    # ... existing patterns
]
```

**Testing**: Access at `/welcome/` route

---

## Implementation Workflow

### Pre-Implementation Checklist

- [ ] Backup current Alliance Auth installation
  ```bash
  docker-compose down
  tar -czf aa-backup-$(date +%Y%m%d).tar.gz /app/aa-docker/
  ```
- [ ] Test database backup
  ```bash
  docker exec auth_mysql mysqldump -u root -p myauth > backup.sql
  ```
- [ ] Document current configuration
- [ ] Verify Docker volumes are properly mounted
- [ ] Ensure `collectstatic` command works

### Step-by-Step Implementation Order

1. **Day 1: Foundation** (Phase 1 + 2)
   - Update site name
   - Add logos and icons
   - Test and verify

2. **Day 2: Styling** (Phase 3)
   - Create custom CSS
   - Override base template
   - Apply color scheme
   - Test across pages

3. **Day 3: Templates** (Phase 4)
   - Customize sidebar
   - Add hero banner
   - Customize dashboard
   - Test navigation

4. **Day 4+: Advanced** (Phase 5, optional)
   - Choose advanced approach
   - Implement custom features
   - Performance testing

### Testing Strategy

**Browser Testing**:
- Chrome/Edge (primary)
- Firefox
- Safari (if applicable)
- Mobile browsers (iOS Safari, Chrome Mobile)

**Page Testing**:
- Dashboard/Home
- Character Management
- Corporation Management
- Services Pages (AFAT, Member Audit, etc.)
- Login/Logout flow

**Accessibility Testing**:
- Color contrast (WCAG AA minimum)
- Keyboard navigation
- Screen reader compatibility (basic)

---

## Maintenance and Updates

### After Alliance Auth Updates

1. **Check for conflicts**
   ```bash
   docker exec allianceauth_gunicorn python manage.py check
   ```

2. **Re-apply customizations if needed**
   - CSS rarely needs updates
   - Templates may need merging

3. **Test all custom features**

### Version Control

Recommended `.gitignore` additions:
```
# Keep custom assets
!./static/
!./templates/
!./images/

# Ignore generated files
./static-volume/
collectstatic/
```

### Documentation

Maintain `ZOO_LANDERS_CUSTOMIZATIONS.md` with:
- List of overridden templates
- Custom CSS locations
- Third-party dependencies
- Configuration changes
- Rollback procedures

---

## Rollback Procedures

### Quick Rollback

```bash
# Remove custom static files
rm -rf ./static/allianceauth/
rm -rf ./static/zoo-custom/

# Remove template overrides
rm -rf ./templates/allianceauth/

# Restore original settings
git checkout .env conf/local.py

# Re-collect default static
docker exec allianceauth_gunicorn python manage.py collectstatic --noinput --clear

# Restart services
docker-compose restart
```

### Restore from Backup

```bash
# Stop services
docker-compose down

# Restore from backup
tar -xzf aa-backup-YYYYMMDD.tar.gz -C /

# Restart
docker-compose up -d
```

---

## Performance Considerations

### Image Optimization

- Use WebP format for modern browsers (fallback to PNG/JPG)
- Compress images before uploading (aim for <200KB per image)
- Use CDN for static assets (optional, advanced)
- Enable browser caching in nginx config

### CSS Optimization

- Minify CSS for production
- Remove unused selectors
- Use CSS variables for consistency
- Avoid deep selector nesting

### Monitoring

```bash
# Check container resource usage
docker stats allianceauth_gunicorn

# Monitor logs for errors
docker logs allianceauth_gunicorn --tail 100 -f

# Check page load times
curl -w "@curl-format.txt" -o /dev/null -s https://your-auth-url.com
```

---

## Security Considerations

1. **Image Sources**: Only use images you own or have rights to use
2. **External Links**: Verify all external links are trustworthy
3. **JavaScript**: Audit any third-party JS libraries
4. **HTTPS**: Ensure all custom assets load over HTTPS
5. **Access Control**: Don't expose sensitive information in templates

---

## Reference Resources

### Official Documentation
- Alliance Auth Customization: https://allianceauth.readthedocs.io/en/latest/customizing/index.html
- Django Template Overriding: https://docs.djangoproject.com/en/stable/howto/overriding-templates/
- Bootstrap 5 Documentation: https://getbootstrap.com/docs/5.0/

### Example Implementations
- Terra Nanotech Templates: https://github.com/terra-nanotech/tn-nt-auth-templates
- AA Theme Slate: https://github.com/ppfeufer/aa-theme-slate

### Tools
- ImageMagick: https://imagemagick.org/
- CSS Minifier: https://cssminifier.com/
- Color Palette Generator: https://coolors.co/

---

## Support and Troubleshooting

### Common Issues

**Issue**: Logo doesn't appear in navbar
- **Solution**: Check file path, run collectstatic, verify permissions

**Issue**: CSS not applying
- **Solution**: Clear browser cache, check template includes CSS file, verify file loaded in browser devtools

**Issue**: Templates not overriding
- **Solution**: Verify exact path match, restart gunicorn, check TEMPLATES setting in local.py

**Issue**: Images broken after collectstatic
- **Solution**: Check STATIC_ROOT setting, verify nginx serves static files, check file permissions

### Debug Commands

```bash
# Check static files collected
docker exec allianceauth_gunicorn ls -la /var/www/myauth/static/allianceauth/

# Check template paths
docker exec allianceauth_gunicorn python manage.py findstatic allianceauth/base.html

# Validate templates
docker exec allianceauth_gunicorn python manage.py check --deploy

# View Django settings
docker exec allianceauth_gunicorn python manage.py diffsettings
```

---

## Next Steps

1. **Review this plan** with your team
2. **Schedule implementation** (recommended: 2-3 days, incremental)
3. **Prepare assets** (optimize images, gather links)
4. **Set up testing environment** (if available)
5. **Begin with Phase 1** (low-risk, immediate results)
6. **Iterate and refine** based on user feedback

---

## Appendix A: Quick Reference Commands

```bash
# ============================================
# ESSENTIAL COMMANDS
# ============================================

# Collect static files
docker exec allianceauth_gunicorn python manage.py collectstatic --noinput

# Restart all AA services
docker-compose restart allianceauth_gunicorn allianceauth_worker allianceauth_beat nginx

# Restart just web server
docker-compose restart nginx

# View container logs
docker logs allianceauth_gunicorn --tail 50 -f

# Access Django shell
docker exec -it allianceauth_gunicorn python manage.py shell

# Check for errors
docker exec allianceauth_gunicorn python manage.py check

# Clear cache (if cache issues)
docker exec allianceauth_gunicorn python manage.py clear_cache

# ============================================
# FILE OPERATIONS
# ============================================

# Copy file from container
docker cp allianceauth_gunicorn:/path/in/container ./local-path

# Copy file to container
docker cp ./local-file allianceauth_gunicorn:/path/in/container

# Extract template from container
docker exec allianceauth_gunicorn cat /usr/local/lib/python3.11/site-packages/allianceauth/templates/allianceauth/base.html > ./templates/allianceauth/base.html

# ============================================
# BACKUP & RESTORE
# ============================================

# Backup everything
docker-compose down
tar -czf aa-backup-$(date +%Y%m%d).tar.gz /app/aa-docker/

# Backup database only
docker exec auth_mysql mysqldump -u root -p${AA_DB_ROOT_PASSWORD} myauth > backup-$(date +%Y%m%d).sql

# Restore database
docker exec -i auth_mysql mysql -u root -p${AA_DB_ROOT_PASSWORD} myauth < backup.sql

# ============================================
# DEBUGGING
# ============================================

# Check static file location
docker exec allianceauth_gunicorn python manage.py findstatic allianceauth/icons/allianceauth.png

# List installed packages
docker exec allianceauth_gunicorn pip list

# Check Python path
docker exec allianceauth_gunicorn python -c "import sys; print('\n'.join(sys.path))"

# Verify template paths
docker exec allianceauth_gunicorn python manage.py shell -c "from django.conf import settings; print(settings.TEMPLATES)"
```

---

## Appendix B: Color Scheme Variations

### Option 1: Space Explorer (Current Plan)
- Primary: Blue (#1e90ff) + Navy (#1a237e)
- Accent: Gold (#FFD700)
- Background: Dark space theme

### Option 2: Zoo Bright
- Primary: Gold (#FFD700) + Brown (#4a3728)
- Accent: Blue (#1e90ff)
- Background: Light/white theme

### Option 3: Night Operations
- Primary: Deep purple (#4a1a6e) + Blue (#1e90ff)
- Accent: Gold (#FFD700)
- Background: Dark with nebula effects

To switch schemes, update CSS variables in `zoo-custom.css`.

---

## Appendix C: Pre-Optimized Image Dimensions

| Purpose | Filename | Dimensions | Format | Max Size |
|---------|----------|------------|--------|----------|
| Navbar Logo | `allianceauth.png` | 200x50 | PNG | 50KB |
| Favicon 16 | `favicon-16x16.png` | 16x16 | PNG | 5KB |
| Favicon 32 | `favicon-32x32.png` | 32x32 | PNG | 5KB |
| Favicon 96 | `favicon-96x96.png` | 96x96 | PNG | 10KB |
| Apple Touch | `apple-touch-icon.png` | 180x180 | PNG | 30KB |
| Android 192 | `android-chrome-192x192.png` | 192x192 | PNG | 40KB |
| Android 512 | `android-chrome-512x512.png` | 512x512 | PNG | 100KB |
| MS Tile | `mstile-150x150.png` | 150x150 | PNG | 30KB |
| Hero Banner | `hero-banner.jpg` | 1920x400 | JPG | 200KB |
| Login BG | `login-background.jpg` | 1920x1080 | JPG | 250KB |

---

**Document Version**: 1.0
**Last Updated**: 2025-10-30
**Author**: Alliance Auth Customization Team
**Status**: Ready for Implementation
