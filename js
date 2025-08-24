

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cron = require('node-cron');

const CONFIG = {
  amount: 500.00,
  currency: 'INR',
  fromAccount: 'CHK-123456789',
  toAccount: 'SAV-987654321'
};

function idempotencyKey({amount, currency, fromAccount, toAccount}) {
  const now = new Date();
  const oneJan = new Date(now.getUTCFullYear(), 0, 1);
  const week = Math.ceil((((now - oneJan) / 86400000) + oneJan.getUTCDay()+1) / 7);
  const base = JSON.stringify({y: now.getUTCFullYear(), week, amount, currency, fromAccount, toAccount});
  return crypto.createHash('sha256').update(base).digest('hex');
}

function log(status, msg, key) {
  const line = `${new Date().toISOString()} | ${status} | ${key} | ${msg}\n`;
  fs.appendFileSync(path.join(__dirname, 'auto_savings.log'), line);
}

async function transferFunds(payload, key) {
  // TODO: call your API with key as an idempotency header
  // Simulated success:
  return { ok: true, txId: 'txn_' + key.slice(0, 12) };
}

async function runOnce() {
  const payload = {
    amount: CONFIG.amount,
    currency: CONFIG.currency,
    fromAccount: CONFIG.fromAccount,
    toAccount: CONFIG.toAccount
  };
  const key = idempotencyKey(payload);
  try {
    const res = await transferFunds(payload, key);
    if (res.ok) log('success', res.txId, key);
    else log('failed', res.error || 'unknown', key);
  } catch (e) {
    log('error', e.message, key);
  }
}

// Run every Monday at 09:00
cron.schedule('0 9 * * 1', runOnce);

// If you also want an immediate run when starting:
runOnce();
