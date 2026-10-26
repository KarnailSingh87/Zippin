# 🚀 Deploying Zippin (Blinkit) on Render: 4 Separate Services

The codebase is organized so that **all 4 services are independently deployable** on Render with their own domains, environments, and scaling controls:

| Service | Type | Directory | Render Role |
|---|---|---|---|
| **`blinkit-backend`** | Web Service (Node/Express) | `backend/` | REST API, WebSockets, DB Controller |
| **`blinkit-frontend`** | Web Service (Next.js) | `frontend/` | Customer Shopping Storefront |
| **`blinkit-admin`** | Web Service (Next.js) | `admin/` | Operations & Order Fulfillment Console |
| **`blinkit-rider`** | Static Site / Web Service | `rider/` | Delivery Partner Live GPS Tracking App |

---

## ⚡ Method A: 1-Click Automated Blueprint (Recommended)

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Configure 4 separate Render services and Firebase setup"
   git push origin main
   ```
2. In [Render Dashboard](https://dashboard.render.com/), click **New +** → **Blueprint**.
3. Select your GitHub repository.
4. Render reads [render.yaml](file:///Users/harsh/Desktop/Harsh/PROJECTS/blinkit/render.yaml) and automatically creates **all 4 services**!
5. Provide your **`MONGO_URI`** connection string under `blinkit-backend`.
6. Click **Apply**. Render will build and deploy each service separately.

---

## 🛠️ Method B: Manual Individual Service Creation (Step-by-Step)

If you prefer creating them one by one in the Render UI:

### 1. Backend Service (`blinkit-backend`)
- Click **New +** → **Web Service**
- Connect your GitHub repo
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `PORT`: `4000`
  - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster0.snxrq5b.mongodb.net/blinkit?retryWrites=true&w=majority`
  - `JWT_SECRET`: `your_secure_secret_key`
  - `ADMIN_EMAIL`: `harshvardhan2005.12.16@gmail.com`
  - `ADMIN_PASSWORD`: `K@rnail0011`

### 2. Customer Frontend (`blinkit-frontend`)
- Click **New +** → **Web Service**
- Connect your GitHub repo
- **Root Directory**: `frontend`
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: `https://blinkit-backend.onrender.com` (Your backend Render URL)

### 3. Admin Operations Console (`blinkit-admin`)
- Click **New +** → **Web Service**
- Connect your GitHub repo
- **Root Directory**: `admin`
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: `https://blinkit-backend.onrender.com` (Your backend Render URL)

### 4. Rider Partner App (`blinkit-rider`)
- Click **New +** → **Static Site**
- Connect your GitHub repo
- **Root Directory**: `rider`
- **Build Command**: `echo "Rider ready"`
- **Publish Directory**: `.`
- **Rewrite Rule**: `/*` → `/index.html`

---

## 🔥 Firebase Integration (Ready to Connect Anytime)

### Customer Frontend (`blinkit-frontend`):
1. In [Firebase Console](https://console.firebase.google.com/) → **Project Settings** → **General** → **Web Apps**, copy your keys.
2. Add them to `blinkit-frontend` Environment Variables on Render:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
3. Under **Authentication** → **Settings** → **Authorized Domains**, add:
   - `your-frontend.onrender.com`
   - `your-admin.onrender.com`
   - `your-rider.onrender.com`

### Backend Server (`blinkit-backend`):
1. In Firebase Console → **Project Settings** → **Service Accounts** → **Generate New Private Key**.
2. Paste the JSON content into Render as:
   - `FIREBASE_SERVICE_ACCOUNT`
   The backend already has [backend/src/config/firebase.js](file:///Users/harsh/Desktop/Harsh/PROJECTS/blinkit/backend/src/config/firebase.js) to initialize Firebase Admin SDK automatically.
