import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { env } from './env.js';
import { prisma } from './lib/prisma.js';
import { router } from './routes.js';

const app = express();

app.use(express.json({ limit: '10kb' }));

app.use(router);

app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = env['PORT'];

app.listen(PORT, async () => {
    await prisma.$connect ();
    console.log(`Server running on port ${PORT}`);
});
