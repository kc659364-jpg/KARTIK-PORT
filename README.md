# Kartik Chauhan — Premium 3D Personal Portfolio

A production-quality personal portfolio website for **Kartik Chauhan** — Web Developer & Creative Technologist based in Surat, Gujarat, India.

Built with **Next.js App Router (JavaScript)**, **Three.js** for real interactive 3D visual art, **GSAP & ScrollTrigger** for smooth entrance and scroll animations, **Vanilla CSS** with a custom coffee-inspired palette, and a functional **Resend** contact inquiry system.

---

## 🎨 Color Palette & Visual Identity

The design is inspired by contemporary digital studios and editorial creative developer portfolios using a warm, coffee-inspired palette:

- **Espresso Brown** (`#2B1D18`): Used for dark sections, high-contrast cards, typography, and dark accents.
- **Warm Cream** (`#F6F0E7`): Primary website canvas and background.
- **Caramel Coffee** (`#B9825B`): Interactive accents, CTAs, button hover states, orbital rings, and highlights.
- **White** (`#FFFFFF`): Crisp card backgrounds and clean surface elevation.
- **Muted Brown** (`#77675D`): Secondary text, subtitles, and descriptions.
- **Light Latte** (`#E8D8C8`): Subtle tags, badges, and 3D wireframes.
- **Subtle Border** (`#E5D9CC`): Soft, refined card outlines and section dividers.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js `v18.17+` or `v20+` (tested on Node v24)
- npm or pnpm / yarn

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your contact form email service:
```env
# Get a free API key at https://resend.com
RESEND_API_KEY=re_your_api_key_here

# The email where you want to receive client inquiries
CONTACT_RECIPIENT_EMAIL=kc659364@gmail.com

# Verified sender email in your Resend account (or onboarding@resend.dev for testing)
CONTACT_SENDER_EMAIL=onboarding@resend.dev
```

*Note: If `RESEND_API_KEY` is not provided, the contact form automatically provides a direct `mailto:` fallback link with all entered project details pre-filled.*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 📁 Project Architecture

```
kartik1/
├── public/
│   └── images/
│       ├── profile-placeholder.svg           # Your main portrait placeholder
│       ├── about-3d-visual-placeholder.svg   # 3D illustration / artwork placeholder
│       ├── project-restopos-placeholder.svg  # RestoPOS dashboard screenshot placeholder
│       ├── project-society-placeholder.svg   # Smart Building dashboard placeholder
│       ├── project-wallify-placeholder.svg   # Wallify gallery preview placeholder
│       ├── project-coffee-placeholder.svg    # Coffee Experience preview placeholder
│       └── favicon.svg                       # KC monogram favicon
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── contact/
│   │   │       └── route.js                  # Contact form email API (Resend + validation)
│   │   ├── globals.css                       # Coffee theme variables & global styles
│   │   ├── layout.js                         # Root layout, Google Fonts, SEO metadata
│   │   ├── not-found.js                      # Custom 404 page
│   │   └── page.js                           # Home page composed of sections
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx                    # Fixed navigation with scroll blur & mobile drawer
│   │   │   └── Footer.jsx                    # Coffee-brown footer with quick links & socials
│   │   ├── sections/
│   │   │   ├── Hero.jsx                      # Hero section with headline & 3D canvas
│   │   │   ├── About.jsx                     # About Kartik, tech badges & visual cards
│   │   │   ├── Services.jsx                  # 6 service cards with interactive inquiry triggers
│   │   │   ├── Skills.jsx                    # Grouped technology chips (Frontend, Backend, etc.)
│   │   │   ├── Projects.jsx                  # Filterable project portfolio grid
│   │   │   ├── Experience.jsx                # Internship & education timeline
│   │   │   ├── WhyWorkWithMe.jsx             # 4 approach & quality pillars
│   │   │   └── Contact.jsx                   # Dark espresso section with form & WhatsApp CTA
│   │   ├── three/
│   │   │   ├── HeroScene.jsx                 # Real Three.js 3D scene (dodecahedron, rings, particles)
│   │   │   └── AboutVisual.jsx               # Interactive tilted portrait & 3D artwork cards
│   │   └── ui/
│   │       ├── Button.jsx                    # Reusable button with variants
│   │       ├── ContactForm.jsx               # Client inquiry form with validation
│   │       ├── Icons.jsx                     # Crisp GitHub & LinkedIn vector icons
│   │       ├── ProjectCard.jsx               # Project card with 3D hover tilt & tag badges
│   │       ├── SectionHeading.jsx            # Standardized typography headings
│   │       ├── ServiceCard.jsx               # Service card that pre-selects form inquiry
│   │       └── SkillGroup.jsx                # Tech group card with pill chips
│   ├── data/
│   │   ├── experience.js                     # Internship & education data
│   │   ├── projects.js                       # All projects data (add new projects here!)
│   │   ├── services.js                       # Service descriptions & form values
│   │   └── skills.js                         # Technical skills categories
│   └── lib/
│       ├── animations.js                     # GSAP entrance & scroll animation helpers
│       └── utils.js                          # Scrolling, validation, WhatsApp URL helpers
├── .env.example
├── .env.local
└── README.md
```

