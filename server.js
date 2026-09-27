import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Serve static assets from project root and public
app.use(express.static(__dirname));
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// In serverless environments like Vercel, the app is exported as a handler.
// In traditional Node environments, listen on the configured port.
if (!process.env.VERCEL) {
  app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
  });
}

export default app;
