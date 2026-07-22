export const getStudentFeeBreakdown = (student, fees = []) => {
  if (!student) return [];

  return fees.filter((fee) => {
    if (!fee?.active) return false;
    const matchesDepartment = fee.department ? fee.department === student.department : true;
    const matchesYear = fee.academicYear ? fee.academicYear === student.year : true;
    return matchesDepartment && matchesYear;
  });
};

export const calculateFeeSummary = (student, fees = [], payments = []) => {
  const breakdown = getStudentFeeBreakdown(student, fees);
  const totalFees = breakdown.reduce((sum, fee) => sum + Number(fee.amount || 0), 0);
  const paidAmount = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const outstandingBalance = Math.max(totalFees - paidAmount, 0);

  return {
    totalFees,
    paidAmount,
    outstandingBalance,
    breakdown,
  };
};

export const getFeeBalances = (student, fees = [], payments = []) => {
  const breakdown = getStudentFeeBreakdown(student, fees);
  let paymentToApply = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  return breakdown.map((fee) => {
    const originalAmount = Number(fee.amount || 0);
    const paidAmount = Math.min(originalAmount, paymentToApply);
    paymentToApply -= paidAmount;

    return {
      ...fee,
      originalAmount,
      paidAmount,
      remainingAmount: originalAmount - paidAmount,
    };
  });
};
