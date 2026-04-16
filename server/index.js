import app from './app.js';
import { initializeDatabase } from './supabase-db.js';

const PORT = process.env.PORT || 5000;

// Initialize database
initializeDatabase().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`🚀 Tantratrack Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: Supabase PostgreSQL`);
  console.log(`🔄 Real-time: Enabled`);
});
