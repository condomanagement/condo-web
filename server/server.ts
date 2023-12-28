import express, { Express } from 'express';
import rateLimit from 'express-rate-limit';
import nocache from 'nocache';
import cors, { CorsOptions } from 'cors';
import httpProxy from 'http-proxy';
import notFoundHandler from './middleware/not-found.middleware';

const port = process.env.PORT || 8080;

async function createServer(): Promise<Express> {
  const app: Express = express();
  const apiProxy = httpProxy.createProxyServer({ changeOrigin: true });

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use(
    limiter,
    nocache(),
    express.urlencoded({ extended: true }),
  );
  const allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:3000',
    'https://arrowlofts.org',
    'https://www.arrowlofts.org',
    'https://azure.arrowlofts.org',
    'https://condo-web.azurewebsites.net',
    'https://condo-api.azurewebsites.net',
  ];

  const corsOptions: CorsOptions = {
    allowedHeaders: ['Authorization', 'Content-Type'],
    origin: (origin, callback) => {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not '
                    + 'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  };

  app.use('/', cors(corsOptions), express.static('build'));
  app.use('/login', cors(corsOptions), express.static('build'));
  app.use('/parking', cors(corsOptions), express.static('build'));
  app.use('/admin', cors(corsOptions), express.static('build'));
  app.use('/authenticate', cors(corsOptions), express.static('build'));
  app.use('/authenticate*', cors(corsOptions), express.static('build'));
  app.use('/reservation', cors(corsOptions), express.static('build'));
  app.use('/elevator-booking', cors(corsOptions), express.static('build'));
  app.use('/myreservations', cors(corsOptions), express.static('build'));
  app.use('/favicon.ico', cors(corsOptions), express.static('public/favicon.ico'));
  app.use('/manifest.json', cors(corsOptions), express.static('public/manifest.json'));
  app.use('/logo192.png', cors(corsOptions), express.static('public/logo192.png'));
  app.use('/logo512.png', cors(corsOptions), express.static('public/logo512.png'));
  app.all('/api/*', cors(corsOptions), (req, res) => {
    apiProxy.web(req, res, { target: 'https://api.arrowlofts.org', secure: true });
  });

  app.all('/healthcheck', (req, res) => {
    apiProxy.web(req, res, { target: 'https://api.arrowlofts.org', secure: true });
  });

  app.use(notFoundHandler);

  return app;
}

createServer().then((app) => {
  app.listen(port, () => {
    console.warn(`⚡️[server]: Server is running at https://localhost:${port}`);
  });
});
