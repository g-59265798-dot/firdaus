import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { buildInitialState } from './src/data/sampleData';

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'database.json');

app.use(express.json({ limit: '10mb' }));

// Initialize persistent database
let currentData: any = null;

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      currentData = JSON.parse(content);
      // Ensure year is 2026
      if (currentData.year !== 2026) {
        currentData.year = 2026;
      }
    } else {
      currentData = buildInitialState();
      fs.writeFileSync(DB_FILE, JSON.stringify(currentData, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error loading database.json:', err);
    currentData = buildInitialState();
  }
}

loadDatabase();

// SSE Clients for Real-time Sync
const sseClients: express.Response[] = [];

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send current state immediately
  res.write(`data: ${JSON.stringify({ type: 'INIT', payload: { data: currentData } })}\n\n`);

  sseClients.push(res);

  req.on('close', () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) sseClients.splice(idx, 1);
  });
});

function broadcast(event: string, data: any) {
  const message = `data: ${JSON.stringify({ type: event, payload: data })}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.write(message);
    } catch (e) {
      // client disconnected
    }
  });
}

// API Routes
app.get('/api/data', (_req, res) => {
  res.json({ success: true, data: currentData });
});

app.post('/api/data', (req, res) => {
  const payload = req.body;
  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ success: false, error: 'Invalid payload' });
  }

  const updatedData = payload.data || payload;
  const senderClientId = payload.clientId || null;

  currentData = {
    ...updatedData,
    lastUpdated: new Date().toISOString(),
  };

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(currentData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database.json:', err);
  }

  broadcast('UPDATE', { data: currentData, senderClientId });
  res.json({ success: true, data: currentData });
});

// Vite Middleware
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
