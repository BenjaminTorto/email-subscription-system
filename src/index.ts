import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import subscribeRouter from './routes/subscribe.js';
import newsletterRouter from './routes/newsletter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/', subscribeRouter);
app.use('/api/newsletter', newsletterRouter);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
