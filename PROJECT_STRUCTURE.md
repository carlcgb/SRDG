# La Soirée du Rire de Granby - Project Structure

## 📁 Clean Project Organization

```
SRDG/
├── 📁 docs/                          # Documentation
│   ├── FULL_SETUP_GUIDE.md
│   ├── MCP_CURSOR_SETUP.md           # MCP server on Cloudflare Workers + Cursor
│   ├── INTERNAL_LINKS_OPTIMIZATION.md
│   ├── SEO_OPTIMIZATION_COMPLETE.md
│   └── SEO_OPTIMIZATION_REPORT.md
├── 📁 public/                        # Public assets (served directly)
│   ├── 📁 assets/                    # Organized static assets
│   │   ├── 📁 images/
│   │   │   ├── 📁 logos/            # Company logos
│   │   │   │   └── cgb.jpg
│   │   │   ├── 📁 icons/            # Icons and favicons
│   │   │   │   └── favicon.ico
│   │   │   ├── 📁 heroes/           # Hero section images
│   │   │   ├── 📁 events/           # Event photos
│   │   │   └── 📁 corporate/        # Corporate images
│   │   ├── 📁 styles/
│   │   │   ├── 📁 css/              # Compiled CSS
│   │   │   │   ├── main.css
│   │   │   │   └── tilted.css
│   │   │   └── 📁 scss/             # Source SCSS files
│   │   ├── 📁 fonts/                # Custom fonts
│   │   └── README.md                # Asset organization guide
│   ├── index.html                   # Main HTML file
│   ├── manifest.json
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── _redirects
│   └── sw.js                        # Service worker
├── 📁 src/                          # Source code
│   ├── 📁 components/               # React components
│   │   ├── Contact.js
│   │   ├── CorporateSection.js
│   │   ├── Events.js
│   │   ├── Footer.js
│   │   ├── Hero.js
│   │   ├── JokeModal.js
│   │   ├── JokeSection.js
│   │   ├── Navigation.js
│   │   ├── Platforms.js
│   │   └── StructuredData.js
│   ├── 📁 hooks/                    # Custom React hooks
│   │   ├── useButtonAnimations.js
│   │   ├── useCorporateScroll.js
│   │   ├── useEventCards.js
│   │   ├── useJokeModal.js
│   │   ├── useMascotTilt.js
│   │   ├── useParallax.js
│   │   └── useScrollEffects.js
│   ├── 📁 services/                 # External services
│   │   ├── emailService.js
│   │   └── googleSheetsService.js
│   ├── App.js                       # Main App component
│   └── index.js                     # Entry point
├── 📁 scripts/                      # Google Apps Script files
│   ├── google-apps-script-clean.js
│   ├── google-apps-script-form.js
│   └── google-apps-script-simple.js
├── 📁 my-mcp-server/                 # MCP server (Cloudflare Workers) for Cursor – manual deploy only
│   ├── src/index.ts                  # event-data-mcp tools (query_metrics, query_ga4, /insights, /chat)
│   ├── wrangler.jsonc
│   └── package.json                  # Deploy: cd my-mcp-server && npx wrangler deploy (see docs/MCP_CURSOR_SETUP.md)
├── 📄 Configuration Files
│   ├── package.json                 # Dependencies and scripts
│   ├── package-lock.json           # Locked dependency versions
│   ├── wrangler.toml               # Cloudflare Workers config (main app)
│   ├── .gitignore                  # Git ignore rules
│   └── README.md                   # Project overview
└── 📁 node_modules/                # Dependencies (auto-generated)
```

## 🎯 Key Improvements Made

### ✅ **Asset Organization**
- **Centralized assets** in `public/assets/` with logical subfolders
- **Clear categorization** by asset type (images, styles, fonts)
- **Future-ready structure** with placeholder folders
- **Comprehensive documentation** for asset management

### ✅ **Documentation Organization**
- **Centralized docs** in `docs/` folder
- **SEO and optimization guides** properly organized
- **Setup documentation** easily accessible

### ✅ **Script Organization**
- **Google Apps Script files** moved to `scripts/` folder
- **Clear separation** between source code and utility scripts

### ✅ **Build Optimization**
- **Removed duplicate files** (build folder auto-generated)
- **Updated .gitignore** with comprehensive rules
- **Clean project root** with only essential files

### ✅ **Development Ready**
- **Placeholder files** (.gitkeep) maintain folder structure
- **Clear naming conventions** throughout
- **Scalable architecture** for future growth

## 🚀 Usage Guidelines

### **Adding New Assets**
- **Images**: Place in appropriate subfolder (`logos/`, `heroes/`, `events/`, `corporate/`, `icons/`)
- **Styles**: Add CSS to `styles/css/` or SCSS to `styles/scss/`
- **Fonts**: Place custom fonts in `fonts/` folder

### **Adding New Components**
- **React components**: Add to `src/components/`
- **Custom hooks**: Add to `src/hooks/`
- **Services**: Add to `src/services/`

### **Documentation**
- **Project docs**: Add to `docs/` folder
- **Asset guidelines**: Update `public/assets/README.md`

## 🔧 Build Commands

```bash
# Development
npm start

# Production build
npm run build

# Test build locally
npx serve -s build -l 3000
```

This structure provides a clean, maintainable, and scalable foundation for your project! 🎉
