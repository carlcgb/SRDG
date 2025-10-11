# 🎭 Event Website Template - React.js

A modern, responsive event website template built with React.js, perfect for comedy shows, concerts, conferences, and any type of event. This template is designed to be easily customizable and ready for production deployment.

## ✨ Features

- **🎨 Modern Design**: Clean, professional layout with custom animations
- **📱 Fully Responsive**: Works perfectly on desktop, tablet, and mobile
- **🎪 Interactive Elements**: 3D tilt effects, smooth animations, and engaging UI
- **📝 Contact Forms**: Built-in joke submission form with Google Sheets integration
- **📅 Event Management**: Easy-to-customize event cards and information
- **🔗 Social Integration**: Ready-to-use social media links and contact options
- **⚡ Fast Performance**: Optimized React components and efficient rendering
- **🚀 Easy Deployment**: Ready for Cloudflare Pages, Netlify, Vercel, and more

## 🚀 Quick Start

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/event-website-template.git

# Navigate to the project directory
cd event-website-template

# Install dependencies
npm install

# Start development server
npm start
```

The website will be available at `http://localhost:3000`

### Production Build
```bash
# Create optimized production build
npm run build

# The build files will be in the 'build' directory
```

## 🎯 Perfect For

- **Comedy Shows** & Stand-up Events
- **Concerts** & Music Events  
- **Conferences** & Business Events
- **Weddings** & Private Events
- **Festivals** & Community Events
- **Workshops** & Educational Events

## 📁 Project Structure

```
src/
├── components/              # React Components
│   ├── Navigation.js        # Navigation bar
│   ├── Hero.js             # Hero section with mascot
│   ├── Events.js           # Events section
│   ├── Platforms.js        # Social media platforms
│   ├── JokeSection.js      # Joke submission section
│   ├── Contact.js          # Contact information
│   ├── Footer.js           # Footer component
│   └── JokeModal.js        # Joke submission modal
├── hooks/                  # Custom React Hooks
│   ├── useScrollEffects.js # Scroll animations
│   ├── useMascotTilt.js    # Mascot tilt animation
│   ├── useJokeModal.js     # Modal management
│   ├── useEventCards.js    # Event card animations
│   ├── useButtonAnimations.js # Button animations
│   └── useParallax.js      # Parallax effects
├── services/               # External Services
│   └── googleSheetsService.js # Google Sheets integration
├── App.js                  # Main App component
└── index.js                # Entry point

public/
├── style/                  # CSS Files
│   ├── main.css           # Main styles
│   ├── tilted.css         # 3D tilt effects
│   └── PillNav.css        # Navigation styles
├── assets/                 # Images and resources
└── index.html              # HTML template

google-apps-script-*.js     # Google Apps Script files for form handling
```

## 🎨 Design System

The template uses a modern design system with:
- **Colors**: Customizable color scheme (easily changeable in CSS)
- **Typography**: Modern fonts with excellent readability
- **Animations**: Smooth transitions and 3D effects
- **Layout**: Responsive grid system with consistent spacing

## 🔧 Customization Guide

### 1. Basic Information
Update the following files with your event information:

**Hero Section** (`src/components/Hero.js`):
```javascript
// Update event name, date, and description
const eventName = "Your Event Name";
const eventDate = "December 25, 2024";
const eventDescription = "Your event description...";
```

**Contact Information** (`src/components/Contact.js`):
```javascript
// Update contact details
const contactInfo = {
  phone: "+1-234-567-8900",
  email: "contact@yourevent.com",
  messenger: "https://m.me/yourpage"
};
```

### 2. Events Management
**Events Section** (`src/components/Events.js`):
```javascript
// Add/remove/modify events
const events = [
  {
    id: 1,
    title: "Event Title",
    date: "2024-12-25",
    time: "8:00 PM",
    location: "Venue Name",
    price: "$25",
    description: "Event description..."
  }
  // Add more events...
];
```

### 3. Social Media Links
**Platforms Section** (`src/components/Platforms.js`):
```javascript
// Update social media links
const platforms = [
  { name: "Facebook", url: "https://facebook.com/yourpage", icon: "facebook" },
  { name: "Instagram", url: "https://instagram.com/yourpage", icon: "instagram" }
  // Add more platforms...
];
```

### 4. Colors and Styling
**Main Styles** (`public/style/main.css`):
```css
:root {
  --primary-color: #F64A3E;    /* Main brand color */
  --secondary-color: #FFE1AF;  /* Background color */
  --accent-color: #2C3E50;     /* Text color */
  /* Add more custom colors... */
}
```

### 5. Images and Assets
Replace images in `public/assets/`:
- `mascot.png` - Your mascot/logo
- `background.jpg` - Hero background
- `event-placeholder.jpg` - Default event image

## 🚀 Deployment Options

### Cloudflare Pages (Recommended)
```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy build --project-name=your-event-site
```

### Netlify
```bash
# Build the project
npm run build

# Deploy to Netlify (drag and drop the build folder)
# Or connect your GitHub repository for automatic deployments
```

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

## 📱 Responsive Design

The template automatically adapts to all screen sizes:
- **Desktop**: Full grid layout with complete 3D effects
- **Tablet**: Optimized font sizes and spacing
- **Mobile**: Vertical layout with simplified navigation

## 🎪 Animations & Effects

- **Mascot**: Entrance animation from bottom + tilt effect on hover
- **Event Cards**: 3D tilt effect on hover
- **Buttons**: Lift animation on hover
- **Scroll**: Smooth appearance animations
- **Parallax**: Subtle background movement effects

## 📊 Google Sheets Integration

The template includes a complete form submission system:

1. **Setup Google Apps Script**:
   - Copy the code from `google-apps-script-form.js`
   - Create a new Google Apps Script project
   - Deploy as a web app with "Anyone" access
   - Update the script URL in `src/services/googleSheetsService.js`

2. **Configure Google Sheets**:
   - Create a new Google Sheet
   - Update the spreadsheet ID in the Google Apps Script
   - Form submissions will automatically populate the sheet

## 💼 Business Model

This template is perfect for:
- **Web Design Agencies**: Offer as a premium service to clients
- **Event Organizers**: Create professional event websites quickly
- **Freelancers**: Provide high-quality websites to clients
- **Template Marketplaces**: Sell on platforms like ThemeForest, Creative Market

### Pricing Suggestions
- **Basic Setup**: $200-500 (includes customization)
- **Premium Package**: $500-1000 (includes hosting, domain, maintenance)
- **White-label License**: $50-100 per use

## 🛠️ Technical Features

- **React 18**: Latest React features and optimizations
- **Modern JavaScript**: ES6+ features and async/await
- **CSS3 Animations**: Hardware-accelerated animations
- **Mobile-First**: Responsive design from the ground up
- **SEO Ready**: Semantic HTML and meta tags
- **Performance Optimized**: Lazy loading and efficient rendering

## 📞 Support & Customization

For custom modifications or support:
- **Email**: support@yourcompany.com
- **Documentation**: [Full documentation available]
- **Custom Development**: Available upon request

## 📄 License

MIT License - Feel free to use for personal and commercial projects.

---

**Ready to create amazing event websites?** Clone this template and start building! 🚀
