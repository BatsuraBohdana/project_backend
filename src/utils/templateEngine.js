const fs = require('fs');
const path = require('path');

class TemplateEngine {
  static render(templateName, data) {
    const layoutPath = path.join(__dirname, '../views/layout.html');
    let layout = fs.readFileSync(layoutPath, 'utf8');

    const defaults = {
      TITLE: 'VibeStream API',
      CONTENT: '{{CONTENT}}',
      EXTRA_STYLE: ''
    };

    const finalData = { ...defaults, ...data };

    Object.keys(finalData).forEach(key => {
      const placeholder = `{{${key}}}`;
      layout = layout.split(placeholder).join(finalData[key]);
    });

    const remainingPlaceholders = layout.match(/{{[A-Z_]+}}/g) || [];
    remainingPlaceholders.forEach(placeholder => {
      layout = layout.split(placeholder).join('');
    });

    return layout;
  }
}

module.exports = TemplateEngine;
