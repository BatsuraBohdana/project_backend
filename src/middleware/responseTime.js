const responseTimeMiddleware = (req, res, next) => {
  const start = process.hrtime();

  const originalEnd = res.end;
  res.end = function (...args) {
    if (!res.headersSent) {
      const diff = process.hrtime(start);
      const durationInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);
      res.setHeader('X-Response-Time', `${durationInMs}ms`);
    }
    return originalEnd.apply(res, args);
  };

  next();
};

module.exports = responseTimeMiddleware;
