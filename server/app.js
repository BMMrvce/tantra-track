import express from 'express';
import cors from 'cors';
import routes from './routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', database: 'Supabase' });
});

export default app;