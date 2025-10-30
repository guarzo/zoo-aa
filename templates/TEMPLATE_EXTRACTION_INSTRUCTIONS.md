# Template Extraction Instructions

Since we're not in the deployment environment, you'll need to extract the original templates from your deployed Alliance Auth container before customizing them.

## Step 1: Extract Base Template

Run this command on your deployment server:

```bash
docker exec allianceauth_gunicorn cat /usr/local/lib/python3.11/site-packages/allianceauth/templates/allianceauth/base.html > ./templates/allianceauth/base.html
```

Then add this line in the `<head>` section, just before `</head>`:

```html
<!-- Zoo Landers Custom Styles -->
<link rel="stylesheet" href="{% static 'allianceauth/css/zoo-custom.css' %}">
```

## Step 2: Extract Sidebar Menu Template

Run this command on your deployment server:

```bash
docker exec allianceauth_gunicorn cat /usr/local/lib/python3.11/site-packages/allianceauth/templates/allianceauth/side-menu.html > ./templates/allianceauth/side-menu.html
```

Then add the custom Zoo Landers section from `side-menu-additions.html` in this directory.

## Step 3: Extract Dashboard Template

Run this command on your deployment server:

```bash
docker exec allianceauth_gunicorn cat /usr/local/lib/python3.11/site-packages/allianceauth/templates/allianceauth/dashboard.html > ./templates/allianceauth/dashboard.html
```

Then add the hero banner from `dashboard-hero-banner.html` in this directory.

## Alternative: Use the provided stub templates

We've created stub templates in this directory that should work with most Alliance Auth installations. You can use them as-is or extract and merge with your actual templates for better compatibility.
