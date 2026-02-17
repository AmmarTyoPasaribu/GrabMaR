// =============================================
// GrabMaR - Local Development Server (Node.js)
// =============================================
// Run: npm run dev
// Opens: http://localhost:8000

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Load .env file
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('#')) {
            const [key, ...vals] = line.split('=');
            process.env[key.trim()] = vals.join('=').trim();
        }
    });
}

// MIME types for static files
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

// API route mapping
const API_ROUTES = {
    '/api/register':        './api/register.js',
    '/api/register.php':    './api/register.js',
    '/api/login':           './api/login.js',
    '/api/login.php':       './api/login.js',
    '/api/save-earning':    './api/save-earning.js',
    '/api/save-earning.php':'./api/save-earning.js',
    '/api/earnings':        './api/earnings.js',
    '/api/earnings.php':    './api/earnings.js',
    '/api/earning-detail':  './api/earning-detail.js',
    '/api/earning-detail.php':'./api/earning-detail.js',
    '/api/delete-earning':  './api/delete-earning.js',
    '/api/delete-earning.php':'./api/delete-earning.js',
};

const PORT = 8000;

const server = http.createServer(async (req, res) => {
    const parsed = url.parse(req.url, true);
    const pathname = parsed.pathname;

    // Check if it's an API route
    const basePath = pathname.split('?')[0];
    if (API_ROUTES[basePath]) {
        try {
            // Clear require cache for hot-reload during dev
            const handlerPath = path.resolve(__dirname, API_ROUTES[basePath]);
            delete require.cache[handlerPath];
            const handler = require(handlerPath);

            // Parse JSON body for POST/DELETE/PATCH requests
            let body = {};
            if (['POST', 'DELETE', 'PATCH'].includes(req.method)) {
                body = await new Promise((resolve) => {
                    let data = '';
                    req.on('data', chunk => data += chunk);
                    req.on('end', () => {
                        try { resolve(JSON.parse(data)); }
                        catch { resolve({}); }
                    });
                });
            }

            // Create mock Vercel request/response
            const mockReq = {
                method: req.method,
                headers: req.headers,
                query: parsed.query,
                body: body,
            };

            const mockRes = {
                statusCode: 200,
                _headers: {},
                setHeader(key, val) { this._headers[key] = val; },
                status(code) { this.statusCode = code; return this; },
                json(data) {
                    res.writeHead(this.statusCode, {
                        'Content-Type': 'application/json',
                        ...this._headers
                    });
                    res.end(JSON.stringify(data));
                },
                end() {
                    res.writeHead(this.statusCode, this._headers);
                    res.end();
                },
            };

            await handler(mockReq, mockRes);
        } catch (err) {
            console.error('API Error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error: ' + err.message }));
        }
        return;
    }

    // Serve static files
    let filePath = pathname === '/' ? '/index.html' : pathname;
    filePath = path.join(__dirname, filePath);

    // Security: don't serve files outside project dir
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n  ❌ Port ${PORT} sudah dipakai!`);
        console.error(`  Coba kill prosesnya dulu:`);
        console.error(`    Windows: netstat -ano | findstr :${PORT}  → taskkill /PID <PID> /F`);
        console.error(`    Mac/Linux: kill $(lsof -t -i:${PORT})\n`);
        process.exit(1);
    }
    throw err;
});

server.listen(PORT, () => {
    console.log(`
  ╔═══════════════════════════════════════╗
  ║   GrabMaR Dev Server                  ║
  ║   http://localhost:${PORT}              ║
  ╚═══════════════════════════════════════╝
    `);
});
