const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const loggerMiddleware = require('./middleware/logger');
const responseTimeMiddleware = require('./middleware/responseTime');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./utils/swagger');
const trackRoutes = require('./routes/trackRoutes');

dotenv.config();

const app = express();

// 1. MIDDLEWARES
app.use(cors());
app.use(express.json());

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Обмеження кількості запитів (Rate limit - 429)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 хвилин
  max: 100, // ліміт 100 запитів з однієї IP
  message: 'Забагато запитів з цього IP, будь ласка, спробуйте пізніше.',
  handler: (req, res, next, options) => {
    res.status(429).json({
      status: 'fail',
      message: options.message
    });
  }
});
app.use('/api', limiter);

// Custom Response Time header
app.use(responseTimeMiddleware);

// Logger & Masking & EventEmitter
app.use(loggerMiddleware);

// 2. ROUTES
app.use('/api/v1/tracks', trackRoutes);

// Обробка неіснуючих маршрутів
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Не вдалося знайти ${req.originalUrl} на цьому сервері!`
  });
});

// 3. DATABASE CONNECTION & SERVER START
const startServer = async () => {
  try {
    const DB = process.env.MONGODB_URI;

    if (!DB) {
      throw new Error('MONGODB_URI не визначено у файлі .env');
    }

    // Підключаємося до MongoDB Atlas
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(' Підключення до MongoDB Atlas успішне!');

    // 4. SERVER START
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(` Сервер запущено на порту ${PORT}!`);
      console.log(` Документація (Swagger): http://localhost:${PORT}/api-docs`);
      console.log(` API посилання: http://localhost:${PORT}/api/v1/tracks`);
    });
  } catch (err) {
    console.error(' Помилка запуску сервера або БД:', err);
    process.exit(1);
  }
};

startServer();
