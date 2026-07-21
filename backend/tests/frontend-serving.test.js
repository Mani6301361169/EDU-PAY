import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../app.js';

const startServer = () => new Promise((resolve) => {
  const server = app.listen(0, () => resolve(server));
});

test('serves the frontend entry point at the root URL', async () => {
  const server = await startServer();
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /<div id="root">|<!doctype html>/i);
  } finally {
    server.close();
  }
});
