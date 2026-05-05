const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

class RequestEventEmitter extends EventEmitter {}

const requestEmitter = new RequestEventEmitter();

const LOG_FILE = path.join(__dirname, '../../logs/requests.json');


const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}


requestEmitter.on('requestCompleted', (data) => {
  let logs = [];
  if (fs.existsSync(LOG_FILE)) {
    try {
      const content = fs.readFileSync(LOG_FILE, 'utf8');
      logs = content ? JSON.parse(content) : [];
    } catch (err) {
      console.error('Помилка читання файлу логів:', err);
      logs = [];
    }
  }
  

  const localTimestamp = new Date().toLocaleString('uk-UA', {
    timeZone: 'Europe/Kyiv',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  logs.push({
    timestamp: localTimestamp,
    ...data
  });

  try {
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
  } catch (err) {
    console.error('Помилка запису файлу логів:', err);
  }
});

module.exports = requestEmitter;