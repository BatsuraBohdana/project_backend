const mongoose = require('mongoose');

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    if (this.connection) {
      return this.connection;
    }

    const DB = process.env.MONGODB_URI;

    if (!DB) {
      throw new Error('MONGODB_URI is not defined in the .env file');
    }

    try {
      this.connection = await mongoose.connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Successfully connected to MongoDB!');
      return this.connection;
    } catch (err) {
      if (err.name === 'MongoNetworkError' || err.message.includes('SSL')) {
        console.error('\x1b[31m%s\x1b[0m', 'Помилка мережі/SSL при підключенні до MongoDB!');
        console.error('\x1b[33m%s\x1b[0m', 'Порада: Перевірте, чи ваш IP додано до WhiteList у MongoDB Atlas, та чи вірний пароль у .env');
      }
      console.error('Database connection error details:', err);
      throw err;
    }
  }
}

const dbInstance = new Database();
module.exports = dbInstance;
