# 🚀 Tantratrack Setup Guide

## Step 1: Initial Setup

### Option A: Fresh Installation
```bash
# Navigate to the project
cd ~/Desktop/tantratrack

# Install all dependencies
npm run install:all
```

### Option B: Manual Installation
```bash
# Install root dependencies
cd ~/Desktop/tantratrack
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

## Step 2: Configure Environment Variables

### Server Configuration
Create a `.env` file in the `server` directory:
```bash
cp .env.example server/.env
# Edit if needed - default PORT is 5000
```

### Client Configuration
The client automatically connects to `http://localhost:5000/api`

## Step 3: Start the Application

### Development Mode (Recommended)
```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

### Alternative: Start Separately
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm start
```

## Step 4: First Use

1. **Open your browser** and go to `http://localhost:3000`
2. **Navigate to **"➕ Add Transaction"** tab
3. **Create your first transaction**:
   - Type: Select Income or Expense
   - Category: Choose from pre-defined categories
   - Amount: Enter amount (e.g., 500)
   - Date: Select today's date
   - Click "Add Transaction"

4. **View your Dashboard** - See your stats immediately
5. **Generate Reports** - Go to Reports tab to see charts
6. **Export to Excel** - Click the 📥 button to export

## Data Persistence

- **Database File**: `tantratrack/server/tantratrack.db`
- **Location**: SQLite database in server directory
- **Auto-created**: First time you add a transaction

## Troubleshooting

### Port Already in Use
If port 3000 or 5000 is already in use:

```bash
# Find process using port 3000
lsof -i :3000

# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules client/node_modules server/node_modules
npm run install:all
```

### Database Issues
```bash
# Delete existing database (will create new one)
rm server/tantratrack.db

# Restart server
npm run dev
```

### CORS Errors
Ensure backend is running on port 5000 before starting frontend.

## Building for Production

### Create Production Build
```bash
cd client
npm run build
```

This creates optimized files in `client/build/`

### Run in Production
```bash
cd server
NODE_ENV=production npm start
```

## Features Quick Reference

| Feature | How to Access |
|---------|--------------|
| Add Transaction | Tab: "➕ Add Transaction" |
| View Dashboard | Tab: "📊 Dashboard" |
| View Reports | Tab: "📈 Reports" |
| Export to Excel | Button: "📥" (bottom-right) |
| Daily Report | Reports Tab → Select "Daily" |
| Weekly Report | Reports Tab → Select "Weekly" |
| Monthly Report | Reports Tab → Select "Monthly" |

## Customization

### Add New Categories
Edit `server/database.js` - `defaultCategories` array

### Change Colors
Edit `client/src/App.css` - `:root` CSS variables

### Modify Port
Edit `server/.env` - Change PORT value

## Performance Tips

- Use Monthly reports for better performance with large datasets
- Export data regularly to backup
- Clear old transactions to improve dashboard speed
- Use Chrome/Firefox for best performance

## Support

For issues:
1. Check browser console (F12)
2. Check server logs
3. Visit: https://tantravruksha.in

---

**Ready to budget? Let's go! 💰**
