# Music Hub API 🎵

Сучасний та потужний API для управління музичними треками, аудіокнигами та плейлистами.

## 🚀 Основні Фішки

- **Professional Tech Stack:** Node.js, Express, MongoDB (Mongoose).
- **Advanced API Features:** Вбудоване сортування, фільтрація, пагінація та вибір полів через Query Parameters.
- **Security First:** Використання `helmet` для захисту заголовків, хешування паролів `bcrypt`, та обмеження кількості запитів (Rate Limiting).
- **100% Code Coverage:** Надійна база тестів (Jest & Supertest).
- **Visual Frontend:** Легкий та сучасний інтерфейс з "живим" пошуком у реальному часі.
- **Documentation:** Повний Swagger UI для зручного тестування.

## 🛠 Початок Роботи

1. **Клонуйте проект та встановіть залежності:**
   ```bash
   npm install
   ```

2. **Налаштуйте середовище:**
   Скопіюйте `.env.example` у `.env` та додайте свій `MONGODB_URI`.

3. **Запустіть сервер:**
   ```bash
   npm start # Production
   npm run dev # Development (Nodemon)
   ```

4. **Перейдіть до документації:**
   Відкрийте `http://localhost:3000/api-docs`

## 🧪 Тестування

Запуск усіх юніт та інтеграційних тестів зі звітом про покриття:
```bash
npm test
```

## 📐 Архітектура

Проект побудований за принципами **Clean Architecture**:
- **Models:** Схеми даних.
- **Controllers:** Бізнес-логіка (використовує паттерн `catchAsync`).
- **Routes:** Опис ендпоінтів.
- **Middleware:** Глобальна обробка помилок, логування, безпека.
- **Utils:** Допоміжні класи, такі як `APIFeatures` (Advanced Query logic).
