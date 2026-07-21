import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../app.js';

const startServer = () => new Promise((resolve) => {
  const server = app.listen(0, () => resolve(server));
});

test('checkout endpoint rejects incomplete payment data', async () => {
  const server = await startServer();
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/payments/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1000, feeType: 'Tuition' }),
    });

    assert.equal(response.status, 400);
  } finally {
    server.close();
  }
});
