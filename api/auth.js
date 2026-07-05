const AUTH_BACKEND_URL = 'https://www.trydecidr.xyz/api/auth';
const JSON_TYPE = 'application/json; charset=utf-8';

const buckets = new Map();

const LIMITS = {
  ipMinute: { limit: 30, windowMs: 60 * 1000 },
  credentialMinute: { limit: 5, windowMs: 60 * 1000 },
  credentialHour: { limit: 20, windowMs: 60 * 60 * 1000 },
};

function json(res, status, body, headers = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', JSON_TYPE);
  res.setHeader('Cache-Control', 'no-store');
  Object.entries(headers).forEach(([key, value]) => res.setHeader(key, value));
  res.end(JSON.stringify(body));
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body); }
  catch { return {}; }
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function pruneBuckets(now) {
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

function hitBucket(key, limit, windowMs, now) {
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  existing.count += 1;
  buckets.set(key, existing);
  return {
    allowed: existing.count <= limit,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
  };
}

function checkLimit(key, config, now) {
  const result = hitBucket(key, config.limit, config.windowMs, now);
  if (result.allowed) return null;
  return {
    retryAfter: Math.max(1, Math.ceil((result.resetAt - now) / 1000)),
    resetAt: result.resetAt,
  };
}

function rateLimit(req) {
  const now = Date.now();
  pruneBuckets(now);

  const ip = getClientIp(req);
  const body = parseBody(req);
  const action = String(body.action || req.query?.action || 'verify').toLowerCase();
  const email = normalizeEmail(body.email);
  const credentialKey = email || ip;

  const checks = [
    [`ip:${ip}:minute`, LIMITS.ipMinute],
  ];

  if (req.method === 'POST' && ['login', 'register'].includes(action)) {
    checks.push(
      [`credential:${action}:${credentialKey}:minute`, LIMITS.credentialMinute],
      [`credential:${action}:${credentialKey}:hour`, LIMITS.credentialHour],
    );
  }

  for (const [key, config] of checks) {
    const blocked = checkLimit(key, config, now);
    if (blocked) return blocked;
  }

  return null;
}

async function forwardRequest(req, res) {
  const incomingUrl = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  const targetUrl = `${AUTH_BACKEND_URL}${incomingUrl.search}`;
  const body = ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(parseBody(req));

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
    },
    body,
  });

  res.statusCode = response.status;
  res.setHeader('Cache-Control', 'no-store');
  response.headers.forEach((value, key) => {
    if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
      res.setHeader(key, value);
    }
  });

  const payload = Buffer.from(await response.arrayBuffer());
  res.end(payload);
}

module.exports = async function handler(req, res) {
  if (!['GET', 'POST', 'OPTIONS'].includes(req.method)) {
    json(res, 405, { error: 'Method not allowed' }, { Allow: 'GET, POST, OPTIONS' });
    return;
  }

  if (req.method === 'OPTIONS') {
    json(res, 204, {});
    return;
  }

  const blocked = rateLimit(req);
  if (blocked) {
    json(
      res,
      429,
      { error: 'Too many authentication attempts. Please wait and try again.' },
      {
        'Retry-After': String(blocked.retryAfter),
        'X-RateLimit-Reset': String(Math.ceil(blocked.resetAt / 1000)),
      },
    );
    return;
  }

  try {
    await forwardRequest(req, res);
  } catch {
    json(res, 502, { error: 'Authentication service unavailable. Please try again.' });
  }
};
