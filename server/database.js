import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';

const db = new sqlite3.Database('./tantratrack.db');

export const initializeDatabase = () => {
  db.serialize(() => {
    // Create transactions table
    db.run(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        createdAt TEXT NOT NULL
      )
    `);

    // Create categories table
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        color TEXT
      )
    `);

    // Insert default categories
    const defaultCategories = [
      { type: 'income', name: 'Salary', color: '#10b981' },
      { type: 'income', name: 'Freelance', color: '#3b82f6' },
      { type: 'income', name: 'Investment', color: '#f59e0b' },
      { type: 'income', name: 'Other Income', color: '#8b5cf6' },
      { type: 'expense', name: 'Food', color: '#ef4444' },
      { type: 'expense', name: 'Transportation', color: '#ec4899' },
      { type: 'expense', name: 'Utilities', color: '#f97316' },
      { type: 'expense', name: 'Entertainment', color: '#06b6d4' },
      { type: 'expense', name: 'Shopping', color: '#d946ef' },
      { type: 'expense', name: 'Healthcare', color: '#14b8a6' },
      { type: 'expense', name: 'Education', color: '#0ea5e9' },
      { type: 'expense', name: 'Other Expense', color: '#6366f1' }
    ];

    defaultCategories.forEach(cat => {
      db.run(
        'INSERT OR IGNORE INTO categories (id, name, type, color) VALUES (?, ?, ?, ?)',
        [uuidv4(), cat.name, cat.type, cat.color]
      );
    });
  });
};

export const addTransaction = (type, category, amount, description, date) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO transactions (id, type, category, amount, description, date, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [uuidv4(), type, category, amount, description, date, new Date().toISOString()],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

export const getTransactions = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM transactions WHERE date >= ? AND date <= ? ORDER BY date DESC',
      [startDate, endDate],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
};

export const deleteTransaction = (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM transactions WHERE id = ?', [id], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

export const updateTransaction = (id, type, category, amount, description, date) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE transactions SET type = ?, category = ?, amount = ?, description = ?, date = ? WHERE id = ?',
      [type, category, amount, description, date, id],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

export const getCategories = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM categories', (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

export const getAllTransactions = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM transactions ORDER BY date DESC', (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

export default db;
