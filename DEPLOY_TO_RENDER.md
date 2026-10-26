# 🚀 Deploying Zippin (Blinkit) on Render with Firebase

This repository is pre-configured with a `render.yaml` Blueprint for **1-click automated deployment** of all 3 services:
1. **`blinkit-backend`** (Node/Express API)
2. **`blinkit-frontend`** (Customer Next.js Web App)
3. **`blinkit-admin`** (Operations Next.js Admin Console)

---

## 📋 Step 1: Push Repository to GitHub

Ensure all your latest changes are pushed to GitHub:
```bash
git add .
git commit -m "Prepare Render deployment and Firebase configurations"
git push origin main
```

---

## 🌐 Step 2: Deploy on Render

1. Open [dashboard.render.com](https://dashboard.render.com/) and sign in with GitHub.
2. Click **New +** → Select **Blueprint**.
3. Choose your `blinkit` GitHub repository.
4. Render will read `render.yaml` and display all 3 services automatically:
   - **`blinkit-backend`**
   - **`blinkit-frontend`**
   - **`blinkit-admin`**
5. Under **Environment Variables**:
   - Set **`MONGO_URI`** to your MongoDB Atlas connection string:
     ```text
     mongodb+srv://<username>:<password>@cluster0.snxrq5b.mongodb.net/blinkit?retryWrites=true&w=majority
     ```
6. Click **Apply**. Render will build and deploy all services with free SSL HTTPS certificates!

---

## 🔥 Step 3: Firebase Integration Setup

Once deployed (or anytime right now), add your Firebase credentials:

### Customer Frontend (Google Login & Push Notifications):
1. Go to [Firebase Console](https://console.firebase.google.com/) → Your Project → **Project Settings** → **General** → **Web apps**.
2. Copy your web config keys and paste them into your Render **`blinkit-frontend`** Environment Variables:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

3. In **Firebase Console** → **Authentication** → **Sign-in method** → Add your Render URL to **Authorized Domains**:
   - `https://your-frontend.onrender.com`

### Backend Server (Optional - Admin Token Verification & Push Notification Dispatch):
1. In Firebase Console → **Project Settings** → **Service accounts** → Click **Generate new private key**.
2. Copy the content of the downloaded `.json` file and paste it into Render **`blinkit-backend`** Environment Variables as:
   - `FIREBASE_SERVICE_ACCOUNT`

The backend already has [backend/src/config/firebase.js](file:///Users/harsh/Desktop/Harsh/PROJECTS/blinkit/backend/src/config/firebase.js) configured to automatically parse this and initialize Firebase Admin SDK.
