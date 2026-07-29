import { jsPDF } from 'jspdf';

/**
 * Generates and downloads a clean, professional EduPay fee payment PDF receipt.
 * @param {Object} payment - Payment transaction object
 * @param {Object} student - Student profile details
 */
export const downloadReceiptPDF = (payment, student) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const studentName = student?.name || payment?.student?.name || 'Student';
  const studentRoll = student?.rollNo || student?.studentId || payment?.student?.studentId || 'N/A';
  const department = student?.department || 'Computer Science';
  const academicYear = student?.year || '2026';
  const feeType = payment?.feeType || 'College Fees';
  const amount = Number(payment?.amount || 0);
  const transactionId = payment?.transactionId || `TXN-${payment?._id || Date.now()}`;
  const receiptNo = `REC-${String(payment?._id || Date.now()).slice(-8).toUpperCase()}`;
  const dateStr = payment?.paidAt
    ? new Date(payment.paidAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  // Dark Header Background Block
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, 210, 42, 'F');

  // Gold accent bar
  doc.setFillColor(212, 160, 23);
  doc.rect(0, 42, 210, 2, 'F');

  // Header Title
  doc.setTextColor(212, 160, 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('EduPay', 15, 20);

  doc.setTextColor(245, 241, 230);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Institutional Fee Payment Receipt', 15, 27);
  doc.text('Mother Teresa Institute of Technology', 15, 33);

  // Official Badge
  doc.setDrawColor(212, 160, 23);
  doc.setFillColor(30, 30, 30);
  doc.roundedRect(145, 12, 50, 18, 3, 3, 'FD');
  doc.setTextColor(212, 160, 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('OFFICIAL RECEIPT', 150, 20);
  doc.setFontSize(8);
  doc.setTextColor(34, 197, 94);
  doc.text('STATUS: SUCCESS', 150, 26);

  // Receipt & Student Details Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 15, 15);
  doc.text('Receipt Details', 15, 55);

  doc.setDrawColor(220, 220, 220);
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(15, 58, 180, 42, 3, 3, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('Receipt No:', 20, 66);
  doc.text('Transaction ID:', 20, 74);
  doc.text('Payment Date:', 20, 82);
  doc.text('Payment Method:', 20, 90);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 15, 15);
  doc.text(receiptNo, 55, 66);
  doc.text(transactionId, 55, 74);
  doc.text(dateStr, 55, 82);
  doc.text(payment?.method || 'UPI / Online', 55, 90);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('Student Name:', 115, 66);
  doc.text('Roll No / ID:', 115, 74);
  doc.text('Department:', 115, 82);
  doc.text('Academic Year:', 115, 90);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 15, 15);
  doc.text(studentName, 148, 66);
  doc.text(studentRoll, 148, 74);
  doc.text(department, 148, 82);
  doc.text(academicYear, 148, 90);

  // Table Header
  doc.setFillColor(15, 15, 15);
  doc.rect(15, 110, 180, 10, 'F');
  doc.setTextColor(212, 160, 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('FEE CATEGORY / DESCRIPTION', 20, 116.5);
  doc.text('PAYMENT MODE', 115, 116.5);
  doc.text('AMOUNT PAID', 160, 116.5);

  // Table Row
  doc.setFillColor(255, 255, 255);
  doc.rect(15, 120, 180, 14, 'F');
  doc.setDrawColor(220, 220, 220);
  doc.line(15, 134, 195, 134);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 15, 15);
  doc.text(feeType, 20, 129);
  doc.setFont('helvetica', 'normal');
  doc.text(payment?.method || 'UPI / Online', 115, 129);
  doc.setFont('helvetica', 'bold');
  doc.text(`INR ${amount.toLocaleString('en-IN')}`, 160, 129);

  // Total Summary Box
  doc.setFillColor(245, 241, 230);
  doc.rect(15, 135, 180, 14, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 15, 15);
  doc.text('TOTAL AMOUNT PAID:', 110, 144);
  doc.setTextColor(184, 134, 11);
  doc.text(`INR ${amount.toLocaleString('en-IN')}`, 160, 144);

  // Verification & Signature
  doc.setDrawColor(212, 160, 23);
  doc.line(140, 180, 190, 180);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Authorized Finance Signatory', 143, 185);
  doc.text('EduPay Institutional Accounts', 143, 189);

  // Footer Disclaimer
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('This is a computer-generated official receipt. No physical signature is required.', 15, 200);
  doc.text('For support or verification, contact support@edupay.edu | +1 (555) 019-2834', 15, 205);

  // Trigger automatic download
  doc.save(`edupay_receipt_${transactionId}.pdf`);
};
