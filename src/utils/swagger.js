const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Music Playlist API',
      version: '1.0.0',
      description: 'API для управління музичними плейлистами ',
      contact: {
        name: 'Developer'
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3000}`,
          description: 'Локальний сервер'
        }
      ]
    },
    components: {
      schemas: {
        Track: {
          type: 'object',
          required: ['title', 'artist'],
          properties: {
            title: {
              type: 'string',
              description: 'Назва треку'
            },
            artist: {
              type: 'string',
              description: 'Автор/Виконавець'
            },
            album: {
              type: 'string',
              description: 'Альбом'
            },
            duration: {
              type: 'number',
              description: 'Тривалість у секундах'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Теги треку'
            }
          },
          example: {
            title: 'Stefania',
            artist: 'Kalush Orchestra',
            album: 'Eurovision 2022',
            duration: 180,
            tags: ['folk', 'rap', 'ukraine']
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'] 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
