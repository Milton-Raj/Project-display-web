# 🚀 Chrixlin - Premium Project Showcase Website

A modern, premium project showcase website built with Next.js 14, Firebase, and Tailwind CSS. Features a stunning dark theme with neon accents, glassmorphism effects, and smooth animations.

## ✨ Features

### Public Website
- **Premium Dark Theme** with cyan/purple/pink neon accents
- **Hero Section** with animated gradients and floating elements
- **Projects Showcase** with category filters and search
- **Contact Page** with direct contact buttons (Call, WhatsApp, Email, LinkedIn)
- **About Page** with skills, certifications, and professional info
- **Responsive Design** optimized for all devices
- **SEO Optimized** with proper meta tags and OpenGraph

### Admin Portal (Coming Soon)
- JWT-based authentication
- Project management (CRUD operations)
- Image upload to Firebase Storage
- Contact form submissions viewer

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components with Radix UI primitives
- **Animations**: Framer Motion
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Icons**: Lucide React
- **Deployment**: Static export (works on any hosting)

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- Firebase account (for database and storage)

### Setup Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd project-showcase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` and add your Firebase credentials:
   ```env
   # Get these from Firebase Console > Project Settings > General
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow the setup wizard
4. Enable Google Analytics (optional)

### 2. Enable Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode**
4. Select your preferred location
5. Click **Enable**

### 3. Enable Firebase Storage

1. Go to **Storage** in Firebase Console
2. Click **Get started**
3. Use default security rules for now
4. Click **Done**

### 4. Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click the web icon (`</>`)
4. Register your app
5. Copy the config values to your `.env.local`

### 5. Set Up Firestore Collections

The app will automatically create these collections when you add data:
- `projects` - Stores project information
- `contacts` - Stores contact form submissions

## 🚀 Deployment

### Option 1: Static Export (Recommended for Hostinger)

This method works on **ANY hosting plan** including basic shared hosting.

1. **Build the static site**
   ```bash
   npm run build
   ```

2. **The output will be in the `out` folder**
   
   Upload the contents of the `out` folder to your Hostinger `public_html` directory.

3. **Upload via FTP or File Manager**
   - Connect to Hostinger via FTP
   - Navigate to `public_html`
   - Upload all files from the `out` folder
   - Done! Your site is live.

### Option 2: Vercel (Easiest)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

### Option 3: Hostinger with Node.js (If supported)

If your Hostinger plan supports Node.js:

1. Enable Node.js in Hostinger control panel
2. Upload your project files
3. Install dependencies: `npm install`
4. Build: `npm run build`
5. Start: `npm start`

## 📝 Adding Your First Project

Since Firebase is not configured yet, you'll need to:

1. **Set up Firebase** (follow steps above)
2. **Add projects manually** through Firebase Console:
   - Go to Firestore Database
   - Create a new document in `projects` collection
   - Add these fields:
     ```
     title: "My Awesome Project"
     slug: "my-awesome-project"
     description: "Short description"
     category: "web-app"
     techStack: ["React", "Node.js"]
     features: ["Feature 1", "Feature 2"]
     thumbnail: "https://your-image-url.com/image.jpg"
     screenshots: []
     demoUrl: "https://demo.com"
     demoType: "web"
     status: "live"
     featured: true
     createdAt: [Timestamp]
     updatedAt: [Timestamp]
     ```

3. **Or build the Admin Panel** (coming soon) to manage projects easily

## 🎨 Customization

### Colors
Edit `app/globals.css` to change the color scheme:
```css
--primary: 189 94% 55%; /* Cyan */
--secondary: 280 89% 65%; /* Purple */
--accent: 330 81% 60%; /* Pink */
```

### Contact Information
Already configured in `.env.local`:
- Phone: +91 91 51 21 41 81
- Email: chrixlinitsolutions@gmail.com
- LinkedIn: https://www.linkedin.com/in/milton-raj/

### Content
- **Hero Section**: Edit `components/home/HeroSection.tsx`
- **About Page**: Edit `app/about/page.tsx`
- **Skills & Certifications**: Edit the arrays in `app/about/page.tsx`

## 📁 Project Structure

```
project-showcase/
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── projects/          # Projects listing
│   ├── globals.css        # Global styles & design system
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── home/             # Home page components
│   ├── layout/           # Layout components (Header, Footer)
│   ├── projects/         # Project components
│   └── ui/               # Reusable UI components
├── lib/                   # Utility functions
│   ├── firebase/         # Firebase configuration
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript type definitions
├── public/               # Static assets
└── .env.local           # Environment variables
```

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

### Build Errors
- Make sure all environment variables are set
- Check that Firebase credentials are correct
- Run `npm install` to ensure all dependencies are installed

### Styling Issues
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`

### Firebase Connection Issues
- Verify your Firebase config in `.env.local`
- Check Firebase Console for any errors
- Ensure Firestore and Storage are enabled

## 📄 License

This project is private and proprietary.

## 👤 Author

**Milton Raj**
- Email: chrixlinitsolutions@gmail.com
- LinkedIn: [milton-raj](https://www.linkedin.com/in/milton-raj/)
- Phone: +91 91 51 21 41 81

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Firebase for the backend infrastructure
- Framer Motion for smooth animations
