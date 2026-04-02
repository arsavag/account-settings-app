import express from 'express';
import cors from 'cors';
import { initDb } from './configs/database';
import { useRoutes } from './useRoutes';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

async function start() {
  await initDb();

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  useRoutes(app);

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
