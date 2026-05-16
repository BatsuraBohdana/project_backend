const fs = require('fs');
const path = require('path');

class TemplateEngine {
  static render(templateName, data) {
    const layoutPath = path.join(__dirname, '../views/layout.html');
    let layout = fs.readFileSync(layoutPath, 'utf8');

    // Default values for optional layout placeholders
    const defaults = {
      TITLE: 'VibeStream API',
      CONTENT: '{{CONTENT}}',
      EXTRA_STYLE: ''
    };

    // Merge data with defaults
    const finalData = { ...defaults, ...data };

    // Fill in the data into the layout using a safe replacement method
    Object.keys(finalData).forEach(key => {
      const placeholder = `{{${key}}}`;
      layout = layout.split(placeholder).join(finalData[key]);
    });

    // Clean up any remaining placeholders that weren't in the data
    const remainingPlaceholders = layout.match(/{{[A-Z_]+}}/g) || [];
    remainingPlaceholders.forEach(placeholder => {
      layout = layout.split(placeholder).join('');
    });

    return layout;
  }
}

module.exports = TemplateEngine;
