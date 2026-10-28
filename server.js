/**
 * Little Genius Prep - Dual-Port Local Server & Secure Anti-Spam API
 * Serves:
 *  - Port 3080: Public Showcase Website (site/)
 *  - Port 3081: Academy ERP Operations Hub (erp/)
 *
 * Implements strict anti-spam guidelines:
 *  - Honeypot check
 *  - Secret client token header (x-lgp-client: secure-form-v1)
 *  - Content filtering (Cyrillic bot signatures)
 *  - Fake 200 OK on bot detection (prevents bot retries)
 *  - Zero open-relay auto-responders
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT_SITE = 3080;
const PORT_ERP = 3081;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const INQUIRIES_FILE = path.join(__dirname, 'inquiries.json');

// Ensure inquiries file exists
if (!fs.existsSync(INQUIRIES_FILE)) {
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2));
}

function handleStaticFile(req, res, baseDir) {
  let safePath = path.normalize(decodeURI(req.url.split('?')[0])).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';

  let fullPath = path.join(baseDir, safePath);

  fs.stat(fullPath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      fullPath = path.join(fullPath, 'index.html');
      return fs.stat(fullPath, (indexErr, indexStats) => {
        if (indexErr || !indexStats.isFile()) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
          return;
        }
        serveFile(res, fullPath);
      });
    }

    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    serveFile(res, fullPath);
  });
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*'
  });
  fs.createReadStream(filePath).pipe(res);
}

// Anti-Spam Strict Verification Handler
function handleInquiryApi(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
    if (body.length > 1e6) req.destroy(); // Protection against oversized payload
  });

  req.on('end', () => {
    try {
      const data = JSON.parse(body || '{}');

      // Rule 3: Secret Client Token Check
      const clientToken = req.headers['x-lgp-client'];
      if (clientToken !== 'secure-form-v1') {
        console.warn('[Security] Rejected inquiry missing or invalid secret header token.');
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized request origin' }));
        return;
      }

      // Rule 2 & 4: Honeypot check (Fake 200 OK for bots)
      if (data._gotcha && data._gotcha.trim() !== '') {
        console.warn('[Security] Honeypot field filled. Returning fake 200 OK to neutralize bot.');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'success', message: 'Inquiry processed successfully' }));
        return;
      }

      // Rule 5: Content filtering against Cyrillic / bot signatures
      const cyrillicRegex = /[А-Яа-яЁё]/;
      const combinedText = `${data.parentName || ''} ${data.studentName || ''} ${data.notes || ''}`;
      if (cyrillicRegex.test(combinedText)) {
        console.warn('[Security] Cyrillic bot pattern detected. Returning fake 200 OK.');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'success', message: 'Inquiry processed successfully' }));
        return;
      }

      // Rule 1: Never create open-relay auto-responders
      // We log and store the inquiry safely for the Little Genius Prep Academy ERP
      const newInquiry = {
        id: 'INQ-' + Math.floor(1000 + Math.random() * 9000),
        parentName: data.parentName || 'Unknown',
        studentName: data.studentName || 'Unknown',
        phone: data.phone || '',
        email: data.email || '',
        currentGrade: data.currentGrade || 'Unspecified',
        targetProgram: data.targetProgram || 'SHSAT',
        preferredFormat: data.preferredFormat || 'In-Person',
        status: 'New Inquiry',
        notes: data.notes || '',
        submittedAt: new Date().toISOString()
      };

      try {
        const currentInquiries = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf8') || '[]');
        currentInquiries.unshift(newInquiry);
        fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(currentInquiries, null, 2));
      } catch (writeErr) {
        console.error('Error writing to inquiries file:', writeErr);
      }

      console.log(`[Success] Verified inquiry recorded: ${newInquiry.studentName} (${newInquiry.targetProgram})`);

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({
        status: 'success',
        inquiryId: newInquiry.id,
        message: 'Diagnostic session request confirmed.'
      }));

    } catch (parseErr) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Malformed JSON payload' }));
    }
  });
}

// 1. Site Server (Port 3080)
const siteDir = path.join(__dirname, 'site');
const siteServer = http.createServer((req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-lgp-client'
    });
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/inquiry') {
    handleInquiryApi(req, res);
  } else {
    handleStaticFile(req, res, siteDir);
  }
});

siteServer.listen(PORT_SITE, () => {
  console.log(`[Little Genius Prep] Public Showcase Website running at http://localhost:${PORT_SITE}`);
});

// 2. ERP Server (Port 3081)
const erpDir = path.join(__dirname, 'erp');
const erpServer = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api/inquiries') {
    // ERP reading persisted inquiries
    try {
      const currentInquiries = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf8') || '[]');
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify(currentInquiries));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify([]));
    }
  } else {
    handleStaticFile(req, res, erpDir);
  }
});

erpServer.listen(PORT_ERP, () => {
  console.log(`[Little Genius Prep] Academy Operations ERP running at http://localhost:${PORT_ERP}`);
});
