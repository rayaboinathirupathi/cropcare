# CropCare AI — Deployment and Credentials Guide

## 1. Third-Party Service & Credential Checklist

| Service / Provider | Required Variable(s) | Status When Unconfigured | Where to Obtain |
|---|---|---|---|
| **Google Gemini Multimodal AI** | `GEMINI_API_KEY` | Seamless fallback to ICAR rule-matching engine | [Google AI Studio](https://aistudio.google.com) |
| **Supabase PostgreSQL & Auth** | `NEXT_PUBLIC_SUPABASE_URL`<br>`NEXT_PUBLIC_SUPABASE_ANON_KEY`<br>`SUPABASE_SERVICE_ROLE_KEY` | Operates in resilient local session & browser storage mode | [Supabase Dashboard](https://supabase.com) |
| **Open-Meteo Weather API** | `WEATHER_PROVIDER=open-meteo` | No API key required for non-commercial agricultural queries | [Open-Meteo](https://open-meteo.com) |
| **Admin Portal** | `ADMIN_SECRET_KEY` | Defaults to secure development passphrase | Set in production environment |

---

## 2. Database Migration Deployment (Supabase)

1. Create a project in [Supabase](https://supabase.com).
2. Navigate to **SQL Editor** in the Supabase Dashboard.
3. Open `supabase/migrations/20261009_cropcare_schema.sql` from this repository.
4. Paste and execute the script to create all 14 normalized tables, foreign key constraints, indexes, and Row Level Security (RLS) policies.
5. Copy your project URL and public Anon key into your production environment variables.

---

## 3. Production Deployment Options

### Option A: Vercel (Recommended)
1. Push this repository to GitHub or GitLab.
2. Import the project into Vercel.
3. Set the Root Directory to `./`.
4. Configure environment variables (`GEMINI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ADMIN_SECRET_KEY`).
5. Deploy. The Next.js 14 App Router routes will automatically be deployed as Edge and Serverless functions.

### Option B: Docker Container
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "run", "start"]
```

### Option C: Standalone Node.js Linux Server (Ubuntu/Debian)
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Build and start with PM2
cd /var/www/cropcare-ai
npm ci
npm run build
pm2 start npm --name "cropcare" -- start
pm2 save
```
