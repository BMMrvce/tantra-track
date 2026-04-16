import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import { initializeDatabase } from './supabase-db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', database: 'Supabase' });
});

app.listen(PORT, () => {
  console.log(`🚀 Tantratrack Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: Supabase PostgreSQL`);
  console.log(`🔄 Real-time: Enabled`);
});
