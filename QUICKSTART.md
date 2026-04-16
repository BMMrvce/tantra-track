# 🚀 Tantratrack - Quick Start Guide

## 📋 What is Tantratrack?

Tantratrack is a **professional budget tracking application** that helps you manage your personal finances with:
- 💰 Income tracking
- 💸 Expense tracking  
- 📊 Advanced reporting (Daily, Weekly, Monthly)
- 📈 Visual charts and analytics
- 📥 Excel export
- 🎨 Beautiful, modern UI

---

## 🎯 Get Started in 60 Seconds

### 1. Install Dependencies
```bash
cd ~/Desktop/tantratrack
npm run install:all
```

### 2. Start the App
```bash
npm run dev
```

### 3. Open in Browser
```
http://localhost:3000
```

### 4. Add Your First Transaction
- Click "➕ Add Transaction"
- Select Type: **Expense** or **Income**
- Choose Category
- Enter Amount (₹)
- Click "Add Transaction"

That's it! 🎉

---

## 📊 Key Features

### Dashboard
- View total income, expenses, and balance
- See recent transactions
- Quick overview of your finances

### Add Transaction
- Transaction type (Income/Expense)
- Multiple pre-defined categories
- Optional description
- Flexible date selection

### Reports
- **Daily Reports** - Today's activity
- **Weekly Reports** - Week-at-a-glance
- **Monthly Reports** - Full month analysis with charts

### Export
- 📥 Click the floating button
- Select date range
- Download professional Excel report with 3 sheets:
  - Summary
  - Transactions
  - Category Breakdown

---

## 💡 Tips for Success

### Best Practices
1. **Add transactions daily** - Better tracking accuracy
2. **Use meaningful descriptions** - Helps you remember details
3. **Categorize correctly** - More accurate reports
4. **Review weekly** - Stay on top of spending
5. **Export monthly** - Keep records for tax/accounting

### Default Categories

**Income:**
- 💼 Salary
- 🎨 Freelance
- 💹 Investment
- 📝 Other Income

**Expenses:**
- 🍔 Food
- 🚕 Transportation
- ⚡ Utilities
- 🎮 Entertainment
- 🛍️ Shopping
- 🏥 Healthcare
- 📚 Education
- 📌 Other Expense

---

## 🎨 Customization

### Change Currency Symbol
Edit `client/src/App.js` - Replace `₹` with your currency symbol

### Change Colors
Edit `client/src/App.css` - Modify `:root` CSS variables

### Add More Categories
Edit `server/database.js` - Update `defaultCategories` array

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Database Issues
```bash
# Remove old database
rm server/tantratrack.db

# Restart app
npm run dev
```

### Dependencies Issues
```bash
# Reinstall everything
rm -rf node_modules client/node_modules server/node_modules
npm run install:all
```

---

## 📱 Device Support

✅ Desktop (Chrome, Firefox, Safari, Edge)
✅ Tablet (iPad, Android tablets)
✅ Mobile (Not optimized, use desktop for better UX)

---

## 📁 File Organization

```
tantratrack/
├── client/          # React frontend
├── server/          # Node.js backend
├── README.md        # Full documentation
├── SETUP.md         # Installation guide
├── API.md           # API reference
└── package.json     # Root configuration
```

---

## 🔐 Security & Privacy

✅ Data stored **locally** on your computer
✅ No cloud upload (unless you export)
✅ No user tracking
✅ No authentication needed (local use)

---

## 📈 Sample Workflow

### Day 1: Setup
1. Start the app
2. Add 3-5 sample transactions
3. Check your dashboard

### Day 2-7: Daily Usage
1. Add transactions as they happen
2. Review dashboard daily
3. Check reports for patterns

### End of Month
1. Generate monthly report
2. Review expenses by category
3. Export to Excel for records
4. Plan budget for next month

---

## 🎁 Bonus Features

### Keyboard Shortcuts
- While in add transaction form, press **Enter** to submit
- Press **Tab** to move between fields

### Data Export
- Export includes all metadata
- Multiple sheets for different views
- Professional formatting for sharing

### Responsive Design
- Works on different screen sizes
- Touch-friendly buttons
- Mobile-friendly layout

---

## 📞 Need Help?

### For Issues
1. Check [SETUP.md](./SETUP.md) for detailed setup
2. Check [API.md](./API.md) for API details
3. Visit [Tantravruksha.in](https://tantravruksha.in)

### Check Logs
```bash
# Check server logs (Terminal where npm run dev runs)
# Check browser console (F12 in browser)
```

---

## 🚀 Production Deployment

### Build for Production
```bash
cd client
npm run build
```

### Deploy to Web
- Upload `client/build/` to hosting service
- Deploy `server/` as Node.js app
- Update API URL in client

---

## 🎓 Learning Path

1. **Beginner** - Add transactions, view dashboard
2. **Intermediate** - Use reports to analyze spending
3. **Advanced** - Export data, set budgets, plan finances

---

## 💬 Feedback

Loving Tantratrack? Let us know at [Tantravruksha.in](https://tantravruksha.in)

---

**Happy Budgeting! 💚**

Made with ❤️ by Tantravruksha Technologies
