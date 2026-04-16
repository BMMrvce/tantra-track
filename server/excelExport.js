import XLSX from 'xlsx';

export const generateExcelReport = (transactions, startDate, endDate, res) => {
  try {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Summary data
    const summaryData = [
      ['Tantratrack Budget Report', ''],
      ['Report Period', `${startDate} to ${endDate}`],
      ['', ''],
      ['Metric', 'Amount'],
      ['Total Income', income],
      ['Total Expenses', expenses],
      ['Net Balance', income - expenses],
      ['Total Transactions', transactions.length]
    ];
    
    // Transactions data
    const txnData = [['Date', 'Type', 'Category', 'Description', 'Amount']];
    transactions.forEach(txn => {
      txnData.push([
        txn.date,
        txn.type.toUpperCase(),
        txn.category,
        txn.description || '-',
        txn.amount
      ]);
    });
    
    // Category summary
    const byCategory = {};
    transactions.forEach(t => {
      if (!byCategory[t.category]) {
        byCategory[t.category] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') byCategory[t.category].income += t.amount;
      else byCategory[t.category].expense += t.amount;
    });
    
    const categoryData = [['Category', 'Income', 'Expense', 'Net']];
    Object.entries(byCategory).forEach(([category, data]) => {
      categoryData.push([
        category,
        data.income,
        data.expense,
        data.income - data.expense
      ]);
    });
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    const txnSheet = XLSX.utils.aoa_to_sheet(txnData);
    const categorySheet = XLSX.utils.aoa_to_sheet(categoryData);
    
    // Set column widths
    summarySheet['!cols'] = [{ wch: 25 }, { wch: 20 }];
    txnSheet['!cols'] = [{ wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 30 }, { wch: 12 }];
    categorySheet['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
    
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    XLSX.utils.book_append_sheet(workbook, txnSheet, 'Transactions');
    XLSX.utils.book_append_sheet(workbook, categorySheet, 'By Category');
    
    // Generate buffer
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Send response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="TantraTrack_Report_${startDate}_to_${endDate}.xlsx"`);
    res.end(Buffer.from(buffer));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
