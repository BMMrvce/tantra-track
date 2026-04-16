# 🚀 Supabase Integration - Quick Reference

## 📋 Checklist

### Setup (One-time)
- [ ] Create Supabase account → supabase.com
- [ ] Create project (region close to you)
- [ ] Copy URL & Keys from API settings
- [ ] Run SUPABASE_SCHEMA.sql in SQL editor
- [ ] Create server/.env with credentials
- [ ] Create client/.env.local with credentials
- [ ] Run `npm run install:all`

### Start App
```bash
npm run dev
```

### Access
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Supabase: https://app.supabase.com

---

## 🔑 Environment Variables

### server/.env
```
PORT=5000
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_KEY=eyJhbG...
SUPABASE_SERVICE_KEY=eyJhbG...
```

### client/.env.local
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SUPABASE_URL=https://xyz.supabase.co
REACT_APP_SUPABASE_KEY=eyJhbG...
```

---

## 📊 Database Tables

### transactions
```
id (UUID) | type | category | amount | description | date | created_at
```

### categories
```
id (UUID) | name | type | color | created_at
```

With 12 default categories pre-loaded.

---

## 🔄 Real-time Flow

```
Client App → Backend → Supabase → Real-time Broadcast → All Clients
```

Changes sync instantly! ✨

---

## 🛠️ Key Files

| File | Purpose |
|------|---------|
| `server/supabase-db.js` | Database operations |
| `server/routes.js` | API endpoints |
| `server/index.js` | Express server |
| `SUPABASE_SCHEMA.sql` | Database schema |
| `.env` files | Configuration |

---

## 📖 Documentation Files

| File | Read When |
|------|-----------|
| SUPABASE_SETUP.md | First time setup |
| SUPABASE_INTEGRATION.md | Want overview |
| MIGRATION_GUIDE.md | Migrating from SQLite |
| SUPABASE_SCHEMA.sql | Running schema |
| README.md | Feature overview |

---

## 🆘 Quick Fixes

### Won't start?
```bash
# Reinstall everything
rm -rf node_modules */node_modules
npm run install:all
```

### Connection error?
- Check SUPABASE_URL in .env
- Verify SUPABASE_KEY is correct
- Ensure no extra spaces in .env

### No categories?
- Run SUPABASE_SCHEMA.sql
- Check in Supabase Table Editor
- Verify insert statements ran

### Real-time not working?
- Check backend logs
- Verify backend running on 5000
- Try refreshing browser

---

## 💻 Commands

```bash
# Install all
npm run install:all

# Start dev
npm run dev

# Start backend only
cd server && npm start

# Start frontend only
cd client && npm start

# Reinstall
npm run install:all
```

---

## 🎯 Next Steps

1. Follow SUPABASE_SETUP.md
2. Start with `npm run dev`
3. Test adding transaction
4. Open in 2 tabs to see real-time
5. Try generating reports
6. Export to Excel

---

## ✅ Success Indicators

- ✅ Backend starts without errors
- ✅ Frontend loads at localhost:3000
- ✅ Can add transactions
- ✅ Can see list of categories
- ✅ Changes appear across tabs
- ✅ Reports generate correctly
- ✅ Excel export works

---

## 🔗 Important URLs

- **Supabase**: https://app.supabase.com
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Docs**: https://supabase.com/docs

---

## 📱 Test Real-time

1. Open http://localhost:3000 in Tab 1
2. Add a transaction
3. Open http://localhost:3000 in Tab 2
4. Watch new transaction appear instantly!

---

## 🎊 Ready to Go!

Follow SUPABASE_SETUP.md and you'll be running on production-ready infrastructure in 10 minutes! 🚀

---

**Version**: v1.0
**Status**: Ready ✅
