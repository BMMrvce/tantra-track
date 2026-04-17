import express from 'express';
import {
  addTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
  getCategories,
  getAllTransactions
} from './supabase-db.js';
import { requireAuth } from './auth.js';
import { generateExcelReport } from './excelExport.js';
import { generatePdfReport } from './pdfExport.js';
import { getMonthlyReport, getWeeklyReport, getDailyReport } from './reports.js';

const router = express.Router();

router.use(requireAuth);

// Get all transactions for a date range
router.get('/transactions', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const transactions = await getTransactions(startDate, endDate, req.user.id);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new transaction
router.post('/transactions', async (req, res) => {
  try {
    const { type, category, amount, description, date } = req.body;
    const result = await addTransaction(type, category, amount, description, date, req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update transaction
router.put('/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, category, amount, description, date } = req.body;
    const result = await updateTransaction(id, type, category, amount, description, date, req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete transaction
router.delete('/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteTransaction(id, req.user.id);
    if (!result.success) {
      return res.status(404).json({ success: false, error: 'Transaction not found or not owned by current user' });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get reports
router.get('/reports/daily', async (req, res) => {
  try {
    const { date } = req.query;
    const report = await getDailyReport(req.user.id, date);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/reports/weekly', async (req, res) => {
  try {
    const { startDate } = req.query;
    const report = await getWeeklyReport(req.user.id, startDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/reports/monthly', async (req, res) => {
  try {
    const { month, year } = req.query;
    const report = await getMonthlyReport(req.user.id, month, year);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export to Excel
router.post('/export', async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const transactions = await getTransactions(startDate, endDate, req.user.id);
    generateExcelReport(transactions, startDate, endDate, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export to PDF
router.post('/export/pdf', async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const transactions = await getTransactions(startDate, endDate, req.user.id);
    await generatePdfReport(transactions, startDate, endDate, res);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
      return;
    }

    console.error('PDF export failed after headers were sent:', error);
  }
});

export default router;
