#!/usr/bin/env node

# 🎉 TANTRATRACK - INSTALLATION & LAUNCH GUIDE

## 📌 Project Location
📁 `/home/bmm/Desktop/tantratrack`

---

## ⚡ QUICK START (Copy & Paste)

### Option 1: Automated Setup
```bash
cd ~/Desktop/tantratrack
bash setup.sh
npm run dev
```

### Option 2: Manual Setup
```bash
cd ~/Desktop/tantratrack
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
npm run dev
```

---

## 🌐 Access the Application

After running `npm run dev`, open your browser:

🔗 **Frontend**: http://localhost:3000
🔗 **Backend**: http://localhost:5000

---

## 📚 DOCUMENTATION FILES

Read these in order:

1. **QUICKSTART.md** - Start here! (5 min read)
2. **README.md** - Full features overview (10 min)
3. **SETUP.md** - Detailed setup guide (5 min)
4. **API.md** - API reference (for developers)
5. **PROJECT-SUMMARY.md** - Technical deep dive

---

## ✨ WHAT YOU GET

### Features Included ✅
- ✅ Add Income & Expenses
- ✅ Beautiful Dashboard
- ✅ Daily/Weekly/Monthly Reports
- ✅ Interactive Charts
- ✅ Professional Excel Export
- ✅ 12 Pre-defined Categories
- ✅ Responsive Design
- ✅ SQLite Database (No setup needed!)

### Tech Stack ✅
- ✅ React 18 Frontend
- ✅ Node.js/Express Backend
- ✅ SQLite Database
- ✅ Recharts for Visualization
- ✅ Professional Styling with CSS

### Branding ✅
- ✅ "Tantratrack" identity
- ✅ Powered by Tantravruksha Technologies
- ✅ Modern, professional design
- ✅ Blue color scheme

---

## 🎯 FIRST TIME SETUP

### 1️⃣ Install Node.js (if not installed)
```bash
# Download from: https://nodejs.org/
# Or use: brew install node (Mac)
```

### 2️⃣ Navigate to Project
```bash
cd ~/Desktop/tantratrack
```

### 3️⃣ Install All Dependencies
```bash
npm run install:all
```

### 4️⃣ Start the Application
```bash
npm run dev
```

### 5️⃣ Open in Browser
```
http://localhost:3000
```

### 6️⃣ Start Tracking!
- Click "➕ Add Transaction"
- Add your first income or expense
- View your Dashboard
- Generate Reports

---

## 🛠️ PROJECT STRUCTURE

```
tantratrack/
├── 📄 README.md              ← START HERE
├── 📄 QUICKSTART.md          ← Quick reference
├── 📄 SETUP.md               ← Installation help
├── 📄 API.md                 ← API reference
│
├── 📁 server/                ← Node.js Backend
│   ├── index.js              (Main server)
│   ├── database.js           (SQLite)
│   ├── routes.js             (API endpoints)
│   ├── reports.js            (Reports logic)
│   ├── excelExport.js        (Excel generation)
│   └── package.json
│
├── 📁 client/                ← React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js            (Main component)
│   │   ├── App.css           (Styling)
│   │   └── components/       (UI components)
│   └── package.json
│
└── 📄 package.json           (Root config)
```

---

## 💡 COMMON COMMANDS

### Development
```bash
# Start both frontend & backend
npm run dev

# Start just backend
cd server && npm start

# Start just frontend
cd client && npm start
```

### Building
```bash
# Build frontend for production
cd client && npm run build

# Create optimized bundle
npm run build
```

### Reinstall
```bash
# If you hit issues
rm -rf node_modules client/node_modules server/node_modules
npm run install:all
```

---

## 🐛 TROUBLESHOOTING

### Port Already in Use
```bash
# Kill port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Database Issues
```bash
# Reset database
rm server/tantratrack.db
npm run dev  # Creates new DB
```

### Module Not Found
```bash
# Reinstall dependencies
npm run install:all
```

### CORS Errors
- Make sure backend runs on port 5000
- Make sure frontend runs on port 3000

---

## 📊 DEFAULT CATEGORIES

### Income Categories
- 💼 Salary
- 🎨 Freelance  
- 💹 Investment
- 📝 Other Income

### Expense Categories
- 🍔 Food
- 🚕 Transportation
- ⚡ Utilities
- 🎮 Entertainment
- 🛍️ Shopping
- 🏥 Healthcare
- 📚 Education
- 📌 Other Expense

---

## 🚀 NEXT STEPS

### Immediate
1. ✅ Install dependencies
2. ✅ Start app
3. ✅ Add 5 transactions
4. ✅ Check dashboard

### Short Term
1. Add daily transactions
2. Generate weekly reports
3. Export to Excel
4. Review spending patterns

### Medium Term
1. Customize categories
2. Set up budget targets
3. Track trends
4. Plan for next month

---

## 📞 SUPPORT

### Documentation
- README.md - Features overview
- SETUP.md - Installation help
- API.md - Developer reference

### Website
🌐 https://tantravruksha.in

### Contact
📧 tantravruksha@outlook.com
📞 +91 9113950234

---

## ✅ PRODUCTION CHECKLIST

- [x] All features working
- [x] Responsive design
- [x] Excel export
- [x] Reports system
- [x] Documentation complete
- [x] Ready to deploy
- [ ] Add authentication (optional)
- [ ] Add cloud backup (optional)

---

## 🎊 YOU'RE ALL SET!

Your Tantratrack Budget Tracker is ready to use! 

### Start Here:
1. Run: `npm run dev`
2. Open: http://localhost:3000
3. Add a transaction
4. Start budgeting! 💰

---

**Version**: 1.0.0
**Status**: Production Ready
**Last Updated**: April 2024

Made with ❤️ by Tantravruksha Technologies

---
