import { getTransactions } from './supabase-db.js';

export const getDailyReport = async (userId, date) => {
  const transactions = await getTransactions(date, date, userId);
  
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const byCategory = {};
  transactions.forEach(t => {
    if (!byCategory[t.category]) {
      byCategory[t.category] = { income: 0, expense: 0, count: 0 };
    }
    if (t.type === 'income') byCategory[t.category].income += t.amount;
    else byCategory[t.category].expense += t.amount;
    byCategory[t.category].count += 1;
  });
  
  return {
    date,
    totalIncome: income,
    totalExpenses: expenses,
    netBalance: income - expenses,
    transactionCount: transactions.length,
    byCategory
  };
};

export const getWeeklyReport = async (userId, startDateStr) => {
  const date = new Date(startDateStr);
  // Get start of week (Sunday)
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay());
  // Get end of week (Saturday)
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  const startDateFormatted = weekStart.toISOString().split('T')[0];
  const endDateFormatted = weekEnd.toISOString().split('T')[0];
  
  const transactions = await getTransactions(startDateFormatted, endDateFormatted, userId);
  
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const dailyData = {};
  transactions.forEach(t => {
    if (!dailyData[t.date]) {
      dailyData[t.date] = { income: 0, expense: 0, count: 0 };
    }
    if (t.type === 'income') dailyData[t.date].income += t.amount;
    else dailyData[t.date].expense += t.amount;
    dailyData[t.date].count += 1;
  });
  
  return {
    weekStart: startDateFormatted,
    weekEnd: endDateFormatted,
    totalIncome: income,
    totalExpenses: expenses,
    netBalance: income - expenses,
    transactionCount: transactions.length,
    dailyData
  };
};

export const getMonthlyReport = async (userId, month, year) => {
  const startDate = new Date(year, parseInt(month) - 1, 1);
  const endDate = new Date(year, parseInt(month), 0);
  
  const startDateFormatted = startDate.toISOString().split('T')[0];
  const endDateFormatted = endDate.toISOString().split('T')[0];
  
  const transactions = await getTransactions(startDateFormatted, endDateFormatted, userId);
  
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const byCategory = {};
  transactions.forEach(t => {
    if (!byCategory[t.category]) {
      byCategory[t.category] = { income: 0, expense: 0, count: 0 };
    }
    if (t.type === 'income') byCategory[t.category].income += t.amount;
    else byCategory[t.category].expense += t.amount;
    byCategory[t.category].count += 1;
  });
  
  const dailyData = {};
  transactions.forEach(t => {
    if (!dailyData[t.date]) {
      dailyData[t.date] = { income: 0, expense: 0, count: 0 };
    }
    if (t.type === 'income') dailyData[t.date].income += t.amount;
    else dailyData[t.date].expense += t.amount;
    dailyData[t.date].count += 1;
  });
  
  return {
    month,
    year,
    totalIncome: income,
    totalExpenses: expenses,
    netBalance: income - expenses,
    transactionCount: transactions.length,
    byCategory,
    dailyData
  };
};
