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

  return new Promise((resolve, reject) => {
    const income = transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((sum, transaction) => sum + toNumber(transaction.amount), 0);

    const expense = transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + toNumber(transaction.amount), 0);

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

    doc.on('error', cleanupAndReject);
    res.on('error', cleanupAndReject);
    res.on('finish', resolve);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    doc.pipe(res);

    doc.fontSize(21).fillColor('#0f172a').text('Tantratrack Financial Report', { align: 'left' });
    doc.moveDown(0.35);
    doc.fontSize(11).fillColor('#475569').text(`Report Period: ${toText(startDate)} to ${toText(endDate)}`);
    doc.moveDown();

    doc.fontSize(12).fillColor('#111827').text(`Total Income: Rs ${income.toFixed(2)}`);
    doc.fontSize(12).fillColor('#111827').text(`Total Expense: Rs ${expense.toFixed(2)}`);
    doc.fontSize(12).fillColor('#111827').text(`Net Balance: Rs ${(income - expense).toFixed(2)}`);
    doc.fontSize(12).fillColor('#111827').text(`Transactions: ${transactions.length}`);

    doc.moveDown(1.1);
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
      doc.text(`Rs ${toNumber(transaction.amount).toFixed(2)}`, 300, rowY);
      doc.text(toText(transaction.description), 380, rowY, { width: 170 });

      rowY += 18;
    });

    doc.end();
  });
};