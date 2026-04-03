import express from 'express';
import cors from 'cors';
import { initDb } from './configs/database.js';
import { useRoutes } from './useRoutes.js';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

try {
  initDb();
} catch (err) {
  console.error(err);
  process.exit(1);
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

useRoutes(app);

app.get('/api/test', (_req, res) => {
  res.json({ message: 'Direct route works' });
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
