# Assets Organization Guide

This folder contains all static assets for the La Soirée du Rire de Granby website, organized for better maintainability and performance.

## Folder Structure

```
public/assets/
├── images/
│   ├── logos/           # Company logos and branding images
│   │   └── cgb.jpg     # Main company logo
│   ├── heroes/          # Hero section images and banners
│   ├── events/          # Event photos and promotional images
│   ├── corporate/       # Corporate event and team building images
│   └── icons/           # Icons, favicons, and small graphics
│       └── favicon.ico  # Website favicon
├── styles/
│   ├── css/             # Compiled CSS files
│   │   ├── main.css     # Main stylesheet
│   │   └── tilted.css   # Tilted elements styles
│   └── scss/            # Source SCSS files (if using Sass)
└── fonts/               # Custom font files
```

## Image Guidelines

### Logos (`/images/logos/`)
- Company logos and branding materials
- High resolution versions for print/web
- Formats: JPG, PNG, SVG
- Recommended sizes: 1200x630px for social media, 300x300px for favicons

### Hero Images (`/images/heroes/`)
- Large banner images for hero sections
- High-quality, optimized for web
- Formats: JPG, WebP
- Recommended size: 1920x1080px or similar

### Event Images (`/images/events/`)
- Photos from past events
- Promotional event images
- Formats: JPG, PNG
- Optimize for web (compress but maintain quality)

### Corporate Images (`/images/corporate/`)
- Team building event photos
- Corporate presentation images
- Professional headshots
- Formats: JPG, PNG

### Icons (`/images/icons/`)
- Favicons, social media icons
- Small UI elements
- Formats: ICO, PNG, SVG
- Multiple sizes: 16x16, 32x32, 48x48, 64x64px

## CSS Organization

### Main Styles (`/styles/css/`)
- `main.css` - Primary stylesheet with all component styles
- `tilted.css` - Specific styles for tilted elements and animations

### SCSS Source Files (`/styles/scss/`)
- Source files if using Sass preprocessing
- Organized by components and features
- Compile to CSS files in `/css/` folder

## Font Files (`/fonts/`)
- Custom font files (if not using Google Fonts)
- Include all font weights and styles
- Formats: WOFF2, WOFF, TTF

## Best Practices

1. **File Naming**: Use descriptive, lowercase names with hyphens
   - `company-logo.jpg` instead of `logo1.jpg`
   - `hero-banner-2024.jpg` instead of `banner.jpg`

2. **Image Optimization**:
   - Compress images for web use
   - Use appropriate formats (WebP for photos, SVG for icons)
   - Provide multiple sizes for responsive design

3. **CSS Organization**:
   - Keep styles modular and organized
   - Use consistent naming conventions
   - Comment complex styles

4. **Version Control**:
   - Don't commit large binary files unnecessarily
   - Use `.gitignore` for temporary files
   - Consider using a CDN for large assets

## File References

When referencing assets in your code, use the following paths:

```html
<!-- Images -->
<img src="/assets/images/logos/cgb.jpg" alt="Logo">
<img src="/assets/images/heroes/hero-banner.jpg" alt="Hero">

<!-- CSS -->
<link rel="stylesheet" href="/assets/styles/css/main.css">

<!-- Favicon -->
<link rel="icon" href="/assets/images/icons/favicon.ico">
```

## Maintenance

- Regularly audit and remove unused assets
- Optimize images periodically
- Keep CSS files organized and commented
- Update this README when adding new asset categories
