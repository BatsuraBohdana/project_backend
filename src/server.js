const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

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
    console.log('Підключення до MongoDB Atlas успішне!');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Сервер запущено на порту ${PORT}!`);
      console.log(`Документація (Swagger): http://localhost:${PORT}/api-docs`);
      console.log(`API посилання: http://localhost:${PORT}/api/v1/tracks`);
    });
  } catch (err) {
    console.error(' Помилка запуску сервера або БД:', err);
    process.exit(1);
  }
};

startServer();
