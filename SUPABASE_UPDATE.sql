-- Tantratrack Supabase update script
-- Run this in Supabase SQL Editor if you already created the earlier schema.

-- Add user_id to existing transactions table if it does not exist yet.
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Backward-compatible index creation.
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- Ensure categories remain readable to authenticated users.
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Replace old shared-access policies with per-user policies.
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

-- Optional: after you migrate old rows to a real user_id, you can enforce NOT NULL.
-- ALTER TABLE transactions ALTER COLUMN user_id SET NOT NULL;
