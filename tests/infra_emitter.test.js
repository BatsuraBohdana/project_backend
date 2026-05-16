const eventEmitter = require('../src/utils/eventEmitter');
const fs = require('fs');

describe('EventEmitter Infrastructure', () => {
  test('Should log request completed successfully', () => {
    const spy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    eventEmitter.emit('requestCompleted', { method: 'GET', url: '/api' });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('Should handle unreadable log file', () => {
    const readSpy = jest.spyOn(fs, 'readFileSync').mockImplementation(() => { throw new Error('Fail'); });
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    eventEmitter.emit('requestCompleted', { method: 'GET' });

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Помилка читання'), expect.any(Error));
    readSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});
