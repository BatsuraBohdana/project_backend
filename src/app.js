const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const loggerMiddleware = require('./middleware/logger');
const responseTimeMiddleware = require('./middleware/responseTime');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./utils/swagger');

const albumRoutes = require('./routes/albumRoutes');
const trackRoutes = require('./routes/trackRoutes');
const userRoutes = require('./routes/userRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const audiobookRoutes = require('./routes/audiobookRoutes');
const artistRoutes = require('./routes/artistRoutes');
const podcastRoutes = require('./routes/podcastRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const globalErrorHandler = require('./middleware/errorHandler');

const TemplateEngine = require('./utils/templateEngine');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.limiterHandler = (_req, res, _next, options) => {
  res.status(429).json({
    status: 'fail',
    message: options.message
  });
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Забагато запитів з цього IP, будь ласка, спробуйте пізніше.',
  handler: app.limiterHandler
});

app.use('/api', limiter);

app.use(responseTimeMiddleware);
app.use(loggerMiddleware);

app.get('/', (_req, res) => {
  res.redirect('/api/v1/tracks');
});

app.get('/login', (_req, res) => {
  res.send(TemplateEngine.render('login', { TITLE: 'Login' }));
});

app.get('/signup', (_req, res) => {
  res.send(TemplateEngine.render('signup', { TITLE: 'Register' }));
});

app.use('/api/v1/albums', albumRoutes);
app.use('/api/v1/tracks', trackRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/playlists', playlistRoutes);
app.use('/api/v1/audiobooks', audiobookRoutes);
app.use('/api/v1/artists', artistRoutes);
app.use('/api/v1/podcasts', podcastRoutes);
app.use('/api/v1/reviews', reviewRoutes);

app.all('*', (req, res, _next) => {
  res.status(404).json({
    status: 'fail',
    message: `Не вдалося знайти ${req.originalUrl} на цьому сервері!`
  });
});

app.use(globalErrorHandler);
module.exports = app;
