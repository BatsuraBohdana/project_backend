const responseTimeMiddleware = (req, res, next) => {
  const start = process.hrtime();

  res.on('header', () => {
    const diff = process.hrtime(start);
    const durationInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);
    res.setHeader('X-Response-Time', `${durationInMs}ms`);
  });

  
  const originalSend = res.send;
  res.send = function () {
    const diff = process.hrtime(start);
    const durationInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);
    res.setHeader('X-Response-Time', `${durationInMs}ms`);
    return originalSend.apply(res, arguments);
  };

  next();
};

module.exports = responseTimeMiddleware;
