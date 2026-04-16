# 📡 Tantratrack API Documentation

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### Transactions

#### Get All Transactions for Date Range
```
GET /transactions?startDate=2024-01-01&endDate=2024-01-31
```

**Parameters:**
- `startDate` (string, required): Start date (YYYY-MM-DD)
- `endDate` (string, required): End date (YYYY-MM-DD)

**Response:**
```json
[
  {
    "id": "uuid",
    "type": "income",
    "category": "Salary",
    "amount": 50000,
    "description": "Monthly salary",
    "date": "2024-01-31",
    "createdAt": "2024-01-31T10:30:00Z"
  }
]
```

#### Add New Transaction
```
POST /transactions
Content-Type: application/json
```

**Body:**
```json
{
  "type": "expense",
  "category": "Food",
  "amount": 500.50,
  "description": "Lunch and dinner",
  "date": "2024-01-31"
}
```

**Response:**
```json
{
  "success": true,
  "id": "uuid-string"
}
```

#### Update Transaction
```
PUT /transactions/:id
Content-Type: application/json
```

**Body:** Same as POST

#### Delete Transaction
```
DELETE /transactions/:id
```

**Response:**
```json
{
  "success": true
}
```

---

### Categories

#### Get All Categories
```
GET /categories
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Salary",
    "type": "income",
    "color": "#10b981"
  },
  {
    "id": "uuid",
    "name": "Food",
    "type": "expense",
    "color": "#ef4444"
  }
]
```

---

### Reports

#### Daily Report
```
GET /reports/daily?date=2024-01-31
```

**Response:**
```json
{
  "date": "2024-01-31",
  "totalIncome": 50000,
  "totalExpenses": 2500.50,
  "netBalance": 47499.50,
  "transactionCount": 15,
  "byCategory": {
    "Salary": {
      "income": 50000,
      "expense": 0,
      "count": 1
    },
    "Food": {
      "income": 0,
      "expense": 1200,
      "count": 3
    }
  }
}
```

#### Weekly Report
```
GET /reports/weekly?startDate=2024-01-29
```

**Response:**
```json
{
  "weekStart": "2024-01-29",
  "weekEnd": "2024-02-04",
  "totalIncome": 50000,
  "totalExpenses": 5500,
  "netBalance": 44500,
  "transactionCount": 20,
  "dailyData": {
    "2024-01-31": {
      "income": 50000,
      "expense": 2500,
      "count": 10
    }
  }
}
```

#### Monthly Report
```
GET /reports/monthly?month=1&year=2024
```

**Response:**
```json
{
  "month": "1",
  "year": "2024",
  "totalIncome": 150000,
  "totalExpenses": 25000,
  "netBalance": 125000,
  "transactionCount": 60,
  "byCategory": { ... },
  "dailyData": { ... }
}
```

---

### Export

#### Export to Excel
```
POST /export
Content-Type: application/json
```

**Body:**
```json
{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31"
}
```

**Response:** 
- Excel file download (.xlsx)
- Filename: `TantraTrack_Report_2024-01-01_to_2024-01-31.xlsx`

**Sheets included:**
1. **Summary** - Total income, expenses, balance, transaction count
2. **Transactions** - All transactions with date, type, category, description, amount
3. **By Category** - Income and expenses breakdown by category

---

## Error Responses

### Bad Request (400)
```json
{
  "error": "Invalid request parameters"
}
```

### Server Error (500)
```json
{
  "error": "Internal server error message"
}
```

---

## Data Types

### Transaction Object
```
{
  id: string (UUID)
  type: 'income' | 'expense'
  category: string
  amount: number (positive)
  description: string (optional)
  date: string (YYYY-MM-DD)
  createdAt: string (ISO 8601)
}
```

### Category Object
```
{
  id: string (UUID)
  name: string
  type: 'income' | 'expense'
  color: string (hex color)
}
```

---

## Rate Limiting
Currently no rate limiting. For production, consider implementing:
- Request per minute limits
- IP-based throttling

---

## Authentication
Currently no authentication. For production:
- Implement JWT tokens
- Add user authentication
- Secure database

---

## Example Usage

### Using cURL
```bash
# Add transaction
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "expense",
    "category": "Food",
    "amount": 500,
    "description": "Lunch",
    "date": "2024-01-31"
  }'

# Get monthly report
curl "http://localhost:5000/api/reports/monthly?month=1&year=2024"

# Export to Excel
curl -X POST http://localhost:5000/api/export \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  }' \
  > report.xlsx
```

### Using Fetch API
```javascript
// Add transaction
fetch('/api/transactions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'income',
    category: 'Salary',
    amount: 50000,
    description: 'Monthly salary',
    date: '2024-01-31'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## Version
API Version: 1.0.0

## Last Updated
April 2024

## Support
For API support, visit: https://tantravruksha.in
