# PDFNova: Premium PDF Tools, Refined.

PDFNova is a world-class, high-performance, browser-local PDF utilities platform built with Next.js (App Router), TypeScript, Tailwind CSS (v4), Framer Motion, and Firebase. It provides a secure, zero-server-upload alternative to services like iLovePDF, ensuring sensitive files are compiled inside the browser sandbox.

---

## 1. Project Folder Architecture

```
pdfnova/
├── public/                 # Static assets, manifests, icons
│   └── manifest.json       # PWA configurations
├── src/
│   ├── app/                # App Router routing gateway
│   │   ├── auth/           # Authentication layouts (Login, Sign Up, etc.)
│   │   ├── dashboard/      # Workspace dashboards
│   │   ├── legal/          # GDPR & Privacy Policies
│   │   ├── tool/           # Workspace routes for PDF utilities
│   │   ├── globals.css     # CSS variable color mapping
│   │   ├── layout.tsx      # Root providers wrapper
│   │   ├── not-found.tsx   # Custom 404 handler
│   │   └── page.tsx        # SEO homepage
│   ├── components/         # Reusable layouts
│   │   ├── ui/             # Core widgets (Button, Card, Toast, Modal)
│   │   ├── Header.tsx      # Sticky Navbar & search controls
│   │   └── Footer.tsx      # Resource listings
│   ├── context/            # Auth & Theme states
│   └── lib/                # SDK integrations
│       └── firebase.ts     # Firebase client initializer
├── firestore.rules         # Database lock configurations
├── storage.rules           # Ephemeral storage rules
└── firebase.json           # Firebase Hosting descriptors
```

---

## 2. Getting Started & Installation Guide

### Prerequisites
* Node.js (version 18 or higher)
* npm (bundled with Node.js)

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   cd PDFNova
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development compiler locally:
   ```bash
   npm run dev
   ```
4. Access the workspace at `http://localhost:3000`.

---

## 3. Firebase Setup Guide

To connect the application to your production Google Cloud environment:

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable the following services:
   * **Authentication**: Turn on Email/Password & Google Sign-In.
   * **Cloud Firestore**: Initialize in Production Mode.
   * **Cloud Storage**: Set up default buckets.
   * **Firebase Hosting**: Configure hosting deployment zones.
3. Obtain your Client Web SDK configurations (found under Project Settings -> General -> Web Apps).

---

## 4. Environment Variables Guide

Create a `.env.local` file in the project root containing your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

---

## 5. Security Rules Deployment

To publish the Firestore and Cloud Storage locks:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Login and associate the project:
   ```bash
   firebase login
   firebase use --add
   ```
3. Deploy safety configurations:
   ```bash
   firebase deploy --only firestore:rules,storage:rules
   ```

---

## 6. Production Deployment Guide

### Vercel / Netlify Deployments
PDFNova is fully optimized for standard Edge/Serverless platforms. Next.js App Router endpoints are resolved instantly. Simply import the repository, map the environment variables, and trigger compilation.

### Firebase App Hosting / Hosting CLI
To compile assets and release static pages directly to Google CDN:
1. Build compilation outputs:
   ```bash
   npm run build
   ```
2. Upload configurations:
   ```bash
   firebase deploy --only hosting
   ```
