# 🚀 Tantratrack + Supabase Integration Guide

## What's New?

✅ **PostgreSQL Database** - Replaces SQLite with Supabase
✅ **Real-time Updates** - Live data sync across clients
✅ **Cloud Storage** - Your data on Supabase servers
✅ **Better Scalability** - Ready for production

---

## 📋 Prerequisites

- Supabase account (free at [supabase.com](https://supabase.com))
- Your project's Supabase URL & Keys
- Node.js 14+ installed

---

## 🔧 Step 1: Create Supabase Project

### 1.1 Sign Up
1. Go to [supabase.com](https://supabase.com)
2. Click **"Sign up"**
3. Use email or GitHub
4. Verify email

### 1.2 Create Project
1. Click **"New Project"**
2. Enter project name: `tantratrack`
3. Set a strong password
4. Choose region (pick closest to you)
5. Click **"Create new project"**
6. Wait for project to initialize (~2 minutes)

### 1.3 Get Your Credentials
Once project is created:
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** - Under "API URL"
   - **Anon Key** - Under "anon" key
   - **Service Role Key** - Under "service_role" key

**Keep these safe!** ⚠️

---

## 📊 Step 2: Create Database Tables

### 2.1 Open SQL Editor
1. In Supabase dashboard
2. Click **"SQL"** in left sidebar
3. Click **"+ New Query"**

### 2.2 Run Schema
1. Open file: `SUPABASE_SCHEMA.sql` (in project root)
2. Copy entire content
3. Paste into SQL editor
4. Click **"Run"** button
5. Wait for success message ✅

Your tables are now created!

---

## 🔐 Step 3: Configure Environment

### 3.1 Server Setup
Create file: `server/.env`

```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

Replace:
- `your-project` with your Supabase project name
- Keys from Step 1.3

### 3.2 Client Setup
Create file: `client/.env.local`

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_KEY=your-anon-key-here
```

---

## 📦 Step 4: Install Dependencies

```bash
cd ~/Desktop/tantratrack

# Install root dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies  
cd client && npm install && cd ..

# Done!
```

---

## 🚀 Step 5: Start the Application

```bash
# From project root
npm run dev
```

This starts:
- **Backend** on http://localhost:5000
- **Frontend** on http://localhost:3000

---

## ✨ Step 6: Test Real-time Updates

1. Open http://localhost:3000
2. Open same URL in another browser tab/window
3. Add a transaction in one tab
4. **Watch it appear instantly in the other tab!** 🔄

---

## 🎯 Features Now Available

### Real-time Sync
- Add transaction in one place
- See it update everywhere instantly
- Multiple users can use app simultaneously

### Better Performance
- PostgreSQL is faster than SQLite
- Automatic backups on Supabase
- Better for large datasets

### Cloud Storage
- Data stored on Supabase servers
- Access from anywhere
- No local database needed

---

## 🛠️ File Changes

### Updated Files:
- ✅ `server/package.json` - Added Supabase package
- ✅ `server/index.js` - Updated to use Supabase
- ✅ `server/routes.js` - Using Supabase client
- ✅ `server/supabase-db.js` - New Supabase module
- ✅ `client/package.json` - Added Supabase package
- ✅ `.env.example` - Added Supabase variables

### Removed Files:
- ❌ SQLite database (`sqlite3` package)
- ❌ Local `tantratrack.db` file

---

## 📱 Access Your Data

You can view/edit data directly in Supabase:

1. Go to Supabase dashboard
2. Click **"Table Editor"**
3. Select **"transactions"** or **"categories"**
4. Browse/edit data directly

---

## 🔍 Real-time Subscriptions

The backend now listens for real-time changes:

```js
// When data changes in Supabase
// All connected clients get updated instantly
// (triggered automatically)
```

---

## 🚨 Troubleshooting

### "Missing Supabase credentials"
- Check `.env` file exists in `server/` folder
- Verify SUPABASE_URL and SUPABASE_KEY are filled
- No spaces around `=` sign

### Connection refused
- Make sure backend started: `npm run dev`
- Check port 5000 is not in use
- Verify Supabase project is active

### Empty categories
- Log in to Supabase
- Check `categories` table has data
- Run SQL schema query if empty

### Real-time not working
- Ensure project has real-time enabled (default: enabled)
- Check network tab in browser dev tools
- Verify backend console shows "Real-time: Enabled"

---

## 🔒 Security Best Practices

### For Development (Current Setup)
- ✅ Public access enabled
- ✅ Works for testing
- ⚠️ Not for production

### For Production
1. Enable Row Level Security (RLS)
2. Add user authentication
3. Use service role key for backend only
4. Implement authorization policies
5. Enable SSL/TLS

---

## 📊 Database Schema

### Transactions Table
```
id (UUID) - Primary key
type (income/expense) - Transaction type
category (text) - Category name
amount (decimal) - Amount in rupees
description (text) - Optional notes
date (date) - Transaction date
created_at (timestamp) - Creation time
updated_at (timestamp) - Last update time
```

### Categories Table
```
id (UUID) - Primary key
name (text) - Category name
type (income/expense) - Type
color (text) - Hex color code
created_at (timestamp) - Creation time
```

---

## 💡 Pro Tips

### Backup Your Data
```
In Supabase → Database → Backups
Select "Download" to backup
```

### Export Data to Excel
- Use Tantratrack export feature
- Or export directly from Supabase

### Monitor Usage
- Supabase dashboard shows:
  - Database size
  - API calls
  - Real-time connections

---

## 🎓 Learning More

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [Supabase Real-time](https://supabase.com/docs/guides/realtime)

---

## ✅ Checklist

- [ ] Supabase account created
- [ ] Project created & initialized
- [ ] SQL schema executed
- [ ] `.env` files created
- [ ] Dependencies installed
- [ ] App started successfully
- [ ] Can add transactions
- [ ] Real-time sync working

---

## 🎉 Done!

Your Tantratrack app is now running on **Supabase**! 🚀

**Next Steps:**
1. Add transactions
2. Invite others to share access
3. Monitor in Supabase dashboard
4. Deploy when ready

---

**Questions?** Check [tantravruksha.in](https://tantravruksha.in)

**Version**: Supabase Edition 1.0
**Status**: Production Ready