---

## 🛠️ Easy Customization Guide

### 1. How to Add a New Project
Open `/src/data/projects.js` and add a new object to the `projects` array:

```javascript
{
  id: "my-new-project",
  title: "My Project Title",
  shortTitle: "Project Short Name",
  role: "Full-Stack Developer",
  description: "A short description of what the project does and the problem it solves.",
  category: "Web Application", // Options: "Web Application" | "Frontend Project" | "Interactive Experience"
  technologies: ["React.js", "Node.js", "Tailwind CSS"],
  features: ["Feature 1", "Feature 2", "Feature 3"],
  image: "/images/my-project-screenshot.png", // Place image in /public/images/
  liveUrl: "https://myproject.com",           // Leave "" if not deployed yet
  githubUrl: "https://github.com/...",       // Leave "" if repository is private
  status: "Completed",                        // "Completed" or "In Progress"
  featured: true,
}
```
*The new project will automatically appear on the website and respect category filters without modifying any component!*

### 2. How to Replace Placeholder Images

#### A. Your Profile Portrait
1. Copy your portrait photo (e.g. `kartik-portrait.jpg` or `.png`) into `/public/images/`.
2. Open `/src/components/three/AboutVisual.jsx`.
3. Update `profileImageSrc`:
   ```jsx
   profileImageSrc = '/images/kartik-portrait.jpg'
   ```
   *(Or simply overwrite `/public/images/profile-placeholder.svg`)*

#### B. The About 3D Artwork
1. Save your 3D artwork or illustration to `/public/images/about-artwork.png`.
2. In `/src/components/three/AboutVisual.jsx`, set:
   ```jsx
   artworkImageSrc = '/images/about-artwork.png'
   ```

#### C. Project Screenshots
1. Take high-resolution screenshots of your projects (recommended aspect ratio: 16:10 or 1200x750px).
2. Place the image files in `/public/images/` (e.g. `restopos.png`, `society.png`, `wallify.png`, `coffee.png`).
3. Update the `image` field of the corresponding project in `/src/data/projects.js`.

### 3. How to Edit Services
Open `/src/data/services.js`. You can edit titles, descriptions, icons, or add new services.

### 4. How to Edit Skills
Open `/src/data/skills.js`. You can add new technologies to existing categories or create a new skill category card.

### 5. How to Edit Experience & Education
Open `/src/data/experience.js`. Update dates, descriptions, company names, or add additional roles.

---

## 📬 Contact Form & Email Setup (Resend)

The contact form is fully integrated with a Next.js serverless route (`/api/contact`) powered by **Resend**:

1. Create a free account at [resend.com](https://resend.com).
2. Go to **API Keys** and generate a new key.
3. Add it to your `.env.local` file:
   ```env
   RESEND_API_KEY=re_abc123...
   CONTACT_RECIPIENT_EMAIL=kc659364@gmail.com
   CONTACT_SENDER_EMAIL=onboarding@resend.dev
   ```
4. For production with a custom domain, verify your domain in Resend and update `CONTACT_SENDER_EMAIL=inquiries@yourdomain.com`.

**Graceful Fallback:**
If no API key is configured or an unexpected network issue occurs, the form provides a 1-click **mailto fallback** with all submitted form data (client name, company, budget, selected service, project description) pre-filled directly into the visitor's email client addressed to `kc659364@gmail.com`.

---

## 🌐 Deploying to Vercel

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: Kartik Chauhan personal portfolio"
   git branch -M main
   git remote add origin https://github.com/kartik-chauhan/portfolio.git
   git push -u origin main
   ```
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Under **Environment Variables**, add:
   - `RESEND_API_KEY`
   - `CONTACT_RECIPIENT_EMAIL`
   - `CONTACT_SENDER_EMAIL`
5. Click **Deploy**. Vercel will automatically build and deploy the Next.js app.

---

## ⚡ Performance, 3D & Accessibility Notes

- **Three.js Performance:** Loaded dynamically with `next/dynamic` (`ssr: false`) to avoid server-side rendering issues. The renderer restricts device pixel ratio to `Math.min(window.devicePixelRatio, 2)` and scales particle counts on mobile devices.
- **WebGL Fallback:** If WebGL is unavailable on older devices or restricted browsers, an artistic CSS animated orb and orbital rings render seamlessly without layout shifts.
- **Reduced Motion:** All GSAP ScrollTriggers and animations respect the user's `prefers-reduced-motion: reduce` system preference.
- **Pointer Events:** The Three.js canvas container uses `pointer-events: none` to ensure all buttons, links, and text remain 100% interactive and clickable.

---

&copy; 2026 Kartik Chauhan. All rights reserved.
