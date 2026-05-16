const app = require('./app');

const dotenv = require('dotenv');
const db = require('./utils/db');

dotenv.config();

const startServer = async () => {
  try {
    await db.connect();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Сервер запущено на порту ${PORT}!`);
      console.log(`Документація (Swagger): http://localhost:${PORT}/api-docs`);
      console.log(`API посилання: http://localhost:${PORT}/api/v1/tracks`);
    });
  } catch (err) {
    console.error('Помилка запуску сервера або БД:', err);
    process.exit(1);
  }
};

startServer();
