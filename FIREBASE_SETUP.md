# 🔥 Firebase Setup Guide

Complete guide to setting up Firebase for your project showcase website.

## 📋 Overview

Your website uses Firebase for:
- **Firestore Database**: Store projects and contact submissions
- **Firebase Storage**: Store project images and screenshots
- **Firebase Authentication**: (Future) Admin panel authentication

## 🚀 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `chrixlin-portfolio` (or your choice)
4. Click **Continue**
5. **Google Analytics**: Enable (recommended) or disable
6. Click **Create project**
7. Wait for project creation
8. Click **Continue**

## 🗄️ Step 2: Set Up Firestore Database

1. In Firebase Console sidebar, click **Firestore Database**
2. Click **Create database**
3. **Select starting mode**:
   - Choose **"Start in production mode"**
   - Click **Next**
4. **Select location**:
   - Choose closest to your users (e.g., `asia-south1` for India)
   - Click **Enable**
5. Wait for database creation

### Configure Security Rules

1. Go to **Firestore Database** > **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Projects collection - public read, authenticated write
    match /projects/{projectId} {
      allow read: if true;  // Anyone can read projects
      allow create, update, delete: if request.auth != null;  // Only authenticated users can write
    }
    
    // Contacts collection - authenticated read/write only
    match /contacts/{contactId} {
      allow read, write: if request.auth != null;  // Only authenticated users
      allow create: if true;  // Anyone can submit contact form
    }
  }
}
```

3. Click **Publish**

## 📦 Step 3: Set Up Firebase Storage

1. In Firebase Console sidebar, click **Storage**
2. Click **Get started**
3. **Security rules**: Keep default for now
4. Click **Next**
5. **Storage location**: Use same as Firestore
6. Click **Done**

### Configure Storage Rules

1. Go to **Storage** > **Rules** tab
2. Replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Projects folder - public read, authenticated write
    match /projects/{allPaths=**} {
      allow read: if true;  // Anyone can view images
      allow write: if request.auth != null;  // Only authenticated users can upload
    }
    
    // Temporary uploads
    match /temp/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

## 🔑 Step 4: Get Firebase Configuration

1. In Firebase Console, click the **gear icon** (⚙️) > **Project settings**
2. Scroll to **"Your apps"** section
3. Click the **web icon** (`</>`) to add a web app
4. **Register app**:
   - App nickname: `Chrixlin Portfolio`
   - Check **"Also set up Firebase Hosting"** (optional)
   - Click **Register app**

5. **Copy the configuration**:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

6. **Add to your project**:
   - Open `.env.local` in your project
   - Add the values:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

7. Click **Continue to console**

## 📝 Step 5: Add Your First Project

### Option A: Via Firebase Console (Manual)

1. Go to **Firestore Database**
2. Click **Start collection**
3. Collection ID: `projects`
4. Click **Next**
5. **Add first document**:
   - Document ID: Auto-ID
   - Add fields:
   
   | Field | Type | Value |
   |-------|------|-------|
   | title | string | "My Awesome Project" |
   | slug | string | "my-awesome-project" |
   | description | string | "A brief description" |
   | longDescription | string | "Detailed description..." |
   | category | string | "web-app" |
   | techStack | array | ["React", "Node.js", "MongoDB"] |
   | features | array | ["Feature 1", "Feature 2"] |
   | thumbnail | string | "https://via.placeholder.com/800x600" |
   | screenshots | array | [] |
   | demoUrl | string | "https://demo.example.com" |
   | demoType | string | "web" |
   | status | string | "live" |
   | featured | boolean | true |
   | createdAt | timestamp | (click "Add field" > select timestamp > now) |
   | updatedAt | timestamp | (click "Add field" > select timestamp > now) |

6. Click **Save**

### Option B: Import Sample Data

Create a file `sample-project.json`:
```json
{
  "title": "FoodID - AI Food Analyzer",
  "slug": "foodid-ai-analyzer",
  "description": "AI-powered mobile app that identifies food and provides nutritional information",
  "longDescription": "FoodID is a revolutionary mobile application that uses advanced AI to analyze food images and provide comprehensive nutritional information, ingredient lists, and health scores.",
  "category": "mobile-app",
  "techStack": ["React Native", "FastAPI", "TensorFlow", "Firebase"],
  "features": [
    "Real-time food recognition",
    "Nutritional analysis",
    "Ingredient detection",
    "Health score calculation",
    "Scan history"
  ],
  "thumbnail": "https://via.placeholder.com/800x600/00D9FF/ffffff?text=FoodID",
  "screenshots": [],
  "demoUrl": "",
  "demoType": "video",
  "status": "live",
  "featured": true
}
```

Then use Firebase CLI or Admin SDK to import (advanced).

## 🔐 Step 6: Set Up Authentication (For Admin Panel)

1. In Firebase Console, click **Authentication**
2. Click **Get started**
3. Click **Sign-in method** tab
4. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle **Enable**
   - Click **Save**

### Create Admin User

1. Go to **Authentication** > **Users** tab
2. Click **Add user**
3. Enter:
   - Email: `chrixlinitsolutions@gmail.com`
   - Password: (create a strong password)
4. Click **Add user**
5. **Save the password** - you'll need it for admin login

## 📊 Step 7: Test Firebase Connection

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Open browser console** (F12)
3. Check for any Firebase errors
4. Try adding a project via Firebase Console
5. Refresh your website - project should appear

## 🎯 Step 8: Production Checklist

Before deploying to production:

- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] Firebase Storage enabled
- [ ] Security rules configured
- [ ] Environment variables set in `.env.local`
- [ ] Test project added to Firestore
- [ ] Firebase connection tested locally
- [ ] Admin user created (for future admin panel)

## 📈 Step 9: Monitoring & Analytics

### Enable Firebase Analytics

1. Go to **Analytics** in Firebase Console
2. View user engagement
3. Track page views
4. Monitor errors

### Set Up Performance Monitoring

1. Go to **Performance** in Firebase Console
2. Click **Get started**
3. Follow integration steps (optional)

## 🔄 Backup & Restore

### Export Firestore Data

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Export data
firebase firestore:export backup-folder
```

### Import Data

```bash
firebase firestore:import backup-folder
```

## 🐛 Troubleshooting

### "Permission Denied" Errors
- Check Firestore security rules
- Verify authentication status
- Check browser console for details

### Images Not Uploading
- Verify Storage rules
- Check file size limits (default 5MB)
- Ensure correct Storage bucket name

### Data Not Appearing
- Check Firestore Console for data
- Verify collection and document structure
- Check browser console for errors
- Ensure environment variables are correct

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Storage Guide](https://firebase.google.com/docs/storage)
- [Security Rules](https://firebase.google.com/docs/rules)

## 💡 Tips

1. **Use Firestore Indexes** for complex queries
2. **Monitor usage** to stay within free tier
3. **Set up billing alerts** if using paid features
4. **Regular backups** of important data
5. **Test security rules** thoroughly

## 🎉 You're All Set!

Your Firebase backend is now configured and ready to use!

---

**Need help?** Contact: chrixlinitsolutions@gmail.com
