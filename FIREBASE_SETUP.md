# Firebase Setup Guide

This guide will walk you through setting up Firebase for your React application, including Authentication, Firestore Database, and optional features.

## Prerequisites

- Node.js and npm installed
- Basic understanding of React and Firebase
- A Google account to access Firebase Console

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** or **Create a project**
3. Enter your project name
4. (Optional) Enable Google Analytics
5. Click **Create project** and wait for setup to complete

## Step 2: Register Your Web App

1. In the Firebase Console, click on the web icon (</>) to add a web app
2. Enter an app nickname (e.g., "My Web App")
3. (Optional) Set up Firebase Hosting
4. Click **Register app**
5. Copy the Firebase configuration - you'll need this for your `.env` file
6. Click **Continue to console**

## Step 3: Enable Email/Password Authentication

1. In the left sidebar, click **Build** → **Authentication**
2. Click **Get started** (if first time)
3. Go to the **Sign-in method** tab
4. Click on **Email/Password** provider
3. In the left sidebar, click **Build** → **Authentication**
4. Click **Get started** (if first time) or go to the **Sign-in method** tab
5. Click on **Email/Password** provider
6. Toggle **Enable** to ON
7. Toggle **Email link (passwordless sign-in)** to OFF (unless you want this feature)
8. Click **Save**

## Step 4: Create Firestore Database

1. In the left sidebar, click **Build** → **Firestore Database**
2. Click **Create database**
3. Choose a location (select one closest to your users)
4. Start in **production mode** or **test mode**:
   - **Test mode**: Easier for development but less secure
   - **Production mode**: More secure, requires proper security rules
5. Click **Enable**

## Step 5: Enable Google OAuth Authentication (Optional)

### 5.1: Enable Google Provider in Firebase

1. Go back to **Authentication** → **Sign-in method** tab
2. Click on **Google** provider
3. Toggle **Enable** to ON
4. Set the **Project support email** (use your email address)
5. Click **Save**

### 5.2: Configure Authorized Domains

1. In the **Authentication** section, go to the **Settings** tab
2. Scroll down to **Authorized domains**
3. By default, `localhost` and your Firebase hosting domain are already authorized
4. If you deploy to a custom domain later, add it here:
   - Click **Add domain**
   - Enter your domain (e.g., `yourdomain.com`)
   - Click **Add**

### 5.3: Get OAuth Credentials (Optional - for advanced configuration)

Firebase handles OAuth credentials automatically, but if you need to configure the OAuth consent screen:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (same project as Firebase)
3. Go to **APIs & Services** → **OAuth consent screen**
4. Configure your app information:
   - **App name**: Your App Name
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Click **Save and Continue**
6. Add scopes (optional):
   - `email`
   - `profile`
7. Click **Save and Continue**
8. Add test users if app is in testing mode
9. Click **Save and Continue**

## Step 6: Configure Email Templates (Optional but Recommended)

### Email Verification Template

1. In Firebase Console, go to **Authentication** → **Templates** tab
2. Click on **Email address verification**
3. Customize the email template:
   - **Sender name**: Your App Name
   - **Subject**: Verify your email for Your App Name
   - Customize the message if needed
4. Click **Save**

### Password Reset Template

1. Click on **Password reset**
2. Customize the email template:
   - **Sender name**: Dating App
   - **Subject**: Reset your password
   - Customize the message if needed
3. Click **Save**

## Step 7: Set Up Firestore Security Rules

Since your app creates user documents in Firestore, you need proper security rules:

1. In Firebase Console, go to **Firestore Database** → **Rules** tab
2. Replace the rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own document
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
    }

    // Add more rules for other collections as needed
    match /{document=**} {
      allow read, write: if false; // Deny all by default
    }
  }
}
```

3. Click **Publish**

## Step 8: Configure Your Application

1. Copy `.env.example` to `.env` in your project root
2. Fill in the Firebase configuration values from Step 2:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

3. Save the file and restart your development server

## Step 9: Test Your Authentication

### Test Email/Password Signup

1. Run your app: `npm run dev`
2. Navigate to the signup page
3. Create an account with a test email
4. Check your email for verification link
5. Click the verification link

### Test Email/Password Login

1. Go to the login page
2. Enter your email and password
3. Click **Login**
4. You should be redirected to the home page

### Test Google OAuth

1. Go to the login page
2. Click **Continue with Google**
3. Select your Google account
4. Grant permissions
5. You should be redirected to the home page

### Test Password Reset

1. Go to the login page
2. Click **Forgot Password?**
3. Enter your email
4. Check your email for the password reset link
5. Click the link and set a new password

## Step 10: Production Deployment Checklist

Before deploying to production:

- [ ] Update authorized domains in Firebase Authentication settings
- [ ] Review and update Firestore security rules
- [ ] Set up proper error logging
- [ ] Configure email templates with your branding
- [ ] Set up Firebase App Check for abuse prevention
- [ ] Review OAuth consent screen (make sure it's verified for production)
- [ ] Set up rate limiting if needed
- [ ] Add terms of service and privacy policy links
- [ ] Test all auth flows thoroughly

## Troubleshooting

### "This domain is not authorized" error

- Make sure your domain is added to **Authorized domains** in Firebase Authentication settings

### "Email already in use" error

- This means the email is already registered
- User should use the login form instead

### Google OAuth popup closes immediately

- Check browser popup blocker settings
- Make sure authorized domains are configured correctly

### Email verification not sending

- Check Firebase email templates are configured
- Check spam folder
- Make sure sender email is verified in Firebase

## Security Best Practices

1. **Never commit `.env` file** - Add it to `.gitignore`
2. **Use environment variables** for all Firebase config
3. **Implement proper Firestore security rules**
4. **Enable Firebase App Check** to prevent abuse
5. **Require email verification** before allowing full access
6. **Implement rate limiting** for auth operations
7. **Use HTTPS** in production
8. **Monitor Authentication logs** in Firebase Console

## Additional Features to Consider

- [ ] Add social login (Facebook, Apple, etc.)
- [ ] Implement 2FA (two-factor authentication)
- [ ] Add phone number authentication
- [ ] Set up account recovery options
- [ ] Implement session management
- [ ] Add account deletion functionality
- [ ] Set up user profile completion flow

## Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Google OAuth Setup](https://firebase.google.com/docs/auth/web/google-signin)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase App Check](https://firebase.google.com/docs/app-check)

## Support

If you encounter any issues:

1. Check the [Firebase Status Dashboard](https://status.firebase.google.com/)
2. Review Firebase Console error logs
3. Check browser console for error messages
4. Consult Firebase documentation
5. Ask questions on Stack Overflow with the `firebase` tag
