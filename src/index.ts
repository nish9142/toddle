import pool from './pool';
import app from './app';
const isProd = process.env.ENV == 'production';
pool
  .connect({
    connectionString:
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@localhost:5432/toddle',
    ssl: isProd && {
      rejectUnauthorized: false,
    },
  })
  .then(() => {
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log('Listening on port', port);
    });
  })
  .catch((err) => console.error(err));
