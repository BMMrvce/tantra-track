import { v4 as uuidv4 } from 'uuid';
import { serviceSupabase } from './auth.js';

// Initialize database tables and categories
export const initializeDatabase = async () => {
  try {
    console.log('✅ Supabase connected');
    
    // Insert default categories if they don't exist
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

    // Check if categories exist
    const { data: existingCategories } = await serviceSupabase
      .from('categories')
      .select('id')
      .limit(1);

    // Insert default categories if table is empty
    if (!existingCategories || existingCategories.length === 0) {
      const categoriesToInsert = defaultCategories.map(cat => ({
        id: uuidv4(),
        name: cat.name,
        type: cat.type,
        color: cat.color
      }));

      await serviceSupabase
        .from('categories')
        .insert(categoriesToInsert);

      console.log('✅ Default categories inserted');
    }
  } catch (error) {
    console.error('Database initialization error:', error.message);
  }
};

// Add transaction
export const addTransaction = async (type, category, amount, description, date, userId) => {
  try {
    const { data, error } = await serviceSupabase
      .from('transactions')
      .insert([
        {
          id: uuidv4(),
          user_id: userId,
          type,
          category,
          amount,
          description,
          date,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    return { success: true, id: data[0]?.id };
  } catch (error) {
    throw new Error(`Failed to add transaction: ${error.message}`);
  }
};

// Get transactions for date range
export const getTransactions = async (startDate, endDate, userId) => {
  try {
    const { data, error } = await serviceSupabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }
};

// Get all transactions
export const getAllTransactions = async (userId) => {
  try {
    const { data, error } = await serviceSupabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }
};

// Update transaction
export const updateTransaction = async (id, type, category, amount, description, date, userId) => {
  try {
    const { error } = await serviceSupabase
      .from('transactions')
      .update({
        type,
        category,
        amount,
        description,
        date
      })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw new Error(`Failed to update transaction: ${error.message}`);
  }
};

// Delete transaction
export const deleteTransaction = async (id, userId) => {
  try {
    const { data, error } = await serviceSupabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select('id');

    if (error) throw error;

    const deletedCount = data?.length || 0;
    return { success: deletedCount > 0, deletedCount };
  } catch (error) {
    throw new Error(`Failed to delete transaction: ${error.message}`);
  }
};

// Get categories
export const getCategories = async () => {
  try {
    const { data, error } = await serviceSupabase
      .from('categories')
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }
};

// Subscribe to real-time updates
export const subscribeToTransactions = (callback) => {
  const subscription = serviceSupabase
    .channel('transactions')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'transactions' },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return subscription;
};

export { serviceSupabase };
