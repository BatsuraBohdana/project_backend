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


app.use(cors());
app.use(express.json());


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Забагато запитів з цього IP, будь ласка, спробуйте пізніше.',
  handler: (req, res, next, options) => {
    res.status(429).json({
      status: 'fail',
      message: options.message
    });
  }
});
app.use('/api', limiter);


app.use(responseTimeMiddleware);


app.use(loggerMiddleware);


app.use('/api/v1/tracks', trackRoutes);


app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Не вдалося знайти ${req.originalUrl} на цьому сервері!`
  });
});


const startServer = async () => {
  try {
    const DB = process.env.MONGODB_URI;

    if (!DB) {
      throw new Error('MONGODB_URI не визначено у файлі .env');
    }


    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(' Підключення до MongoDB Atlas успішне!');


    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущено на порту ${PORT}!`);
      console.log(`🔗 Документація (Swagger): http://localhost:${PORT}/api-docs`);
      console.log(`📂 API посилання: http://localhost:${PORT}/api/v1/tracks`);
    });
  } catch (err) {
    console.error(' Помилка запуску сервера або БД:', err);
    process.exit(1);
  }
};

startServer()