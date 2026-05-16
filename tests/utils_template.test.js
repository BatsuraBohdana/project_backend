const TemplateEngine = require('../src/utils/templateEngine');
const fs = require('fs');
const path = require('path');

describe('TemplateEngine Utility', () => {
  test('Should render template with data', () => {
    const html = TemplateEngine.render('login', { TITLE: 'Test Login' });
    expect(html).toContain('Test Login');
    expect(html).not.toContain('{{TITLE}}');
  });

  test('Should handle missing data by clearing placeholders', () => {
    const html = TemplateEngine.render('login', {});
    expect(html).not.toContain('{{');
  });

  test('Should support extra styles', () => {
    const html = TemplateEngine.render('login', { EXTRA_STYLE: '.custom { color: red; }' });
    expect(html).toContain('.custom { color: red; }');
  });
});
