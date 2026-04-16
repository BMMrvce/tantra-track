-- Tantratrack Supabase Schema
-- Run this SQL in Supabase SQL Editor to create the required tables

-- Create transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expense')),
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expense')),
  color VARCHAR(7) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_categories_type ON categories(type);

-- Add user_id to existing installs that used the shared schema
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- Insert default categories
INSERT INTO categories (name, type, color) VALUES
('Salary', 'income', '#10b981'),
('Freelance', 'income', '#3b82f6'),
('Investment', 'income', '#f59e0b'),
('Other Income', 'income', '#8b5cf6'),
('Food', 'expense', '#ef4444'),
('Transportation', 'expense', '#ec4899'),
('Utilities', 'expense', '#f97316'),
('Entertainment', 'expense', '#06b6d4'),
('Shopping', 'expense', '#d946ef'),
('Healthcare', 'expense', '#14b8a6'),
('Education', 'expense', '#0ea5e9'),
('Other Expense', 'expense', '#6366f1');

-- Enable RLS (Row Level Security) - Optional for real-time updates
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create per-user policies for transactions
DROP POLICY IF EXISTS "transactions_all" ON transactions;
DROP POLICY IF EXISTS "transactions_select_own" ON transactions;
DROP POLICY IF EXISTS "transactions_insert_own" ON transactions;
DROP POLICY IF EXISTS "transactions_update_own" ON transactions;
DROP POLICY IF EXISTS "transactions_delete_own" ON transactions;

CREATE POLICY "transactions_select_own" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "transactions_insert_own" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "transactions_update_own" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "transactions_delete_own" ON transactions
  FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "categories_all" ON categories;
DROP POLICY IF EXISTS "categories_select_all" ON categories;

CREATE POLICY "categories_select_all" ON categories
  FOR SELECT USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for transactions
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for categories
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
