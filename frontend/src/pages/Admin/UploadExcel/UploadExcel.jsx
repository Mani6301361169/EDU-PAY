import React, { useState } from 'react';
import styles from './UploadExcel.module.css';
import {
  FiUploadCloud,
  FiCheckCircle,
  FiDownload,
} from 'react-icons/fi';

export default function UploadExcel() {
  const [csvText, setCsvText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [report, setReport] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      setCsvText(evt.target.result);
    };
    reader.readAsText(file);
  };

  const handleProcessImport = (e) => {
    e.preventDefault();
    if (!csvText.trim()) {
      alert('Please select an Excel/CSV file or paste CSV data first.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const lines = csvText.trim().split(/\r?\n/);
      let successCount = 0;
      let duplicateCount = 0;
      let errorCount = 0;
      const details = [];

      lines.forEach((line, idx) => {
        // Skip header if first line
        if (idx === 0 && line.toLowerCase().includes('email')) return;
        const cols = line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));

        if (cols.length >= 4 && cols[2] && cols[2].includes('@')) {
          const rollNo = cols[0] || `ROLL${1000 + idx}`;
          const name = cols[1] || 'New User';
          const email = cols[2];
          const role = (cols[3] || 'student').toLowerCase();
          const dept = cols[4] || 'Computer Science';
          const phone = cols[5] || '+91 9876543210';

          // Simulate duplicate check
          if (email === 'test@gmail.com' || email === 'aarav.sharma@college.edu') {
            duplicateCount++;
            details.push({ line: idx + 1, email, status: 'Skipped (Duplicate Email)' });
          } else {
            successCount++;
            details.push({
              line: idx + 1,
              name,
              email,
              role,
              rollNo,
              dept,
              phone,
              status: 'Account Created Successfully',
            });
          }
        } else {
          errorCount++;
          details.push({ line: idx + 1, email: cols[2] || 'N/A', status: 'Invalid Row Format' });
        }
      });

      setReport({
        total: lines.length - (lines[0]?.toLowerCase().includes('email') ? 1 : 0),
        success: Math.max(successCount, lines.length - (lines[0]?.toLowerCase().includes('email') ? 1 : 0) - duplicateCount - errorCount),
        duplicates: duplicateCount,
        errors: errorCount,
        details,
      });

      setIsProcessing(false);
    }, 800);
  };

  const downloadSampleCSV = () => {
    const sample = `ID/Roll No,Name,Email,Role,Department/Year,Contact Number
CS202610,Rohan Verma,rohan.v@college.edu,student,Computer Science,9876543210
PR202611,Suresh Verma,suresh.v@college.edu,parent,Parent,9876543211
ACC202612,Anita Roy,anita.r@college.edu,accountant,Finance,9876543212`;
    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edupay_user_import_sample.csv';
    a.click();
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerBanner}>
        <div>
          <h1 className={styles.pageTitle}>Batch Import Users (Excel / CSV)</h1>
          <p className={styles.pageSubtitle}>
            Import student, parent, accountant, and admin records directly from spreadsheet files.
          </p>
        </div>
        <button type="button" className={styles.sampleBtn} onClick={downloadSampleCSV}>
          <FiDownload /> Download Sample Template
        </button>
      </div>

      {/* Upload Drop Zone Card */}
      <div className={`${styles.uploadCard} glass-panel`}>
        <div className={styles.dropZone}>
          <FiUploadCloud className={styles.uploadIcon} />
          <h3>Select Excel (.xlsx) or CSV (.csv) File</h3>
          <p>Columns required: ID/Roll No, Name, Email, Role, Department/Year, Contact Number</p>

          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileUpload}
            id="excelFileInput"
            className={styles.fileInput}
          />
          <label htmlFor="excelFileInput" className={styles.selectFileBtn}>
            {fileName ? `File: ${fileName}` : 'Browse Spreadsheet File'}
          </label>
        </div>

        <div className={styles.textPasteArea}>
          <label>Or Paste Raw CSV Data</label>
          <textarea
            rows="5"
            className={styles.textarea}
            placeholder={`ID/Roll No,Name,Email,Role,Department/Year,Contact Number\nCS202610,Rohan Verma,rohan.v@college.edu,student,Computer Science,9876543210`}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
          ></textarea>
        </div>

        <button
          type="button"
          className={styles.processBtn}
          onClick={handleProcessImport}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing & Validating Data...' : 'Import & Provision Accounts'}
        </button>
      </div>

      {/* Import Results Report */}
      {report && (
        <div className={`${styles.reportCard} glass-panel`}>
          <div className={styles.reportHeader}>
            <h2>
              <FiCheckCircle style={{ color: '#22c55e' }} /> Account Import Summary Report
            </h2>
          </div>

          <div className={styles.metricsRow}>
            <div className={styles.metricBox}>
              <span>Total Processed</span>
              <strong>{report.total}</strong>
            </div>
            <div className={styles.metricBox}>
              <span>Successfully Created</span>
              <strong style={{ color: '#22c55e' }}>{report.success}</strong>
            </div>
            <div className={styles.metricBox}>
              <span>Skipped (Duplicates)</span>
              <strong style={{ color: '#fbbf24' }}>{report.duplicates}</strong>
            </div>
            <div className={styles.metricBox}>
              <span>Errors</span>
              <strong style={{ color: '#ef4444' }}>{report.errors}</strong>
            </div>
          </div>

          <div className={styles.detailsList}>
            <h3>Row Execution Log</h3>
            {report.details.map((item, idx) => (
              <div key={idx} className={styles.logRow}>
                <span>Row {item.line}: {item.name || item.email}</span>
                <span className={item.status.includes('Successfully') ? styles.logSuccess : styles.logWarn}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
