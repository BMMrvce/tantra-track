# 💰 Tantratrack - Smart Budget Tracker

A powerful, modern budget tracking application built with React and Node.js. Track your income and expenses with beautiful dashboards, detailed reports, and Excel export functionality.

## ✨ Features

- 📊 **Real-time Dashboard** - View your income, expenses, and balance at a glance
- ➕ **Easy Transaction Management** - Add, view, and delete transactions with a user-friendly interface
- 📈 **Advanced Reporting** - Generate daily, weekly, and monthly reports
- 📉 **Visual Charts** - Beautiful charts and graphs for expense breakdown
- 📥 **Excel Export** - Export your financial data to Excel with professional formatting
- 🏷️ **Category Management** - Pre-defined categories for income and expenses
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI** - Elegant design inspired by Tantravruksha.in

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd ~/Desktop/tantratrack
   ```

2. **Install all dependencies**
   ```bash
   npm install
   cd client && npm install && cd ../server && npm install && cd ..
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both the server (port 5000) and React client (port 3000).

### Individual Startup

**Start Backend Only:**
```bash
cd server
npm start
```

**Start Frontend Only:**
```bash
cd client
npm start
```

## 📋 Project Structure

```
tantratrack/
├── client/                 # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── Dashboard.js
│   │   │   ├── TransactionForm.js
│   │   │   ├── Reports.js
│   │   │   └── ExportButton.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── server/                 # Node.js Backend
│   ├── index.js
│   ├── database.js
│   ├── routes.js
│   ├── reports.js
│   ├── excelExport.js
│   └── package.json
├── package.json
└── README.md
```

## 💻 Usage

### Adding Transactions

1. Click on **"➕ Add Transaction"** tab
2. Select transaction type (Income or Expense)
3. Choose a category
4. Enter amount and optional description
5. Select date
6. Click **"Add Transaction"**

### Viewing Reports

1. Click on **"📈 Reports"** tab
2. Select report type:
   - **Daily** - Today's transactions
   - **Weekly** - This week's data
   - **Monthly** - Full month breakdown
3. View charts and category breakdown

### Exporting Data

1. Click the **📥** button (bottom-right corner)
2. Select start and end dates
3. Click **"Export"**
4. Excel file will download with:
   - Summary sheet
   - Detailed transactions
   - Category breakdown

## 📊 Default Categories

### Income Categories
- Salary
- Freelance
- Investment
- Other Income

### Expense Categories
- Food
- Transportation
- Utilities
- Entertainment
- Shopping
- Healthcare
- Education
- Other Expense

## 🛠️ Technology Stack

### Frontend
- React 18.2.0
- Recharts - Data visualization
- Axios - HTTP client
- date-fns - Date manipulation

### Backend
- Express.js - Web framework
- SQLite3 - Database
- XLSX - Excel export
- CORS - Cross-origin support
- UUID - Unique IDs

## 🔒 Security Features

- CORS enabled for secure API communication
- Input validation on client and server
- SQLite database for local data storage
- No sensitive data exposed in API responses

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🎨 Design Features

- Blue color scheme matching Tantravruksha Technologies
- Gradient header with logo
- Responsive grid layouts
- Smooth animations and transitions
- Icons for better UX
- Dark mode compatible

## 📝 Database

The application uses SQLite3 with the following tables:

### Transactions Table
- id (Primary Key)
- type (income/expense)
- category
- amount
- description
- date
- createdAt

### Categories Table
- id
- name
- type
- color

## 🚀 Deployment

### Build Frontend
```bash
cd client
npm run build
```

This creates an optimized production build in `client/build/`

## 📞 Support

For issues or questions, visit: https://tantravruksha.in

## 🏆 Powered by Tantravruksha Technologies

🔗 [Tantravruksha.in](https://tantravruksha.in)

🤝 Excellent web and mobile app development solutions.

## 📄 License

This project is created as a portfolio application.

---

**Happy Budgeting! 💰**
