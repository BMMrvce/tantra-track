import PDFDocument from 'pdfkit';

export const generatePdfReport = (transactions, startDate, endDate, res) => {
  const toNumber = (value) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : 0;
  };

  const toText = (value, fallback = '-') => {
    if (value === null || value === undefined || value === '') {
      return fallback;
    }

    return String(value);
  };

  const formatCurrency = (value) => `Rs ${toNumber(value).toFixed(2)}`;

  return new Promise((resolve, reject) => {
    const income = transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((sum, transaction) => sum + toNumber(transaction.amount), 0);

    const expense = transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + toNumber(transaction.amount), 0);

    const expenseByCategory = {};
    const expenseByDay = {};

    transactions.forEach((transaction) => {
      const amount = toNumber(transaction.amount);

      if (transaction.type === 'expense') {
        expenseByCategory[transaction.category] = (expenseByCategory[transaction.category] || 0) + amount;
        expenseByDay[transaction.date] = (expenseByDay[transaction.date] || 0) + amount;
      }
    });

    const categoryData = Object.entries(expenseByCategory)
      .sort((left, right) => right[1] - left[1])
      .map(([label, value]) => ({ label, value }));

    const dayData = Object.entries(expenseByDay)
      .sort((left, right) => new Date(left[0]) - new Date(right[0]))
      .map(([date, value]) => ({
        label: new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        value
      }));

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const filename = `TantraTrack_Report_${startDate}_to_${endDate}.pdf`;

    const cleanupAndReject = (error) => {
      if (!res.writableEnded) {
        try {
          res.destroy(error);
        } catch (destroyError) {
          // Ignore cleanup failures and surface the original error.
        }
      }

      reject(error);
    };

    const ensureSpace = (requiredHeight) => {
      const pageBottom = doc.page.height - doc.page.margins.bottom;
      if (doc.y + requiredHeight > pageBottom) {
        doc.addPage();
        doc.x = doc.page.margins.left;
        doc.y = doc.page.margins.top;
      }
    };

    const drawMetricCard = (x, y, width, title, value, accentColor, valueColor = '#0f172a') => {
      doc.save();
      doc.roundedRect(x, y, width, 60, 10).fillAndStroke('#f8fafc', '#cbd5e1');
      doc.rect(x, y, 5, 60).fill(accentColor);
      doc.fillColor('#475569').fontSize(9).text(title, x + 12, y + 10, { width: width - 24 });
      doc.fillColor(valueColor).font('Helvetica-Bold').fontSize(14).text(value, x + 12, y + 27, { width: width - 24 });
      doc.font('Helvetica');
      doc.restore();
    };

    const drawHorizontalBars = (title, data, options = {}) => {
      const {
        x = 40,
        width = 500,
        barColor = '#ef4444',
        maxItems = 6,
        emptyText = 'No expense data for this period'
      } = options;

      ensureSpace(140);
      doc.fontSize(13).fillColor('#0f172a').text(title, x, doc.y);
      doc.moveDown(0.35);

      if (!data.length) {
        doc.fontSize(10).fillColor('#64748b').text(emptyText, x, doc.y);
        doc.moveDown(0.5);
        return;
      }

      const rows = data.slice(0, maxItems);
      const labelWidth = 150;
      const barWidth = width - labelWidth - 90;
      const maxValue = Math.max(...rows.map((item) => item.value), 1);

      rows.forEach((item) => {
        ensureSpace(24);
        const rowY = doc.y;
        const fillWidth = Math.max(8, Math.round(barWidth * (item.value / maxValue)));

        doc.fontSize(10).fillColor('#1f2937').text(item.label, x, rowY + 1, { width: labelWidth, ellipsis: true });
        doc.roundedRect(x + labelWidth + 10, rowY + 2, barWidth, 12, 4).fill('#e2e8f0');
        doc.roundedRect(x + labelWidth + 10, rowY + 2, fillWidth, 12, 4).fill(barColor);
        doc.fillColor('#475569').fontSize(9).text(formatCurrency(item.value), x + labelWidth + 10 + barWidth + 10, rowY, { width: 80, align: 'right' });
        doc.moveDown(1.05);
      });
    };

    const drawDailyTrend = (title, data, options = {}) => {
      const {
        x = 40,
        width = 500,
        barColor = '#0ea5e9',
        emptyText = 'No daily expense trend available for this period'
      } = options;

      ensureSpace(160);
      doc.fontSize(13).fillColor('#0f172a').text(title, x, doc.y);
      doc.moveDown(0.35);

      if (!data.length) {
        doc.fontSize(10).fillColor('#64748b').text(emptyText, x, doc.y);
        doc.moveDown(0.5);
        return;
      }

      const rows = data.slice(-10);
      const maxValue = Math.max(...rows.map((item) => item.value), 1);
      const chartWidth = width - 60;

      rows.forEach((item) => {
        ensureSpace(26);
        const rowY = doc.y;
        const barWidth = Math.max(8, Math.round(chartWidth * (item.value / maxValue)));

        doc.fontSize(10).fillColor('#1f2937').text(item.label, x, rowY + 1, { width: 70 });
        doc.roundedRect(x + 78, rowY + 2, chartWidth, 12, 4).fill('#e2e8f0');
        doc.roundedRect(x + 78, rowY + 2, barWidth, 12, 4).fill(barColor);
        doc.fillColor('#475569').fontSize(9).text(formatCurrency(item.value), x + 78 + chartWidth + 10, rowY, { width: 70, align: 'right' });
        doc.moveDown(1.05);
      });
    };

    doc.on('error', cleanupAndReject);
    res.on('error', cleanupAndReject);
    res.on('finish', resolve);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    doc.pipe(res);

    doc.fontSize(21).fillColor('#0f172a').text('Tantratrack Financial Report', { align: 'left' });
    doc.moveDown(0.35);
    doc.fontSize(11).fillColor('#475569').text(`Report Period: ${toText(startDate)} to ${toText(endDate)}`);
    doc.moveDown(0.8);

    const cardWidth = 117;
    const cardGap = 10;
    const cardY = doc.y;
    drawMetricCard(40, cardY, cardWidth, 'Income', formatCurrency(income), '#22c55e');
    drawMetricCard(40 + cardWidth + cardGap, cardY, cardWidth, 'Expenses', formatCurrency(expense), '#ef4444');
    drawMetricCard(40 + (cardWidth + cardGap) * 2, cardY, cardWidth, 'Balance', formatCurrency(income - expense), income - expense >= 0 ? '#22c55e' : '#ef4444');
    drawMetricCard(40 + (cardWidth + cardGap) * 3, cardY, cardWidth, 'Transactions', String(transactions.length), '#0ea5e9');

    doc.y = cardY + 78;
    doc.moveDown(0.2);

    doc.fontSize(13).fillColor('#0f172a').text('Expense Visual Summary');
    doc.moveDown(0.3);
    const topCategory = categoryData[0]?.label || 'None';
    const topCategoryValue = categoryData[0]?.value || 0;
    const concentration = expense > 0 ? `${((topCategoryValue / expense) * 100).toFixed(1)}%` : '0%';
    doc.fontSize(10).fillColor('#475569').text(`Top expense category: ${topCategory} • Share of expenses: ${concentration}`);
    doc.moveDown(0.7);

    drawHorizontalBars('Expense by Category', categoryData, {
      barColor: '#ef4444',
      emptyText: 'No expense transactions were found in this date range'
    });

    doc.moveDown(0.6);
    drawDailyTrend('Daily Expense Trend', dayData, {
      barColor: '#0ea5e9',
      emptyText: 'No expense trend data for this period'
    });

    doc.moveDown(0.8);
    doc.fontSize(13).fillColor('#0f172a').text('Transactions');
    doc.moveDown(0.5);

    const headerY = doc.y;
    doc.fontSize(10).fillColor('#0f172a');
    doc.text('Date', 40, headerY);
    doc.text('Type', 110, headerY);
    doc.text('Category', 170, headerY);
    doc.text('Amount', 300, headerY);
    doc.text('Description', 380, headerY, { width: 170 });
    doc.moveTo(40, headerY + 15).lineTo(555, headerY + 15).strokeColor('#94a3b8').stroke();

    let rowY = headerY + 22;

    transactions.forEach((transaction) => {
      if (rowY > 770) {
        doc.addPage();
        rowY = 50;
      }

      doc.fillColor('#1f2937').fontSize(9);
      doc.text(toText(transaction.date), 40, rowY);
      doc.text(toText(transaction.type).toUpperCase(), 110, rowY);
      doc.text(toText(transaction.category), 170, rowY, { width: 120 });
      doc.text(formatCurrency(transaction.amount), 300, rowY);
      doc.text(toText(transaction.description), 380, rowY, { width: 170 });

      rowY += 18;
    });

    doc.end();
  });
};