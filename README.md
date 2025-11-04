# React Firebase Template

A production-ready, modern React starter template with Firebase integration, authentication, routing, and state management. Perfect for quickly building web applications with user authentication and database functionality.

## Features

- **React 19** - Latest React with modern hooks and patterns
- **Vite** - Lightning fast build tool with HMR
- **Firebase Integration**
  - Authentication (Email/Password + Google OAuth)
  - Firestore Database with CRUD service
  - Cloud Storage ready
- **React Router v7** - Client-side routing with protected routes
- **Context API** - Global state management for auth and user data
- **Responsive Design** - Mobile-first, fully responsive components
- **Modern UI** - Clean, professional authentication pages
- **Production Ready** - Proper error handling, loading states, and security practices

## Tech Stack

- **Frontend**: React 19, React Router v7
- **Build Tool**: Vite
- **Backend**: Firebase (Auth, Firestore, Storage)
- **State Management**: React Context API
- **Styling**: CSS-in-JS (inline styles)

## Quick Start

### 1. Clone or Use This Template

```bash
# Clone the repository
git clone <your-repo-url>
cd react-firebase-template

# Or use as GitHub template
# Click "Use this template" button on GitHub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable Authentication:
   - Email/Password authentication
   - Google authentication (optional)
4. Create a Firestore Database
5. Get your Firebase configuration:
   - Click on Project Settings (gear icon)
   - Scroll to "Your apps" section
   - Click on the web app icon (</>) or create new web app
   - Copy the configuration values

### 4. Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env` and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
react-firebase-template/
├── public/               # Static assets
├── src/
│   ├── components/
│   │   ├── auth/        # Authentication components
│   │   │   ├── LoginForm.jsx
│   │   │   ├── SignupForm.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── GoogleAuthButton.jsx
│   │   └── ProtectedRoute.jsx
│   ├── config/
│   │   └── firebase.js  # Firebase configuration
│   ├── contexts/
│   │   ├── AuthContext.jsx    # Authentication context
│   │   └── UserContext.jsx    # User data context
│   ├── hooks/           # Custom React hooks
│   ├── pages/
│   │   ├── AuthPage.jsx       # Login/Signup page
│   │   └── HomePage.jsx       # Protected home page
│   ├── services/
│   │   └── firebaseService.js # Firestore CRUD operations
│   ├── App.jsx          # Main app component
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
├── vite.config.js
├── FIREBASE_SETUP.md   # Detailed Firebase setup guide
└── README.md
```

## Key Components

### Authentication System

The template includes a complete authentication system:

- **LoginForm** - Email/password login with validation
- **SignupForm** - User registration with automatic profile creation
- **ResetPassword** - Password reset via email
- **GoogleAuthButton** - One-click Google OAuth
- **ProtectedRoute** - Route wrapper for authenticated pages

### Context Providers

- **AuthContext** - Manages authentication state and auth operations
- **UserContext** - Manages user profile data from Firestore

### Firebase Service

A comprehensive Firestore service (`firebaseService.js`) with:
- CRUD operations (Create, Read, Update, Delete)
- Subcollection support
- Query building with filters, ordering, and limits
- Consistent error handling
- Automatic timestamp management

## Usage Examples

### Protected Routes

```jsx
import ProtectedRoute from './components/ProtectedRoute';

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### Using Auth Context

```jsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  // Access user data
  console.log(user.email);

  // Logout
  const handleLogout = async () => {
    await logout();
  };
}
```

### Using Firebase Service

```jsx
import { createDocument, readDocument, updateDocument } from './services/firebaseService';

// Create a document
const result = await createDocument('posts', {
  title: 'My Post',
  content: 'Post content'
});

// Read a document
const post = await readDocument('posts', 'post-id');

// Update a document
await updateDocument('posts', 'post-id', {
  title: 'Updated Title'
});
```

## Customization

### 1. Change App Name

Edit `src/pages/AuthPage.jsx`:
```jsx
<h1 style={styles.appTitle}>Your App Name</h1>
```

### 2. Customize Styles

The template uses inline styles for simplicity. You can:
- Keep using inline styles
- Switch to CSS modules
- Add a CSS framework (Tailwind, MUI, etc.)
- Use styled-components or emotion

### 3. Add More Routes

Edit `src/App.jsx`:
```jsx
<Route path="/profile" element={
  <ProtectedRoute>
    <ProfilePage />
  </ProtectedRoute>
} />
```

### 4. Extend User Profile

Edit the signup logic in `src/components/auth/SignupForm.jsx` to add more user fields.

## Firebase Setup

For detailed Firebase setup instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

### Firestore Security Rules

Add these rules in Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
    }

    // Add more rules for your collections
    match /{document=**} {
      allow read, write: if false; // Deny all by default
    }
  }
}
```

## Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder.

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init hosting

# Deploy
firebase deploy
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build the project
npm run build

# Drag and drop the dist/ folder to Netlify
# Or use Netlify CLI
```

## Environment Variables in Production

Remember to add environment variables in your hosting platform:

- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables
- **Firebase Hosting**: Use Firebase environment configuration

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Security Best Practices

- Never commit `.env` file (already in `.gitignore`)
- Use Firestore security rules to protect data
- Enable Firebase App Check for production
- Validate user input on both client and server
- Keep Firebase SDK and dependencies updated
- Use HTTPS in production (automatic with Firebase/Vercel/Netlify)

## Troubleshooting

### Firebase Connection Issues

- Double-check your `.env` file has correct credentials
- Ensure Firebase services are enabled in console
- Check browser console for specific error messages

### Authentication Not Working

- Verify Email/Password and Google auth are enabled in Firebase Console
- Check that authorized domains include your deployment domain
- Clear browser cache and cookies

### Build Errors

- Delete `node_modules` and `package-lock.json`, then run `npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Ensure all environment variables are set

## Contributing

This is a template repository. Feel free to:
- Fork and customize for your needs
- Submit issues for bugs or suggestions
- Create pull requests for improvements

## License

MIT License - feel free to use this template for any project (personal or commercial).

## Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Router Documentation](https://reactrouter.com/)

## Support

For issues and questions:
- Check the [Firebase Setup Guide](./FIREBASE_SETUP.md)
- Review Firebase Console error logs
- Check browser console for errors
- Search existing issues or create a new one

---

**Happy coding!** If you found this template helpful, please give it a star ⭐
