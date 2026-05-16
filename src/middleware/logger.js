const requestEmitter = require('../utils/eventEmitter');

const maskSensitiveData = (data) => {
  const sensitiveFields = ['password', 'token', 'email'];
  const maskedData = { ...data };

  sensitiveFields.forEach(field => {
    if (maskedData[field]) {
      maskedData[field] = '***';
    }
  });

  return maskedData;
};

const loggerMiddleware = (req, res, next) => {
  const start = process.hrtime();
  const userAgent = req.get('User-Agent');
  const ip = req.ip;

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);

    const requestInfo = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      ip: ip,
      userAgent: userAgent,
      responseTime: `${durationInMs}ms`,
      body: maskSensitiveData(req.body),
      params: req.params,
      query: req.query
    };

    requestEmitter.emit('requestCompleted', requestInfo);

    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${durationInMs}ms`);
  });

  next();
};

module.exports = loggerMiddleware;
