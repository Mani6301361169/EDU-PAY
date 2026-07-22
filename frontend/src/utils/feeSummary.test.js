import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateFeeSummary, getFeeBalances, getStudentFeeBreakdown } from './feeSummary.js';

test('matches a student fee breakdown by department and academic year', () => {
  const student = {
    department: 'Computer Science',
    year: '2nd Year',
  };

  const fees = [
    { _id: '1', name: 'Tuition Fee', amount: 50000, department: 'Computer Science', academicYear: '2nd Year', active: true },
    { _id: '2', name: 'Hostel Fee', amount: 12000, department: 'Civil', academicYear: '2nd Year', active: true },
  ];

  const breakdown = getStudentFeeBreakdown(student, fees);

  assert.equal(breakdown.length, 1);
  assert.equal(breakdown[0].name, 'Tuition Fee');
});

test('calculates outstanding balance from payments', () => {
  const student = { department: 'Computer Science', year: '2nd Year' };
  const fees = [
    { _id: '1', name: 'Tuition Fee', amount: 50000, department: 'Computer Science', academicYear: '2nd Year', active: true },
    { _id: '2', name: 'Library Fee', amount: 3000, department: 'Computer Science', academicYear: '2nd Year', active: true },
  ];
  const payments = [{ amount: 20000 }];

  const summary = calculateFeeSummary(student, fees, payments);
  

  assert.equal(summary.totalFees, 53000);
  assert.equal(summary.paidAmount, 20000);
  assert.equal(summary.outstandingBalance, 33000);
});

test('applies payments to fee structure balances in order', () => {
  const student = { department: 'Computer Science', year: '2nd Year' };
  const fees = [
    { _id: '1', name: 'Tuition Fee', amount: 50000, department: 'Computer Science', academicYear: '2nd Year', active: true },
    { _id: '2', name: 'Library Fee', amount: 3000, department: 'Computer Science', academicYear: '2nd Year', active: true },
  ];

  const balances = getFeeBalances(student, fees, [{ amount: 51000 }]);

  assert.deepEqual(balances.map(({ remainingAmount }) => remainingAmount), [0, 2000]);
});
