import React, { useState } from 'react';

function ExportButton({ authToken }) {
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState('excel');

  const handleExport = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert('Start date must be before end date');
      return;
    }

    try {
      setLoading(true);
      const endpoint = format === 'pdf' ? '/api/export/pdf' : '/api/export';
      const extension = format === 'pdf' ? 'pdf' : 'xlsx';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ startDate, endDate })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `TantraTrack_Report_${startDate}_to_${endDate}.${extension}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setShowModal(false);
      } else {
        const errorBody = await response.json().catch(() => ({}));
        alert(errorBody.error || 'Error exporting data');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="btn btn-success"
        onClick={() => setShowModal(true)}
        disabled={!authToken}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 999,
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
        }}
        title="Export report"
      >
        📥
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => !loading && setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">📊 Export Report</div>
            
            <div className="form-group">
              <label htmlFor="start-date">Start Date</label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="end-date">End Date</label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="format">Export Format</label>
              <select id="format" value={format} onChange={(event) => setFormat(event.target.value)}>
                <option value="excel">Excel (.xlsx)</option>
                <option value="pdf">PDF (.pdf)</option>
              </select>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={handleExport}
                disabled={loading}
              >
                {loading ? '⏳ Exporting...' : `📥 Export ${format === 'pdf' ? 'PDF' : 'Excel'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ExportButton;
